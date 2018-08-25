<template>
    <div class="results-view" data-simplebar> 
        <tr><th colspan="2">{{ file }}</th><th></th></tr>
        <table>
            <tbody>
                <tr v-for="result in displayed" :key="result.number">
                    <td>{{ result.number }}</td>
                    <td>
                        {{ result.line }}
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
      file: "",
      matches: [],
      displayed: "",
      contains: ""
    };
  },
  mounted() {
    var that = this;

    ipcRenderer.on("loadResults", (event, args) => {
      that.displayed = [];
      that.matches.forEach(match => {
        if (match.file == args) {
          that.displayed = match.match;
          that.file = match.path;

          ipcRenderer.send("cross-component", {
            message: "set-title-bar",
            data:
              that.file.replace(/^.*[\\/]/, "") +
              ` (${that.displayed.length} ${
                that.displayed.length > 1 ? "matches" : "match"
              }) -- legion`
          });
        }
      });
    });

    ipcRenderer.on("match", (event, args) => {
      args.forEach(match => {
        that.matches.push(match);
      });
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

.highlightText {
  background: orange;
  color: black;
}
</style>
