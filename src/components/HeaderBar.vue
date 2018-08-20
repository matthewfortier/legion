<template>
    <div class="header-bar">
      <div v-bind:class="(os == 'darwin') ? 'darwin' : ''" class="left">
        <i v-on:click="runQuery()" id="run" class="fas fa-play" data-toggle="tooltip" data-placement="bottom" title="Run Query"></i>
        <i v-on:click="stopQuery()" id="stop" class="fas fa-stop" data-toggle="tooltip" data-placement="bottom" title="Stop"></i>
      </div>
      <div class="center">
        <span>legion</span>
      </div>
      <div class="right">
        <div v-if="os == 'win32'" class="windows-buttons">
          <i v-on:click="minimize()" id="minimize" class="far fa-window-minimize"></i>
          <i v-on:click="maximize()" id="maximize" class="far fa-window-maximize"></i>
          <i v-on:click="close()" id="close" class="far fa-window-close"></i>
        </div>
      </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
const BrowserWindow = window.require("electron").remote;

export default {
  name: "HeaderBar",
  data() {
    return {
      os: process.platform
    };
  },
  methods: {
    runQuery: () => {
      ipcRenderer.send("cross-component", "run-query");
    },
    stopQuery: () => {
      ipcRenderer.send("stop-query");
    },
    getPlatform: () => {
      ipcRenderer.send("platform");
    },
    minimize: () => {
      BrowserWindow.getFocusedWindow().minimize();
    },
    maximize: () => {
      var win = BrowserWindow.getFocusedWindow();
      win.isMaximized() ? win.unmaximize() : win.maximize();
    },
    close: () => {
      BrowserWindow.getFocusedWindow().close();
    }
  },
  mounted() {
    var that = this;
    that.getPlatform();

    ipcRenderer.on("platform", (event, args) => {
      that.os = args;
    });
  }
};
</script>

<style lang="scss" scoped>
$header-color: #151d2c;
$body-color: lighten(#151d2c, 2);

.header-bar {
  display: block;
  height: 38px;
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
  padding-left: 15px;
  -webkit-app-region: no-drag;

  &.darwin {
    padding-left: 85px;
  }
}

.center {
  position: absolute;
  width: 200px;
  text-align: center;
  left: calc(50% - 100px);
}

.right {
  -webkit-app-region: no-drag;

  i {
    height: 38px;
    width: 38px;
    padding: 0 5px;
    text-align: center;
    vertical-align: center;
    margin: 0;
    line-height: 38px;

    &:hover {
      background-color: lighten(#1b77d2, 10);
    }

    &:nth-child(3):hover {
      background-color: #e81123;
    }

    &:nth-child(3):active {
      background-color: #f1707a;
    }
  }
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
