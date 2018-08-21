import Vue from "vue";
import App from "./App.vue";
import Vuebar from "vuebar";

Vue.config.productionTip = false;

Vue.filter("highlight", (word, query) => {
  var check = new RegExp(query, "ig");
  return word.toString().replace(check, matchedText => {
    return "<strong>" + matchedText + "</strong>";
  });
});

Vue.use(Vuebar);

new Vue({
  render: h => h(App)
}).$mount("#app");
