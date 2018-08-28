<template>
    <div class="results-view" data-simplebar> 
        <tr><th v-if="this.$parent.displayed" colspan="2">{{ this.$parent.displayed.path }}</th><th></th></tr>
        <table>
            <tbody v-if="this.$parent.displayed" >
                <tr v-for="result in this.$parent.displayed.match" :key="result.number">
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
  data() {
    return {
      contains: ""
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
.results-view {
  overflow-x: scroll;
}

table {
  width: 100%;
}

th {
  background-color: #2c333d;
  white-space: nowrap;
  text-decoration: underline;
}

tbody tr:hover {
  background-color: lighten(#1b77d2, 10);
  cursor: pointer;
}

td {
  padding: 0;
  margin: 0;
  white-space: nowrap;
  padding-left: 15px;
  border-top: 1px solid #2f374a;

  &:first-child {
    background-color: lighten(#1b77d2, 10);
    padding: 0 5px;
    min-width: 20px;
    color: black;
  }
}

pre {
  color: white;
  margin: 0;
  padding: 0;
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

strong {
  background-color: rgba(white, 0.4) !important;
}

.highlightText {
  background: orange;
  color: black;
}
</style>
