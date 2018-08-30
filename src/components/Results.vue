<template>
    <section class="app-body container-fluid">
      <div id="results-row" class="row">
        <div id="results">
          <ResultsGrid />
          <ResultsView :displayed="displayed" />
        </div>
      </div>
    </section>
</template>

<script>
import ResultsGrid from "@/components/ResultsGrid";
import ResultsView from "@/components/ResultsView";
var Split = require("split.js");

export default {
  name: "Results",
  components: {
    ResultsGrid,
    ResultsView
  },
  data() {
    return {
      matches: [],
      displayed: null
    };
  },
  methods: {},
  mounted() {
    var that = this;
    this.$parent.electron.ipcRenderer.on("match", (event, args) => {
      args.forEach(file => {
        that.matches.push(file);
      });
    });

    this.$parent.electron.ipcRenderer.on("clear", () => {
      that.matches = [];
      that.displayed = null;
    });

    Split([".results-grid", ".results-view"], {
      sizes: [50, 50],
      minSize: 300
    });

    this.$socket.on("match", data => {
      // eslint-disable-next-line
      console.log(data);
      var temp = JSON.parse(data);
      that.matches.push(temp);
    });

    this.$socket.on("result", data => {
      // eslint-disable-next-line
      console.log(data);
      that.displayed = data;
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
