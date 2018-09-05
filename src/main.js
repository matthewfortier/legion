import Vue from "vue";
import App from "./App.vue";
import escape from "escape-html";
import io from "socket.io-client";
import VueConfig from "vue-configuration";
import icons from "./icons.js";
import contenteditableDirective from "vue-contenteditable-directive";
import VueVirtualScroller from 'vue-virtual-scroller'

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

var mime = require("mime-types");

// pass config object to the plugin
Vue.use(VueConfig, {
  config: icons
});
Vue.use(contenteditableDirective);
Vue.use(VueVirtualScroller)

Vue.config.productionTip = false;
Vue.prototype.$socket = io("http://localhost:9090");

Vue.filter("highlight", (word, query) => {
  var check = new RegExp(escape(query), "ig");
  return escape(word)
    .toString()
    .replace(check, matchedText => {
      return "<span class='highlightText'>" + matchedText + "</span>";
    });
});

Vue.filter("dateFromTime", time => {
  return new Date(time).toLocaleString();
});

Vue.filter("bytesToSize", (bytes, decimals = 2) => {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
});

Vue.filter("mime", ext => {
  var type = mime.lookup(ext);
  return type ? type : ext;
});

Vue.filter("icon", filename => {
  if (icons["fileExtensions"][filename]) {
    return icons["iconDefinitions"][icons["fileExtensions"][filename]][
      "iconPath"
    ];
  } else {
    for (var icon in icons["fileExtensions"]) {
      if (filename.endsWith(icon)) {
        return icons["iconDefinitions"][icons["fileExtensions"][icon]][
          "iconPath"
        ];
      }
    }
    return icons["iconDefinitions"][icons["fileExtensions"]["txt"]]["iconPath"];
  }
});

new Vue({
  render: h => h(App)
}).$mount("#app");
