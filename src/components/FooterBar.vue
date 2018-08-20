<template>
    <div class="footer-bar">
        <div v-if="loading" class="loader">
            <div class="loader1">
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-bind:class="loading ? 'loading' : ''" class="footer-bar-content">
            <div v-if="loading" class="loading-message">Searching...</div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "FooterBar",
  data() {
    return {
      loading: false
    };
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading;
    }
  },
  mounted() {
    var that = this;
    ipcRenderer.on("toggleLoading", () => {
      that.toggleLoading();
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

@keyframes spinForwards {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
