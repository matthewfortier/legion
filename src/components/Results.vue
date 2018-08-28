<template>
    <section class="app-body container-fluid">
      <div id="results-row" class="row">
        <div id="results">
          <ResultsGrid />
          <ResultsView />
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
  }
};
</script>

<style lang="scss" scoped>
</style>

