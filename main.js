const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const shell = electron.shell
const dialog = electron.dialog

const fs = require("file-system");
const FileHound = require('filehound');
const { FileSniffer, asArray } = require('filesniffer');
var lineNumber = require('line-number');

let url
if (process.env.NODE_ENV === 'DEV') {
    url = 'http://localhost:8080/'
} else {
    url = `file://${process.cwd()}/dist/index.html`
}

let mainWindow
let backgroundWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        titleBarStyle: (process.platform == "darwin") ? "hiddenInset" : "default"
    });
    mainWindow.loadURL(url)

    mainWindow.webContents.send("process", process.platform)

    createBackgroundProcess();
})

function createBackgroundProcess() {
    backgroundWindow = new BrowserWindow({ "show": false })
    backgroundWindow.loadURL(`file://${process.cwd()}/background.html`)
    backgroundWindow.on("ready", () => {
        console.log("Background process ready")
    })
    backgroundWindow.on('closed', () => {
        console.log('background window closed')
    });
    return backgroundWindow
}

ipcMain.on("cross-component", function (event, args) {
    if (typeof args === "string") {
        console.log(args)
        event.sender.send(args);
    }
    else
        event.sender.send(args.message, args.data);
})

ipcMain.on("stop-query", () => {
    backgroundWindow.close();
    mainWindow.webContents.send("toggleLoading");
    createBackgroundProcess();
})

ipcMain.on("browse", (event) => {
    var path = dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })

    event.sender.send("directory", path);
})

ipcMain.on("open", (event, path) => {
    console.log(path);
    shell.openItem(path);
})

ipcMain.on("query", function (event, args) {
    console.log("bg-query")
    backgroundWindow.webContents.send("bg-query", args);
});

ipcMain.on("file", (event, args) => {
    mainWindow.webContents.send("file", args);
});

ipcMain.on("match", (event, args) => {
    mainWindow.webContents.send("match", args);
});

ipcMain.on("toggleLoading", (event, args) => {
    mainWindow.webContents.send("toggleLoading");
});

ipcMain.on("platform", () => {
    mainWindow.webContents.send("platform", process.platform)
})