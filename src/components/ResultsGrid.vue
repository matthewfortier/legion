<template>
    <div class="results-grid" data-simplebar>
        <table id="results-table">
            <thead>
                <tr><th>Filename</th><th>Path</th></tr>
            </thead>
            <tbody>
                <tr v-on:click="loadResults(match)" v-on:dblclick="openFile(match.path)" v-for="match in this.$parent.matches" :key="match.path">
                    <td>{{ match.file }}</td>
                    <td>{{ match.path }}</td>
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
    loadResults: function(match) {
      this.$parent.displayed = match;
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
