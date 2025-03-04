<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 摸鱼小工具
const currentTime = ref(new Date())
const workingHoursLeft = ref('')
const weekendCountdown = ref('')
const randomJoke = ref('')
const workProgressPercent = ref(0)
const weekendProgressPercent = ref(0)
const isLoadingJoke = ref(false) // 加载状态

// 卡片相关变量
const showCardModal = ref(false) // 控制弹窗显示
const currentCardStyle = ref(0) // 当前卡片样式
const cardGenerating = ref(false) // 卡片生成中状态

// 木鱼功能
const woodenFishCount = ref(0)
const isAnimating = ref(false)
const woodenFishSound = ref<HTMLAudioElement | null>(null)
const meritPoints = ref(0)

// 卡皮巴拉功能
const capybaraStatus = ref([true, true, true, true, true, true]) // 六只卡皮巴拉的存在状态
const explodingCapybara = ref<number | null>(null) // 正在爆炸的卡皮巴拉

// 点击卡皮巴拉
const clickCapybara = (index: number) => {
  if (!capybaraStatus.value[index]) return // 如果已经消失了，不做任何处理
  
  explodingCapybara.value = index // 设置当前正在爆炸的卡皮巴拉
  
  // 播放爆炸音效
  const explosionSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-interface-device-plug-in-1013.mp3')
  explosionSound.volume = 0.3
  explosionSound.play()
  
  // 300毫秒后隐藏卡皮巴拉
  setTimeout(() => {
    capybaraStatus.value[index] = false
    explodingCapybara.value = null
    
    // 3-6秒后重新生成
    const regenerateTime = 3000 + Math.random() * 3000
    setTimeout(() => {
      capybaraStatus.value[index] = true
    }, regenerateTime)
  }, 300)
}

// 敲木鱼功能
const tapWoodenFish = () => {
  woodenFishCount.value++
  meritPoints.value += Math.floor(Math.random() * 3) + 1 // 随机增加1-3点功德
  isAnimating.value = true
  
  // 播放敲击音效
  if (woodenFishSound.value) {
    woodenFishSound.value.currentTime = 0
    woodenFishSound.value.play()
  }
  
  // 动画结束后恢复状态
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

// 获取功德等级
const meritLevel = computed(() => {
  if (meritPoints.value < 10) return '无为新人'
  if (meritPoints.value < 50) return '初级禅修'
  if (meritPoints.value < 100) return '中级禅修'
  if (meritPoints.value < 200) return '高级禅修'
  if (meritPoints.value < 500) return '摸鱼大师'
  return '摸鱼仙人'
})

// 获取工作进度条样式
const getWorkProgressStyle = () => {
  return {
    width: `${workProgressPercent.value}%`,
    background: 'linear-gradient(to right, #36d1dc, #5b86e5)'
  }
}

// 获取周末进度条样式
const getWeekendProgressStyle = () => {
  return {
    width: `${weekendProgressPercent.value}%`,
    background: 'linear-gradient(to right, #ff9966, #ff5e62)'
  }
}

// 更新时间和倒计时
const updateTime = () => {
  currentTime.value = new Date()
  
  // 计算工作时间剩余
  const now = new Date()
  const startOfWork = new Date()
  startOfWork.setHours(9, 0, 0)
  const endOfWork = new Date()
  endOfWork.setHours(18, 0, 0)
  
  if (now > endOfWork) {
    workingHoursLeft.value = '今日工作已结束！'
    workProgressPercent.value = 100
  } else if (now < startOfWork) {
    workingHoursLeft.value = '工作还未开始'
    workProgressPercent.value = 0
  } else {
    const totalWorkMs = endOfWork.getTime() - startOfWork.getTime()
    const elapsedWorkMs = now.getTime() - startOfWork.getTime()
    workProgressPercent.value = Math.floor((elapsedWorkMs / totalWorkMs) * 100)
    
    const diff = Math.floor((endOfWork.getTime() - now.getTime()) / (1000 * 60))
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60
    workingHoursLeft.value = `距离下班还有 ${hours} 小时 ${minutes} 分钟`
  }
  
  // 计算周末倒计时
  const day = now.getDay()
  if (day === 0 || day === 6) {
    weekendCountdown.value = '周末愉快！'
    weekendProgressPercent.value = 100
  } else {
    const daysToWeekend = 5 - day
    weekendProgressPercent.value = Math.floor(((5 - daysToWeekend) / 5) * 100)
    weekendCountdown.value = `距离周末还有 ${daysToWeekend} 天`
  }
}

// AI摸鱼名言生成（模拟API调用）
const generateAiJoke = async () => {
  isLoadingJoke.value = true
  randomJoke.value = '' // 先清空当前名言
  
  try {
    // 在实际应用中，这里应该调用真实的AI API
    // 为了演示，使用setTimeout模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟API返回的内容
    const jokesBank = [
      `领导看似在工作，实际在研究最佳摸鱼时机。`,
      `假装在思考工作问题，实际在想摸鱼的一百种方法。`,
      `当你摸鱼时，记得适当点点头，让人觉得你在思考。`,
      `摸鱼是一门艺术，工作是它的掩护。`,
      `高效摸鱼的秘诀：时不时看一眼文档，若有人经过迅速切换屏幕。`,
      `摸鱼达人的日常：9点到岗，5点演完，中间全是即兴发挥。`,
      `今日工作目标：完成摸鱼，顺便处理一点工作。`,
      `摸鱼有理论，也有实践，但最重要的是不要被发现。`,
      `加班的本质：白天摸鱼太多，不得不晚上补回来。`,
      `生活中最甜蜜的瞬间，莫过于摸鱼时领导刚好不在。`
    ]
    const randomIndex = Math.floor(Math.random() * jokesBank.length)
    randomJoke.value = jokesBank[randomIndex]
  } catch (error) {
    console.error('生成摸鱼名言失败:', error)
    randomJoke.value = '网络波动，摸鱼名言加载失败...'
  } finally {
    isLoadingJoke.value = false
  }
}

// 生成卡片并显示弹窗
const generateCard = () => {
  if (isLoadingJoke.value) return; // 如果正在加载，不处理
  
  // 如果没有名言，先生成名言
  if (!randomJoke.value) {
    generateAiJoke().then(() => {
      openCardModal();
    });
    return;
  }
  
  openCardModal();
}

// 打开卡片弹窗
const openCardModal = () => {
  cardGenerating.value = true;
  
  // 随机选择卡片样式 (0-3)
  currentCardStyle.value = Math.floor(Math.random() * 4);
  
  // 模拟卡片生成过程
  setTimeout(() => {
    cardGenerating.value = false;
    showCardModal.value = true;
  }, 800);
}

// 关闭卡片弹窗
const closeCardModal = () => {
  showCardModal.value = false;
}

// 下载卡片（实际项目中可以使用html2canvas等库实现真实下载）
const downloadCard = () => {
  // 模拟下载过程
  const downloadLink = document.createElement('a');
  downloadLink.href = '#';
  downloadLink.download = '摸鱼名言卡片.png';
  downloadLink.click();
  
  // 关闭弹窗
  setTimeout(() => {
    closeCardModal();
  }, 500);
}

// 摸鱼提醒
const remindSlacking = () => {
  const notifications = [
    '记得喝水，顺便休息一下眼睛。',
    '站起来伸个懒腰，活动一下筋骨。',
    '假装去洗手间，其实是去放松一下。',
    '现在是查看社交媒体的最佳时机。',
    '考虑一下今天午饭吃什么？'
  ]
  
  const randomIndex = Math.floor(Math.random() * notifications.length)
  
  // 模拟浏览器通知
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('摸鱼提醒', {
      body: notifications[randomIndex],
      icon: '/favicon.ico'
    })
  } else {
    alert('摸鱼提醒: ' + notifications[randomIndex])
  }
}

// 摸鱼模式
const isSlackingMode = ref(false)
const toggleSlackingMode = () => {
  isSlackingMode.value = !isSlackingMode.value
}

onMounted(() => {
  updateTime()
  generateAiJoke() // 初始生成一条AI摸鱼名言
  
  // 每分钟更新时间
  setInterval(updateTime, 60000)
  
  // 每30分钟更新名言
  setInterval(generateAiJoke, 1800000)
  
  // 请求通知权限
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission()
  }
  
  // 初始化木鱼音效 - 使用简短的敲击音效
  woodenFishSound.value = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-drum-hit-percussion-563.mp3') // 简短的敲击音效
  woodenFishSound.value.volume = 0.6
})
</script>

<template>
  <div class="slacking-container glass-effect">
    <h1>摸鱼达人</h1>
    
    <div class="bento-container">
      <!-- 摸鱼模式卡片 - 第一行第一个卡片 -->
      <div class="bento-box slacking-mode-box gradient-bg-1">
        <h3 class="box-title">摸鱼模式</h3>
        <div class="toggle-container">
          <label class="toggle-switch">
            <input type="checkbox" v-model="isSlackingMode">
            <span class="toggle-slider">
              <span class="toggle-indicator"></span>
              <span class="toggle-on">ON</span>
              <span class="toggle-off">OFF</span>
            </span>
          </label>
          <span class="toggle-status">{{ isSlackingMode ? '已开启' : '已关闭' }}</span>
        </div>
        
        <div v-if="isSlackingMode" class="mode-description">
          摸鱼模式已开启，将会定时提醒您摸鱼。
          <button @click="remindSlacking" class="remind-btn pulse-animation">立即提醒</button>
        </div>
      </div>
      
      <!-- 当前时间卡片 - 第一行第二个卡片，占据2个宽度 -->
      <div class="bento-box time-box wide-box gradient-bg-2">
        <h3 class="box-title">当前时间</h3>
        <div class="time-content">
          <div class="time-display">
            <div class="time">{{ currentTime.toLocaleTimeString() }}</div>
            <div class="date">{{ currentTime.toLocaleDateString() }}</div>
          </div>
          <div class="countdown-container">
            <div class="countdown work-countdown">
              <div class="countdown-icon">⏰</div>
              <div class="countdown-text">{{ workingHoursLeft }}</div>
              <div class="progress-bar">
                <div class="progress" :style="getWorkProgressStyle()"></div>
              </div>
            </div>
            <div class="countdown weekend-countdown">
              <div class="countdown-icon">🏖️</div>
              <div class="countdown-text">{{ weekendCountdown }}</div>
              <div class="progress-bar">
                <div class="progress" :style="getWeekendProgressStyle()"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 木鱼功德卡片 - 独立卡片 -->
      <div class="bento-box wooden-fish-box gradient-bg-5">
        <h3 class="box-title">功德木鱼</h3>
        <div class="wooden-fish-container">
          <div class="wooden-fish-wrapper">
            <div 
              class="wooden-fish" 
              :class="{ 'animate-tap': isAnimating }" 
              @click="tapWoodenFish"
            >
              <div class="wooden-fish-icon">🪘</div>
              <div class="tap-hint">点击敲木鱼积攒功德</div>
            </div>
            <div class="wooden-fish-stats">
              <div class="merit-count">功德值: {{ meritPoints }}</div>
              <div class="merit-level">等级: {{ meritLevel }}</div>
              <div class="tap-count">共敲击 {{ woodenFishCount }} 次</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 摸鱼名言卡片 - 重新设计 -->
      <div class="bento-box ai-joke-box gradient-ai">
        <div class="ai-joke-header">
          <h3 class="box-title">今日鸡汤</h3>
        </div>
        
        <div class="joke-content">
          <div class="ai-joke-container">
            <div v-if="isLoadingJoke" class="loading-container">
              <div class="dot-typing"></div>
              <div class="loading-text">AI思考中...</div>
            </div>
            <div v-else class="joke-bubble">
              <div class="ai-joke">{{ randomJoke }}</div>
            </div>
          </div>
          
          <div class="ai-controls">
            <button @click="generateAiJoke" class="ai-refresh-btn">
              <span class="refresh-icon">🔄</span>
              <span>换一句</span>
            </button>
            <button @click="generateCard" class="generate-card-btn">
              <span class="card-icon">🎴</span>
              <span>生成卡片</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 摸鱼小技巧卡片 -->
      <div class="bento-box tips-box gradient-bg-4">
        <h3 class="box-title">摸鱼小技巧</h3>
        <ul class="tips-list">
          <li>工作间隙看看新闻，让自己保持信息更新。</li>
          <li>设置高效工作的25分钟，然后休息5分钟。</li>
          <li>午休时间可以小憩一下，提高下午工作效率。</li>
          <li>定时喝水，既能保持健康，又能适当休息。</li>
          <li>保持桌面整洁，看起来你一直在工作。</li>
        </ul>
      </div>
      
      <!-- 卡皮巴拉队列卡片 - 占据整行 -->
      <div class="bento-box capybara-box full-width gradient-bg-6">
        <h3 class="box-title">卡皮巴拉散步队</h3>
        <div class="capybara-container">
          <div class="grass-ground"></div>
          <div 
            v-for="(exists, index) in capybaraStatus" 
            :key="index"
            v-show="exists"
            :class="[
              'capybara', 
              `capybara-${index + 1}`,
              { 'exploding': explodingCapybara === index }
            ]"
            @click="clickCapybara(index)"
          >🦫</div>
          <div class="water-area">
            <div class="water-ripple"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 卡片弹窗 -->
    <div class="card-modal-overlay" v-if="showCardModal || cardGenerating" @click.self="closeCardModal">
      <div class="card-modal">
        <div v-if="cardGenerating" class="card-generating">
          <div class="generating-spinner"></div>
          <div class="generating-text">正在生成卡片...</div>
        </div>
        
        <div v-else class="card-content">
          <div class="close-btn" @click="closeCardModal">×</div>
          
          <!-- 卡片样式 0: 简约风格 -->
          <div v-if="currentCardStyle === 0" class="quote-card minimalist-card">
            <div class="card-inner">
              <div class="quote-icon">❝</div>
              <div class="quote-text">{{ randomJoke }}</div>
              <div class="quote-author">— 摸鱼达人 —</div>
              <div class="card-watermark">MOYU</div>
            </div>
          </div>
          
          <!-- 卡片样式 1: 自然风格 -->
          <div v-else-if="currentCardStyle === 1" class="quote-card nature-card">
            <div class="card-inner">
              <div class="quote-text">{{ randomJoke }}</div>
              <div class="nature-decoration"></div>
              <div class="quote-author">今日摸鱼名言</div>
            </div>
          </div>
          
          <!-- 卡片样式 2: 霓虹风格 -->
          <div v-else-if="currentCardStyle === 2" class="quote-card neon-card">
            <div class="card-inner">
              <div class="neon-title">MOYU TIME</div>
              <div class="quote-text">{{ randomJoke }}</div>
              <div class="neon-decoration"></div>
            </div>
          </div>
          
          <!-- 卡片样式 3: 复古风格 -->
          <div v-else class="quote-card retro-card">
            <div class="card-inner">
              <div class="retro-badge">摸鱼警告</div>
              <div class="quote-text">{{ randomJoke }}</div>
              <div class="retro-stamp">APPROVED</div>
            </div>
          </div>
          
          <div class="card-actions">
            <button @click="downloadCard" class="download-btn">
              <span>下载卡片</span>
            </button>
            <button @click="generateCard" class="regenerate-btn">
              <span>换个样式</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slacking-container {
  padding: 20px;
  border-radius: var(--border-radius);
  width: 1200px;
}

.bento-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.bento-box {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
}

.box-title {
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 10px;
}

.wide-box {
  grid-column: span 2;
}

/* 渐变背景 */
.gradient-bg-1 {
  background: linear-gradient(135deg, rgba(189, 195, 255, 0.2) 0%, rgba(255, 183, 213, 0.2) 100%);
}

.gradient-bg-2 {
  background: linear-gradient(135deg, rgba(110, 223, 247, 0.2) 0%, rgba(151, 150, 240, 0.2) 100%);
}

.gradient-bg-3 {
  background: linear-gradient(135deg, rgba(254, 211, 107, 0.2) 0%, rgba(255, 182, 193, 0.2) 100%);
}

.gradient-bg-4 {
  background: linear-gradient(135deg, rgba(130, 255, 179, 0.2) 0%, rgba(151, 224, 240, 0.2) 100%);
}

.gradient-bg-5 {
  background: linear-gradient(135deg, rgba(255, 154, 158, 0.2) 0%, rgba(250, 208, 196, 0.2) 100%);
}

.gradient-bg-6 {
  background: linear-gradient(135deg, rgba(142, 219, 250, 0.2) 0%, rgba(176, 229, 208, 0.2) 100%);
}

.bento-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15);
}

/* 摸鱼模式卡片 */
.slacking-mode-box {
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

/* 木鱼卡片 */
.wooden-fish-box {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

/* 木鱼组件样式 */
.wooden-fish-container {
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 10px 0;
}

.wooden-fish-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
}

.wooden-fish-wrapper:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

.wooden-fish {
  cursor: pointer;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  margin-bottom: 20px;
}

.wooden-fish:hover {
  transform: scale(1.05);
}

.wooden-fish-icon {
  font-size: 4rem;
  margin-bottom: 10px;
  transition: transform 0.2s;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-tap .wooden-fish-icon {
  transform: scale(0.85);
  animation: tapEffect 0.3s ease;
}

@keyframes tapEffect {
  0% { transform: scale(0.85); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.tap-hint {
  font-size: 0.9rem;
  color: rgba(51, 51, 51, 0.9);
  margin-bottom: 10px;
  font-weight: 500;
}

.wooden-fish-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  width: 100%;
}

.merit-count {
  font-weight: bold;
  color: var(--accent-color);
  font-size: 1.2rem;
}

.merit-level {
  margin: 8px 0;
  font-weight: bold;
  font-size: 1.1rem;
  color: rgba(51, 51, 51, 0.9);
}

.tap-count {
  font-size: 0.9rem;
  color: rgba(51, 51, 51, 0.9);
}

/* 功德光环动画 */
@keyframes meritGlow {
  0% { box-shadow: 0 0 5px rgba(151, 150, 240, 0.5); }
  50% { box-shadow: 0 0 15px rgba(151, 150, 240, 0.8); }
  100% { box-shadow: 0 0 5px rgba(151, 150, 240, 0.5); }
}

/* 高级开关按钮 */
.toggle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 40px;
  margin-bottom: 15px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 34px;
  transition: .4s;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.toggle-on, .toggle-off {
  font-size: 12px;
  font-weight: bold;
  color: white;
  z-index: 1;
  position: absolute;
  width: 30px;
  text-align: center;
}

.toggle-on {
  left: 10px;
  opacity: 0;
  transition: .4s;
}

.toggle-off {
  right: 10px;
  opacity: 1;
  transition: .4s;
}

.toggle-indicator {
  position: absolute;
  content: "";
  height: 32px;
  width: 32px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background-color: var(--accent-color);
}

input:checked + .toggle-slider .toggle-indicator {
  transform: translateX(40px);
}

input:checked + .toggle-slider .toggle-on {
  opacity: 1;
}

input:checked + .toggle-slider .toggle-off {
  opacity: 0;
}

.toggle-status {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--accent-color);
}

/* 脉冲动画 */
.pulse-animation {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(151, 150, 240, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(151, 150, 240, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(151, 150, 240, 0);
  }
}

.mode-description {
  text-align: center;
  margin-top: 10px;
  font-size: 1.1rem;
  line-height: 1.5;
}

.remind-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  margin-top: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.remind-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(151, 150, 240, 0.4);
}

/* 时间卡片 */
.time-box {
  text-align: center;
}

.time-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  margin-top: 5px;
}

.time-display {
  margin-bottom: 10px;
}

.time {
  font-size: 2.7rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(to right, #36d1dc, #5b86e5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.date {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.countdown-container {
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: space-between;
  margin-top: 5px;
}

.countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  width: 48%;
  min-height: 100px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.work-countdown {
  border-left: 4px solid #36d1dc;
}

.weekend-countdown {
  border-left: 4px solid #ff9966;
}

.countdown-icon {
  font-size: 1.5rem;
  margin-bottom: 3px;
}

.countdown-text {
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: rgba(51, 51, 51, 0.9);
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin-top: auto;
}

.progress {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

/* 添加沙漏动画效果 */
.countdown::after {
  content: "⌛";
  position: absolute;
  font-size: 2.5rem;
  opacity: 0.08;
  right: -5px;
  bottom: -8px;
  transform: rotate(15deg);
  animation: sandFlow 3s infinite linear;
}

@keyframes sandFlow {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(359deg); }
}

/* 新的AI摸鱼名言卡片 */
.ai-joke-box {
  display: flex;
  flex-direction: column;
  min-height: 250px;
  position: relative;
  overflow: hidden;
}

.gradient-ai {
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.15) 0%, rgba(222, 134, 244, 0.15) 100%);
  border: 1px solid rgba(123, 97, 255, 0.2);
}

.ai-joke-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.joke-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.ai-joke-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  min-height: 100px;
}

.joke-bubble {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  padding: 15px 20px;
  box-shadow: 0 5px 15px rgba(123, 97, 255, 0.1);
  position: relative;
  width: 100%;
  transition: all 0.3s;
}

.joke-bubble:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(123, 97, 255, 0.15);
}

.joke-bubble::before {
  content: '🤖';
  position: absolute;
  left: -10px;
  top: -10px;
  font-size: 1.5rem;
  background: white;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.ai-joke {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  text-align: left;
}

.ai-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 10px;
}

.ai-refresh-btn {
  flex: 1;
}

.generate-card-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(90deg, #ff6b6b, #ffa36b);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: .5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 0.9rem;
  box-shadow: 0 3px 8px rgba(255, 107, 107, 0.3);
  flex: 1;
}

.generate-card-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 12px rgba(255, 107, 107, 0.4);
}

.card-icon {
  font-size: 1rem;
}

/* 加载动画 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-text {
  margin-top: 10px;
  color: #7b61ff;
  font-weight: 500;
}

.dot-typing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #7b61ff;
  color: #7b61ff;
  animation: dot-typing 1.5s infinite linear;
}

.dot-typing::before,
.dot-typing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-typing::before {
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #7b61ff;
  color: #7b61ff;
  animation: dot-typing 1.5s infinite linear;
  animation-delay: -0.5s;
}

.dot-typing::after {
  left: 15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #7b61ff;
  color: #7b61ff;
  animation: dot-typing 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dot-typing {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.4);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* 添加波浪效果背景装饰 */
.ai-joke-box::after {
  content: "";
  position: absolute;
  bottom: -50px;
  left: -50px;
  right: -50px;
  height: 100px;
  background: rgba(123, 97, 255, 0.05);
  border-radius: 50%;
  z-index: -1;
  animation: wave 8s infinite ease-in-out;
}

@keyframes wave {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
  }
}

/* 小技巧卡片 */
.tips-list {
  padding-left: 20px;
  line-height: 1.6;
  color: rgba(51, 51, 51, 0.9);
}

.tips-list li {
  margin-bottom: 10px;
  position: relative;
}

.tips-list li::before {
  content: "✓";
  color: var(--accent-color);
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.full-width {
  grid-column: span 3;
}

/* 卡皮巴拉卡片 */
.capybara-box {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.capybara-container {
  flex: 1;
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-radius: 10px;
}

.grass-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, rgba(126, 213, 111, 0.4), rgba(126, 213, 111, 0.6));
  z-index: 1;
}

.water-area {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 180px;
  height: 60px;
  background: linear-gradient(to bottom, rgba(100, 181, 246, 0.3), rgba(100, 181, 246, 0.5));
  border-radius: 50% 0 0 0;
  overflow: hidden;
  z-index: 2;
}

.water-ripple {
  position: absolute;
  top: 20px;
  left: 40px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 4s infinite;
}

@keyframes ripple {
  0% { transform: scale(0); opacity: 0.7; }
  50% { transform: scale(3); opacity: 0; }
  100% { transform: scale(0); opacity: 0; }
}

.capybara {
  position: absolute;
  bottom: 12px;
  font-size: 2rem;
  z-index: 3;
  animation: walk 20s linear infinite;
  transform: scaleX(-1); /* 默认面向左侧 */
  cursor: pointer;
  transition: transform 0.2s ease;
}

.capybara:hover {
  transform: scaleX(-1) scale(1.2);
}

.capybara.exploding {
  animation: explode 0.3s forwards;
}

@keyframes explode {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(2);
    opacity: 0.8;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.capybara-1 { animation-delay: 0s; }
.capybara-2 { animation-delay: -3s; }
.capybara-3 { animation-delay: -6s; }
.capybara-4 { animation-delay: -9s; }
.capybara-5 { animation-delay: -12s; }
.capybara-6 { animation-delay: -15s; }

@keyframes walk {
  0% {
    left: -5%;
    transform: scaleX(-1);
  }
  45% {
    left: 78%;
    transform: scaleX(-1);
  }
  50% {
    left: 80%;
    transform: scaleX(1);
  }
  95% {
    left: -3%;
    transform: scaleX(1);
  }
  100% {
    left: -5%;
    transform: scaleX(-1);
  }
}

/* 卡片弹窗样式 */
.card-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  z-index: 10;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #333;
}

/* 卡片生成中状态 */
.card-generating {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.generating-spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #7b61ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.generating-text {
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;
}

/* 卡片内容区域 */
.card-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

/* 卡片样式通用 */
.quote-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  width: 100%;
  max-width: 450px;
  height: 350px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-inner {
  padding: 25px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.quote-text {
  font-size: 1.3rem;
  line-height: 1.6;
  text-align: center;
  margin: 15px 0;
  z-index: 1;
  font-weight: 500;
}

.quote-author {
  font-style: italic;
  font-size: 1rem;
  margin-top: 15px;
  opacity: 0.8;
  z-index: 1;
}

/* 简约风格卡片 */
.minimalist-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 1px solid #eaeaea;
}

.minimalist-card .card-inner {
  padding: 40px 25px;
}

.minimalist-card .quote-icon {
  font-size: 5rem;
  color: rgba(123, 97, 255, 0.1);
  position: absolute;
  top: 20px;
  left: 20px;
}

.minimalist-card .quote-text {
  color: #333;
  font-family: serif;
  padding: 0 20px;
}

.minimalist-card .quote-author {
  color: #7b61ff;
  letter-spacing: 2px;
  font-weight: 600;
  margin-top: 30px;
}

.minimalist-card .card-watermark {
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.1);
  font-weight: bold;
  letter-spacing: 3px;
}

/* 自然风格卡片 */
.nature-card {
  background: linear-gradient(rgba(76, 175, 80, 0.8), rgba(139, 195, 74, 0.8)), url('https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTM0Nzg1MjA&ixlib=rb-1.2.1&q=80');
  background-size: cover;
  background-position: center;
}

.nature-card .card-inner {
  background: rgba(255, 255, 255, 0.2);
  padding: 30px;
}

.nature-card .quote-text {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  font-weight: 600;
}

.nature-card .quote-author {
  color: white;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  font-style: normal;
  font-weight: 500;
}

.nature-card .nature-decoration {
  position: absolute;
  width: 140px;
  height: 140px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='1'%3E%3Cpath d='M30,50 C30,30 50,10 70,30 C90,50 70,70 50,90 C30,70 10,50 30,30 Z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.5;
  z-index: 0;
  bottom: 20px;
  right: 20px;
  transform: rotate(10deg);
}

/* 霓虹风格卡片 */
.neon-card {
  background: #121212;
  position: relative;
  overflow: hidden;
}

.neon-card .card-inner {
  padding: 40px 20px;
}

.neon-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    transparent, 
    rgba(255, 0, 187, 0.3), 
    transparent 30%
  );
  animation: rotate 4s linear infinite;
}

.neon-card::after {
  content: "";
  position: absolute;
  inset: 3px;
  background: #121212;
  border-radius: 8px;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.neon-card .neon-title {
  color: #00f3ff;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0 0 5px #00f3ff, 0 0 10px #00f3ff;
  letter-spacing: 2px;
  margin-bottom: 20px;
  z-index: 1;
}

.neon-card .quote-text {
  color: white;
  z-index: 1;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
}

.neon-card .neon-decoration {
  position: absolute;
  bottom: 15px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff009e, transparent);
  z-index: 1;
}

/* 复古风格卡片 */
.retro-card {
  background: #f8f3e3;
  border: 1px dashed #c8ad7f;
  position: relative;
}

.retro-card .card-inner {
  background-image: 
    radial-gradient(#c8ad7f 1px, transparent 1px),
    radial-gradient(#c8ad7f 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  padding: 35px 20px;
}

.retro-card .quote-text {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #c8ad7f;
  padding: 20px;
  color: #5d4037;
  font-family: 'Courier New', monospace;
  box-shadow: 3px 3px 0 #c8ad7f;
}

.retro-card .retro-badge {
  position: absolute;
  top: 15px;
  background: #e53935;
  color: white;
  padding: 5px 15px;
  transform: rotate(-5deg);
  font-weight: bold;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.retro-card .retro-stamp {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
  background: rgba(229, 57, 53, 0.8);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: rotate(15deg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 1px;
  z-index: 1;
}

/* 卡片操作按钮 */
.card-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.download-btn, .regenerate-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.download-btn {
  background: #7b61ff;
  color: white;
  box-shadow: 0 3px 8px rgba(123, 97, 255, 0.3);
}

.download-btn:hover {
  background: #6a4fff;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(123, 97, 255, 0.4);
}

.regenerate-btn {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.regenerate-btn:hover {
  background: #e5e5e5;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.05);
}
</style> 