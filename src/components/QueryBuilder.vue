<template>
    <div id="query-builder">

      <div class="inputs">
         <div class="legion-input">
          <span>Filename:</span>
          <input v-model="query" type="text" placeholder="Filename and/or extensions...">
        </div>

        <div class="legion-input">
          <span>Containing:</span>
          <input v-model="content" type="text" placeholder="Containing text or expression...">
        </div>

        <div class="legion-input">
          <span>Directory:</span>
          <input v-model="directory" type="text" placeholder="Root directory...">
          <i v-on:click="browse()" id="loadPath" class="fas fa-folder-open" data-toggle="tooltip" data-placement="bottom" title="Browse..."></i>
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
      query: ".html",
      content: "query",
      directory: "/Users/matthewfortier/Documents/code/legion/"
    };
  },
  methods: {
    sendQuery: function() {
      // eslint-disable-next-line
      console.log("Send Query");
      this.files = [];
      ipcRenderer.send("cross-component", "toggleLoading");
      ipcRenderer.send("cross-component", "clear");
      ipcRenderer.send("query", {
        content: this.content,
        query: this.query,
        directory: this.directory
      });
    },
    browse: () => {
      ipcRenderer.send("browse");
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
  }
}

.inputs {
  width: 100%;
}
</style>
