import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import * as icons from "./icons";
import "bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { RollbarPlugin } from "@/rollbar";

library.add(icons);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(
  new RollbarPlugin({
    accessToken: "482cd9074ca34bb496d382ce456c28e5",
    captureUncaught: true,
    captureUnhandledRejections: true,
    captureIp: true,
  })
);

// Логирование ошибок через rollbar
Vue.config.errorHandler = async (err, vm, info) => {
  vm.$rollbar.log("Error Handled:");
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
