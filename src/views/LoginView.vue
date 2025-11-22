<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-dark text-white">Вхід до системи</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <form @submit.prevent="submitLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Логін</label>
                <input
                  type="text"
                  v-model="username"
                  class="form-control"
                  id="username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">Увійти</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      error: null,
      apiUrl: "http://localhost:8081/admin",
    };
  },
  methods: {
    async submitLogin() {
      this.error = null;

      const credentials = `${this.username}:${this.password}`;

      try {
        const response = await axios.get(this.apiUrl, {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        });

        if (response.status === 200) {
          this.$store.commit("setToken", credentials);

          this.$router.push("/");
        }
      } catch (err) {
        this.error = "Помилка входу: Неправильний логін або пароль.";
        this.$store.commit("setToken", null);
        console.error("Login error:", err);
      }
    },
  },
  created() {},
};
</script>
