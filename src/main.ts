import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import * as icons from "./icons";
import "bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { RollbarPlugin } from "@/rollbar/RollbarPlugin";

library.add(icons);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(
  new RollbarPlugin({
    accessToken: "eab95a630f7848789871044db1f99308",
    captureUncaught: true,
    captureUnhandledRejections: true,
    captureIp: true,
  })
);

// Логирование ошибок через rollbar
Vue.config.errorHandler = (err, vm, info) => {
  vm.$rollbar.error(err);
  throw err;
};

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

// Добавить куки ко всем запросам
axios.interceptors.request.use(function (config) {
  config.withCredentials = true;
  return config;
});
