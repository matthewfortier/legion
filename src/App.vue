<template>
  <div id="app">
    <HeaderBar />
    <QueryBuilder />
    <Results :matches="matches" :displayed="displayed" />
    <FooterBar :matched="matches.length" :matchedSize="matchedSize" :searched="searched" :searchedSize="searchedSize" />
  </div>
</template>

<script>
const $ = require("jquery");
require("bootstrap/dist/css/bootstrap.css");
require("bootstrap");
var Split = require("split.js");

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
      electron: window.require("electron"),
      matches: [],
      matchedSize: 0,
      searched: 0,
      searchedSize: 0,
      displayed: null,
      split: null
    };
  },
  mounted() {
    var that = this;
    $('[data-toggle="tooltip"]').tooltip({
      delay: { show: 1000, hide: 100 }
    });

    that.split = Split([".results-grid", ".results-view"], {
      sizes: [50, 50],
      minSize: 300
    });
    that.split.collapse(1);

    this.electron.ipcRenderer.on("toggle-light", () => {
      document.documentElement.classList.toggle("light-theme");
    });

    this.electron.ipcRenderer.on("clear", () => {
      that.matches = [];
      that.displayed = null;
      that.split.collapse(1);
    });

    this.$socket.on("match", data => {
      var temp = JSON.parse(data);
      that.matches.push(temp);
      that.matchedSize += temp.stats.size;
    });

    this.$socket.on("result", data => {
      that.displayed = data;
      that.split.setSizes([50, 50]);
    });

    this.$socket.on("searched-files", data => {
      // eslint-disable-next-line
      console.log(data);
      that.searched = data.searched;
      that.searchedSize = data.searchedSize;
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
  border-top: 1px solid #545454;

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

[data-simplebar] {
  z-index: auto !important;
}

.highlightText {
  //background: $match-highlight-text-color;
  color: $accent-color-light;
  font-weight: bold;

  .light-theme & {
    color: black;
  }
}
</style>
