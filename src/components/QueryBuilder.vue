<template>
    <div id="query-builder">

      <div class="inputs">
        <div class="legion-input">
          <div class="legion-input-content">
            <span class="label">Directory:</span>
            <input v-model="directory" type="text" placeholder="Root directory...">
          </div>
          <i @click="gitignore = !gitignore" v-bind:class="!gitignore ? 'off' : ''" class="fab fa-git-square" data-toggle="tooltip" data-placement="bottom" title="Ignore"></i>
          <i v-on:click="browse()" id="loadPath" class="fas fa-folder-open" data-toggle="tooltip" data-placement="bottom" title="Browse..."></i>
        </div>
      

        <div class="legion-input">
          <div class="legion-input-content">
            <span class="label">Filename:</span>
            <input v-model="query" type="text" placeholder="Glob patterns...">
          </div>
          <i data-toggle="tooltip" data-placement="bottom" title="Glob Help" v-on:click="openGlobHelp()" id="globHelp" class="fas fa-question" data-target="#glob-modal"></i>
        </div>

        <div class="legion-input">
          <div class="legion-input-content">
            <span class="label">Containing:</span>
            <span class="regex">/</span>
            <!-- <input v-model="content" type="text" placeholder="Containing text or expression..."> -->
            <span v-contenteditable:content="true" @paste="paste($event)" @keydown="$event.keyCode === 13 ? $event.preventDefault() : false" class="input-span" contenteditable="true"></span>
            <span class="regex">/</span>
            <span v-show="this.ignore" class="regex">i</span>
            <span v-show="this.global" class="regex">g</span>
            <span v-show="this.multiline" class="regex">m</span>
            <span v-show="this.unicode" class="regex">u</span>
            <span v-show="this.sticky" class="regex">y</span>
          </div>
          <div class="regex-flags">
            <span class="flags-label">Flags: </span>
            <span data-toggle="tooltip" data-placement="bottom" title="Ignore" @click="setFlag($event)" v-bind:class="(this.ignore) ? 'selected' : ''" class="flag">i</span>
            <span data-toggle="tooltip" data-placement="bottom" title="Global" @click="setFlag($event)" v-bind:class="(this.global) ? 'selected' : ''" class="flag">g</span>
            <span data-toggle="tooltip" data-placement="bottom" title="Multiline" @click="setFlag($event)" v-bind:class="(this.multiline) ? 'selected' : ''" class="flag">m</span>
            <span data-toggle="tooltip" data-placement="bottom" title="Unicode" @click="setFlag($event)" v-bind:class="(this.unicode) ? 'selected' : ''" class="flag">u</span>
            <span data-toggle="tooltip" data-placement="bottom" title="Sticky" @click="setFlag($event)" v-bind:class="(this.sticky) ? 'selected' : ''" class="flag">y</span>
            <i data-toggle="tooltip modal" data-placement="bottom" title="Regex Builder" v-on:click="openRegexHelp()" id="regexHelp" class="fas fa-question" data-target="#"></i>
          </div>
        </div>
      </div>

      <div id="glob-modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Globbing Cheatsheet</h5>
            </div>
            <div class="modal-body">
              <h5>Patterns</h5>
              <ul>
                <li><strong>?</strong> - matches any one character</li>
                <li><strong>*</strong> - matches any number of characters</li>
                <li><strong>{!glob}</strong> - Matches anything that does not match glob</li>
                <li><strong>{a,b,c}</strong> - matches any one of a, b or c</li>
                <li><strong>[abc]</strong> - matches any character in the set a, b or c</li>
                <li><strong>[^abc]</strong> - matches any character not in the set a, b or c</li>
                <li><strong>[a-z]</strong> - matches any character in the range a to z, inclusive. A leading or trailing dash will be interpreted literally</li>
              </ul>
              <h5>Examples</h5>
              <ul>
                <li><strong>*</strong> - all files.</li>
                <li><strong>index*</strong> - files whose names start with "index".</li>
                <li><strong>*index</strong> - files whose names end with "index".</li>
                <li><strong>*index*</strong> - files whose names contain "index".</li>
                <li><strong>index*.{html,js}</strong> - files whose names start with "index" and end with "html" or "js" extensions.</li>
                <li><strong>*.java</strong> - all files whose names end with “.java”.</li>
                <li><strong>*.[ch]</strong> - all files whose names end with either “.c” or “.h”.</li>
                <li><strong>*.{c,cpp,h,hpp,cxx,hxx}</strong> - all C or C++ files.</li>
                <li><strong>[^#]*</strong> - all files whose names do not start with “#”.</li>
              </ul>
              <p>Borrowed from: http://www.jedit.org/users-guide/globs.html</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div id="regex-modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Regex Help</h5>
            </div>
            <div class="modal-body">
              <iframe src="https://regexr.com/" frameborder="0"></iframe>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
const $ = require("jquery");
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";

export default {
  name: "QueryBuilder",
  data() {
    return {
      query: "**/*.html",
      content: "",
      directory: "/Users/matthewfortier/Documents/code/legion",
      gitignore: false,
      flags: "",
      ignore: false,
      global: false,
      multiline: false,
      unicode: false,
      sticky: false
    };
  },
  methods: {
    sendQuery: function() {
      ipcRenderer.send("cross-component", "start-loading");
      ipcRenderer.send("cross-component", "clear");
      ipcRenderer.send("cross-component", {
        message: "contains",
        data: this.content
      });
      this.$socket.emit("query", {
        content: {
          content: this.content,
          flags: this.flags
        },
        query: this.query,
        directory: this.directory,
        gitignore: this.gitignore
      });
    },
    paste: function(e) {
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    },
    updateContains: function(text) {
      this.content = text;
    },
    setFlag: function(event) {
      switch (event.target.innerText) {
        case "i":
          this.ignore = !this.ignore;
          break;
        case "g":
          this.global = !this.global;
          break;
        case "m":
          this.multiline = !this.multiline;
          break;
        case "u":
          this.unicode = !this.unicode;
          break;
        case "y":
          this.sticky = !this.sticky;
          break;
      }
      this.flags = `${this.ignore ? "i" : ""}${this.global ? "g" : ""}${
        this.multiline ? "m" : ""
      }${this.unicode ? "u" : ""}${this.sticky ? "y" : ""}`;
    },
    browse: () => {
      ipcRenderer.send("browse");
    },
    openGlobHelp: () => {
      $("#glob-modal").modal();
    },
    openRegexHelp: () => {
      $("#regex-modal").modal();
    }
  },
  mounted() {
    var that = this;
    ipcRenderer.on("run-query", function() {
      that.sendQuery();
    });

    ipcRenderer.on("directory", (event, args) => {
      that.directory = args;
    });

    $(".legion-input input").on("focus", () => {
      $(this)
        .parent()
        .css("border-color", "white");
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../themes.scss";

#query-builder {
  display: block;
  background-color: $query-builder-background;

  .light-theme & {
    background-color: $query-builder-background-light;
  }
}

.legion-input {
  height: 36px;
  border: 1px solid $input-border-color;
  border-radius: 3px;
  display: flex;
  align-items: center;
  margin: 10px 10px;
  display: flex;
  justify-content: space-between;

  .light-theme & {
    border-color: $accent-color;
    background-color: white;
  }

  &:focus-within {
    border-color: $accent-color;
  }

  .label {
    color: $accent-color;
    font-weight: bold;
    margin: 0 10px;
    text-transform: uppercase;
    user-select: none;
  }

  .legion-input-content {
    overflow-x: auto;
    flex: 1;
    white-space: nowrap;
  }

  .input-span {
    background-color: transparent;
    border: none;
    outline: none;
    color: $accent-color;
    margin: 0;
    min-width: 20px;
    padding: 0 5px;
    white-space: nowrap;
    width: calc(100% - 400px);
  }

  .regex {
    font-weight: 900;
    color: $input-regex-color;

    .light-theme & {
      color: $input-regex-color-light;
    }
  }

  input {
    background-color: transparent;
    border: none;
    outline: none;
    color: $accent-color;
    width: calc(100% - 100px);
  }

  .regex-flags {
    display: flex;
    align-items: center;
    text-align: center;

    .flags-label {
      font-size: 0.8em;
      color: #9ca7bc;
      //opacity: 0.6;
      margin: 0 5px;
    }

    .flag {
      display: inline-block;
      color: $accent-color;
      cursor: pointer;
      font-weight: bold;
      height: 25px;
      width: 25px;
      line-height: 25px;
      border-radius: 3px;
      margin: 0 2.5px;
      user-select: none;

      i {
        line-height: 36px;
      }

      &.selected {
        background-color: $flag-selected-color;
        color: #0c1520;

        .light-theme & {
          background-color: $flag-selected-color-light;
          color: $accent-color;
        }
      }

      &:hover {
        background-color: $flag-hover-color;

        .light-theme & {
          background-color: $flag-selected-color-light;
        }
      }
    }
  }

  i {
    margin-right: 10px;
    margin-left: 10px;
    color: $accent-color;
    cursor: pointer;
    justify-content: flex-end;
    line-height: 36px;

    &.off {
      color: #464646;
    }
  }
}

.inputs {
  width: 100%;
}

#glob-modal,
#regex-modal {
  .modal-header,
  .modal-footer {
    background-color: $header-color !important;
    border: none !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .modal-content {
    background-color: transparent;

    ul,
    p {
      color: #ddd;
    }
  }

  .modal-body {
    background-color: $body-color;

    iframe {
      height: 70vh;
      width: 100%;
    }
  }
}

#regex-modal .modal-body {
  padding: 0;
}
</style>
