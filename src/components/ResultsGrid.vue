<template>
    <div class="results-grid">
        <table id="results-table">
            <thead>
                <tr><th>Filename</th></tr>
            </thead>
            <tbody>
                <tr v-on:dblclick="openFile(file.path)" v-for="file in files" :key="file.filename" v-on:click="loadResults(file.filename)">
                    <td>{{ file.filename }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

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

    ipcRenderer.on("file", function(event, args) {
      if (!that.files.filter(e => e.filename === args.filename).length > 0) {
        that.files.push(args);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.results-grid {
  overflow-x: scroll;
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
