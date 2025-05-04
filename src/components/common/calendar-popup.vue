<!-- CalendarPopup.vue -->
<template>
  <div class="calendar-popup">
    <div class="header">
      <div class="title">日期选择</div>
      <div class="month">{{ displayedMonth }}</div>
    </div>

    <div class="weekdays">
      <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">{{ day }}</div>
    </div>

    <div class="days-grid">
      <div
        v-for="day in days"
        :key="day.date"
        class="day"
        :class="{ selected: day.isSelected }"
        @click="handleDaySelect(day)"
      >
        {{ day.number }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  defineProps<{
    selectedDate: string
  }>()

  const emit = defineEmits(['select', 'close'])

  // 实现日期计算逻辑（需要完善）
  const days = computed(() => {
    // 生成当月日期数据
    return Array.from({ length: 31 }, (_, i) => ({
      number: i + 1,
      date: `2025-05-${i + 1}`,
      isSelected: i === 2, // 示例选中3号
    }))
  })

  const displayedMonth = '2025年5月'

  const handleDaySelect = (day: any) => {
    emit('select', day.date)
    emit('close')
  }
</script>

<style scoped>
  .calendar-popup {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  }

  .header {
    margin-bottom: 20px;
    text-align: center;
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 10px;
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }

  .day {
    padding: 10px;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
  }

  .day.selected {
    color: white;
    background: #ff69b4;
  }
</style>
