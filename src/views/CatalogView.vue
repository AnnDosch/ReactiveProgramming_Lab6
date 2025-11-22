<template>
  <div class="container mt-4">
    <h2 class="mb-4">📚 Каталог Книг (CRUD)</h2>

    <div class="card mb-4 shadow">
      <div class="card-header bg-success text-white">
        {{ isEditing ? "Редагування Книги" : "Додати Нову Книгу" }}
      </div>
      <div class="card-body">
        <form @submit.prevent="saveBook">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Назва</label>
              <input
                v-model="bookForm.title"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Автор</label>
              <input
                v-model="bookForm.author"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">ISBN</label>
              <input
                v-model="bookForm.isbn"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Рік видання</label>
              <input
                v-model="bookForm.publicationYear"
                type="number"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Інвентарний номер</label>
              <input
                v-model="bookForm.inventoryNumber"
                type="number"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Розташування</label>
              <select v-model="bookForm.location" class="form-select" required>
                <option value="Subscription">Абонемент</option>
                <option value="Reading Room">Читальний зал</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-success me-2">
            {{ isEditing ? "Зберегти зміни" : "Створити Книгу" }}
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
      <p class="text-success">Знайдено книг: {{ books.length }}</p>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Назва / Автор</th>
            <th>ISBN</th>
            <th>Рік</th>
            <th>Інв. Номер</th>
            <th>Доступність</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.id }}</td>
            <td>
              {{ book.title }} <br />
              <small class="text-muted">({{ book.author }})</small>
            </td>
            <td>{{ book.isbn }}</td>
            <td>{{ book.publicationYear }}</td>
            <td>{{ book.inventoryNumber }}</td>
            <td>
              <span
                :class="{
                  'badge bg-success': book.available,
                  'badge bg-danger': !book.available,
                }"
              >
                {{ book.available ? "В наявності" : "Видана" }}
              </span>
            </td>
            <td>
              <button
                @click="editBook(book)"
                class="btn btn-sm btn-warning me-2"
              >
                Редагувати
              </button>
              <button
                @click="deleteBook(book.id)"
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
  name: "CatalogView",
  data() {
    return {
      books: [],
      loading: true,
      error: null,
      apiUrl: "http://localhost:8081/api/v1/books", // Оновлений URL для BookController
      isEditing: false,
      bookForm: {
        id: null,
        title: "",
        author: "",
        isbn: "",
        publicationYear: null,
        inventoryNumber: null,
        location: "Subscription", // Значення за замовчуванням
        isAvailable: true,
        currentReaderId: null, // Не використовується у формі CRUD, але є у сутності
        dueDate: null,
      },
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    // ------------------------------------
    // READ (Отримання всіх)
    // ------------------------------------
    async fetchBooks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(this.apiUrl);
        // Зверніть увагу: API повертає `isAvailable`, тут перейменовуємо для зручності
        this.books = response.data.map((book) => ({
          ...book,
          available: book.isAvailable, // Використовуємо 'available' у шаблоні
        }));
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
    async saveBook() {
      try {
        const bookData = { ...this.bookForm };

        // Перетворення number на int/long, якщо це потрібно для API
        bookData.publicationYear = parseInt(bookData.publicationYear);
        bookData.inventoryNumber = parseInt(bookData.inventoryNumber);

        if (this.isEditing) {
          // UPDATE (PUT)
          await axios.put(`${this.apiUrl}/${bookData.id}`, bookData);
        } else {
          // CREATE (POST)
          delete bookData.id;
          await axios.post(this.apiUrl, bookData);
        }

        this.fetchBooks();
        this.resetForm();
      } catch (err) {
        this.error = `Помилка збереження: ${err.response.status}. Перевірте унікальні поля (ISBN, Інв. номер).`;
        console.error("Помилка:", err);
      }
    },

    // ------------------------------------
    // DELETE (Видалення)
    // ------------------------------------
    async deleteBook(id) {
      if (
        !confirm(
          "Ви впевнені, що хочете видалити цю книгу? Це можливо, тільки якщо вона доступна (не видана читачеві)."
        )
      )
        return;

      try {
        await axios.delete(`${this.apiUrl}/${id}`);
        this.fetchBooks(); // Оновлюємо список
      } catch (err) {
        this.error = `Помилка видалення: ${err.response.status}. Можливо, книга видана.`;
        console.error(err);
      }
    },

    // ------------------------------------
    // ДОПОМІЖНІ МЕТОДИ
    // ------------------------------------
    editBook(book) {
      // Заповнюємо форму даними для редагування
      this.bookForm = { ...book };
      this.isEditing = true;
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      // Скидаємо форму до початкового стану
      this.bookForm = {
        id: null,
        title: "",
        author: "",
        isbn: "",
        publicationYear: null,
        inventoryNumber: null,
        location: "Subscription",
        isAvailable: true,
        currentReaderId: null,
        dueDate: null,
      };
      this.isEditing = false;
    },
  },
};
</script>
