<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'

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
interface TodoType {
  id: string
  name: string
  active: boolean
  color: string
}

// 提醒时间选项
const reminderOptions = [
  { value: '7d', label: '7天' },
  { value: '3d', label: '3天' },
  { value: '1d', label: '1天' },
  { value: '12h', label: '12小时' },
  { value: '6h', label: '6小时' },
  { value: '3h', label: '3小时' },
  { value: '2h', label: '2小时' },
  { value: '1h', label: '1小时' },
  { value: '15m', label: '15分钟' }
]

// 模拟从设置获取的待办类型
const todoTypes = ref<TodoType[]>([
  { id: '1', name: '船舶作业', active: true, color: '#3498db' },
  { id: '2', name: '订舱', active: true, color: '#9b59b6' },
  { id: '3', name: '报关', active: true, color: '#e67e22' },
  { id: '4', name: '拖车', active: true, color: '#e74c3c' },
  { id: '5', name: '仓储', active: true, color: '#27ae60' },
  { id: '6', name: '会议', active: true, color: '#f1c40f' },
  { id: '7', name: '其他', active: true, color: '#95a5a6' }
])

// 获取激活的待办类型
const activeTodoTypes = computed(() => {
  return todoTypes.value.filter(type => type.active)
})

// 更新待办事项数据结构
interface Todo {
  id: number
  title: string
  date: string
  types: string[] // 多个类型
  shipName: string
  voyage: string
  etd: string
  deadline: string
  needReminder: boolean
  reminderTimes: string[] // 多个提醒时间
  blNumber: string
  containerNumber: string
  customNumber: string
  notes: string
  completed: boolean
}

// 更新待办事项列表为新数据结构
const todos = ref<Todo[]>([])
const selectedDateObj = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate()
})

// 新待办事项对象
const newTodoData = ref({
  title: '',
  types: [] as string[],
  shipName: '',
  voyage: '',
  etd: '',
  deadline: '',
  needReminder: false,
  reminderTimes: [] as string[],
  blNumber: '',
  containerNumber: '',
  customNumber: '',
  notes: ''
})

// 清空新待办事项表单
const resetNewTodoForm = () => {
  newTodoData.value = {
    title: '',
    types: [],
    shipName: '',
    voyage: '',
    etd: '',
    deadline: '',
    needReminder: false,
    reminderTimes: [],
    blNumber: '',
    containerNumber: '',
    customNumber: '',
    notes: ''
  }
}

// 打开添加待办事项弹窗
const openAddTodoModal = (year: number, month: number, day: number) => {
  selectedDateObj.value = { year, month, day }
  selectedDate.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  
  // 设置默认日期值
  newTodoData.value.etd = selectedDate.value
  
  // 设置默认截止时间为当天下午5点
  const deadlineDate = new Date(year, month, day, 17, 0)
  newTodoData.value.deadline = deadlineDate.toISOString().slice(0, 16)
  
  isModalOpen.value = true
}

// 加载本地存储的待办事项
const loadTodosFromStorage = () => {
  try {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      todos.value = JSON.parse(savedTodos)
    }
  } catch (e) {
    console.error('解析待办事项数据失败:', e)
    // 确保失败时使用默认空数组
    todos.value = []
  }
}

// 保存待办事项到本地存储
const saveTodosToStorage = () => {
  try {
    localStorage.setItem('todos', JSON.stringify(todos.value))
  } catch (e) {
    console.error('保存待办事项数据失败:', e)
  }
}

// 加载待办类型
const loadTodoTypesFromStorage = () => {
  try {
    const savedTypes = localStorage.getItem('todoTypes')
    if (savedTypes) {
      todoTypes.value = JSON.parse(savedTypes)
    }
  } catch (e) {
    console.error('解析待办类型数据失败:', e)
    // 保持默认值
  }
}

// 在组件挂载时加载数据 - 注意顺序和错误处理
onMounted(() => {
  try {
    // 先初始化基本视图
    updateCalendar()
    updateWeekData()
    // 然后加载存储数据
    loadTodosFromStorage()
    loadTodoTypesFromStorage()
  } catch (e) {
    console.error('组件初始化失败:', e)
  }
})

// 监听todos变化并保存 - 添加错误处理
watch(todos, () => {
  try {
    saveTodosToStorage()
  } catch (e) {
    console.error('保存待办事项时出错:', e)
  }
}, { deep: true })

// 添加新待办事项
const addTodo = () => {
  // 验证必填字段
  if (!newTodoData.value.title || !newTodoData.value.deadline) {
    alert('请填写标题和截止时间')
    return
  }
  
  // 创建新待办事项
  const newTodo: Todo = {
    id: Date.now(), // 使用时间戳作为唯一ID
    title: newTodoData.value.title,
    date: `${selectedDateObj.value.year}-${String(selectedDateObj.value.month + 1).padStart(2, '0')}-${String(selectedDateObj.value.day).padStart(2, '0')}`,
    types: newTodoData.value.types,
    shipName: newTodoData.value.shipName,
    voyage: newTodoData.value.voyage,
    etd: newTodoData.value.etd,
    deadline: newTodoData.value.deadline,
    needReminder: newTodoData.value.needReminder,
    reminderTimes: newTodoData.value.reminderTimes,
    blNumber: newTodoData.value.blNumber,
    containerNumber: newTodoData.value.containerNumber,
    customNumber: newTodoData.value.customNumber,
    notes: newTodoData.value.notes,
    completed: false
  }
  
  // 添加到待办事项列表
  todos.value.push(newTodo)
  
  // 保存到本地存储
  saveTodosToStorage()
  
  // 关闭弹窗并重置表单
  closeModal()
}

// 新待办事项弹窗
const isModalOpen = ref(false)
const selectedDate = ref('')

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

// 添加事项详情弹窗的状态
const isViewModalOpen = ref(false)
const currentTodo = ref<Todo | null>(null)
const isEditMode = ref(true) // 是否处于编辑模式

// 查看事项详情
const viewTodoDetails = (todoId: number) => {
  const todo = todos.value.find(t => t.id === todoId)
  if (todo) {
    currentTodo.value = JSON.parse(JSON.stringify(todo)) // 深拷贝，避免直接修改原对象
    isEditMode.value = !todo.completed // 如果已完成，则默认为查看模式
    isViewModalOpen.value = true
  }
}

// 保存编辑后的事项
const saveTodoChanges = () => {
  if (!currentTodo.value) return
  
  // 找到原始待办事项的索引
  const index = todos.value.findIndex(t => t.id === currentTodo.value?.id)
  if (index !== -1) {
    // 更新待办事项
    todos.value[index] = { ...currentTodo.value }
    isViewModalOpen.value = false
    
    // 自动保存到本地存储(由watch处理)
  }
}

// 标记事项为已完成
const markTodoAsCompleted = () => {
  if (!currentTodo.value) return
  
  currentTodo.value.completed = true
  isEditMode.value = false // 切换到查看模式
  
  // 保存更改
  saveTodoChanges()
}

// 在卡片空白区域点击时创建新待办事项
const handleDayClick = (event: MouseEvent, year: number, month: number, day: number) => {
  // 确保点击的是卡片空白区域，而不是事项项目
  if ((event.target as HTMLElement).closest('.todo-item')) {
    return
  }
  
  // 打开添加待办事项弹窗
  openAddTodoModal(year, month, day)
}

// 清除当前查看的待办事项
const closeViewModal = () => {
  isViewModalOpen.value = false
  currentTodo.value = null
}

// 获取待办事项的颜色
const getTodoColor = (todo: Todo) => {
  // 如果没有类型，返回默认颜色
  if (!todo.types || todo.types.length === 0) return '#95a5a6'
  
  // 获取第一个类型的颜色
  const firstTypeId = todo.types[0]
  const todoType = todoTypes.value.find(t => t.id === firstTypeId)
  
  // 如果找到类型并且有颜色，返回该颜色，否则返回默认颜色
  return todoType?.color || '#95a5a6'
}
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
      
      <div class="month-grid">
        <div 
          v-for="(day, index) in calendarData" 
          :key="index" 
          class="date-cell" 
          :class="{ 
            'current-month': day.isCurrentMonth, 
            'today': day.isToday 
          }"
          @click="handleDayClick($event, day.year, day.month, day.day)"
        >
          <div class="day-header">
            <div class="day-number">{{ day.day }}</div>
            <button 
              class="add-todo-btn" 
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
              :class="{ 
                'completed': todo.completed,
                'type-shipment': todo.types.includes('1'),
                'type-booking': todo.types.includes('2'),
                'type-customs': todo.types.includes('3'),
                'type-trucking': todo.types.includes('4'),
                'type-warehouse': todo.types.includes('5'),
                'type-meeting': todo.types.includes('6'),
                'type-other': todo.types.includes('7') || todo.types.length === 0
              }"
              :style="{ 
                borderLeftColor: getTodoColor(todo),
                backgroundColor: `${getTodoColor(todo)}15` // 使用颜色的透明版本作为背景
              }"
              @click.stop="viewTodoDetails(todo.id)"
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
                :class="{ 
                  'completed': todo.completed,
                  'type-shipment': todo.types.includes('1'),
                  'type-booking': todo.types.includes('2'),
                  'type-customs': todo.types.includes('3'),
                  'type-trucking': todo.types.includes('4'),
                  'type-warehouse': todo.types.includes('5'),
                  'type-meeting': todo.types.includes('6'),
                  'type-other': todo.types.includes('7') || todo.types.length === 0
                }"
                :style="{ 
                  borderLeftColor: getTodoColor(todo),
                  backgroundColor: `${getTodoColor(todo)}15` // 使用颜色的透明版本作为背景
                }"
                @click.stop="viewTodoDetails(todo.id)"
              >
                {{ todo.title }}
              </div>
              <button 
                class="add-todo-btn week-add-btn" 
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
          :style="{ 
            borderLeftColor: getTodoColor(todo),
            backgroundColor: `${getTodoColor(todo)}15` // 使用颜色的透明版本作为背景
          }"
          @click="viewTodoDetails(todo.id)"
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
    
    <!-- 查看/编辑待办事项弹窗 -->
    <div v-if="isViewModalOpen" class="modal-backdrop" @click="closeViewModal">
      <div class="modal-container view-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditMode ? '编辑待办事项' : '查看待办事项' }}</h3>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        
        <div class="modal-body" v-if="currentTodo">
          <div class="selected-date">
            <i class="calendar-icon">📅</i> {{ currentTodo.date }}
          </div>
          
          <div class="form-group">
            <label>标题 <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="currentTodo.title" 
              class="form-control" 
              :disabled="!isEditMode || currentTodo.completed" 
              required
            >
          </div>
          
          <div class="form-group">
            <label>待办类型</label>
            <div class="checkbox-group">
              <label 
                v-for="type in activeTodoTypes" 
                :key="type.id"
                class="checkbox-label"
              >
                <input 
                  type="checkbox" 
                  :value="type.id" 
                  v-model="currentTodo.types"
                  :disabled="!isEditMode || currentTodo.completed"
                >
                {{ type.name }}
              </label>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label>船名</label>
              <input 
                type="text" 
                v-model="currentTodo.shipName" 
                class="form-control" 
                :disabled="!isEditMode || currentTodo.completed"
              >
            </div>
            <div class="form-group half">
              <label>航次</label>
              <input 
                type="text" 
                v-model="currentTodo.voyage" 
                class="form-control"
                :disabled="!isEditMode || currentTodo.completed"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label>ETD</label>
              <input 
                type="date" 
                v-model="currentTodo.etd" 
                class="form-control"
                :disabled="!isEditMode || currentTodo.completed"
              >
            </div>
            <div class="form-group half">
              <label>Deadline <span class="required">*</span></label>
              <input 
                type="datetime-local" 
                v-model="currentTodo.deadline" 
                class="form-control"
                :disabled="!isEditMode || currentTodo.completed"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <label class="reminder-toggle">
              <input 
                type="checkbox" 
                v-model="currentTodo.needReminder"
                :disabled="!isEditMode || currentTodo.completed"
              >
              是否提醒
            </label>
            
            <div class="reminder-options" v-if="currentTodo.needReminder">
              <label>提醒时间</label>
              <div class="checkbox-group">
                <label 
                  v-for="option in reminderOptions" 
                  :key="option.value"
                  class="checkbox-label"
                >
                  <input 
                    type="checkbox" 
                    :value="option.value" 
                    v-model="currentTodo.reminderTimes"
                    :disabled="!isEditMode || currentTodo.completed"
                  >
                  {{ option.label }}
                </label>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label>提单号</label>
              <input 
                type="text" 
                v-model="currentTodo.blNumber" 
                class="form-control"
                :disabled="!isEditMode || currentTodo.completed"
              >
            </div>
            <div class="form-group half">
              <label>箱号</label>
              <input 
                type="text" 
                v-model="currentTodo.containerNumber" 
                class="form-control"
                :disabled="!isEditMode || currentTodo.completed"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>自定义单号</label>
            <input 
              type="text" 
              v-model="currentTodo.customNumber" 
              class="form-control"
              :disabled="!isEditMode || currentTodo.completed"
            >
          </div>
          
          <div class="form-group">
            <label>备注</label>
            <textarea 
              v-model="currentTodo.notes" 
              class="form-control textarea"
              :disabled="!isEditMode || currentTodo.completed"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            v-if="isEditMode && !currentTodo?.completed" 
            class="complete-btn" 
            @click="markTodoAsCompleted"
          >
            标记已完成
          </button>
          <button 
            v-if="isEditMode" 
            class="save-btn" 
            @click="saveTodoChanges"
          >
            保存
          </button>
          <button class="cancel-btn" @click="closeViewModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 添加待办事项弹窗 -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content glass-effect">
        <div class="modal-header">
          <h3>添加新待办事项</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedDateObj" class="selected-date">
            {{ selectedDateObj.year }}年{{ selectedDateObj.month + 1 }}月{{ selectedDateObj.day }}日
          </div>
          <div class="form-group">
            <label for="todoTitle">标题 <span class="required">*</span></label>
            <input 
              id="todoTitle"
              type="text" 
              v-model="newTodoData.title" 
              placeholder="请输入待办标题"
              class="form-control" 
              required
            >
          </div>
          
          <div class="form-group">
            <label>待办类型</label>
            <div class="checkbox-group">
              <label 
                v-for="type in activeTodoTypes" 
                :key="type.id"
                class="checkbox-label"
              >
                <input 
                  type="checkbox" 
                  :value="type.id" 
                  v-model="newTodoData.types"
                >
                {{ type.name }}
              </label>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label>船名</label>
              <input 
                type="text" 
                v-model="newTodoData.shipName" 
                class="form-control"
              >
            </div>
            <div class="form-group half">
              <label>航次</label>
              <input 
                type="text" 
                v-model="newTodoData.voyage" 
                class="form-control"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label>ETD</label>
              <input 
                type="date" 
                v-model="newTodoData.etd" 
                class="form-control"
              >
            </div>
            <div class="form-group half">
              <label>Deadline <span class="required">*</span></label>
              <input 
                type="datetime-local" 
                v-model="newTodoData.deadline" 
                class="form-control"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <label class="reminder-toggle">
              <input 
                type="checkbox" 
                v-model="newTodoData.needReminder"
              >
              是否提醒
            </label>
            
            <div class="reminder-options" v-if="newTodoData.needReminder">
              <label>提醒时间</label>
              <div class="checkbox-group">
                <label 
                  v-for="option in reminderOptions" 
                  :key="option.value"
                  class="checkbox-label"
                >
                  <input 
                    type="checkbox" 
                    :value="option.value" 
                    v-model="newTodoData.reminderTimes"
                  >
                  {{ option.label }}
                </label>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label>提单号</label>
              <input 
                type="text" 
                v-model="newTodoData.blNumber" 
                class="form-control"
              >
            </div>
            <div class="form-group half">
              <label>箱号</label>
              <input 
                type="text" 
                v-model="newTodoData.containerNumber" 
                class="form-control"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>自定义单号</label>
            <input 
              type="text" 
              v-model="newTodoData.customNumber" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>备注</label>
            <textarea 
              v-model="newTodoData.notes" 
              class="form-control textarea"
            ></textarea>
          </div>
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
  width: 100%; /* 使用100%宽度 */
  height: 100%; /* 使用100%高度填充父容器 */
  overflow: auto; /* 允许内容滚动 */
  padding: 0;
  margin: 0 0 0 0px; /* 从左侧开始显示 */
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
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
  width: 2200px; /* 统一宽度为1200px */
}

.month-view {
  display: flex;
  flex-direction: column;
  width: 100%; /* 使用100%宽度而不是固定宽度 */
  max-width: 100%; /* 确保不会溢出父容器 */
  overflow-x: auto; /* 在小屏幕上允许水平滚动 */
}

.week-view {
  min-height: 600px;
}

.list-view {
  min-height: 600px;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 使用等分布局代替固定宽度 */
  gap: 8px;
  width: 100%;
  min-width: 800px; /* 设置最小宽度以保证在小屏幕上的可用性 */
}

.date-cell {
  aspect-ratio: 1 / 1; /* 保持宽高比，确保单元格始终是正方形 */
  min-height: 120px; /* 设置最小高度 */
  overflow: hidden;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease, transform 0.4s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.date-cell:hover {
  transform: translateY(-5px) rotate(1deg);
  box-shadow: 0 10px 25px rgba(151, 150, 240, 0.3);
  background: rgba(255, 255, 255, 0.25);
  z-index: 5;
}

.date-cell.today {
  background: rgba(151, 150, 240, 0.15);
  border: 2px solid rgba(151, 150, 240, 0.5);
}

.date-cell.not-current-month {
  opacity: 0.5;
}

.date-cell.has-todo {
  box-shadow: 0 0 0 2px rgba(151, 150, 240, 0.3);
}

/* 确保小卡片内的其他元素样式也正确 */
.date-number {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-items {
  overflow-y: auto;
  flex: 1;
  margin-top: 5px;
  padding-right: 3px;
  max-height: calc(100% - 30px);
}

.todo-item {
  margin-bottom: 5px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid var(--accent-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-item:hover {
  background-color: white !important;
  transform: translateX(3px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
  border-left-color: #27ae60 !important;
}

/* 船舶作业 - 蓝色 */
.todo-item.type-shipment {
  border-left-color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

/* 订舱 - 紫色 */
.todo-item.type-booking {
  border-left-color: #9b59b6;
  background-color: rgba(155, 89, 182, 0.1);
}

/* 报关 - 橙色 */
.todo-item.type-customs {
  border-left-color: #e67e22;
  background-color: rgba(230, 126, 34, 0.1);
}

/* 拖车 - 红色 */
.todo-item.type-trucking {
  border-left-color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

/* 仓储 - 绿色 */
.todo-item.type-warehouse {
  border-left-color: #27ae60;
  background-color: rgba(39, 174, 96, 0.1);
}

/* 会议 - 黄色 */
.todo-item.type-meeting {
  border-left-color: #f1c40f;
  background-color: rgba(241, 196, 15, 0.1);
}

/* 其他 - 灰色 */
.todo-item.type-other {
  border-left-color: #95a5a6;
  background-color: rgba(149, 165, 166, 0.1);
}

/* 恢复原始加号按钮样式 */
.add-todo-btn {
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
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.date-cell:hover .add-todo-btn {
  opacity: 1;
}

.add-todo-btn:hover {
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

/* 弹窗样式优化 */
.modal-backdrop, .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container, .modal-content {
  width: 650px;
  max-width: 95%;
  max-height: 90vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform: translateY(0);
  animation: modal-slide-up 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes modal-slide-up {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: linear-gradient(135deg, var(--accent-color) 0%, rgba(151, 150, 240, 0.8) 100%);
  color: white;
  border-bottom: none;
  position: relative;
}

.modal-header h3 {
  font-weight: 600;
  font-size: 1.3rem;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
  background-image: 
    radial-gradient(circle at 100% 100%, rgba(151, 150, 240, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 0% 0%, rgba(151, 150, 240, 0.05) 0%, transparent 50%);
}

.selected-date {
  display: inline-flex;
  align-items: center;
  background: rgba(151, 150, 240, 0.15);
  padding: 8px 16px;
  border-radius: 30px;
  margin-bottom: 20px;
  font-weight: 500;
  color: var(--accent-color);
  box-shadow: 0 2px 8px rgba(151, 150, 240, 0.15);
}

.calendar-icon {
  margin-right: 8px;
  font-size: 1.2rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group.half {
  flex: 1;
  min-width: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.form-control:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(151, 150, 240, 0.2), 0 2px 4px rgba(0, 0, 0, 0.02);
  background: white;
}

.textarea {
  resize: vertical;
  min-height: 90px;
  line-height: 1.5;
}

.required {
  color: #e74c3c;
  font-size: 0.9em;
  margin-left: 4px;
}

/* 复选框组样式 */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(151, 150, 240, 0.2);
  border-radius: 10px;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.checkbox-label:hover {
  background: rgba(151, 150, 240, 0.1);
  border-color: rgba(151, 150, 240, 0.3);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-color);
}

/* 提醒选项样式 */
.reminder-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
}

.reminder-toggle input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--accent-color);
}

.reminder-options {
  background: rgba(151, 150, 240, 0.05);
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed rgba(151, 150, 240, 0.3);
  margin-top: 10px;
  animation: fade-in 0.3s ease;
}

/* 按钮样式 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 18px 24px;
  background: rgba(248, 249, 250, 0.7);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.cancel-btn, .save-btn, .complete-btn {
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background: #f1f2f6;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-right: 0;
}

.cancel-btn:hover {
  background: #e5e6ea;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.save-btn {
  background: linear-gradient(135deg, var(--accent-color) 0%, rgba(151, 150, 240, 0.8) 100%);
  color: white;
  border: none;
}

.save-btn:hover {
  background: linear-gradient(135deg, var(--accent-color) 20%, rgba(151, 150, 240, 0.9) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(151, 150, 240, 0.3);
}

.complete-btn {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  margin-right: 0;
}

.complete-btn:hover {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(46, 204, 113, 0.3);
}

/* 日期和时间选择器样式 */
input[type="date"],
input[type="datetime-local"] {
  appearance: none;
  -webkit-appearance: none;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-family: inherit;
  font-size: 16px;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

input[type="date"]:focus,
input[type="datetime-local"]:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(151, 150, 240, 0.2), 0 2px 4px rgba(0, 0, 0, 0.02);
  background: white;
}

/* 已完成样式 */
.form-control:disabled {
  background-color: #f5f7fa;
  color: #a0a0a0;
  cursor: not-allowed;
  border: 1px solid rgba(0, 0, 0, 0.05);
  opacity: 0.9;
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

/* 媒体查询，针对中小屏幕优化布局 */
@media (max-width: 1200px) {
  .date-cell {
    min-height: 100px;
  }
  
  .todo-item {
    padding: 4px 8px;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .calendar-header button, .week-header button {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
  
  .date-number {
    font-size: 0.9rem;
  }
  
  .todo-items {
    max-height: calc(100% - 25px);
  }
}

/* 修正非当月日期数字颜色设置 */
.date-cell:not(.current-month) .day-number {
  color: #999 !important;
  opacity: 0.8;
}

/* 确保标题和日期都使用灰色 */
.date-cell:not(.current-month) .date-number {
  color: #999 !important;
  opacity: 0.8;
}
</style>
