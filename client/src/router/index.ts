import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import BrokersView from "@/views/BrokersView.vue";
import StocksView from "@/views/StocksView.vue";
import TradesView from "@/views/TradesView.vue";
// Чтобы роутер имел доступ к хранилищу
import "@/store/index";
import { Roles } from "@stocks_exchange/server/dist/api";
import BrokerTradesView from "@/views/BrokerTradesView.vue";

Vue.use(VueRouter);

export enum Views {
  LOGIN = "login",
  BROKERS = "brokers",
  STOCKS = "stocks",
  TRADES = "trades",
  BROKER = "broker",
}

const routes: Array<RouteConfig> = [
  { path: "/login", name: Views.LOGIN, component: LoginView },
  { path: "/brokers", name: Views.BROKERS, component: BrokersView },
  { path: "/stocks", name: Views.STOCKS, component: StocksView },
  { path: "/trades", name: Views.TRADES, component: TradesView },
  { path: "/my_trades", name: Views.BROKER, component: BrokerTradesView },
];

const router = new VueRouter({
  routes,
});

// Перенаправление неавторизованного пользователя на страницу входа
router.beforeEach(async (to, from, next) => {
  const auth = await router.app.$store.dispatch("check"),
    role = router.app.$store.state.self?.role;
  if (auth) {
    if (to.name === Views.LOGIN)
      next(
        role === Roles.ADMIN ? { name: Views.BROKERS } : { name: Views.BROKER }
      );
    else next();
  } else {
    if (to.name !== Views.LOGIN) next({ name: Views.LOGIN });
    else next();
  }
});

export default router;
