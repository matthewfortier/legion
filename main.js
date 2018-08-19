const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const FindFiles = require("node-find-files");
const Q = require("q");
const FS = require("file-system");

let url
if (process.env.NODE_ENV === 'DEV') {
    url = 'http://localhost:8080/'
} else {
    url = `file://${process.cwd()}/dist/index.html`
}

app.on('ready', () => {
    let window = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: (process.platform == "win32") ? true : false,
        titleBarStyle: (process.platform == "darwin") ? "hiddenInset" : "default"
    });
    window.loadURL(url)

    window.webContents.send("process", process.platform)
})

function searchFile(content, regex, lineRegEx) {
    var match = content.match(regex),
        linesMatch = content.match(lineRegEx)

    return {
        match: match,
        lines: linesMatch
    };
}

function getRegEx(pattern, regex) {
    var flags, term, grabLineRegEx

    if (typeof pattern === 'object' && pattern.flags) {
        term = pattern.term
        flags = pattern.flags
    } else {
        term = pattern
        flags = 'g'
    }

    grabLineRegEx = "(.*" + term + ".*)"

    if (regex === 'line') {
        return new RegExp(grabLineRegEx, flags)
    }

    return new RegExp(term, flags);
}

ipcMain.on("cross-component", function (event, args) {
    if (typeof args === "string") {
        console.log(args)
        event.sender.send(args);
    }
    else
        event.sender.send(args.message, args.data);
})

ipcMain.on("query", function (event, args) {
    console.log(args.query);
    console.log(args.directory);

    var finder = new FindFiles({
        rootFolder: args.directory,
        filterFunction: function (path, stat) {
            return (path.endsWith(args.query)) ? true : false;
        }
    });

    finder.on("match", function (strPath, stat) {
        //console.log(stat);

        // var file = FS.readFileSync(strPath, "utf-8")

        // var results = searchFile(file.toString(), getRegEx(args.content), getRegEx(args.content, 'line'))

        // console.log(results);

        // if (results.lines) {
        //     event.sender.send("fileResponse", {
        //         filename: strPath.replace(args.directory, ""),
        //         matches: results.lines
        //     })
        // }

        event.sender.send("fileResponse", strPath)
    })
    finder.on("complete", function () {
        console.log("Finished")
    })
    finder.on("patherror", function (err, strPath) {
        console.log("Error for Path " + strPath + " " + err)  // Note that an error in accessing a particular file does not stop the whole show
    })
    finder.on("error", function (err) {
        console.log("Global Error " + err);
    })
    finder.startSearch();

});