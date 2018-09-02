const { ipcRenderer } = require('electron');
const fs = require("file-system");
const fg = require('fast-glob');
const hirestime = require('hirestime');
var lineNumber = require('line-number');
var parse = require('gitignore-globs');
var async = require("async");
var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', (client) => {

    var content;
    var flags;

    client.on("load-results", (path) => {
        var data = fs.readFileSync(path, 'utf8')
        var filename = path.replace(/^.*[\\\/]/, '')
        var match = lineNumber(data, new RegExp(content, flags))
        io.emit("result", {
            path: path,
            file: filename,
            match: match
        });
    })

    client.on("pause", () => {
        ipcRenderer.send("console-log", "pause");
        globs.pause();
    });

    client.on("query", (args) => {
        const getElapsed = hirestime();

        var searched = 0;
        var searchedSize = 0;

        var dirs = args.directory.split(",");
        var expression = args.query;
        if (/^[A-Za-z]+$/.test(args.query)) {
            expression = `*${args.query}*`;
        }

        content = args.content.content;
        flags = args.content.flags;

        var ignores = [];
        if (args.gitignore) {
            ignores = parse(dirs[0] + '/.gitignore');
        }

        var options = {
            cwd: dirs[0],
            absolute: true,
            stats: true,
            dot: true,
            ignore: ignores
        };

        var q = async.queue(function (file, callback) {
            var path = file.path;
            var filename = path.replace(/^.*[\\\/]/, '');
            var stats = file;
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) callback();

                var match = data.search(new RegExp(content, flags));
                if (match > -1) {
                    var buf = JSON.stringify({
                        path: path,
                        file: filename,
                        directory: dirs[0],
                        stats: stats
                    });
                    io.emit("match", buf);
                }
                searched++;
                searchedSize += stats.size;
                callback();
            });
        }, 200);

        // assign a callback
        q.drain = function () {
            io.emit("searched-files", {
                searched: searched,
                searchedSize: searchedSize
            })
        };

        const stream = fg.stream(expression, options);
        stream.on("data", path => {
            q.push(path);
        });

        stream.once("end", () => {
            io.emit("stop-loading", getElapsed(hirestime.S));
        })
    })
});
io.listen(9090);

function splitArrayIntoChunks(arr, chunkLen) {
    var chunkList = [];
    var chunkCount = Math.ceil(arr.length / chunkLen);
    for (var i = 0; i < chunkCount; i++) {
        chunkList.push(arr.splice(0, chunkLen));
    }
    return chunkList;
}