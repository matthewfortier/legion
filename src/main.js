import Vue from "vue";
import App from "./App.vue";
import escape from "escape-html";

Vue.config.productionTip = false;

Vue.filter("highlight", (word, query) => {
  var check = new RegExp(escape(query), "ig");
  return escape(word).toString().replace(check, matchedText => {
    return "<span class='highlightText'>" + matchedText + "</span>";
  });
});

new Vue({
  render: h => h(App)
}).$mount("#app");
