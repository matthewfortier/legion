// Required Libraries
const $ = require("jquery");
const dt = require("datatables.net")();
const path = require("path");
require("datatables.net-scroller")(window, $);
require("tablesorter");
const mime = require("mime-types");
const BrowserWindow = window.require("electron").remote.BrowserWindow;
const process = window.require("electron").remote.process;
const PythonShell = require("python-shell");
const hirestime = require("hirestime");

// DOM / Window Events
window.addEventListener("resize", resizeResultsGrid);
document.addEventListener("dragover", event => event.preventDefault());
document.addEventListener("drop", event => event.preventDefault());

// State Variables
let options = {
  pythonPath:
    "C:/Users/M779668/AppData/Local/Programs/Python/Python37-32/python.exe",
  pythonOptions: ["-u"] // get print results in real-time
};

var splitter;
var results;
var timer;
var previousSearch = "";

// On Ready / Configure Application
(function() {
  configureForPlatform();
  configureResultsRowClick();
  configureSplitter();
  configureDatatables();
  configureRendererEvents();
})();

function configureSplitter() {
  splitter = Split(["#results-grid", "#results-output"], {
    sizes: [50, 50],
    minSize: 0,
    onDragEnd: resizeResultsGrid
  });
  splitter.collapse(1);
}

function configureDatatables() {
  results = $("#results-table").DataTable({
    info: false,
    pageLength: 500,
    deferRender: true,
    scrollY: 100,
    scrollX: true,
    language: {
      search: "Filter:"
    },
    scroller: {
      displayBuffer: 50
    },
    createdRow: function(row, data, dataIndex) {
      $(row).attr("data-file", data.filename);
    },
    columnDefs: [
      {
        targets: 0,
        data: "img",
        render: function(url, type, full) {
          return (
            '<img height="75%" width="75%" src="' + getFileIcon(full[0]) + '"/>'
          );
        }
      }
    ]
  });

  resizeResultsGrid();

  // Match Results View
  $("#results-output-table").tablesorter();
}

function configureRendererEvents() {
  require("electron").ipcRenderer.on("finished", event => {
    toggleReadyState();
  });

  require("electron").ipcRenderer.on("directory", (event, directory) => {
    document.getElementById("directory").value = directory;
  });

  require("electron").ipcRenderer.on("match", (event, message) => {
    splitter.setSizes([50, 50]);
    message.match.forEach(el => {
      var row = `
                <tr>
                    <td>${el.number}</td>
                    <td>
                        <pre>${highlight(el.line, previousSearch)}</pre>
                    </td>
                </tr>
            `;
      $("#results-output-table")
        .find("tbody")
        .append($(row));
    });
  });
}

function configureForPlatform() {
  if (process.platform == "win32") {
    addWindowsEventListeners();
    $(".windows-buttons").css("display", "flex");
  } else if (process.platform == "darwin") {
    $(".header-bar .left").addClass("darwin");
  }
}

function configureResultsRowClick() {
  $("#results-grid").on("click", "#results-table-body [role=row]", event => {
    $.tablesorter.clearTableBody($("#results-output-table"));

    var filename = $(event.currentTarget)
      .find("td:nth-child(2)")
      .text();
    var directory = $(event.currentTarget)
      .find("td:nth-child(3)")
      .text();

    $("#results-table-body [role=row]").removeClass("clicked");
    $(event.currentTarget).addClass("clicked");
    $("#file-path").text(path.join(directory, filename));

    sendAction("getMatches", {
      path: path.join(directory, filename),
      content: previousSearch,
      flags: []
    });
  });

  $("#results-grid").on(
    "dragstart",
    "#results-table-body [role=row]",
    event => {
      event.preventDefault();

      var filename = $(event.currentTarget)
        .find("td:nth-child(2)")
        .text();
      var directory = $(event.currentTarget)
        .find("td:nth-child(3)")
        .text();

      require("electron").ipcRenderer.send(
        "ondragstart",
        path.join(directory, filename)
      );
    }
  );
}

function addWindowsEventListeners() {
  $("#close").click(_ => BrowserWindow.getFocusedWindow().close());
  $("#maximize").click(_ => {
    var win = BrowserWindow.getFocusedWindow();
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });
  $("#minimize").click(_ => BrowserWindow.getFocusedWindow().minimize());
}

// Actions
function executeQuery() {
  timer = hirestime();

  // Get query values from input fields
  var directory = document.getElementById("directory").value;
  var filename = document.getElementById("filename").value;
  var containing = document.getElementById("containing").value;
  previousSearch = containing;

  // Clear the results grid and matches view
  results.clear().draw();
  $.tablesorter.clearTableBody($("#results-output-table"));

  // Clear out previous query info
  clearFooterData();

  // Set the ready state to searching
  toggleProgressBarAnimation();

  // Execute python script with query data and options
  var shell = new PythonShell("api/queryFileNames.py", options).send(
    JSON.stringify({
      command: "getFiles",
      path: directory,
      glob: filename,
      containing: containing
    })
  );

  // Search variables
  let rows = [];
  let searched = 0;
  let count = 0;
  let queryInfo;

  // Python stdout events
  shell.on("message", function(message) {
    // received a message sent from the Python script (a simple "print" statement)
    let msg = JSON.parse(message);

    switch (msg.type) {
      case "searching":
        // Set the number of files to be searched
        searched = msg.searching;
        toggleProgressBarAnimation();
        break;
      case "info":
        // After search is complete, update footer bar with query info
        queryInfo = msg;
        break;
      case "count":
        count++;
        // Display file name in footer bar
        $("#footer-ready").text(msg.file);
        break;
      default:
        // Push file into array to be added to the grid when finished
        // Filename is duplicated to allow for adding of file icons
        rows.push([
          msg.filename,
          msg.filename,
          msg.directory,
          mime.lookup(msg.extension)
            ? mime.lookup(msg.extension)
            : msg.extension,
          bytesToSize(msg.stats.size),
          dateFromTime(msg.stats.access),
          dateFromTime(msg.stats.modified)
        ]);

        count++;
        updateFooterBar(count, searched, msg.file);
    }
  });

  // end the input stream and allow the process to exit
  shell.end(function(err) {
    if (err) {
      throw err;
    }

    // Set the Datatables data and draw the rows
    results.rows.add(rows).draw();

    // Make sure Datatable is the correct height and add draggable attributes to all rows
    resizeResultsGrid();
    addDraggable();

    updateFooterBar(searched, searched, "Ready", timer(hirestime.S), queryInfo);
  });
}

function browseFileSystem() {
  sendAction("browse");
}

function newTab() {
  sendAction("newTab");
}

// Helper Functions
function updateFooterBar(count, searched, file, time, info) {
  $("#footer-progress-bar").css("width", (count / searched) * 100 + "%");
  $("#footer-progress-text").text(`${count} / ${searched}`);
  $("#footer-ready").text(file);

  if (time) {
    $("#time")
      .text(`${timer(hirestime.S)} seconds`)
      .show();
  }

  if (info) {
    $("#found")
      .text(`${info.foundCount} files found (${bytesToSize(info.foundSize)})`)
      .show();

    $("#searched")
      .text(
        `${info.searchedCount} files searched (${bytesToSize(
          info.searchedSize
        )})`
      )
      .show();
  }
}

function toggleProgressBarAnimation() {
  $("#footer-progress-bar").toggleClass("thinking");
  // When query is finished, this will be overridded by updateFooterBar
  $("#footer-ready").text("Searching...");
}

function clearFooterData() {
  $("#footer-progress-text").text("");
  $("#found")
    .text("")
    .hide();
  $("#searched")
    .text("")
    .hide();
  $("#time")
    .text("")
    .hide();
}

function getGridHeight() {
  return $("#results-grid").height() - 37;
}

function resizeResultsGrid() {
  $("div.dataTables_scrollBody").height(getGridHeight());
}

function highlight(line, query) {
  var check = new RegExp(escape(query), "ig");
  return line.toString().replace(check, matchedText => {
    return "<span class='highlightText'>" + matchedText + "</span>";
  });
}

function bytesToSize(bytes, decimals = 2) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function dateFromTime(time) {
  return new Date(time).toLocaleString();
}

function sendAction(command, args = {}) {
  require("electron").ipcRenderer.send(command, args);
}

function addDraggable() {
  $("#results-table-body [role=row]").attr("draggable", "true");
}

function getFileIcon(filename) {
  var path = "./assets/icons/";
  if (icons.fileExtensions.filename) {
    return path + icons.iconDefinitions[icons.fileExtensions.filename].iconPath;
  } else {
    for (var i in icons.fileExtensions) {
      if (filename.endsWith(i)) {
        return path + icons.iconDefinitions[icons.fileExtensions[i]].iconPath;
      }
    }
    return path + iconDefinitions[icons.fileExtensions.txt].iconPath;
  }
}
