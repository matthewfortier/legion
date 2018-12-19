const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("file-system");
var lineNumber = require("line-number");

let win;
var PythonShell = require("python-shell");
let options = {
  pythonPath:
    "C:/Users/M779668/AppData/Local/Programs/Python/Python37-32/python.exe"
};

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    transparent: true,
    titleBarStyle: process.platform == "darwin" ? "hiddenInset" : "default"
  });
  win.loadFile("index.html");
}

ipcMain.on("getFiles", (event, args) => {
  var shell = new PythonShell("api/queryFileNames.py", options);
  shell.send(
    JSON.stringify({
      command: "getFiles",
      path: args.path,
      glob: args.glob,
      containing: args.containing
    })
  );
  shell.on("message", function(message) {
    // received a message sent from the Python script (a simple "print" statement)
    win.webContents.send("ping", message);
  });

  // end the input stream and allow the process to exit
  shell.end(function(err) {
    if (err) {
      throw err;
    }

    win.webContents.send("finished");
  });
});

ipcMain.on("getMatches", (event, args) => {
  var data = fs.readFileSync(args.path, "utf8");
  var filename = args.path.replace(/^.*[\\\/]/, "");
  var match = lineNumber(data, new RegExp(args.content, args.flags));
  //console.log(match);
  win.webContents.send("match", {
    path: args.path,
    file: filename,
    match: match
  });
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
