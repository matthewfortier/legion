<template>
    <div class="header-bar">
      <div class="left">
        <i v-on:click="runQuery()" id="run" class="fas fa-play" data-toggle="tooltip" data-placement="bottom" title="Run Query"></i>
        <i id="pause" class="fas fa-pause" data-toggle="tooltip" data-placement="bottom" title="Pause"></i>
        <i v-on:click="stopQuery()" id="stop" class="fas fa-stop" data-toggle="tooltip" data-placement="bottom" title="Stop"></i>
      </div>
      <div class="center">
        <span>legion</span>
      </div>
      <div class="right"></div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "HeaderBar",
  methods: {
    runQuery: () => {
      // eslint-disable-next-line
      console.log("run-query");
      ipcRenderer.send("cross-component", "run-query");
    },
    stopQuery: () => {
      // eslint-disable-next-line
      console.log("stop-query");
      ipcRenderer.send("stop-query");
    }
  }
};
</script>

<style lang="scss" scoped>
$header-color: #151d2c;
$body-color: lighten(#151d2c, 2);

.header-bar {
  display: block;
  height: 35px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  -webkit-app-region: drag;
  user-select: none;
  background-color: $header-color;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

span {
  font-size: 12px;
}

.left {
  padding-left: 85px;
}

.center {
  position: absolute;
  width: 200px;
  text-align: center;
  left: calc(50% - 100px);
}

i {
  margin-right: 15px;
}

#run,
#pause,
#stop {
  color: #1b77d2;
}
</style>
