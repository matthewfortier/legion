<template>
    <div class="header-bar">
      <div v-bind:class="(os == 'darwin' && !maximized) ? 'darwin' : ''" class="left">
        <i v-on:click="runQuery()" id="run" class="fas fa-play" data-toggle="tooltip" data-placement="bottom" title="Run Query"></i>
        <i v-on:click="pauseQuery()" id="pause" class="fas fa-pause" data-toggle="tooltip" data-placement="bottom" title="Pause"></i>
        <i v-on:click="stopQuery()" id="stop" class="fas fa-stop" data-toggle="tooltip" data-placement="bottom" title="Stop"></i>
      </div>
      <div class="center">
        <span>{{ title }}</span>
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
const BrowserWindow = window.require("electron").remote.BrowserWindow;

export default {
  name: "HeaderBar",
  data() {
    return {
      os: process.platform,
      maximized: false,
      title: "legion"
    };
  },
  methods: {
    runQuery: () => {
      ipcRenderer.send("cross-component", "run-query");
    },
    pauseQuery: () => {
      this.$socket.emit("pause-query");
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

    that.win = BrowserWindow.getFocusedWindow();

    ipcRenderer.on("platform", (event, args) => {
      that.os = args;
    });

    ipcRenderer.on("set-title-bar", (event, args) => {
      that.title = args;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../themes.scss";

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
  border-bottom: 1px solid #545454;

  .light-theme & {
    background-color: $accent-color;
    border-bottom: none;
    color: white;
  }
}

span {
  font-size: 12px;
  white-space: nowrap;
}

.left {
  padding-left: 10px;
  -webkit-app-region: no-drag;

  &.darwin {
    padding-left: 75px;
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
    &:hover {
      background-color: $accent-color-light;
    }

    &:nth-child(3):hover {
      background-color: $windows-close-hover;
    }

    &:nth-child(3):active {
      background-color: $windows-close-active;
    }

    .light-theme & {
      color: white;
    }
  }
}

i {
  padding: 0 7.5px;
  height: 38px;
  line-height: 38px;
  cursor: pointer;
}

#run,
#pause,
#stop,
#gear {
  color: $accent-color;

  .light-theme & {
    color: white;
  }
}
</style>
