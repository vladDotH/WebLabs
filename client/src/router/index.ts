import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import BrokersView from "@/views/BrokersView.vue";
import StocksView from "@/views/StocksView.vue";
import Bargaining from "@/views/Bargaining.vue";
import { UserController } from "@/util/UserController";

Vue.use(VueRouter);

export enum Views {
  LOGIN = "login",
  BROKERS = "brokers",
  STOCKS = "stocks",
  BARGAINING = "bargaining",
}

const routes: Array<RouteConfig> = [
  { path: "/login", name: Views.LOGIN, component: LoginView },
  { path: "/brokers", name: Views.BROKERS, component: BrokersView },
  { path: "/stocks", name: Views.STOCKS, component: StocksView },
  { path: "/bargainig", name: Views.BARGAINING, component: Bargaining },
];

const router = new VueRouter({
  routes,
});

// Перенаправление неавторизованного пользователя на страницу входа
router.beforeEach(async (to, from, next) => {
  const auth = await UserController.check();
  if (auth) {
    router.app.$store.commit("updateAuth", true);
    if (to.name === Views.LOGIN) next({ name: Views.BROKERS });
    else next();
  } else {
    router.app.$store.commit("updateAuth", false);
    if (to.name !== Views.LOGIN) next({ name: Views.LOGIN });
    else next();
  }
});

export default router;
