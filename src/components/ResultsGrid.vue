<template>
    <div class="results-grid" data-simplebar>
        <table id="results-table">
            <thead>
                <tr><th>Filename</th><th>Path</th><th>Size</th></tr>
            </thead>
            <tbody>
                <tr v-on:click="loadResults(match.path)" v-on:dblclick="openFile(match.path)" :key="match.path" v-for="match in this.$parent.matches">
                    <td>{{ match.file }}</td>
                    <td>{{ match.path.replace(match.directory, "").replace(/^\//, "").replace(/^\\/, "") }}</td>
                    <td>{{ match.stats.size | bytesToSize }}</td>
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
  methods: {
    loadResults: function(path) {
      this.$socket.emit("load-results", path);
    },
    openFile: path => {
      ipcRenderer.send("open", path);
    }
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
  white-space: nowrap;
  background-color: #2c333d;
  padding-right: 15px;

  &:nth-child(n + 3) {
    text-align: right;
  }
}

td {
  white-space: nowrap;
  border-top: 1px solid #2f374a;
  padding-right: 15px;

  &:nth-child(n + 3) {
    text-align: right;
  }
}

tbody tr:hover {
  background-color: lighten(#1b77d2, 10);
  cursor: pointer;
}
</style>
