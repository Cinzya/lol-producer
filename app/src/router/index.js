import Vue from "vue";
import VueRouter from "vue-router";
import Connect from "../views/Connect.vue";
import Home from "../views/Home.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Connect",
    component: Connect,
  },
  {
    path: "/Home",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      if (to.name !== "Connect" && !store.state.connection)
        next({ name: "Connect" });
      else next();
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
