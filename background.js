const { ipcRenderer } = require("electron");
const fs = require("file-system");
const fg = require("fast-glob");
const hirestime = require("hirestime");
var lineNumber = require("line-number");
var parse = require("gitignore-globs");
var async = require("async");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var path = require("path");
var IPCStream = require('electron-ipc-stream')
var ipcs = new IPCStream('background-stream')

io.listen(9090);

io.on("connection", client => {
  var content;
  var flags;

  client.on("load-results", path => {
    var data = fs.readFileSync(path, "utf8");
    var filename = path.replace(/^.*[\\\/]/, "");
    var match = lineNumber(data, new RegExp(content, flags));
    io.emit("result", {
      path: path,
      file: filename,
      match: match
    });
  });

  client.on("pause", () => {
    ipcRenderer.send("console-log", "pause");
    globs.pause();
  });

  client.on("query", args => {
    const getElapsed = hirestime();

    var searched = 0;
    var searchedSize = 0;

    var sending = [];

    var dirs = args.directory.split(",");
    var expression = args.query;
    if (/^[A-Za-z]+$/.test(args.query)) {
      expression = `*${args.query}*`;
    }

    content = args.content.content;
    flags = args.content.flags;

    var ignores = [".git"];
    if (args.gitignore) {
      ignores = parse(path.join(dirs[0], ".gitignore"));
      ignores.push(".git");
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
      var filename = path.replace(/^.*[\\\/]/, "");
      var stats = file;

      if (!content) {
        sending.push({
          path: path,
          file: filename,
          directory: dirs[0],
          stats: {
            size: stats.size,
            atimeMs: stats.atimeMs,
            birthtimeMs: stats.birthtimeMs,
            mtimeMs: stats.mtimeMs
          }
        })

        callback();
      } else {
        fs.readFile(path, "utf8", (err, data) => {
          if (err) callback();

          if (content) {
            var match = data.search(new RegExp(content, flags));
            if (match > -1) {
              //io.emit("match", buf);
              sending.push({
                path: path,
                file: filename,
                directory: dirs[0],
                stats: {
                  size: stats.size,
                  atimeMs: stats.atimeMs,
                  birthtimeMs: stats.birthtimeMs,
                  mtimeMs: stats.mtimeMs
                }
              })
            }
          }
          searched++;
          searchedSize += stats.size;
          callback();
        });
      }
    }, 200);

    // assign a callback
    q.drain = function () {

    };

    const stream = fg.stream(expression, options);
    stream.on("data", path => {
      q.push(path);
    });

    stream.once("end", () => {
      ipcs.write(sending);
      io.emit("stop-loading", getElapsed(hirestime.S));
      io.emit("searched-files", {
        searched: searched,
        searchedSize: searchedSize
      });
    });
  });
});

function splitArrayIntoChunks(arr, chunkLen) {
  var chunkList = [];
  var chunkCount = Math.ceil(arr.length / chunkLen);
  for (var i = 0; i < chunkCount; i++) {
    chunkList.push(arr.splice(0, chunkLen));
  }
  return chunkList;
}

const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function () {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
