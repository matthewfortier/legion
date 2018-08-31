const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const shell = electron.shell;
const dialog = electron.dialog;

let url;
if (process.env.NODE_ENV === "DEV") {
  url = "http://localhost:8080/";
} else {
  url = `file://${process.cwd()}/dist/index.html`;
}

let mainWindow;
let backgroundWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    titleBarStyle: process.platform == "darwin" ? "hiddenInset" : "default"
  });
  mainWindow.loadURL(url);

  mainWindow.webContents.send("process", process.platform);

  createBackgroundProcess();

  require("./menu");
});

function createBackgroundProcess() {
  backgroundWindow = new BrowserWindow({ show: false });
  backgroundWindow.loadURL(`file://${process.cwd()}/background.html`);
  backgroundWindow.on("ready", () => {
    console.log("Background process ready");
  });
  backgroundWindow.on("closed", () => {
    console.log("background window closed");
  });
  return backgroundWindow;
}

ipcMain.on("cross-component", function (event, args) {
  if (typeof args === "string") {
    event.sender.send(args);
  } else {
    event.sender.send(args.message, args.data);
  }
});

ipcMain.on("cross-component-process", function (event, args) {
  if (typeof args === "string") {
    mainWindow.webContents.send(args);
  } else {
    mainWindow.webContents.send(args.message, args.data);
  }
});

ipcMain.on("stop-query", () => {
  backgroundWindow.close();
  mainWindow.webContents.send("stop-loading");
  createBackgroundProcess();
});

ipcMain.on("browse", event => {
  var path = dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "multiSelections"]
  });
  console.log(path.join(","));
  event.sender.send("directory", path.join(","));
});

ipcMain.on("open", (event, path) => {
  console.log(path);
  shell.openItem(path);
});

ipcMain.on("query", function (event, args) {
  console.log("bg-query");
  backgroundWindow.webContents.send("bg-query", args);
});

ipcMain.on("file", (event, args) => {
  mainWindow.webContents.send("file", args);
});

ipcMain.on("match", (event, args) => {
  mainWindow.webContents.send("match", args);
});

ipcMain.on("stop-loading", (event, args) => {
  mainWindow.webContents.send("stop-loading");
});

ipcMain.on("start-loading", (event, args) => {
  mainWindow.webContents.send("start-loading");
});

ipcMain.on("platform", () => {
  mainWindow.webContents.send("platform", process.platform);
});

ipcMain.on("console-log", (event, args) => {
  console.log(args);
});
