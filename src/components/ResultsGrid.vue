<template>
    <div class="results-grid" data-simplebar>
        <table id="results-table">
            <thead>
                <tr>
                  <th>Filename</th>
                  <th>Path</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Accessed</th>
                  <th>Modified</th>
                  <th>Created</th>
                </tr>
            </thead>
            <tbody>
                <tr @contextmenu.prevent="$refs.menu.open($event, { path: match.path })" v-on:click="loadResults(match.path)" v-on:dblclick="openFile(match.path)" :key="match.path" v-for="match in this.$parent.matches">
                    <td>{{ match.file }}</td>
                    <td>{{ match.path.replace(match.directory, "").replace(/^\//, "").replace(/^\\/, "") }}</td>
                    <td>{{ match.file.slice((match.file.lastIndexOf(".") - 1 >>> 0) + 2) | mime }}</td>
                    <td>{{ match.stats.size | bytesToSize }}</td>
                    <td>{{ match.stats.atimeMs | dateFromTime }}</td>
                    <td>{{ match.stats.mtimeMs | dateFromTime }}</td>
                    <td>{{ match.stats.birthtimeMs | dateFromTime }}</td>
                </tr>
            </tbody>
        </table>
        <vue-context class="context-menu" ref="menu">
            <ul slot-scope="child">
                <li @click="openFile(child.data.path)">Open</li>
                <li @click="openLocation(child.data.path)">Show in File Location</li>
            </ul>
        </vue-context>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import { VueContext } from "vue-context";

export default {
  name: "ResultsGrid",
  components: {
    VueContext
  },
  methods: {
    loadResults: function(path) {
      this.$socket.emit("load-results", path);
    },
    openFile: path => {
      ipcRenderer.send("open", path);
    },
    openLocation: path => {
      ipcRenderer.send("open-location", path);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../themes.scss";

.results-grid {
  overflow-x: scroll;
  width: 100%;
}

table {
  width: 100%;
}

th {
  white-space: nowrap;
  //background-color: $results-grid-header-color;
  padding-right: 15px;
  padding-left: 10px;
  border-bottom: 1px solid #545454;
  font-size: 0.8em;

  .light-theme & {
    background-color: white;
    color: black;
  }

  &:nth-child(n + 3) {
    text-align: right;
  }
}

td {
  white-space: nowrap;
  border-top: 1px solid #4f4f4f;
  padding-right: 15px;
  padding-left: 10px;
  user-select: none;

  .light-theme & {
    border-color: $td-border-color-light;
    color: black;
  }

  &:nth-child(n + 3) {
    text-align: right;
  }
}

tbody tr:hover {
  background-color: #4f4f4f;
  cursor: pointer;
}

.context-menu {
  background-color: #0c1520 !important;
  border: none !important;
  border-radius: 3px;
  width: auto !important;
  min-width: 150px !important;

  ul {
    padding: 0 !important;
  }

  li {
    padding: 5px 10px !important;
  }
}
</style>
