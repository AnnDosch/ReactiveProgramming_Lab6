<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg">
          <div class="card-body text-center">
            <h1 class="card-title text-primary mb-4">
              🏛️ Ласкаво просимо до Бібліотеки!
            </h1>

            <hr />

            <p class="card-text text-muted">
              Лабораторна робота №6 Дощич Ганна ІН-401
            </p>

            <div class="d-grid gap-2 col-6 mx-auto mt-4">
              <router-link to="/catalog" class="btn btn-primary btn-lg"
                >Перейти до Каталогу</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.card-title {
  font-weight: 700;
}
</style>
