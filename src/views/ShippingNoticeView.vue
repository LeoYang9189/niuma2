<script setup lang="ts">
import { ref, computed } from 'vue'

// 船司公告列表
const notices = ref([
  {
    id: 1,
    company: '海运集团',
    title: '航线调整通知',
    content: '由于季风影响，亚洲-欧洲航线将临时调整，详情请咨询客服。',
    date: '2023-03-10',
    important: true
  },
  {
    id: 2,
    company: '中远海运',
    title: '运费调整公告',
    content: '自2023年4月1日起，所有航线运费将上调5%，特此通知。',
    date: '2023-03-15',
    important: true
  },
  {
    id: 3,
    company: '马士基航运',
    title: '新航线开通',
    content: '我司将于2023年5月开通新的东南亚直达航线，欢迎广大客户选择。',
    date: '2023-03-20',
    important: false
  },
  {
    id: 4,
    company: '地中海航运',
    title: '系统维护通知',
    content: '我司订舱系统将于本周六进行维护升级，届时将暂停服务4小时。',
    date: '2023-03-22',
    important: false
  }
])

// 筛选条件
const filterImportant = ref(false)
const searchKeyword = ref('')

// 筛选公告
const filteredNotices = computed(() => {
  return notices.value.filter(notice => {
    if (filterImportant.value && !notice.important) {
      return false
    }
    
    if (searchKeyword.value && 
       !notice.title.includes(searchKeyword.value) && 
       !notice.company.includes(searchKeyword.value) && 
       !notice.content.includes(searchKeyword.value)) {
      return false
    }
    
    return true
  })
})
</script>

<template>
  <div class="shipping-notice-container glass-effect">
    <h1>船司公告</h1>
    
    <div class="notice-filter">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索公告..."
        >
      </div>
      <div class="filter-options">
        <label>
          <input type="checkbox" v-model="filterImportant">
          只显示重要公告
        </label>
      </div>
    </div>
    
    <div class="notices-list">
      <div 
        v-for="notice in filteredNotices" 
        :key="notice.id" 
        class="notice-item"
        :class="{ 'important': notice.important }"
      >
        <div class="notice-header">
          <div class="notice-company">{{ notice.company }}</div>
          <div class="notice-date">{{ notice.date }}</div>
        </div>
        <div class="notice-title">
          <span v-if="notice.important" class="important-badge">重要</span>
          {{ notice.title }}
        </div>
        <div class="notice-content">{{ notice.content }}</div>
      </div>
      
      <div v-if="filteredNotices.length === 0" class="no-notices">
        没有找到匹配的公告
      </div>
    </div>
  </div>
</template>

<style scoped>
.shipping-notice-container {
  padding: 20px;
  border-radius: var(--border-radius);
  width: 1200px;
}

.notice-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.search-box input {
  padding: 10px 15px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.3);
  width: 250px;
}

.filter-options label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.filter-options input[type="checkbox"] {
  margin-right: 8px;
}

.notices-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.notice-item {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 15px;
  transition: transform 0.3s;
}

.notice-item:hover {
  transform: translateY(-5px);
}

.notice-item.important {
  border-left: 4px solid #ff6b6b;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.notice-company {
  font-weight: bold;
  color: var(--accent-color);
}

.notice-date {
  font-size: 0.9rem;
  color: #666;
}

.notice-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.important-badge {
  background: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  padding: 3px 6px;
  border-radius: 10px;
  margin-right: 8px;
}

.notice-content {
  line-height: 1.5;
}

.no-notices {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

@media (max-width: 768px) {
  .notice-filter {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-box input {
    width: 100%;
  }
}
</style> 