<template>
    <div class="footer-bar">
        <div v-if="loading" class="loader">
            <div class="loader1">
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-bind:class="loading ? 'loading' : ''" class="footer-bar-content">
            <div class="left">
              <div v-if="loading" class="loading-message">Searching {{searching}} files...</div>
            </div>
            <div class="center"></div>
            <div class="right">
              <div class="progress-bar">
                <p>{{ searched }} / {{ searching }}</p>
                <span v-bind:style="{ width: (searched / searching) * 100 + '%' }"></span>
              </div>
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
      matched: null
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
    ipcRenderer.on("stop-loading", () => {
      that.stopLoading();
    });
    ipcRenderer.on("start-loading", () => {
      that.startLoading();
      that.searching = null;
      that.matched = null;
      that.searched = 0;
    });
    ipcRenderer.on("percent-complete", (event, args) => {
      // eslint-disable-next-line
      console.log(args);
    });

    ipcRenderer.on("increment-searched", () => {
      that.searched++;
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
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.loading {
    padding-left: 34px;
  }
}

.loader {
  height: 100px;
  width: 100px;
  transform: scale(0.2);
  margin-top: -34px;
  margin-left: -34px;
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

.right {
  padding-right: 10px;
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
