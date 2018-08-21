<template>
  <div id="app">
    <HeaderBar />
    <QueryBuilder />
    <section class="app-body container-fluid">
      <div id="results-row" class="row">
        <div id="results">
          <ResultsGrid />
          <ResultsView />
        </div>
      </div>
    </section>
    <FooterBar />
  </div>
</template>

<script>
const $ = require("jquery");
require("bootstrap/dist/css/bootstrap.css");
require("bootstrap");
var Split = require("split.js");

import QueryBuilder from "@/components/QueryBuilder";
import HeaderBar from "@/components/HeaderBar";
import ResultsGrid from "@/components/ResultsGrid";
import ResultsView from "@/components/ResultsView";
import FooterBar from "@/components/FooterBar";

export default {
  name: "app",
  components: {
    QueryBuilder,
    HeaderBar,
    ResultsGrid,
    ResultsView,
    FooterBar
  },
  data() {
    return {
      files: []
    };
  },
  mounted() {
    $('[data-toggle="tooltip"]').tooltip({
      delay: { show: 1000, hide: 100 }
    });

    Split([".results-grid", ".results-view"], {
      sizes: [50, 50],
      minSize: 300
    });
  }
};
</script>

<style lang="scss">
@import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
@import url("https://fonts.googleapis.com/css?family=Karla");

$header-color: #151d2c;
$body-color: lighten(#151d2c, 2);

html,
body {
  overflow: hidden;
  margin: 0;
  padding: 0;

  height: 100vh;
  background-color: #151d2c;
}
#app {
  font-family: "Karla", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;

  height: 100vh;
  display: flex;
  flex-direction: column;

  background-color: $body-color;
}

.app-body {
  flex: 1;
  overflow: auto;
}

#results-row {
  height: 100%;
}

#results {
  display: flex;
  overflow: hidden;
  width: 100%;
}

.darwin-header {
  height: 22px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gutter {
  background-color: #2f374a;

  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
  background-image: url("./assets/vertical.png");
  cursor: ew-resize;
}

.gutter.gutter-vertical {
  background-image: url("./assets/horizontal.png");
  cursor: ns-resize;
}
</style>
