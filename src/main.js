import Vue from "vue";
import App from "./App.vue";
import Vuebar from "vuebar";
//import VueElectron from "vue-electron";

Vue.config.productionTip = false;

Vue.filter("highlight", (word, query) => {
  var check = new RegExp(query, "ig");
  return word.toString().replace(check, matchedText => {
    return "<span class='highlightText'>" + matchedText + "</span>";
  });
});

Vue.use(Vuebar);
//Vue.use(VueElectron);

new Vue({
  render: h => h(App)
}).$mount("#app");
