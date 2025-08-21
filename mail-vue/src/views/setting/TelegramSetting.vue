<template>
  <div class="telegram-setting">
    <h2>Telegram 配置</h2>
    <form @submit.prevent="saveConfig">
      <div class="form-group">
        <label for="telegramToken">Telegram Token</label>
        <input
          id="telegramToken"
          v-model="telegramToken"
          type="text"
          placeholder="请输入 Telegram Bot Token"
          required
        />
      </div>
      <div class="form-group">
        <label for="telegramId">Telegram Chat ID</label>
        <input
          id="telegramId"
          v-model="telegramId"
          type="text"
          placeholder="请输入 Telegram Chat ID"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">保存配置</button>
    </form>
    <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TelegramSetting',
  data() {
    return {
      telegramToken: '',
      telegramId: '',
      message: '',
      success: false,
    };
  },
  methods: {
    async saveConfig() {
      try {
        const userId = 'exampleUserId'; // Replace with actual user ID logic
        const response = await axios.post('/api/telegram/config', {
          userId,
          TELEGRAM_TOKEN: this.telegramToken,
          TELEGRAM_ID: this.telegramId,
        });
        this.message = response.data.message;
        this.success = true;
      } catch (error) {
        this.message = error.response?.data?.error || '保存失败';
        this.success = false;
      }
    },
  },
};
</script>

<style scoped>
.telegram-setting {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
