// src/store/index.js

import { createStore } from "vuex";

export default createStore({
  state: {
    // Чи авторизований користувач
    isAuthenticated: false,
    // Токен (хоча для Basic Auth він не використовується, зберігаємо статус)
    userToken: null,
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
  },
  mutations: {
    // Зміна статусу входу
    setAuthenticated(state, status) {
      state.isAuthenticated = status;
    },
    // Встановлення токена (для зберігання в Local Storage)
    setToken(state, token) {
      state.userToken = token;
      if (token) {
        state.isAuthenticated = true;
        // Зберігаємо токен у Local Storage, щоб він не зникав при оновленні
        localStorage.setItem("userToken", token);
      } else {
        state.isAuthenticated = false;
        localStorage.removeItem("userToken");
      }
    },
    // Ініціалізація при старті програми
    initializeStore(state) {
      if (localStorage.getItem("userToken")) {
        state.userToken = localStorage.getItem("userToken");
        state.isAuthenticated = true;
      }
    },
  },
  actions: {
    // Тут можна додати логіку для входу (login) та виходу (logout)
  },
  modules: {},
});
