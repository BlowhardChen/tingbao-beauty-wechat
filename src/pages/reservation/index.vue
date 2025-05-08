<template>
  <view class="box">
    <view class="content">
      <!-- banner -->
      <view class="banner">
        <image src="@/static/reservation/banner.png" mode="scaleToFill" />
      </view>
      <!-- main -->
      <view class="main">
        <!-- 店铺详情 -->
        <view class="store-detail">
          <view class="title">
            <text>婷宝美业</text>
          </view>
          <view class="business-hours flex-row">
            <image class="icon" src="@/static/reservation/icon-time.png" mode="scaleToFill" />
            <view class="business-hours-desc flex-row">
              <view :class="businessStatus.colorClass">{{ businessStatus.text }}</view>
              <text> 周一至周日 11:00~22:00 </text>
            </view>
          </view>
          <view class="address-box flex-row">
            <view class="address flex-row">
              <image class="icon" src="@/static/reservation/icon-location.png" mode="scaleToFill" />
              <view class="address-desc">
                <text>深圳市福田区KK ONE商场4F联娱影城前台左侧</text>
              </view>
            </view>
            <view class="icon-group flex-row">
              <image
                class="icon-item"
                src="@/static/reservation/icon-location-red.png"
                mode="scaleToFill"
                style="margin-right: 32rpx"
                @click="openMapLocation"
              />
              <image
                class="icon-item"
                src="@/static/reservation/icon-phone.png"
                mode="scaleToFill"
                @click="callPhone"
              />
            </view>
          </view>
        </view>
        <!-- 预约时间组件-->
        <CalenDar @select-time="selectTime" ref="calendarRef" />
        <!-- 选择项目 -->
        <view class="select-project flex-row" @click="selectProject">
          <view class="select-project-title">
            <text>服务项目</text>
          </view>
          <view class="select-input">
            <input
              type="text"
              placeholder="请选择"
              v-model="reservationForm.project"
              :disabled="true"
            />
          </view>
          <image
            class="project-icon"
            src="@/static/reservation/iocn-right.png"
            mode="scaleToFill"
          />
        </view>
        <!-- 预约人 -->
        <view class="select-project flex-row">
          <view class="select-project-title">
            <text>预约人</text>
          </view>
          <view class="select-input">
            <input type="text" placeholder="请输入" v-model="reservationForm.name" />
          </view>
        </view>
        <!-- 预约号码 -->
        <view class="select-project flex-row">
          <view class="select-project-title">
            <text>预约号码</text>
          </view>
          <view class="select-input">
            <input type="text" placeholder="请输入" v-model="reservationForm.phone" />
          </view>
        </view>
      </view>
      <!-- 预约按钮 -->
      <view class="button-box flex-row">
        <view
          :class="['button', 'flex-row', { 'button-disabled': !isFormComplete }]"
          @click="clickReservationNow"
        >
          <text>立即预约</text>
        </view>
      </view>
    </view>
    <!-- 成功弹窗 -->
    <SuccessPopup v-if="isShowSuccessPopup" @left-btn="closePopup" @right-btn="viewReservation" />
  </view>
</template>

<script setup lang="ts">
  import { onShow } from '@dcloudio/uni-app'
  import SuccessPopup from '@/components/common/success-popup.vue'
  import CalenDar from '@/components/common/calendar.vue'
  import { computed, reactive, ref } from 'vue'
  import { useProjectInfoStore } from '@/stores'

  import { debounce } from '@/utils'
  import { addReservation } from '@/services/reservation'

  const projectInfoStore = useProjectInfoStore()

  const calendarRef = ref<InstanceType<typeof CalenDar> | null>(null)

  // 计算当前时间
  const currentTime = new Date()
  const currentHour = currentTime.getHours()

  // 营业时间：11:00 - 22:00
  const businessStartHour = 11
  const businessEndHour = 22

  // 计算营业状态
  const businessStatus = computed(() => {
    if (currentHour >= businessStartHour && currentHour < businessEndHour) {
      return { text: '营业中', colorClass: 'business-open' }
    } else {
      return { text: '已休息', colorClass: 'business-closed' }
    }
  })

  // 打开地图位置
  const openMapLocation = (): void => {
    uni.openLocation({
      latitude: 22.528304, // 纬度
      longitude: 114.027462, // 经度
      name: '婷宝美业',
      address: '深圳市福田区KK ONE商场4F联娱影城前台左侧',
      scale: 18,
    })
  }

  // 拨打电话
  const callPhone = (): void => {
    uni.makePhoneCall({
      phoneNumber: '18218426498', // 电话号码
    })
  }

  // 预约表单数据
  const reservationForm = reactive({
    project: '',
    name: '',
    phone: '',
    date: '',
  })

  const reservationParams = reactive({
    appointDate: '',
    appointTimeId: '',
    appointUsername: '',
    appointPhone: '',
    appointProjectId: '',
  })

  // 预约表单是否完整
  const isFormComplete = computed(() => {
    return (
      reservationForm.project &&
      reservationForm.name &&
      reservationForm.phone &&
      reservationForm.date
    )
  })

  // 选择项目
  const selectProject = (): void => {
    uni.navigateTo({
      url: '/pages/project/index',
    })
  }

  // 选择时间
  const selectTime = (data: any): void => {
    console.log('selectTime', data)
    reservationForm.date = data.date
    reservationParams.appointTimeId = data.time.id
  }

  // 立即预约
  const clickReservationNow = debounce(async (): Promise<void> => {
    const phone = reservationForm.phone.trim()
    // 正则校验：以1开头，第二位是3-9，然后后面9位数字，共11位
    const phoneReg = /^1[3-9]\d{9}$/
    if (!phoneReg.test(phone)) {
      uni.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      })
      return
    }
    try {
      reservationParams.appointUsername = reservationForm.name
      reservationParams.appointPhone = reservationForm.phone
      reservationParams.appointDate = reservationForm.date
      await addReservation(reservationParams)
      resetCalendarAndForm()
      isShowSuccessPopup.value = true
    } catch (error: any) {
      console.log('error', error)
      uni.showToast({
        title: error?.msg || '预约失败',
        icon: 'none',
      })
    }
  }, 500)

  // 重置日历和表单数据
  const resetCalendarAndForm = (): void => {
    calendarRef.value?.handleOnShowLogic()
    projectInfoStore.removeProjectInfoData()
    reservationForm.project = ''
    reservationForm.name = ''
    reservationForm.phone = ''
    reservationForm.date = ''
  }

  const isShowSuccessPopup = ref(false)
  // 关闭弹窗
  const closePopup = (): void => {
    isShowSuccessPopup.value = false
  }

  // 查看预约
  const viewReservation = (): void => {
    closePopup()
    uni.switchTab({
      url: '/pages/my/index',
    })
  }

  onShow(() => {
    if (!reservationParams.appointProjectId) {
      calendarRef.value?.handleOnShowLogic()
    }

    if (projectInfoStore.projectInfo) {
      reservationForm.project = projectInfoStore.projectInfo.name
    }

    uni.$on('selectProject', (data) => {
      reservationForm.project = `${data.project.name}${data.project.activity}`
      reservationParams.appointProjectId = data.project.projectId
    })
  })
</script>

<style>
  .box {
    background: #f5f6f8;
  }

  .content {
    position: relative;
    height: auto;
    overflow: hidden;
  }

  .banner {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 580rpx;
  }

  .banner image {
    width: 100%;
    height: 100%;
  }

  .main {
    position: relative;
    padding: 0 24rpx;
    padding-bottom: 194rpx;
    margin-top: 510rpx;
    background: #f5f6f8;
  }

  .store-detail {
    position: relative;
    z-index: 2;
    width: 702rpx;
    padding: 32rpx;
    background: #fff;
    border-radius: 16rpx;
  }

  .title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
  }

  .business-hours {
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-top: 8rpx;
  }

  .icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;
  }

  .business-hours-desc,
  .address-desc {
    flex: 1;
    align-items: center;
    font-size: 24rpx;
    font-weight: 400;
    color: #666;
  }

  /* 正常营业时的样式 */
  .business-open {
    padding: 0 16rpx;
    margin-right: 8rpx;
    font-size: 20rpx;
    color: rgb(8 174 60 / 80%);
    background-color: rgb(8 174 60 / 10%);
    border-radius: 16rpx;
  }

  /* 休息时的样式 */
  .business-closed {
    padding: 0 16rpx;
    margin-right: 8rpx;
    font-size: 20rpx;
    color: rgb(170 170 170); /* 灰色 */
    background-color: rgb(170 170 170 / 20%); /* 灰色背景 */
    border-radius: 16rpx;
  }

  /* 休息时的样式 */
  .business-closed {
    padding: 0 16rpx;
    margin-right: 8rpx;
    font-size: 20rpx;
    color: rgb(170 170 170); /* 灰色 */
    background-color: rgb(170 170 170 / 20%); /* 灰色背景 */
    border-radius: 16rpx;
  }

  .address-box {
    justify-content: space-between;
    width: 100%;
  }

  .address {
    align-items: center;
    justify-content: flex-start;
    padding-top: 16rpx;
    margin-right: 24rpx;
  }

  .icon-group {
    align-items: center;
  }

  .icon-item {
    width: 64rpx;
    height: 64rpx;
  }

  .select-project {
    width: 100%;
    padding: 28rpx 32rpx;
    margin-top: 16rpx;
    background: #fff;
    border-radius: 16rpx;
  }

  .select-project-title {
    width: 135rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .select-input {
    flex: 1;
    padding-left: 48rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: #fe9393;
  }

  .project-icon {
    width: 48rpx;
    height: 48rpx;
  }

  .button-box {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    align-items: center;
    justify-content: center;
    width: 750rpx;
    height: 108rpx;
    background: #fff;
  }

  .button {
    align-items: center;
    justify-content: center;
    width: 590rpx;
    height: 72rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
    background: #fe9393;
    border-radius: 36rpx;
    opacity: 1;
  }

  .button-disabled {
    opacity: 0.5;
  }
</style>
