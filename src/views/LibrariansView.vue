<template>
  <div class="container mt-4">
    <h2 class="mb-4">💼 Список Бібліотекарів</h2>

    <div class="card mb-4 shadow">
      <div class="card-header bg-info text-white">
        {{
          isEditing ? "Редагування Бібліотекаря" : "Додати Нового Бібліотекаря"
        }}
      </div>
      <div class="card-body">
        <form @submit.prevent="saveLibrarian">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Ім'я</label>
              <input
                v-model="librarianForm.firstName"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Прізвище</label>
              <input
                v-model="librarianForm.lastName"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Посада</label>
              <input
                v-model="librarianForm.position"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn btn-success me-2">
            {{ isEditing ? "Зберегти зміни" : "Створити Бібліотекаря" }}
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
      <p class="text-success">
        Знайдено бібліотекарів: {{ librarians.length }}
      </p>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Ім'я</th>
            <th>Прізвище</th>
            <th>Посада</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="librarian in librarians" :key="librarian.id">
            <td>{{ librarian.id }}</td>
            <td>{{ librarian.firstName }}</td>
            <td>{{ librarian.lastName }}</td>
            <td>{{ librarian.position }}</td>
            <td>
              <button
                @click="editLibrarian(librarian)"
                class="btn btn-sm btn-warning me-2"
              >
                Редагувати
              </button>
              <button
                @click="deleteLibrarian(librarian.id)"
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
  name: "LibrariansView",
  data() {
    return {
      librarians: [],
      loading: true,
      error: null,
      // URL для LibrarianController
      apiUrl: "http://localhost:8081/api/v1/librarians",
      isEditing: false,
      librarianForm: {
        id: null,
        firstName: "",
        lastName: "",
        position: "",
      },
    };
  },
  mounted() {
    this.fetchLibrarians();
  },
  methods: {
    async fetchLibrarians() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(this.apiUrl);
        this.librarians = response.data;
      } catch (err) {
        this.error = `Помилка: ${
          err.response ? err.response.status : "мережі"
        }. Перевірте бекенд.`;
      } finally {
        this.loading = false;
      }
    },

    async saveLibrarian() {
      try {
        const librarianData = { ...this.librarianForm };

        if (this.isEditing) {
          await axios.put(`${this.apiUrl}/${librarianData.id}`, librarianData);
        } else {
          delete librarianData.id;
          await axios.post(this.apiUrl, librarianData);
        }

        this.fetchLibrarians();
        this.resetForm();
      } catch (err) {
        this.error = `Помилка збереження: ${err.response.status}. Перевірте дані.`;
        console.error(err);
      }
    },

    async deleteLibrarian(id) {
      if (!confirm("Ви впевнені, що хочете видалити цього бібліотекаря?"))
        return;

      try {
        await axios.delete(`${this.apiUrl}/${id}`);
        this.fetchLibrarians(); // Оновлюємо список
      } catch (err) {
        this.error = `Помилка видалення: ${err.response.status}. Перевірте, чи не пов'язаний цей бібліотекар з іншими даними.`;
        console.error(err);
      }
    },

    editLibrarian(librarian) {
      this.librarianForm = { ...librarian };
      this.isEditing = true;
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      this.librarianForm = {
        id: null,
        firstName: "",
        lastName: "",
        position: "",
      };
      this.isEditing = false;
    },
  },
};
</script>
