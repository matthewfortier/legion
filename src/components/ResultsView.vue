<template>
    <div class="results-view" data-simplebar> 
        <table>
            <thead><tr><th v-if="this.displayed" colspan="2">{{ this.displayed.path }}</th><th></th></tr></thead>
            <tbody v-if="this.displayed" >
                <tr v-for="result in this.displayed.match" :key="result.number">
                    <td>{{ result.number }}</td>
                    <td>
                      <pre v-if="contains != ''" v-html="$options.filters.highlight(result.line, contains)"></pre>
                      <pre v-else>{{ result.line }}</pre>
                    </td>
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
  name: "ResultsView",
  props: ["displayed"],
  data() {
    return {
      contains: "",
      match: this.displayed
    };
  },
  mounted() {
    var that = this;
    ipcRenderer.on("contains", (event, args) => {
      that.contains = args;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../themes.scss";

.results-view {
  overflow-x: scroll;
}

table {
  width: 100%;
}

th {
  //background-color: $results-grid-header-color;
  font-size: 0.8em;
  white-space: nowrap;
  text-decoration: underline;
  border-bottom: 1px solid #545454;

  .light-theme & {
    background-color: white;
    color: black;
  }
}

tbody tr:hover {
  background-color: #4f4f4f;
  cursor: pointer;
}

td {
  padding: 0;
  margin: 0;
  white-space: nowrap;
  padding-left: 15px;
  border-top: 1px solid #4f4f4f;
  z-index: -1;

  .light-theme & {
    border-color: $td-border-color-light;
  }

  &:first-child {
    font-weight: bold;
    font-size: 0.8em;
  }
}

pre {
  color: white;
  margin: 0;
  padding: 0;

  .light-theme & {
    color: black;
  }
}

li {
  list-style-type: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.file-link {
  font-weight: bold;
  text-decoration: underline;
  height: 26px;
  line-height: 26px;
  background-color: #2c333d;
}
</style>
