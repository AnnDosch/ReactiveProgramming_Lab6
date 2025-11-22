<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">🏛️ Бібліотека</router-link>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/catalog" class="nav-link"
                >Каталог Книг</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/readers" class="nav-link">Читачі</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/librarians" class="nav-link"
                >Бібліотекарі</router-link
              >
            </li>
          </ul>

          <ul class="navbar-nav">
            <!-- <li class="nav-item">
              <a
                v-if="isAuthenticated"
                @click="logout"
                class="nav-link btn btn-link text-white me-2"
                >Вихід</a
              >

              <router-link
                v-else
                to="/login"
                class="nav-link btn btn-success text-white"
                >Увійти</router-link
              >
            </li> -->
            <li class="nav-item">
              <img
                class="nav-link text-white me-2"
                style="filter: invert(1); width: 46px; height: 46px"
                src="/userIcon.png"
                alt="User Icon"
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$store.commit("setToken", null);

      this.$router.push("/login");
    },
  },
};
</script>
