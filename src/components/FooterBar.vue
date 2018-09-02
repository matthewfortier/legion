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
            <div class="right">
              <span v-show="time">{{ time }} seconds</span>
              <span class="divider"></span>
              <span>{{ matched }} files found ({{ matchedSize | bytesToSize }})</span>
              <span class="divider"></span>
              <span>{{ searched }} files searched ({{ searchedSize | bytesToSize }})</span>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "FooterBar",
  props: ["matched", "matchedSize", "searched", "searchedSize"],
  data() {
    return {
      loading: false,
      searching: null,
      time: null
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
      that.searching = args;
    });
    this.$socket.on("stop-loading", time => {
      that.time = time;
      that.stopLoading();
    });
    ipcRenderer.on("stop-loading", () => {
      that.stopLoading();
    });
    ipcRenderer.on("start-loading", () => {
      that.startLoading();
      that.searching = null;
      that.time = null;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../themes.scss";

.footer-bar {
  background-color: $header-color;
  height: 31px;

  .light-theme & {
    background-color: $accent-color;
    color: white;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.12), 0 -1px 2px rgba(0, 0, 0, 0.24);
  }
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
    border: 10px solid $accent-color;
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
    border: 10px solid $accent-color-light;
    border-left: 10px solid transparent;
    border-bottom: 10px solid transparent;
    animation: spinForwards 1s linear infinite;
  }
}

.left {
  padding-left: 10px;

  &.loading {
    padding-left: 34px;
  }
}

.right {
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;

  span {
    margin-left: 15px;
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
