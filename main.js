const { app, BrowserWindow, ipcMain } = require('electron');

let win;
var PythonShell = require('python-shell');
let options = {
    pythonPath: 'python3'
};

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        transparent: true,
        titleBarStyle: process.platform == 'darwin' ? 'hiddenInset' : 'default'
    });
    win.loadFile('index.html');
}

ipcMain.on('getFiles', (event, args) => {
    var shell = new PythonShell('api/queryFileNames.py', options);
    shell.send(
        JSON.stringify({
            command: 'getFiles',
            path: args.path,
            glob: args.glob,
            containing: args.containing
        })
    );
    shell.on('message', function(message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(JSON.parse(message));
        win.webContents.send('ping', message);
    });

    // end the input stream and allow the process to exit
    shell.end(function(err) {
        if (err) {
            throw err;
        }

        win.webContents.send('finished');
    });
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
