import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import axios from "axios";
import { config } from "@/../api";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/BooksListView.vue"),
  },
  {
    path: "/book/:book_id",
    name: "book",
    component: () => import("../views/BookView.vue"),
  },
];

const router = new VueRouter({
  routes,
});

async function isAuthenticated(): Promise<boolean> {
  try {
    await axios.get(new URL(config.endpoints.login, config.server).toString(), {
      withCredentials: true,
    });
    return true;
  } catch (err) {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const auth = await isAuthenticated();
  if (auth) {
    if (to.name === "login") next({ name: "home" });
    else next();
  } else {
    if (to.name !== "login") next({ name: "login" });
    else next();
  }
});

export default router;
