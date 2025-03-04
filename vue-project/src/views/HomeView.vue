<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

// 日历视图类型
const viewType = ref('month') // 'month', 'week', 'list'

// 当前日期
const currentDate = reactive({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  date: new Date().getDate()
})

// 周视图相关
const currentWeek = reactive({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  date: new Date().getDate(),
  weekNumber: 0
})

// 计算当前是一年中的第几周
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// 获取周视图数据
const generateWeekData = () => {
  // 获取当前日期
  const current = new Date(currentWeek.year, currentWeek.month, currentWeek.date);
  // 获取当前周数
  const weekNum = getWeekNumber(current);
  currentWeek.weekNumber = weekNum;
  
  // 计算这一周的开始日期（周日）
  const day = current.getDay();
  const diff = current.getDate() - day;
  const weekStartDate = new Date(current);
  weekStartDate.setDate(diff);
  
  // 生成当前周的天数据
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStartDate);
    currentDay.setDate(weekStartDate.getDate() + i);
    
    days.push({
      day: currentDay.getDate(),
      month: currentDay.getMonth(),
      year: currentDay.getFullYear(),
      weekday: i,
      isCurrentMonth: currentDay.getMonth() === currentWeek.month,
      isToday: currentDay.getDate() === new Date().getDate() && 
               currentDay.getMonth() === new Date().getMonth() && 
               currentDay.getFullYear() === new Date().getFullYear()
    });
  }
  
  // 返回当前周信息
  return {
    weekNumber: weekNum,
    year: currentWeek.year,
    startDate: weekStartDate,
    days: days
  };
}

const weekData = ref(generateWeekData());

// 更新周视图数据
const updateWeekData = () => {
  weekData.value = generateWeekData();
}

// 切换到上一周
const prevWeek = () => {
  const prevDate = new Date(currentWeek.year, currentWeek.month, currentWeek.date);
  prevDate.setDate(prevDate.getDate() - 7);
  
  currentWeek.year = prevDate.getFullYear();
  currentWeek.month = prevDate.getMonth();
  currentWeek.date = prevDate.getDate();
  
  updateWeekData();
}

// 切换到下一周
const nextWeek = () => {
  const nextDate = new Date(currentWeek.year, currentWeek.month, currentWeek.date);
  nextDate.setDate(nextDate.getDate() + 7);
  
  currentWeek.year = nextDate.getFullYear();
  currentWeek.month = nextDate.getMonth();
  currentWeek.date = nextDate.getDate();
  
  updateWeekData();
}

// 格式化周显示
const formatWeekDisplay = (week: any) => {
  return `${week.year}年 第${week.weekNumber}周`;
}

// 获取星期几的名称
const getWeekdayName = (weekday: number): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[weekday];
}

// 待办事项类型定义
interface Todo {
  id: number
  title: string
  date: string
  completed: boolean
}

// 待办事项列表
const todos = ref<Todo[]>([
  { id: 1, title: '完成项目计划', date: '2023-03-15', completed: false },
  { id: 2, title: '团队会议', date: '2023-03-16', completed: false },
  { id: 3, title: '提交报告', date: '2023-03-17', completed: true }
])

// 新待办事项弹窗
const isModalOpen = ref(false)
const newTodo = ref('')
const selectedDate = ref('')
const selectedDateObj = ref<{year: number, month: number, day: number} | null>(null)

// 添加新待办事项
const addTodo = () => {
  if (newTodo.value.trim() === '' || !selectedDate.value) return
  
  const id = todos.value.length > 0 ? Math.max(...todos.value.map(t => t.id)) + 1 : 1
  
  todos.value.push({
    id,
    title: newTodo.value,
    date: selectedDate.value,
    completed: false
  })
  
  newTodo.value = ''
  isModalOpen.value = false
}

// 打开添加待办事项弹窗
const openAddTodoModal = (year: number, month: number, day: number) => {
  selectedDateObj.value = { year, month, day }
  selectedDate.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  isModalOpen.value = true
}

// 关闭弹窗
const closeModal = () => {
  isModalOpen.value = false
}

// 切换待办事项完成状态
const toggleTodoStatus = (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

// 切换视图类型
const changeViewType = (type: string) => {
  viewType.value = type
}

// 生成日历数据
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay()
}

const generateCalendarData = () => {
  const daysInMonth = getDaysInMonth(currentDate.year, currentDate.month)
  const firstDay = getFirstDayOfMonth(currentDate.year, currentDate.month)
  
  const days = []
  
  // 添加上个月的天数
  const prevMonthDays = firstDay
  const prevMonth = currentDate.month === 0 ? 11 : currentDate.month - 1
  const prevMonthYear = currentDate.month === 0 ? currentDate.year - 1 : currentDate.year
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)
  
  for (let i = daysInPrevMonth - prevMonthDays + 1; i <= daysInPrevMonth; i++) {
    days.push({
      day: i,
      month: prevMonth,
      year: prevMonthYear,
      isCurrentMonth: false
    })
  }
  
  // 添加当前月的天数
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: currentDate.month,
      year: currentDate.year,
      isCurrentMonth: true,
      isToday: i === new Date().getDate() && 
               currentDate.month === new Date().getMonth() && 
               currentDate.year === new Date().getFullYear()
    })
  }
  
  // 添加下个月的天数
  const nextDays = 42 - days.length // 6 rows * 7 days
  const nextMonth = currentDate.month === 11 ? 0 : currentDate.month + 1
  const nextMonthYear = currentDate.month === 11 ? currentDate.year + 1 : currentDate.year
  
  for (let i = 1; i <= nextDays; i++) {
    days.push({
      day: i,
      month: nextMonth,
      year: nextMonthYear,
      isCurrentMonth: false
    })
  }
  
  return days
}

const calendarData = ref(generateCalendarData())

// 更新日历数据
const updateCalendar = () => {
  calendarData.value = generateCalendarData()
}

// 切换到上个月
const prevMonth = () => {
  if (currentDate.month === 0) {
    currentDate.month = 11
    currentDate.year--
  } else {
    currentDate.month--
  }
  updateCalendar()
}

// 切换到下个月
const nextMonth = () => {
  if (currentDate.month === 11) {
    currentDate.month = 0
    currentDate.year++
  } else {
    currentDate.month++
  }
  updateCalendar()
}

// 获取日期的待办事项
const getTodosForDate = (year: number, month: number, day: number): Todo[] => {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return todos.value.filter(todo => todo.date === dateStr)
}

// 格式化月份名称
const getMonthName = (month: number): string => {
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return monthNames[month]
}

// 分页相关
const itemsPerPage = 9 // 每页显示的待办事项数
const currentPage = ref(1)

// 列表视图筛选相关
const startDate = ref('')
const endDate = ref('')

// 获取经过筛选的待办事项
const filteredTodos = computed(() => {
  if (!startDate.value && !endDate.value) {
    return todos.value
  }
  
  return todos.value.filter(todo => {
    if (startDate.value && endDate.value) {
      return todo.date >= startDate.value && todo.date <= endDate.value
    } else if (startDate.value) {
      return todo.date >= startDate.value
    } else if (endDate.value) {
      return todo.date <= endDate.value
    }
    return true
  })
})

// 计算总页数 - 更新为使用筛选后的待办事项
const totalPages = computed(() => {
  return Math.ceil(filteredTodos.value.length / itemsPerPage)
})

// 获取当前页的待办事项 - 更新为使用筛选后的待办事项
const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTodos.value.slice(start, end)
})

// 重置日期筛选
const resetDateFilter = () => {
  startDate.value = ''
  endDate.value = ''
  currentPage.value = 1 // 重置到第一页
}

// 应用日期筛选
const applyDateFilter = () => {
  currentPage.value = 1 // 筛选后重置到第一页
}

// 切换页面
const changePage = (page: number) => {
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
}

onMounted(() => {
  updateCalendar()
  updateWeekData()
})
</script>

<template>
  <div class="calendar-container glass-effect">
    <div class="calendar-header">
      <div class="view-selector">
        <button 
          @click="changeViewType('month')" 
          :class="{ active: viewType === 'month' }"
        >月视图</button>
        <button 
          @click="changeViewType('week')" 
          :class="{ active: viewType === 'week' }"
        >周视图</button>
        <button 
          @click="changeViewType('list')" 
          :class="{ active: viewType === 'list' }"
        >列表视图</button>
      </div>
    </div>
    
    <!-- 月视图 -->
    <div v-if="viewType === 'month'" class="month-view">
      <div class="month-navigation">
        <button @click="prevMonth">上个月</button>
        <h2>{{ getMonthName(currentDate.month) }} {{ currentDate.year }}</h2>
        <button @click="nextMonth">下个月</button>
      </div>
      
      <div class="weekdays">
        <div>周日</div>
        <div>周一</div>
        <div>周二</div>
        <div>周三</div>
        <div>周四</div>
        <div>周五</div>
        <div>周六</div>
      </div>
      
      <div class="calendar-grid">
        <div 
          v-for="(day, index) in calendarData" 
          :key="index" 
          class="calendar-day" 
          :class="{ 
            'current-month': day.isCurrentMonth, 
            'today': day.isToday 
          }"
        >
          <div class="day-header">
            <div class="day-number">{{ day.day }}</div>
            <button 
              class="add-event-btn" 
              @click.stop="openAddTodoModal(day.year, day.month, day.day)"
              :title="`添加${day.year}年${day.month + 1}月${day.day}日的待办事项`"
            >
              +
            </button>
          </div>
          <div class="day-events">
            <div 
              v-for="todo in getTodosForDate(day.year, day.month, day.day)" 
              :key="todo.id" 
              class="event" 
              :class="{ 'completed': todo.completed }"
              @click.stop="toggleTodoStatus(todo.id)"
            >
              {{ todo.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 周视图 -->
    <div v-else-if="viewType === 'week'" class="week-view">
      <div class="week-navigation">
        <button @click="prevWeek">上一周</button>
        <h2>{{ formatWeekDisplay(weekData) }}</h2>
        <button @click="nextWeek">下一周</button>
      </div>
      
      <div class="week-card">
        <div class="weekday-list">
          <div v-for="(day, index) in weekData.days" :key="index" class="weekday-item">
            <div class="weekday-header">
              <div class="weekday-name">{{ getWeekdayName(day.weekday) }}</div>
              <div class="day-number" :class="{ 'today': day.isToday }">{{ day.day }}</div>
            </div>
            <div class="day-events week-events">
              <div 
                v-for="todo in getTodosForDate(day.year, day.month, day.day)" 
                :key="todo.id" 
                class="event" 
                :class="{ 'completed': todo.completed }"
                @click.stop="toggleTodoStatus(todo.id)"
              >
                {{ todo.title }}
              </div>
              <button 
                class="add-event-btn week-add-btn" 
                @click.stop="openAddTodoModal(day.year, day.month, day.day)"
                :title="`添加${day.year}年${day.month + 1}月${day.day}日的待办事项`"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 列表视图 -->
    <div v-else class="list-view">
      <h3>待办事项列表</h3>
      
      <!-- 添加日期区间筛选控件 -->
      <div class="date-filter">
        <div class="filter-header">
          <h4>按日期筛选</h4>
          <button class="reset-filter-btn" @click="resetDateFilter">重置</button>
        </div>
        <div class="filter-inputs">
          <div class="date-input-group">
            <label for="start-date">开始日期:</label>
            <input 
              type="date" 
              id="start-date" 
              v-model="startDate" 
              :max="endDate || undefined"
              style="width: 100%; height: 38px; font-family: 'Montserrat', sans-serif; background-color: #fff;" 
            >
          </div>
          <div class="date-input-group">
            <label for="end-date">结束日期:</label>
            <input 
              type="date" 
              id="end-date" 
              v-model="endDate" 
              :min="startDate || undefined"
              style="width: 100%; height: 38px; font-family: 'Montserrat', sans-serif; background-color: #fff;"
            >
          </div>
          <button class="apply-filter-btn" @click="applyDateFilter">应用筛选</button>
        </div>
      </div>
      
      <div class="filter-summary" v-if="startDate || endDate">
        <div class="filter-badge">
          筛选条件: 
          <span v-if="startDate && endDate">{{ startDate }} 至 {{ endDate }}</span>
          <span v-else-if="startDate">{{ startDate }} 之后</span>
          <span v-else-if="endDate">{{ endDate }} 之前</span>
          <button class="clear-filter-btn" @click="resetDateFilter">×</button>
        </div>
        <div class="result-count">找到 {{ filteredTodos.length }} 个结果</div>
      </div>
      
      <!-- 待办事项列表 -->
      <div class="todos-list">
        <!-- 如果没有待办事项，显示空状态 -->
        <div v-if="paginatedTodos.length === 0" class="empty-state">
          <p>没有找到符合条件的待办事项</p>
        </div>
        
        <div 
          v-else
          v-for="todo in paginatedTodos" 
          :key="todo.id" 
          class="todo-item" 
          :class="{ 'completed': todo.completed }"
          @click="toggleTodoStatus(todo.id)"
        >
          <div class="todo-checkbox">
            <span v-if="todo.completed">✓</span>
          </div>
          <div class="todo-content">
            <div class="todo-title">{{ todo.title }}</div>
            <div class="todo-date">{{ todo.date }}</div>
          </div>
        </div>
      </div>
      
      <!-- 分页控制 -->
      <div class="pagination">
        <button class="pagination-button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
        <div class="pagination-info">{{ currentPage }} / {{ totalPages }}</div>
        <button class="pagination-button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
    
    <!-- 添加待办事项弹窗 -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content glass-effect">
        <div class="modal-header">
          <h3>添加待办事项</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedDateObj" class="selected-date">
            {{ selectedDateObj.year }}年{{ selectedDateObj.month + 1 }}月{{ selectedDateObj.day }}日
          </div>
          <input 
            type="text" 
            v-model="newTodo" 
            placeholder="输入待办事项..." 
            class="todo-input"
            @keyup.enter="addTodo"
            ref="todoInput"
          >
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="cancel-btn">取消</button>
          <button @click="addTodo" class="save-btn">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 设置全局Montserrat字体 */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.calendar-container {
  padding: 0;
  margin: 0 0 0 0px; /* 从左侧开始显示 */
  border-radius: var(--border-radius);
  height: 100%;
  width: 1200px; /* 固定宽度为1200px */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
  position: relative;
}

.calendar-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  padding-top: 15px;
  padding-right: 20px;
}

.view-selector button {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  margin-left: 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.view-selector button.active {
  background: var(--accent-color);
  color: white;
}

.month-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-navigation button {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  width: 100%;
  font-size: 1.2rem;
}

.month-view, .week-view, .list-view {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: auto;
  padding: 0 20px 20px 20px;
  width: 1200px; /* 统一宽度为1200px */
}

.month-view {
  display: flex;
  flex-direction: column;
}

.week-view {
  min-height: 600px;
}

.list-view {
  min-height: 600px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 15px;
  flex: 1;
  min-height: 0;
}

.calendar-day {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 120px;
  transition: all 0.3s ease;
  min-width: 150px;
  height: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-5px) rotate(1deg);
  box-shadow: 0 8px 20px rgba(151, 150, 240, 0.3), 0 0 15px rgba(151, 150, 240, 0.5);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.day-number {
  font-weight: bold;
  font-size: 1.5rem;
}

/* 非当月日期字体颜色设置 */
.calendar-day:not(.current-month) .day-number {
  color: #999;
  opacity: 0.6;
}

.add-event-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s, background-color 0.2s;
}

.calendar-day:hover .add-event-btn {
  opacity: 1;
}

.add-event-btn:hover {
  background: var(--accent-color);
  color: white;
}

.current-month {
  background: rgba(255, 255, 255, 0.25);
}

.today {
  background: rgba(151, 150, 240, 0.3);
  border: 2px solid var(--accent-color);
}

.day-events {
  flex: 1;
  overflow-y: auto;
  font-size: 1.1rem;
}

.event {
  background: rgba(255, 255, 255, 0.4);
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.2s;
}

.event:hover {
  background: rgba(255, 255, 255, 0.6);
}

.event.completed {
  text-decoration: line-through;
  opacity: 0.7;
}

.todos-list {
  margin-top: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  font-size: 1.2rem;
  min-height: 80px;
  transition: all 0.3s ease;
  width: 100%; /* 调整为100%以适应容器 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-5px) rotate(0.5deg);
  box-shadow: 0 8px 20px rgba(151, 150, 240, 0.3), 0 0 15px rgba(151, 150, 240, 0.5);
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-checkbox {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 18px;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.todo-date {
  font-size: 1rem;
  color: #666;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
}

.week-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0 20px 20px 20px;
  min-height: 600px;
  width: 1200px; /* 修改为固定宽度1200px */
  max-width: 1200px;
}

.week-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.week-navigation button {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.week-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  margin-bottom: 30px;
  min-height: 500px;
  width: 1150px; /* 固定宽度，比容器略小 */
}

.weekday-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.weekday-item {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  min-height: 60px;
  overflow: hidden;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.weekday-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(151, 150, 240, 0.3), 0 0 15px rgba(151, 150, 240, 0.5);
}

.weekday-header {
  width: 150px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.weekday-name {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.day-number.today {
  color: var(--accent-color);
  font-weight: bold;
  font-size: 1.8rem;
}

.week-events {
  flex: 1;
  padding: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.week-add-btn {
  position: absolute;
  right: 15px;
  top: 15px;
}

.list-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0 20px 20px 20px;
  min-height: 600px;
  width: 1200px; /* 修改为固定宽度1200px */
  max-width: 1200px;
}

.todos-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  margin-bottom: 30px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  font-size: 1.2rem;
  min-height: 80px;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-5px) rotate(0.5deg);
  box-shadow: 0 8px 20px rgba(151, 150, 240, 0.3), 0 0 15px rgba(151, 150, 240, 0.5);
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-checkbox {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 18px;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.todo-date {
  font-size: 1rem;
  color: #666;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 400px;
  max-width: 90%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.selected-date {
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--accent-color);
}

.todo-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  font-size: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.cancel-btn, .save-btn {
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  font-weight: bold;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.save-btn {
  background: var(--accent-color);
  color: white;
  border: none;
}

@media (max-height: 900px) {
  .calendar-header {
    margin-bottom: 10px;
  }
  
  .month-navigation {
    margin-bottom: 10px;
  }
}

.main-content {
  overflow-x: auto;
  width: 100%;
}

/* 分页控制样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
}

.pagination-button {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  margin: 0 5px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.pagination-button.active {
  background: var(--accent-color);
  color: white;
}

.pagination-info {
  margin: 0 15px;
  font-size: 0.9rem;
}

/* 日期筛选控件样式 */
.date-filter {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 15px;
  margin-top: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.filter-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.filter-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
}

.date-input-group label {
  margin-bottom: 5px;
  font-size: 0.9rem;
  opacity: 0.8;
}

.date-input {
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 1rem;
  color: inherit;
  font-family: 'Montserrat', sans-serif;
  width: 100%;
}

/* 修复日期输入框的字体和样式 - 解决点击无反应问题 */
input[type="date"] {
  font-family: 'Montserrat', sans-serif;
  /* 仅添加最基本的样式，不干扰功能 */
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #333;
}

/* 移除这些自定义样式，使用浏览器默认样式 */
/*
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.8;
  cursor: pointer;
  position: absolute;
  right: 10px;
  background-color: transparent;
  padding: 5px;
  border-radius: 4px;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

input[type="date"]::-webkit-datetime-edit {
  padding: 0 5px;
}

input[type="date"]::-webkit-datetime-edit-fields-wrapper {
  color: inherit;
}
*/

.apply-filter-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 110px;
}

.apply-filter-btn:hover {
  background: var(--accent-color-dark, #8180d8);
  transform: translateY(-2px);
}

.reset-filter-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.reset-filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 0 5px;
}

.filter-badge {
  background: rgba(151, 150, 240, 0.2);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.clear-filter-btn {
  background: none;
  border: none;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.clear-filter-btn:hover {
  opacity: 1;
}

.result-count {
  font-size: 0.9rem;
  opacity: 0.7;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  grid-column: span 3;
}

.empty-state p {
  font-size: 1.1rem;
  opacity: 0.7;
}
</style>
