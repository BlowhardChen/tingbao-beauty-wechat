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
        :class="{
          active: selectedDate === date.key,
          disabled: isDateDisabled(date.key),
        }"
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
        v-for="item in currentTimes"
        :key="selectedDate + '-' + item.time"
        class="time-slot flex-col"
        :class="{
          full: item.alreadyCount >= 2,
          active: isTimeActive(item),
          timedisabled: isTimeSlotDisabled(item),
        }"
        @click="handleTimeSelect(item)"
      >
        <view class="active-icon" v-if="isTimeActive(item)">
          <image src="@/static/reservation/icon-active.png" mode="scaleToFill" />
        </view>
        <text>{{ item.time }}</text>
        <view v-if="item.alreadyCount >= 2" class="full-tag">约满</view>
      </view>
    </view>

    <!-- 日期选择弹窗 -->
    <CalendarPopup
      v-if="isShowCalendar"
      :selected-date="selectedDate"
      @close-popup="closeCalendarPopup"
      @select="handlePopupDateSelect"
    />
  </view>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import { onShow } from '@dcloudio/uni-app'
  import CalendarPopup from './calendar-popup.vue'
  import { getReservationTime } from '@/services/reservation'

  interface DateOption {
    key: string
    label: string
    date: Date
    formattedDate: string
  }

  interface TimeSlot {
    time: string
    alreadyCount: number
    maxCapacity: number
    userReserved?: boolean
  }

  const emits = defineEmits(['selectTime'])

  const selectedDate = ref('')
  const selectedTime = ref('')
  const isShowCalendar = ref(false)
  const selectedPopupDate = ref<Date | null>(null)
  const scheduleData = ref<Record<string, TimeSlot[]>>({})

  const businessStartHour = 11
  const businessEndHour = 22
  const today = new Date()
  const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  /**
   * 格式化日期
   */
  const formatDate = (date: Date, format = 'YYYY-M-D') => {
    const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const pad = (n: number) => n.toString().padStart(2, '0')
    return format === 'M/D'
      ? `${pad(normalizedDate.getMonth() + 1)}/${pad(normalizedDate.getDate())}`
      : `${normalizedDate.getFullYear()}-${pad(normalizedDate.getMonth() + 1)}-${pad(normalizedDate.getDate())}`
  }

  /**
   * 获取动态的周几标签
   */
  const getDynamicDayLabel = (date: Date) => {
    const today = new Date()
    const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const normalizedToday = normalize(today)
    const normalizedDate = normalize(date)
    const diffTime = normalizedDate.getTime() - normalizedToday.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '明天'
    if (diffDays === 2) return '后天'

    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
  }

  /**
   * 创建一个日期选项对象
   */
  const createDynamicOption = (baseDate: Date, offset: number): DateOption => {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + offset)
    const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    return {
      key: formatDate(normalizedDate),
      label: getDynamicDayLabel(normalizedDate),
      date: normalizedDate,
      formattedDate: formatDate(normalizedDate, 'M/D'),
    }
  }

  /**
   * 日期选项卡数组
   */
  const dateOptions = computed<DateOption[]>(() => {
    const baseDate = selectedPopupDate.value ?? new Date()
    return [
      createDynamicOption(baseDate, 0),
      createDynamicOption(baseDate, 1),
      createDynamicOption(baseDate, 2),
      createDynamicOption(baseDate, 3),
      { key: 'all', label: '全部', date: baseDate, formattedDate: '' },
    ]
  })

  // 判断日期是否过期禁用
  const isDateDisabled = (dateKey: string) => {
    if (dateKey === 'all') return false
    return new Date(dateKey).getTime() < new Date(todayDateStr).getTime()
  }

  // 判断时间段是否过期禁用
  const isTimeSlotDisabled = (time: TimeSlot) => {
    // 约满的时段 直接禁用
    if (time.alreadyCount >= 2) return true
    // 不是今日 全部时段可用
    if (selectedDate.value !== todayDateStr) return false
    // 今日：判断当前时间是否已超过该时段
    const currentHour = new Date().getHours()
    const currentMinute = new Date().getMinutes()
    const timeHour = Number(time.time.split(':')[0])
    const timeMinute = Number(time.time.split(':')[1] || 0)
    // 营业时间外的时段禁用
    if (timeHour < businessStartHour || timeHour >= businessEndHour) return true
    // 已过的时段禁用
    if (currentHour > timeHour) return true
    if (currentHour === timeHour && currentMinute > timeMinute) return true
    // 其他情况可用
    return false
  }

  /**
   * 点击日期选项
   */
  const handleDateSelect = async (date: DateOption) => {
    // 禁用的日期点击无反应
    if (isDateDisabled(date.key)) return
    if (date.key === 'all') {
      isShowCalendar.value = true
    } else {
      selectedDate.value = date.key
      if (!scheduleData.value[date.key]) {
        await getReservationTimeData(date.key)
      }
      selectedTime.value = ''
    }
  }

  /**
   * 关闭日历弹窗
   */
  const closeCalendarPopup = () => {
    isShowCalendar.value = false
  }

  /**
   * 日历弹窗选择日期
   */
  const handlePopupDateSelect = async (dateStr: string) => {
    isShowCalendar.value = false
    const date = new Date(dateStr)
    const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    selectedPopupDate.value = normalizedDate
    scheduleData.value = {}
    const formatted = formatDate(normalizedDate)
    await getReservationTimeData(formatted)
    nextTick(() => {
      selectedDate.value = formatted
    })
  }

  /**
   * 选择时间槽
   */
  const handleTimeSelect = (time: TimeSlot) => {
    if (isTimeSlotDisabled(time)) return
    selectedTime.value = time.time
    emits('selectTime', { date: selectedDate.value, time })
  }

  /**
   * 判断时间是否被选中
   */
  const isTimeActive = (time: TimeSlot) => {
    return selectedTime.value === time.time
  }

  /**
   * 当前选中日期的时间槽
   */
  const currentTimes = computed<TimeSlot[]>(() => {
    if (selectedDate.value === 'all') return []
    return scheduleData.value[selectedDate.value] || []
  })

  /**
   * 获取预约时间数据
   */
  const getReservationTimeData = async (dateKey: string): Promise<void> => {
    try {
      const data = await getReservationTime(dateKey)
      scheduleData.value[dateKey] = data
    } catch (error) {}
  }

  // 重置方法，用于父组件调用
  const handleOnShowLogic = async (): Promise<void> => {
    selectedTime.value = ''
    scheduleData.value = {}
    selectedPopupDate.value = null
    const todayKey = formatDate(new Date())
    selectedDate.value = todayKey
    await getReservationTimeData(todayKey)
  }

  // 缓存恢复方法，用于onShow返回时执行
  const recoverCalendarState = async (): Promise<void> => {
    if (selectedDate.value) {
      if (!scheduleData.value[selectedDate.value]) {
        await getReservationTimeData(selectedDate.value)
      }
    } else {
      await handleOnShowLogic()
    }
  }

  defineExpose({
    handleOnShowLogic,
  })

  onShow(async () => {
    await recoverCalendarState()
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

  .date-tab.disabled {
    color: #ccc;
    pointer-events: none;
    background: #f9f9f9;
    opacity: 0.6;
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

  .time-slot.timedisabled {
    color: #ccc;
    pointer-events: none;
    background: #f9f9f9;
    opacity: 0.6;
  }
</style>
