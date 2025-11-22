<template>
  <div class="container mt-4">
    <h2 class="mb-4">👤 Список Читачів (CRUD)</h2>

    <div class="card mb-4 shadow">
      <div class="card-header bg-primary text-white">
        {{ isEditing ? "Редагування Читача" : "Додати Нового Читача" }}
      </div>
      <div class="card-body">
        <form @submit.prevent="saveReader">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Ім'я</label>
              <input
                v-model="readerForm.firstName"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Прізвище</label>
              <input
                v-model="readerForm.lastName"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Email</label>
              <input
                v-model="readerForm.email"
                type="email"
                class="form-control"
                required
              />
            </div>
          </div>
          <button type="submit" class="btn btn-success me-2">
            {{ isEditing ? "Зберегти зміни" : "Створити Читача" }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            @click="cancelEdit"
            class="btn btn-secondary"
          >
            Скасувати
          </button>
        </form>
      </div>
    </div>
    <div v-if="loading" class="alert alert-info">Завантаження даних...</div>
    <div v-else-if="error" class="alert alert-danger">Помилка: {{ error }}</div>

    <div v-else>
      <p class="text-success">Знайдено читачів: {{ readers.length }}</p>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Ім'я</th>
            <th>Email</th>
            <th>Активні Замовлення</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reader in readers" :key="reader.id">
            <td>{{ reader.id }}</td>
            <td>{{ reader.firstName }} {{ reader.lastName }}</td>
            <td>{{ reader.email }}</td>
            <td>{{ reader.activeOrdersCount }}</td>
            <td>
              <button
                @click="editReader(reader)"
                class="btn btn-sm btn-warning me-2"
              >
                Редагувати
              </button>
              <button
                @click="deleteReader(reader.id)"
                class="btn btn-sm btn-danger"
              >
                Видалити
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ReadersView",
  data() {
    return {
      readers: [],
      loading: true,
      error: null,
      apiUrl: "http://localhost:8081/api/v1/readers",
      isEditing: false,
      readerForm: {
        id: null,
        firstName: "",
        lastName: "",
        phoneNumber: "", // Можна ігнорувати, якщо не потрібен у формі
        email: "",
        activeOrdersCount: 0,
      },
    };
  },
  mounted() {
    this.fetchReaders();
  },
  methods: {
    // ------------------------------------
    // READ (Отримання всіх)
    // ------------------------------------
    async fetchReaders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(this.apiUrl);
        this.readers = response.data;
      } catch (err) {
        this.error = `Помилка: ${
          err.response ? err.response.status : "мережі"
        }. Перевірте бекенд.`;
      } finally {
        this.loading = false;
      }
    },

    // ------------------------------------
    // CREATE / UPDATE (Створення / Збереження)
    // ------------------------------------
    async saveReader() {
      try {
        const readerData = { ...this.readerForm };

        if (this.isEditing) {
          // UPDATE (PUT)
          await axios.put(`${this.apiUrl}/${readerData.id}`, readerData);
        } else {
          // CREATE (POST)
          // Видаляємо ID, щоб БД його згенерувала
          delete readerData.id;
          await axios.post(this.apiUrl, readerData);
        }

        // Оновлюємо список
        this.fetchReaders();
        this.resetForm();
      } catch (err) {
        this.error = `Помилка збереження: ${err.response.status}. Перевірте унікальні поля (Email).`;
        console.error(err);
      }
    },

    // ------------------------------------
    // DELETE (Видалення)
    // ------------------------------------
    async deleteReader(id) {
      if (!confirm("Ви впевнені, що хочете видалити цього читача?")) return;

      try {
        await axios.delete(`${this.apiUrl}/${id}`);
        this.fetchReaders(); // Оновлюємо список
      } catch (err) {
        this.error = `Помилка видалення: ${err.response.status}. Можливий конфлікт FK (книга видана).`;
        console.error(err);
      }
    },

    // ------------------------------------
    // ДОПОМІЖНІ МЕТОДИ
    // ------------------------------------
    editReader(reader) {
      // Заповнюємо форму даними для редагування
      this.readerForm = { ...reader };
      this.isEditing = true;
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      // Скидаємо форму до початкового стану
      this.readerForm = {
        id: null,
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        activeOrdersCount: 0,
      };
      this.isEditing = false;
    },
  },
};
</script>
