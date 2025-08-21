<template>
  <div class="ai-setting">
    <h2>AI 接口配置</h2>
    <form @submit.prevent="saveConfig">
      <div class="form-group">
        <label for="apiKey">API Key</label>
        <input
          id="apiKey"
          v-model="apiKey"
          type="text"
          placeholder="请输入 API Key"
          required
        />
      </div>
      <div class="form-group">
        <label for="apiUrl">API URL</label>
        <input
          id="apiUrl"
          v-model="apiUrl"
          type="text"
          placeholder="请输入 API URL"
          required
        />
      </div>
      <div class="form-group">
        <label for="model">模型名称</label>
        <input
          id="model"
          v-model="model"
          type="text"
          placeholder="请输入模型名称"
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
  name: 'AiSetting',
  data() {
    return {
      apiKey: '',
      apiUrl: '',
      model: '',
      message: '',
      success: false,
    };
  },
  methods: {
    async saveConfig() {
      try {
        const userId = 'exampleUserId'; // Replace with actual user ID logic
        const response = await axios.post('/api/ai/config', {
          userId,
          API_KEY: this.apiKey,
          API_URL: this.apiUrl,
          MODEL: this.model,
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
.ai-setting {
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
