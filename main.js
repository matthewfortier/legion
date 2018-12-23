const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  dialog
} = require("electron");
const fs = require("file-system");
var lineNumber = require("line-number");

require("electron-debug")();

let win;
let views = [];
let viewIndex = 0;
var PythonShell = require("python-shell");
let options = {
  pythonPath:
    "C:/Users/M779668/AppData/Local/Programs/Python/Python37-32/python.exe",
  pythonOptions: ["-u"] // get print results in real-time
};

function createWindow() {
  win = new BrowserWindow({
    width: 1600,
    height: 800,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    transparent: true,
    titleBarStyle: process.platform == "darwin" ? "hiddenInset" : "default"
  });
  //win.loadFile("index.html");
  let view = new BrowserView({
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 1600, height: 800 });
  view.webContents.loadFile("index.html");
  views.push(view);
}

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

ipcMain.on("browse", (event, args) => {
  console.log("Browsing");
  var path = dialog.showOpenDialog(win, {
    properties: ["openDirectory", "multiSelections"]
  });
  if (path) event.sender.send("directory", path.join(","));
});

ipcMain.on("ondragstart", (event, filePath) => {
  console.log(filePath);
  event.sender.startDrag({
    file: filePath,
    icon: "./assets/vertical.png"
  });
});

ipcMain.on("newTab", event => {
  let view = new BrowserView({
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 1600, height: 800 });
  view.webContents.loadFile("index.html");
  views.push(view);
});

ipcMain.on("cycleTabs", event => {
  viewIndex = (viewIndex + 1) % views.length;
  win.setBrowserView(views[viewIndex]);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
