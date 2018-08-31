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

    this.electron.ipcRenderer.on("toggle-light", () => {
      document.documentElement.classList.toggle("light-theme");
    });
  }
};
</script>

<style lang="scss">
@import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
@import url("https://fonts.googleapis.com/css?family=Karla");
@import "./themes.scss";

html,
body {
  overflow: hidden;
  margin: 0;
  padding: 0;

  height: 100vh;
  background: transparent;
}

body {
  border: 1px solid $body-border-color;
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

  .light-theme & {
    background-color: $body-color-light;
  }
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
  border-top: 1px solid $accent-color-light;

  .light-theme & {
    border: none;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.12), 0 -1px 2px rgba(0, 0, 0, 0.24);
  }
}

.darwin-header {
  height: 22px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gutter {
  background-color: $gutter-color;

  background-repeat: no-repeat;
  background-position: 50%;

  .light-theme & {
    background-color: $gutter-color-light;
  }
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
  background: $match-highlight-text-color;
  color: white;

  .light-theme & {
    color: black;
  }
}
</style>
