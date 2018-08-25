<template>
    <div class="results-grid" data-simplebar>
        <table id="results-table">
            <thead>
                <tr><th>Filename</th><th>Path</th></tr>
            </thead>
            <tbody>
                <tr v-on:dblclick="openFile(file.path)" v-for="file in files" :key="file.filename" v-on:click="loadResults(file.filename)">
                    <td>{{ file.filename }}</td>
                    <td>{{ file.path }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";

export default {
  name: "ResultsGrid",
  data() {
    return {
      files: [],
      matches: []
    };
  },
  methods: {
    loadResults: function(file) {
      ipcRenderer.send("cross-component", {
        message: "loadResults",
        data: file
      });
    },
    openFile: path => {
      ipcRenderer.send("open", path);
    }
  },
  mounted() {
    var that = this;

    ipcRenderer.on("clear", function() {
      that.files = [];
    });

    ipcRenderer.on("files-no-content", (event, args) => {
      // eslint-disable-next-line
      console.log(args);
      that.files = args;
    });

    ipcRenderer.on("file", function(event, args) {
      args.forEach(file => {
        if (!that.files.filter(e => e.filename === file.filename).length > 0) {
          that.files.push(file);
        }
      });
    });
  }
};
</script>

<style lang="scss" scoped>
.results-grid {
  overflow-x: scroll;
}

.simplebar-scrollbar:before {
  background: lighten(#1b77d2, 10);
}

table {
  width: 100%;
}

th {
  background-color: #2c333d;
}

td {
  white-space: nowrap;
  border-top: 1px solid #2f374a;
}

tbody tr:hover {
  background-color: lighten(#1b77d2, 10);
  cursor: pointer;
}
</style>
