import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import axios from "axios";
import { config } from "@/../api";

Vue.use(VueRouter);

export enum Views {
  LOGIN = "login",
  HOME = "home",
  USER = "user",
  POSTS = "posts",
  PHOTOS = "photos",
  FRIENDS = "friends",
  FRIENDSPOSTS = "friends-posts",
}

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: Views.LOGIN,
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/home",
    name: Views.HOME,
    component: () => import("../views/UsersListView.vue"),
  },
  {
    path: "/user/:user_id",
    name: Views.USER,
    component: () => import("../views/UserView.vue"),
    children: [
      {
        name: Views.POSTS,
        path: "posts",
        component: () => import("../components/lists/PostsList.vue"),
      },
      {
        name: Views.PHOTOS,
        path: "photos",
        component: () => import("../components/lists/PhotosList.vue"),
      },
      {
        name: Views.FRIENDS,
        path: "friends",
        component: () => import("../components/lists/UsersList.vue"),
      },
      {
        name: Views.FRIENDSPOSTS,
        path: "friends-posts",
        component: () => import("../components/lists/PostsList.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// Проверка авторизации пользователя
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

// Перенаправление неавторизованного пользователя на страницу входа
router.beforeEach(async (to, from, next) => {
  const auth = await isAuthenticated();
  if (auth) {
    if (to.name === Views.LOGIN) next({ name: Views.HOME });
    else next();
  } else {
    if (to.name !== Views.LOGIN) next({ name: Views.LOGIN });
    else next();
  }
});

export default router;
