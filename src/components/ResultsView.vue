<template>
    <div class="results-view">
        {{ file.matches }}
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "ResultsView",
  data() {
    return {
      file: ""
    };
  },
  mounted() {
    var that = this;

    ipcRenderer.on("loadResults", (event, args) => {
      that.file = args;
    });
  }
};
</script>

<style lang="scss" scoped>
.results-view {
  overflow-x: scroll;
}
</style>
