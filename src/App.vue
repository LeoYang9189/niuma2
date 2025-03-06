<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isDrawerOpen = ref(true)

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>

<template>
  <div class="app-container">
    <!-- 侧边导航栏 -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': !isDrawerOpen }">
      <div class="sidebar-header">
        <div class="logo-container" v-if="isDrawerOpen">
          <img src="@/assets/images/logo.png" alt="日历logo" class="logo-image" />
        </div>
        <button class="toggle-btn" @click="toggleDrawer">
          <span v-if="isDrawerOpen">«</span>
          <span v-else>»</span>
        </button>
      </div>
      
      <div class="sidebar-menu">
        <router-link to="/" class="menu-item" active-class="active">
          <div class="menu-icon">📅</div>
          <span v-if="isDrawerOpen">日历</span>
        </router-link>
        
        <router-link to="/ai-assistant" class="menu-item" active-class="active">
          <div class="menu-icon">🤖</div>
          <span v-if="isDrawerOpen">AI助手</span>
        </router-link>
        
        <router-link to="/shipping-notice" class="menu-item" active-class="active">
          <div class="menu-icon">🚢</div>
          <span v-if="isDrawerOpen">船司公告</span>
        </router-link>
        
        <router-link to="/slacking-master" class="menu-item" active-class="active">
          <div class="menu-icon">🐟</div>
          <span v-if="isDrawerOpen">摸鱼达人</span>
        </router-link>
      </div>
      
      <div class="sidebar-footer">
        <router-link to="/settings" class="menu-item" active-class="active">
          <div class="menu-icon">⚙️</div>
          <span v-if="isDrawerOpen">系统设置</span>
        </router-link>
        
        <div class="user-profile" v-if="isDrawerOpen">
          <div class="avatar">👤</div>
          <span class="username">用户名</span>
        </div>
        <div class="avatar" v-else>👤</div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #b8c6db;
  --secondary-color: #f5f7fa;
  --accent-color: #9796f0;
  --text-color: #333;
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 60px;
  --border-radius: 16px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: var(--text-color);
  min-height: 100vh;
}

.app-container {
  display: flex;
  min-height: 100vh;
  padding: 15px 0 15px 15px;
  gap: 20px;
}

/* 毛玻璃效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

/* 侧边栏样式 */
.sidebar {
  width: var(--sidebar-width);
  height: calc(100vh - 30px);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

.sidebar-collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.logo-image {
  height: 60px;
  max-width: 180px;
  object-fit: contain;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-color);
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.3s;
}

.menu-item:hover, .menu-item.active {
  background-color: rgba(255, 255, 255, 0.4);
}

.menu-icon {
  font-size: 20px;
  margin-right: 15px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.user-profile {
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 10px 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.username {
  font-weight: bold;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  overflow: auto !important;
  display: flex;
  padding: 20px;
  height: calc(100vh - 30px) !important;
  min-height: calc(100vh - 30px) !important;
  max-height: calc(100vh - 30px) !important;
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 确保RouterView占满容器 */
.main-content > * {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* 便当盒风格布局 */
.bento-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.bento-box {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}
</style>
