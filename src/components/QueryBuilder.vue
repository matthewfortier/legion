<template>
    <div id="query-builder">

      <div class="inputs">
         <div class="legion-input">
          <span>Filename:</span>
          <input v-model="query" type="text" placeholder="Glob patterns...">
          <i v-on:click="openGlobHelp()" id="globHelp" class="fas fa-question" data-toggle="tooltip modal" data-placement="bottom" data-target="#glob-modal" title="Help"></i>
        </div>

        <div class="legion-input">
          <span>Containing:</span>
          <input v-model="content" type="text" placeholder="Containing text or expression...">
          <i v-on:click="openRegexHelp()" id="regexHelp" class="fas fa-question" data-toggle="tooltip modal" data-placement="bottom" data-target="#" title="Help"></i>
        </div>

        <div class="legion-input">
          <span>Directory:</span>
          <input v-model="directory" type="text" placeholder="Root directory...">
          <i v-on:click="browse()" id="loadPath" class="fas fa-folder-open" data-toggle="tooltip" data-placement="bottom" title="Browse..."></i>
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

export default {
  name: "QueryBuilder",
  data() {
    return {
      query: "",
      content: "",
      directory: "/Users/matthewfortier/Documents/code/legion/"
    };
  },
  methods: {
    sendQuery: function() {
      // eslint-disable-next-line
      console.log("Send Query");
      this.files = [];
      ipcRenderer.send("cross-component", "start-loading");
      ipcRenderer.send("cross-component", "clear");
      ipcRenderer.send("query", {
        content: this.content,
        query: this.query,
        directory: this.directory
      });
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
      // eslint-disable-next-line
      console.log("Focus");
      $(this)
        .parent()
        .css("border-color", "white");
    });
  }
};
</script>

<style lang="scss" scoped>
#query-builder {
  display: block;
  background-color: #0c1520;
}

.legion-input {
  height: 36px;
  border: 1px solid #2f374a;
  border-radius: 3px;
  display: flex;
  align-items: center;
  margin: 10px 10px;

  &:hover,
  &:focus-within {
    border-color: #1b77d2;
  }

  span {
    color: #1b77d2;
    font-weight: bold;
    margin: 0 10px;
    text-transform: uppercase;
    user-select: none;
  }

  input {
    background-color: transparent;
    border: none;
    outline: none;
    color: #1b77d2;
    width: 100%;
  }

  i {
    margin-right: 10px;
    margin-left: 10px;
    color: #1b77d2;
    cursor: pointer;
  }
}

.inputs {
  width: 100%;
}

#glob-modal,
#regex-modal {
  .modal-header,
  .modal-footer {
    background-color: #151d2c !important;
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
    background-color: lighten(#151d2c, 2);

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
