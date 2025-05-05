<template>
  <view class="calendar-popup-box">
    <view class="calendar-popup">
      <!-- 顶部标题栏 -->
      <view class="header">
        <view class="top flex-row">
          <view class="top-icon"></view>
          <view class="title">日期选择</view>
          <view class="top-icon" @click="closePopup">
            <image src="@/static/reservation/icon-close.png" mode="scaleToFill" />
          </view>
        </view>
        <!-- 当前显示月份 -->
        <view class="month">
          <text>{{ displayedMonth }}</text>
        </view>
      </view>

      <!-- 星期标题 -->
      <view class="weekdays">
        <view v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day" class="day">
          <text>{{ day }}</text>
        </view>
      </view>

      <!-- 日期网格 -->
      <view class="days-grid">
        <view
          v-for="(day, index) in days"
          :key="index"
          class="day"
          :class="{
            empty: day.isEmpty,
            selected: day.isSelected,
            today: day.isToday,
            disabled: day.isDisabled,
          }"
          @click="handleDaySelect(day)"
        >
          <text>{{ day.isEmpty ? '' : day.number }}</text>
        </view>

        <!-- 背景水印月份文字 -->
        <view class="days-bg flex-row">
          <view class="month-bg">
            <text>{{ currentDate.getMonth() + 1 }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  // 组件 props
  const props = defineProps<{
    selectedDate: string | null
  }>()

  // 组件 emits
  const emit = defineEmits(['select', 'closePopup'])

  // 当前显示的日期
  const currentDate = ref(new Date())
  const today = ref(new Date())
  today.value.setHours(0, 0, 0, 0)

  // 最晚可预约日期（15天内）
  const maxDate = ref(new Date(today.value))
  maxDate.value.setDate(today.value.getDate() + 15)

  // 关闭弹窗
  const closePopup = () => {
    emit('closePopup')
  }

  // 点击某一天选择日期
  const handleDaySelect = (day: any) => {
    if (day.isDisabled) return
    emit('select', day.date)
    emit('closePopup') // 选择后关闭弹窗
  }

  // 监听传入的 selectedDate，更新当前显示月份
  watch(
    () => props.selectedDate,
    (newVal) => {
      if (newVal) {
        const date = new Date(newVal)
        if (!isNaN(date.getTime())) {
          currentDate.value = date
        }
      }
    },
    { immediate: true }
  )

  // 生成当前月份的日期数据
  const days = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayWeek = new Date(year, month, 1).getDay()

    const daysArray = []

    // 前导空白占位
    for (let i = 0; i < firstDayWeek; i++) {
      daysArray.push({ isEmpty: true })
    }

    // 填充当月日期数据
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const currentDay = new Date(year, month, i)
      currentDay.setHours(0, 0, 0, 0)

      daysArray.push({
        number: i,
        date: dateStr,
        isSelected: dateStr === props.selectedDate,
        isToday: !props.selectedDate && currentDay.getTime() === today.value.getTime(),
        isDisabled: currentDay < today.value || currentDay > maxDate.value,
      })
    }

    return daysArray
  })

  // 当前显示的年月文字
  const displayedMonth = computed(() => {
    const m = currentDate.value.getMonth() + 1
    return `${currentDate.value.getFullYear()}年${m}月`
  })
</script>

<style lang="scss" scoped>
  .calendar-popup-box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 199;
    width: 750rpx;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
  }

  .calendar-popup {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 200;
    width: 750rpx;
    height: 900rpx;
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    box-shadow: 0 -4rpx 12rpx rgb(0 0 0 / 10%);
  }

  .header {
    text-align: center;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 32rpx;
  }

  .top-icon {
    width: 42rpx;
    height: 42rpx;
  }

  .top-icon image {
    width: 42rpx;
    height: 42rpx;
  }

  .month {
    margin-top: 16rpx;
    font-size: 36rpx;
    font-weight: 500;
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-top: 40rpx;
    font-size: 24rpx;
    color: #666;
    box-shadow: 0 5rpx 5rpx rgb(0 0 0 / 10%);
  }

  .days-grid {
    position: relative;
    z-index: 110;
    display: grid;
    grid-template-columns: repeat(7, 88rpx);
    gap: 15rpx;
    justify-content: center;
    padding: 0 32rpx;
    margin-top: 48rpx;
  }

  .day {
    position: relative;
    z-index: 110;
    height: 88rpx;
    font-size: 32rpx;
    line-height: 88rpx;
    color: #333;
    text-align: center;
    transition: background-color 0.2s ease;
  }

  .day.empty {
    pointer-events: none;
    visibility: hidden;
  }

  .day.disabled {
    color: #ccc !important;
    pointer-events: none;
  }

  .day.today,
  .day.selected {
    font-weight: 500;
    color: #fff;
    background: #fe9393;
    border-radius: 8rpx;
  }

  .days-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }

  .month-bg {
    font-size: 250rpx;
    color: #e2e2e2;
  }
</style>
