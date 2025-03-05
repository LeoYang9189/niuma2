<script setup lang="ts">
import { ref } from 'vue'

const messages = ref([
  { id: 1, role: 'system', content: '你好，我是牛马日历的AI助手，有什么可以帮助你的吗？' }
])

const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim() === '') return

  // 添加用户消息
  messages.value.push({
    id: messages.value.length + 1,
    role: 'user',
    content: newMessage.value
  })

  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      id: messages.value.length + 1,
      role: 'system',
      content: '我已收到您的消息：' + newMessage.value + '。这是一个演示界面，实际AI功能尚未实现。'
    })
  }, 1000)

  newMessage.value = ''
}
</script>

<template>
  <div class="ai-assistant-container glass-effect">
    <h1>AI助手</h1>
    
    <div class="chat-container">
      <div class="messages">
        <div 
          v-for="message in messages" 
          :key="message.id" 
          class="message" 
          :class="message.role"
        >
          {{ message.content }}
        </div>
      </div>
      
      <div class="message-input">
        <input 
          type="text" 
          v-model="newMessage" 
          placeholder="输入消息..." 
          @keyup.enter="sendMessage"
        >
        <button @click="sendMessage">发送</button>
      </div>
    </div>
    
    <div class="ai-features">
      <h3>常见问题</h3>
      <div class="quick-questions">
        <button @click="newMessage = '如何添加日程？'; sendMessage()">如何添加日程？</button>
        <button @click="newMessage = '如何设置提醒？'; sendMessage()">如何设置提醒？</button>
        <button @click="newMessage = '如何分享日历？'; sendMessage()">如何分享日历？</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant-container {
  padding: 20px;
  border-radius: var(--border-radius);
  width: 1200px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  margin-top: 20px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin-bottom: 20px;
}

.message {
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 10px;
  max-width: 80%;
  word-break: break-word;
}

.message.user {
  background: rgba(151, 150, 240, 0.3);
  margin-left: auto;
  border-bottom-right-radius: 5px;
}

.message.system {
  background: rgba(255, 255, 255, 0.3);
  margin-right: auto;
  border-bottom-left-radius: 5px;
}

.message-input {
  display: flex;
  gap: 10px;
}

.message-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
}

.message-input button {
  padding: 10px 20px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.ai-features {
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.quick-questions button {
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-questions button:hover {
  background: rgba(151, 150, 240, 0.3);
}
</style>
