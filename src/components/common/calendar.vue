<template>
  <view class="calendar-container">
    <view class="title">
      <text>预约时间</text>
    </view>
    <!-- 日期选项卡 -->
    <view class="date-tabs">
      <view
        v-for="date in dateOptions"
        :key="date.key"
        class="date-tab flex-col"
        :class="{ active: selectedDate === date.key }"
        @click="handleDateSelect(date)"
      >
        <view class="date-label">
          <text>{{ date.label }}</text>
        </view>
        <view class="date-value">
          <text>{{ date.formattedDate }}</text>
        </view>
      </view>
    </view>

    <!-- 时间选择区域 -->
    <view class="time-grid flex-row">
      <view
        v-for="time in currentTimes"
        :key="time.time"
        class="time-slot flex-col"
        :class="{
          full: time.status === 'full',
          active: isTimeActive(time),
        }"
        @click="handleTimeSelect(time)"
      >
        <view class="active-icon" v-if="isTimeActive(time)">
          <image src="@/static/reservation/icon-active.png" mode="scaleToFill" />
        </view>
        <text>{{ time.time }}</text>
        <view v-if="time.status === 'full'" class="full-tag">约满</view>
      </view>
    </view>

    <!-- 日期选择弹窗 -->
    <!-- <CalendarPopup /> -->
  </view>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import CalendarPopup from './calendar-popup.vue'
  import { onShow } from '@dcloudio/uni-app'
  import { apiGetFullTimes } from '@/service/reservation'

  // 类型定义
  interface TimeSlot {
    time: string
    status: 'available' | 'full'
  }

  interface DateOption {
    key: string
    label: string
    date: Date
    formattedDate: string
  }

  // 响应式数据
  const selectedDate = ref<string>('')
  const showCalendar = ref(false)
  const scheduleData = ref<Record<string, Set<string>>>({})
  const selectedTime = ref<string>('')

  // 计算日期选项卡
  const dateOptions = computed<DateOption[]>(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(today.getDate() + 2)

    // 确保第四个始终是下一个周六
    const nextSaturday = getNextSaturday(today)

    return [
      createDateOption(today, '今天'),
      createDateOption(tomorrow, getDayLabel(tomorrow, '明天')),
      createDateOption(dayAfterTomorrow, getDayLabel(dayAfterTomorrow, '后天')),
      createDateOption(nextSaturday, '周六'),
      { key: 'all', label: '全部', date: today, formattedDate: '' },
    ]
  })

  // 日期切换处理
  const handleDateSelect = async (date: DateOption) => {
    if (date.key === 'all') {
      showCalendar.value = true
    } else {
      selectedDate.value = date.key
      // 动态加载数据
      if (!scheduleData.value[date.key]) {
        const fullTimes = await apiGetFullTimes(date.key)
        scheduleData.value[date.key] = new Set(fullTimes)
      }
      selectedTime.value = '' // 切换日期清空选择
    }
  }

  // 修改时间处理逻辑
  const handleTimeSelect = (time: TimeSlot) => {
    if (time.status === 'full') return

    // 同时记录选中日期和时间
    selectedTime.value = time.time
    console.log('预约时间:', selectedDate.value, time.time)
  }

  // 判断时间是否激活
  const isTimeActive = (time: TimeSlot) => {
    return selectedTime.value === time.time
  }

  // 工具函数
  const getNextSaturday = (date: Date) => {
    const currentDay = date.getDay()
    const daysToAdd = currentDay === 6 ? 7 : 6 - currentDay
    const result = new Date(date)
    result.setDate(date.getDate() + daysToAdd)
    return result
  }

  // 格式化日期
  const formatDate = (date: Date, format = 'YYYY-M-D') => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return format === 'M/D' ? `${month}/${day}` : `${year}-${month}-${day}`
  }

  // 创建日期选项的辅助函数
  const createDateOption = (date: Date, label: string) => {
    return {
      key: formatDate(date),
      label,
      date,
      formattedDate: formatDate(date, 'M/D'),
    }
  }

  // 智能日期标签生成
  const getDayLabel = (date: Date, defaultLabel: string) => {
    const day = date.getDay()
    return day === 6 ? '周六' : day === 0 ? '周日' : defaultLabel
  }

  // 获取当天数据
  const fetchTodayData = async () => {
    const todayKey = formatDate(new Date())
    if (!scheduleData.value[todayKey]) {
      const fullTimes = await apiGetFullTimes(todayKey)
      scheduleData.value[todayKey] = new Set(fullTimes)
    }
  }

  // 修改时间生成逻辑为固定值
  const fixedTimeSlots = [
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
  ]

  // 初始化模拟数据
  onShow(() => {
    fetchTodayData()
    selectedDate.value = formatDate(new Date())
  })
</script>

<style scoped>
  .calendar-container {
    width: 100%;
    padding: 32rpx;
    margin-top: 16rpx;
    overflow: hidden;
    background: #fff;
    border-radius: 16rpx;
    border-radius: 8px;
  }

  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .date-tabs {
    display: flex;
    gap: 10rpx;
    margin-top: 32rpx;
  }

  .date-tab {
    align-items: center;
    justify-content: center;
    width: 120rpx;
    height: 116rpx;
    background: #f1f1f1;
    border-radius: 8rpx;
  }

  .date-tab.active {
    color: white;
    background: #fe9393;
  }

  .time-grid {
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 10rpx;
  }

  .time-slot {
    position: relative;
    align-items: center;
    justify-content: center;
    width: 120rpx;
    height: 116rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    background: #f1f1f1;
    border: 1px solid #f1f1f1;
    border-radius: 8rpx;
  }

  .time-slot:hover {
    box-shadow: 0 2px 6px rgb(0 0 0 / 10%);
  }

  .time-slot.full {
    color: #333;
    background: #f1f1f1;
    opacity: 0.5;
  }

  .full-tag {
    margin-top: 4px;
    font-size: 24rpx;
    font-weight: 400;
    color: #666;
  }

  .time-slot.active {
    background: #fff2f2 !important;
    border-color: #fe9393;
  }

  .active-icon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    width: 44rpx;
    height: 30rpx;
  }

  .active-icon image {
    position: absolute;
    top: 0;
    right: 0;
    width: 44rpx;
    height: 30rpx;
  }
</style>
