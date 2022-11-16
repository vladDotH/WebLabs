import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import axios from "axios";
import { config } from "@/../api";

Vue.use(VueRouter);

export enum Views {
  LOGIN = "login",

  NETWORK = "network",
  PROFILE = "profile",
  NEWS = "news",
  FRIENDS = "friends",
  PHOTOS = "photos",

  USER = "user",
  USER_POSTS = "user_posts",
  USER_PHOTOS = "user_photos",
  USER_FRIENDS = "user_friends",
  USER_FRIENDSPOSTS = "user_friends_posts",

  USERS_LIST = "users_list",
}

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: Views.LOGIN,
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/",
    // name: Views.NETWORK,
    component: () => import("../views/Network.vue"),
    children: [
      {
        path: "",
        name: Views.PROFILE,
        component: () => import("../views/MyProfile.vue"),
      },
      {
        path: "news",
        name: Views.NEWS,
        component: () => import("../views/News.vue"),
      },
      {
        path: "friends",
        name: Views.FRIENDS,
        component: () => import("../views/Friends.vue"),
      },
      {
        path: "photos",
        name: Views.PHOTOS,
        component: () => import("../views/Photos.vue"),
      },
      {
        path: "user/:user_id",
        // name: Views.USER,
        component: () => import("../views/Profile.vue"),
        children: [
          {
            name: Views.USER_POSTS,
            path: "",
            component: () => import("../components/lists/PostsList.vue"),
          },
          {
            name: Views.USER_PHOTOS,
            path: "photos",
            component: () => import("../components/lists/PhotosList.vue"),
          },
          {
            name: Views.USER_FRIENDS,
            path: "friends",
            component: () => import("../components/lists/UsersList.vue"),
          },
          {
            name: Views.USER_FRIENDSPOSTS,
            path: "friends_posts",
            component: () => import("../components/lists/PostsList.vue"),
          },
        ],
      },
      {
        path: "users",
        name: Views.USERS_LIST,
        component: () => import("../views/UsersListView.vue"),
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
    await axios.head(
      new URL(config.endpoints.login, config.server).toString(),
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}

// Перенаправление неавторизованного пользователя на страницу входа
router.beforeEach(async (to, from, next) => {
  const auth = await isAuthenticated();
  if (auth) {
    if (to.name === Views.LOGIN) next({ name: Views.PROFILE });
    else next();
  } else {
    if (to.name !== Views.LOGIN) next({ name: Views.LOGIN });
    else next();
  }
});

export default router;
