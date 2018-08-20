import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.filter("highlight", (word, query) => {
  var check = new RegExp(query, "ig");
  return word.toString().replace(check, matchedText => {
    return "<strong>" + matchedText + "</strong>";
  });
});

new Vue({
  render: h => h(App)
}).$mount("#app");
