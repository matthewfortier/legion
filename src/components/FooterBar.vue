<template>
    <div class="footer-bar">
        <div v-if="loading" class="loader">
            <div class="loader1">
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="footer-bar-content">
            <div v-bind:class="loading ? 'loading' : ''" class="left">
              <div v-if="loading" class="loading-message">Searching {{searching}} files...</div>
              <div v-else class="loading-message">Ready</div>
            </div>
            <div class="center"></div>
            <div class="right">
              <span>{{ matched }} found ({{ matchedSize | bytesToSize }})</span>
              <span class="divider"></span>
              <span>{{ searched }} searched ({{ searchedSize | bytesToSize }})</span>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "FooterBar",
  data() {
    return {
      loading: false,
      searching: null,
      searched: 0,
      searchedSize: 0,
      matched: null,
      matchedSize: 0
    };
  },
  methods: {
    stopLoading() {
      this.loading = false;
    },
    startLoading() {
      this.loading = true;
    }
  },
  mounted() {
    var that = this;
    ipcRenderer.on("files-searching", (event, args) => {
      // eslint-disable-next-line
      console.log("Searching");
      that.searching = args;
    });
    this.$socket.on("stop-loading", () => {
      that.stopLoading();
    });
    ipcRenderer.on("stop-loading", () => {
      that.stopLoading();
    });
    ipcRenderer.on("start-loading", () => {
      that.startLoading();
      that.searching = null;
      that.matched = null;
      that.searched = 0;
      that.matched = 0;
      that.searchedSize = 0;
      that.matchedSize = 0;
    });
    ipcRenderer.on("percent-complete", (event, args) => {
      // eslint-disable-next-line
      console.log(args);
    });

    this.$socket.on("increment-searched", size => {
      that.searched++;
      that.searchedSize += size;
    });
    this.$socket.on("increment-matched", size => {
      that.matched++;
      that.matchedSize += size;
    });
  }
};
</script>

<style lang="scss" scoped>
$header-color: #151d2c;
.footer-bar {
  background-color: $header-color;
  height: 31px;
}

.footer-bar-content {
  font-size: 12px;
  line-height: 31px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .divider {
    display: block;
    width: 0px;
    line-height: 31px;
    margin-top: 6px;
    height: 18px;
    border-left: 1px solid #2f374a;
  }
}

.loader {
  height: 100px;
  width: 100px;
  transform: scale(0.2);
  margin-top: -36px;
  margin-left: -32px;
  position: absolute;
}

.loader1 {
  height: 100%;
  width: 100%;
  position: relative;

  div:nth-child(1) {
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: 10px solid #1b77d2;
    border-left: 10px solid transparent;
    animation: spinForwards 2s linear infinite;
  }

  div:nth-child(2) {
    top: 0;
    left: 0;
    margin-left: 10%;
    margin-top: 10%;
    position: absolute;
    height: 80%;
    width: 80%;
    border-radius: 50%;
    border: 10px solid lighten(#1b77d2, 10);
    border-left: 10px solid transparent;
    border-bottom: 10px solid transparent;
    animation: spinForwards 1s linear infinite;
  }
}

.left {
  padding-left: 10px;
  width: 33vw;

  &.loading {
    padding-left: 34px;
  }
}

.right {
  padding-right: 10px;
  width: 33vw;
  display: flex;
  justify-content: flex-end;

  span {
    margin-left: 15px;
  }
}

.progress-bar {
  display: block;
  position: relative;
  height: 24px;
  width: 100px;
  background-color: #2f374a;

  span {
    display: block;
    height: 24px;
    width: 0%;
    background-color: #1b77d2;
  }

  p {
    line-height: 24px;
    position: absolute;
    width: 100px;
    left: calc(50% - 50px);
  }
}

@keyframes spinForwards {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
