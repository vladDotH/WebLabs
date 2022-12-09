import axios from "axios";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import * as icons from "./icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(icons);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

// Добавить куки ко всем запросам
axios.interceptors.request.use(function (config) {
  config.withCredentials = true;
  return config;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
