<script setup lang="ts">
import { ref } from 'vue'

// 主题类型定义
interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
}

// 主题设置
const themes: Theme[] = [
  { id: 'default', name: '默认主题', primary: '#b8c6db', secondary: '#f5f7fa', accent: '#9796f0' },
  { id: 'ocean', name: '海洋主题', primary: '#4b6cb7', secondary: '#182848', accent: '#00d2ff' },
  { id: 'sunset', name: '日落主题', primary: '#ff9966', secondary: '#ff5e62', accent: '#ffd86f' },
  { id: 'forest', name: '森林主题', primary: '#134e5e', secondary: '#71b280', accent: '#2ecc71' }
]

const selectedTheme = ref('default')

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.style.setProperty('--primary-color', theme.primary)
  root.style.setProperty('--secondary-color', theme.secondary)
  root.style.setProperty('--accent-color', theme.accent)
  
  selectedTheme.value = theme.id
}

// 通知设置
const notificationSettings = ref({
  enableNotifications: true,
  reminderTime: 15,
  soundEnabled: true
})

// 用户设置
const userSettings = ref({
  username: '用户名',
  email: 'user@example.com',
  avatar: '👤'
})

// 保存设置
const saveSettings = () => {
  // 这里将实现保存设置到本地存储或后端
  alert('设置已保存！')
}
</script>

<template>
  <div class="settings-container glass-effect">
    <h1>系统设置</h1>
    
    <div class="settings-section">
      <h2>主题设置</h2>
      <div class="themes-grid">
        <div 
          v-for="theme in themes" 
          :key="theme.id" 
          class="theme-card" 
          :class="{ 'selected': selectedTheme === theme.id }"
          @click="applyTheme(theme)"
        >
          <div class="theme-preview" :style="{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
          }">
            <div class="theme-accent" :style="{ background: theme.accent }"></div>
          </div>
          <div class="theme-name">{{ theme.name }}</div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h2>通知设置</h2>
      <div class="settings-form">
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="notificationSettings.enableNotifications">
            启用通知
          </label>
        </div>
        
        <div class="form-group">
          <label>提醒时间（分钟）</label>
          <input 
            type="number" 
            v-model="notificationSettings.reminderTime" 
            min="1" 
            max="60"
            :disabled="!notificationSettings.enableNotifications"
          >
        </div>
        
        <div class="form-group">
          <label>
            <input 
              type="checkbox" 
              v-model="notificationSettings.soundEnabled"
              :disabled="!notificationSettings.enableNotifications"
            >
            启用提示音
          </label>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h2>用户设置</h2>
      <div class="settings-form">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="userSettings.username">
        </div>
        
        <div class="form-group">
          <label>邮箱</label>
          <input type="email" v-model="userSettings.email">
        </div>
        
        <div class="form-group">
          <label>头像</label>
          <div class="avatar-selector">
            <div class="avatar">{{ userSettings.avatar }}</div>
            <select v-model="userSettings.avatar">
              <option value="👤">👤 默认</option>
              <option value="🐱">🐱 猫咪</option>
              <option value="🐶">🐶 狗狗</option>
              <option value="🦊">🦊 狐狸</option>
              <option value="🐼">🐼 熊猫</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-actions">
      <button class="save-btn" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 20px;
  border-radius: var(--border-radius);
  width: 1200px;
}

.settings-section {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.settings-section h2 {
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 10px;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.theme-card {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.theme-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.theme-card.selected {
  border: 2px solid var(--accent-color);
}

.theme-preview {
  height: 100px;
  position: relative;
}

.theme-accent {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  bottom: 10px;
  right: 10px;
}

.theme-name {
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.settings-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="number"],
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
}

.avatar-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.save-btn {
  padding: 10px 20px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
</style> 