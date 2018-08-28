<template>
  <div id="app">
    <HeaderBar />
    <QueryBuilder />
    <Results />
    <FooterBar />
  </div>
</template>

<script>
const $ = require("jquery");
require("bootstrap/dist/css/bootstrap.css");
require("bootstrap");

import QueryBuilder from "@/components/QueryBuilder";
import HeaderBar from "@/components/HeaderBar";
import FooterBar from "@/components/FooterBar";
import Results from "@/components/Results";

export default {
  name: "app",
  components: {
    QueryBuilder,
    HeaderBar,
    Results,
    FooterBar
  },
  data() {
    return {
      electron: window.require("electron")
    };
  },
  mounted() {
    $('[data-toggle="tooltip"]').tooltip({
      delay: { show: 1000, hide: 100 }
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
  background: transparent;
}

body {
  border: 1px solid darken(#1b77d2, 20);
  border-radius: 5px;
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
  border-top: 1px solid lighten(#1b77d2, 10);
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

.highlightText {
  background: rgba(#1b77d2, 0.5);
  color: white;
}
</style>
