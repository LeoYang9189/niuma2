<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// 主题类型定义
interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
}

// 待办类型定义
interface TodoType {
  id: string
  name: string
  active: boolean
  color: string
}

// 预设颜色选项
const colorOptions = [
  '#3498db', '#9b59b6', '#e67e22', '#e74c3c', 
  '#27ae60', '#f1c40f', '#95a5a6', '#1abc9c',
  '#2980b9', '#8e44ad', '#d35400', '#c0392b',
  '#16a085', '#f39c12', '#7f8c8d', '#2c3e50'
]

// 初始化待办类型 - 添加颜色属性
const todoTypes = ref<TodoType[]>([
  { id: '1', name: '船舶作业', active: true, color: '#3498db' },
  { id: '2', name: '订舱', active: true, color: '#9b59b6' },
  { id: '3', name: '报关', active: true, color: '#e67e22' },
  { id: '4', name: '拖车', active: true, color: '#e74c3c' },
  { id: '5', name: '仓储', active: true, color: '#27ae60' },
  { id: '6', name: '会议', active: true, color: '#f1c40f' },
  { id: '7', name: '其他', active: true, color: '#95a5a6' }
])

// 主题设置
const themes: Theme[] = [
  { id: 'default', name: '默认主题', primary: '#b8c6db', secondary: '#f5f7fa', accent: '#9796f0' },
  { id: 'ocean', name: '海洋主题', primary: '#4b6cb7', secondary: '#182848', accent: '#00d2ff' },
  { id: 'sunset', name: '日落主题', primary: '#ff9966', secondary: '#ff5e62', accent: '#ffd86f' },
  { id: 'forest', name: '森林主题', primary: '#134e5e', secondary: '#71b280', accent: '#2ecc71' }
]

const selectedTheme = ref('default')

// 加载本地存储的待办类型
const loadTodoTypesFromStorage = () => {
  try {
    const savedTypes = localStorage.getItem('todoTypes')
    if (savedTypes) {
      todoTypes.value = JSON.parse(savedTypes)
    }
  } catch (e) {
    console.error('解析待办类型数据失败:', e)
    // 保持默认值不变
  }
}

// 保存待办类型到本地存储
const saveTodoTypesToStorage = () => {
  try {
    localStorage.setItem('todoTypes', JSON.stringify(todoTypes.value))
  } catch (e) {
    console.error('保存待办类型数据失败:', e)
  }
}

// 监听todoTypes变化并保存
watch(todoTypes, () => {
  saveTodoTypesToStorage()
}, { deep: true })

// 加载主题设置
const loadThemeFromStorage = () => {
  try {
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme) {
      selectedTheme.value = savedTheme
      // 找到对应的主题并应用
      const theme = themes.find(t => t.id === savedTheme)
      if (theme) {
        applyTheme(theme)
      }
    }
  } catch (e) {
    console.error('加载主题设置失败:', e)
  }
}

// 保存主题设置
const saveThemeToStorage = () => {
  localStorage.setItem('selectedTheme', selectedTheme.value)
}

// 监听主题变化并保存
watch(selectedTheme, () => {
  saveThemeToStorage()
})

// 修改applyTheme方法
const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.style.setProperty('--primary-color', theme.primary)
  root.style.setProperty('--secondary-color', theme.secondary)
  root.style.setProperty('--accent-color', theme.accent)
  
  selectedTheme.value = theme.id
  // 自动保存到本地存储(由watch处理)
}

// 在组件挂载时加载所有设置 - 添加错误处理
onMounted(() => {
  try {
    loadTodoTypesFromStorage()
    loadThemeFromStorage()
  } catch (e) {
    console.error('加载设置时出错:', e)
  }
})

// 通知设置 - 更新为新的数据结构
const notificationSettings = ref({
  // 通知方式
  notificationMethods: {
    message: true,      // 消息提醒
    browser: false,     // 浏览器提醒
    email: false,       // 邮箱
    wechat: false       // 微信
  },
  // 邮箱地址
  emails: ['', ''],
  // 微信绑定状态
  wechatBound: true,
  // 消息类型
  notificationTypes: {
    todoReminder: true,  // 待办提醒(默认开启)
    slackingReminder: false, // 摸鱼提醒
    shipmentChanges: false,  // 船期变更
    importantNotices: false  // 重要公告发布
  }
})

// 用户设置
const userSettings = ref({
  username: '用户名',
  email: 'user@example.com',
  avatar: '👤'
})

// 新待办类型
const newTodoType = ref('')

// 添加待办类型 - 更新以支持颜色
const addTodoType = () => {
  if (newTodoType.value.trim() === '') return
  
  const id = Date.now().toString()
  // 为新类型随机选择一个颜色
  const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)]
  
  todoTypes.value.push({
    id,
    name: newTodoType.value,
    active: true,
    color: randomColor
  })
  
  newTodoType.value = ''
}

// 删除待办类型
const deleteTodoType = (id: string) => {
  todoTypes.value = todoTypes.value.filter(type => type.id !== id)
}

// 切换待办类型状态
const toggleTodoTypeStatus = (id: string) => {
  const type = todoTypes.value.find(type => type.id === id)
  if (type) {
    type.active = !type.active
  }
}

// 修改保存设置的方法
const saveSettings = () => {
  // 保存到本地存储
  saveTodoTypesToStorage()
  saveThemeToStorage()
  
  // 也可以同时保存通知设置
  localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings.value))
  localStorage.setItem('userSettings', JSON.stringify(userSettings.value))
  
  alert('设置已保存！')
}

// 添加拖拽相关状态和方法
const draggedItem = ref<number | null>(null)
const dragOverItem = ref<number | null>(null)

// 开始拖拽
const dragStart = (index: number) => {
  draggedItem.value = index
}

// 拖拽结束
const dragEnd = () => {
  // 如果有目标位置，执行重新排序
  if (draggedItem.value !== null && dragOverItem.value !== null) {
    // 创建列表副本
    const items = [...todoTypes.value]
    // 获取拖拽的项
    const draggedItemContent = items[draggedItem.value]
    // 从列表中移除拖拽项
    items.splice(draggedItem.value, 1)
    // 在新位置插入拖拽项
    items.splice(dragOverItem.value, 0, draggedItemContent)
    // 更新列表
    todoTypes.value = items
  }
  
  // 重置状态
  draggedItem.value = null
  dragOverItem.value = null
}

// 拖拽经过其他项
const dragOver = (index: number) => {
  dragOverItem.value = index
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
      <h2>待办类型设置</h2>
      <div class="settings-form">
        <div class="todo-types-header">
          <input 
            type="text" 
            v-model="newTodoType" 
            placeholder="输入新的待办类型..." 
            class="new-todo-type-input"
          >
          <button class="add-btn" @click="addTodoType">添加</button>
        </div>
        
        <div class="todo-types-hint">提示：拖拽项目可以改变显示顺序</div>
        
        <div class="todo-types-list">
          <div 
            v-for="(type, index) in todoTypes" 
            :key="type.id" 
            class="todo-type-item"
            :class="{ 
              'dragging': index === draggedItem,
              'drag-over': index === dragOverItem 
            }"
            draggable="true"
            @dragstart="dragStart(index)"
            @dragend="dragEnd"
            @dragover.prevent
            @dragenter.prevent="dragOver(index)"
          >
            <div class="drag-handle">⋮⋮</div>
            <div class="todo-type-color">
              <input 
                type="color" 
                v-model="type.color" 
                :title="'选择颜色'"
                class="color-picker"
              >
              <div class="color-preview" :style="{ backgroundColor: type.color }"></div>
            </div>
            <div class="todo-type-name">{{ type.name }}</div>
            <div class="todo-type-actions">
              <div class="todo-type-status">
                <input 
                  type="checkbox" 
                  :checked="type.active" 
                  @change="toggleTodoTypeStatus(type.id)" 
                  :id="`type-${type.id}`"
                >
                <label :for="`type-${type.id}`">启用</label>
              </div>
              <button class="delete-btn" @click="deleteTodoType(type.id)">删除</button>
            </div>
          </div>
          
          <div v-if="todoTypes.length === 0" class="no-todo-types">
            还没有待办类型，请添加一个
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h2>通知设置</h2>
      <div class="settings-form">
        <div class="form-group">
          <h3>通知方式</h3>
          <div class="checkbox-group notification-options">
            <label class="notification-option">
              <input 
                type="checkbox" 
                v-model="notificationSettings.notificationMethods.message"
              >
              <span class="option-icon">📱</span>
              消息提醒
            </label>
            
            <label class="notification-option">
              <input 
                type="checkbox" 
                v-model="notificationSettings.notificationMethods.browser"
              >
              <span class="option-icon">🌐</span>
              浏览器提醒
            </label>
            
            <label class="notification-option">
              <input 
                type="checkbox" 
                v-model="notificationSettings.notificationMethods.email"
              >
              <span class="option-icon">📧</span>
              邮箱
            </label>
            
            <label class="notification-option">
              <input 
                type="checkbox" 
                v-model="notificationSettings.notificationMethods.wechat"
              >
              <span class="option-icon">💬</span>
              微信
            </label>
          </div>
        </div>
        
        <!-- 邮箱设置 - 当邮箱方式被选中时显示 -->
        <div class="form-group" v-if="notificationSettings.notificationMethods.email">
          <h3>邮箱设置</h3>
          <div class="email-inputs">
            <div class="email-input-group">
              <label>邮箱地址 1 <span class="required">*</span></label>
              <input 
                type="email" 
                v-model="notificationSettings.emails[0]" 
                placeholder="example@domain.com"
                required
              >
            </div>
            
            <div class="email-input-group">
              <label>邮箱地址 2 <span class="optional">(可选)</span></label>
              <input 
                type="email" 
                v-model="notificationSettings.emails[1]" 
                placeholder="alternative@domain.com"
              >
            </div>
          </div>
        </div>
        
        <!-- 微信设置 - 当微信方式被选中时显示 -->
        <div class="form-group" v-if="notificationSettings.notificationMethods.wechat">
          <h3>微信设置</h3>
          <div class="wechat-binding">
            <div class="qrcode-container">
              <div class="qrcode-placeholder">
                <div class="qrcode">
                  <!-- 这里可以替换为实际的二维码图片 -->
                  <div class="qrcode-pattern"></div>
                </div>
                <p>扫描二维码关注公众号</p>
              </div>
            </div>
            
            <div class="binding-status">
              <div class="status-indicator" :class="{ 'bound': notificationSettings.wechatBound }">
                <span class="status-icon">{{ notificationSettings.wechatBound ? '✓' : '!' }}</span>
                <span class="status-text">{{ notificationSettings.wechatBound ? '已绑定' : '未绑定' }}</span>
              </div>
              <p class="binding-instructions">
                {{ notificationSettings.wechatBound 
                  ? '您已成功绑定微信，将通过公众号接收通知' 
                  : '请关注公众号并发送"绑定+您的账号"进行绑定' }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- 消息类型设置 -->
        <div class="form-group">
          <h3>消息类型</h3>
          <div class="checkbox-group notification-types">
            <label class="notification-type">
              <input 
                type="checkbox" 
                v-model="notificationSettings.notificationTypes.todoReminder"
              >
              <span class="type-icon">📅</span>
              待办提醒
            </label>
            
            <label class="notification-type">
              <input 
                type="checkbox" 
                v-model="notificationSettings.notificationTypes.slackingReminder"
              >
              <span class="type-icon">⏰</span>
              摸鱼提醒
            </label>
            
            <label class="notification-type">
              <input 
                type="checkbox" 
                v-model="notificationSettings.notificationTypes.shipmentChanges"
              >
              <span class="type-icon">🚢</span>
              船期变更
            </label>
            
            <label class="notification-type">
              <input 
                type="checkbox" 
                v-model="notificationSettings.notificationTypes.importantNotices"
              >
              <span class="type-icon">📢</span>
              重要公告发布
            </label>
          </div>
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
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: var(--border-radius);
  overflow: auto;
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
  max-width: 700px;
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

/* 待办类型设置样式 */
.todo-types-header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.new-todo-type-input {
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
}

.add-btn {
  padding: 10px 20px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.todo-types-list {
  margin-top: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.todo-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  border-left: 3px solid var(--accent-color);
  cursor: move;
  transition: all 0.2s ease;
}

.todo-type-item.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  background: rgba(151, 150, 240, 0.2);
}

.todo-type-item.drag-over {
  border: 2px dashed var(--accent-color);
  transform: scale(1.02);
}

.drag-handle {
  cursor: grab;
  color: #666;
  margin-right: 10px;
  font-size: 1.2rem;
  line-height: 1;
}

.todo-type-color {
  display: flex;
  align-items: center;
  margin-right: 10px;
  position: relative;
}

.color-picker {
  opacity: 0;
  position: absolute;
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 1;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.todo-type-name {
  flex: 1;
  margin-right: 10px;
  font-weight: 500;
}

.todo-type-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.todo-type-status {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.delete-btn {
  padding: 5px 10px;
  background: rgba(255, 0, 0, 0.2);
  color: #ff4757;
  border: 1px solid rgba(255, 0, 0, 0.1);
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.3);
}

.no-todo-types {
  text-align: center;
  padding: 15px;
  font-style: italic;
  opacity: 0.7;
}

/* 添加拖拽相关样式 */
.todo-types-hint {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 10px;
  font-style: italic;
}

/* 通知选项样式 - 更改为自然换行布局 */
.notification-options, .notification-types {
  display: flex;
  flex-wrap: wrap; /* 改为允许换行 */
  gap: 15px;
  margin-top: 10px;
  /* 移除溢出滚动 */
  padding-bottom: 5px;
}

.notification-option, .notification-type {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  /* 移除不换行设置 */
  /* 移除固定宽度限制，让元素更自然地布局 */
}

.notification-option:hover, .notification-type:hover {
  background: rgba(255, 255, 255, 0.3);
}

.notification-option input, .notification-type input {
  margin-right: 10px;
}

.option-icon, .type-icon {
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  margin-left: 5px;
}

/* 邮箱设置样式 */
.email-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  animation: fade-in 0.3s ease;
}

.email-input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.email-input-group input {
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  width: 100%;
}

.required {
  color: #ff4757;
  font-weight: bold;
}

.optional {
  color: #777;
  font-style: italic;
  font-size: 0.9em;
}

/* 微信绑定样式 */
.wechat-binding {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  animation: fade-in 0.3s ease;
}

.qrcode-container {
  flex: 0 0 150px;
}

.qrcode-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode {
  width: 150px;
  height: 150px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 10px;
}

.qrcode-pattern {
  width: 130px;
  height: 130px;
  background-image: linear-gradient(45deg, #000 25%, transparent 25%), 
                    linear-gradient(-45deg, #000 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #000 75%), 
                    linear-gradient(-45deg, transparent 75%, #000 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border-radius: 5px;
}

.binding-status {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.status-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ff4757;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.status-indicator.bound .status-icon {
  background: #2ecc71;
}

.status-text {
  font-weight: bold;
  font-size: 1.1rem;
}

.binding-instructions {
  color: #666;
  line-height: 1.5;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 分组标题 */
h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
  border-left: 3px solid var(--accent-color);
  padding-left: 10px;
}
</style> 