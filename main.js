const { app, BrowserWindow, ipcMain } = require("electron");

let win;
var PythonShell = require("python-shell");
let options = {
  pythonPath:
    "C:/Users/M779668/AppData/Local/Programs/Python/Python37-32/python.exe"
};
var shell = new PythonShell("api.py", options);

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
  var shell = new PythonShell("api.py", options);
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

    console.log("finished");
  });
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
