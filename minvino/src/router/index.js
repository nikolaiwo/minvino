import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SingleWineView from "../views/SingleWineView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/wine/:articleNumber",
    component: SingleWineView,
    props: true,
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
});
export default router;
