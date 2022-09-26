import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookOpen, faGears } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";

library.add(faBookOpen, faGears);
Vue.component("font-awesome-icon", FontAwesomeIcon);

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
