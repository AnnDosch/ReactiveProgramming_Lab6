import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue"; // Вже існує
import CatalogView from "../views/CatalogView.vue";
import ReadersView from "../views/ReadersView.vue";
import AdminView from "../views/AdminView.vue";
import LoginView from "../views/LoginView.vue";
import LibrariansView from "../views/LibrariansView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/catalog",
    name: "catalog",
    component: CatalogView,
  },
  {
    path: "/readers",
    name: "readers",
    component: ReadersView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/librarians",
    name: "librarians",
    component: LibrariansView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
