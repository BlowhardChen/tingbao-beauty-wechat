<template>
  <view class="box">
    <view class="content">
      <view class="my-top">
        <view class="banner">
          <image src="@/static/my/banner.png" mode="scaleToFill" />
        </view>
        <view class="title" :style="{ marginTop: safeAreaInsets!.top + 'px' }"> 我的 </view>
        <!-- info -->
        <view class="info">
          <view class="user-info flex-row">
            <view class="avatar">
              <image
                class="avatar-img"
                src="/static/my/avatar.png"
                referrer="no-referrer|origin|unsafe-url"
                mode="scaleToFill"
              />
            </view>
            <view class="user-name" @click="goLogin">
              <text>{{
                userInfoState.userInfo?.nickName ? userInfoState.userInfo.nickName : '请登录'
              }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- main -->
      <view class="main">
        <view class="order-box">
          <view class="order-title">订单</view>
          <view class="order-type-list flex-row">
            <view
              class="order-type-item"
              v-for="(item, index) in orderList"
              :key="index"
              :class="item.type === currentOrderType ? 'active' : ''"
              @click="changeOrderType(item)"
            >
              <text>{{ item.title }}</text>
            </view>
          </view>
          <!-- 订单列表 -->
          <scroll-view
            v-if="userInfoState.userInfo"
            class="order-lsit"
            :scroll-y="true"
            enhanced
            :show-scrollbar="false"
            :refresher-enabled="isOpenRefresh"
            :refresher-triggered="triggered"
            :refresher-threshold="100"
            @refresherrefresh="onRefresh"
            @refresherrestore="onRestore"
            @scrolltolower="onReachScollBottom"
          >
            <view v-if="reservationList?.length">
              <view class="order-lsit-item" v-for="(item, index) in reservationList" :key="index">
                <view class="order-info flex-row">
                  <view class="order-info-image">
                    <image
                      class="avatar-img"
                      :src="item.image_url"
                      referrer="no-referrer|origin|unsafe-url"
                      mode="scaleToFill"
                    />
                    <view class="order-info-type">
                      <text>{{ RESERVATION_STATUS_MAP[item.appointStatus] }}</text>
                    </view>
                  </view>
                  <view class="order-info-desc">
                    <view class="desc-title">
                      <text>【{{ item.name }}】{{ item.activity }}</text>
                    </view>
                    <view class="desc-price">
                      <text>价格: ￥{{ item.price }}</text>
                    </view>
                    <view class="desc-time">
                      <text>创建时间: {{ item.createTime }}</text>
                    </view>
                    <view class="desc-time">
                      <text>预约时间: {{ item.createTime }}</text>
                    </view>
                    <view class="desc-time" v-if="item.appointStatus === 'used'">
                      <text>完成时间: {{ item.updateTime }}</text>
                    </view>
                    <view class="desc-time" v-if="item.appointStatus === 'canceled'">
                      <text>取消时间: {{ item.updateTime }}</text>
                    </view>
                    <view class="desc-time" v-if="item.appointStatus === 'expire'">
                      <text>过期时间: {{ item.updateTime }}</text>
                    </view>
                  </view>
                </view>
                <view class="button-box flex-row" v-if="item.appointStatus === 'pending'">
                  <view
                    class="button-box-item flex-row"
                    style="margin-right: 14rpx; border: 1rpx solid #e3e3e3"
                    @click="cancelOrder(item.id)"
                  >
                    <text>取消预约</text>
                  </view>
                  <view
                    class="button-box-item flex-row"
                    style="color: #ff7575; background: #ffecec"
                    @click="completeOrder(item.id)"
                    v-if="userInfoState.userInfo?.role === 'admin'"
                  >
                    <text>完成服务</text>
                  </view>
                </view>
              </view>
            </view>
            <view v-else class="no-data flex-col">
              <view class="data-image">
                <image src="/static/my/empty.png" mode="scaleToFill" />
              </view>
              <text>暂无订单</text>
            </view>
          </scroll-view>
          <view v-else class="no-data flex-col">
            <view class="data-image">
              <image src="/static/my/empty.png" mode="scaleToFill" />
            </view>
            <text>请登录后查看订单</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useUserInfoStore } from '@/stores'
  import { onShow } from '@dcloudio/uni-app'
  import { login } from '@/services/user'
  import { cancelReservation, confirmReservation, getReservationList } from '@/services/reservation'
  import type { ReservationServiceList } from '@/types/reservation'

  interface orderListType {
    title: string
    type: string
  }

  interface ReservationType {
    [key: string]: string
  }

  const RESERVATION_STATUS_MAP: ReservationType = {
    '': '全部',
    pending: '待服务',
    used: '已服务',
    canceled: '已过期/已取消',
    expire: '已过期/已取消',
  } as const

  const userInfoState = useUserInfoStore()

  // 获取屏幕边界到安全区域距离
  const { safeAreaInsets } = uni.getSystemInfoSync()

  /**
   * 发起微信登录流程，获取临时登录凭证并调用后台接口登录
   */
  const goLogin = () => {
    // 调用 uni.login 获取临时登录凭证
    uni.login({
      provider: 'weixin',
      success: async (res) => {
        if (!res.code) {
          return showLoginFail('微信登录失败，请稍后重试')
        }
        try {
          // 使用 code 调用后台登录接口
          const data = await login(res.code)
          console.log('登录成功', data)
          uni.showToast({
            title: '登录成功',
            icon: 'success',
          })
          useUserInfoStore().setToken(data.token)
          useUserInfoStore().setUserInfoData(data.userinfo)
          await getReservationListData()
        } catch (error: any) {
          showLoginFail(error?.msg || '登录失败，请稍后重试')
        }
      },

      fail: (err) => {
        console.error('微信登录接口调用失败', err)
        showLoginFail('微信登录失败，请检查网络或稍后重试')
      },
    })
  }

  /**
   * 显示登录失败提示
   * @param message 提示内容
   */
  const showLoginFail = (message: string) => {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000,
    })
  }

  const currentOrderType = ref('')
  const reservationList = ref<ReservationServiceList[]>()
  /**
   * 切换订单类型
   * @param item 订单类型对象
   */
  const changeOrderType = (item: orderListType) => {
    if (!userInfoState.userInfo) {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    currentOrderType.value = item.type
    getReservationListData()
  }

  /**
   * 取消订单
   * @param id 订单ID
   */
  const cancelOrder = async (id: number): Promise<void> => {
    try {
      await cancelReservation(id)
      await getReservationListData()
      uni.showToast({
        title: '取消订单成功',
        icon: 'success',
        duration: 2000,
      })
    } catch (error: any) {
      uni.showToast({
        title: error?.msg || '取消订单失败',
        icon: 'none',
        duration: 2000,
      })
    }
  }

  /**
   * 完成订单
   * @param id 订单ID
   */
  const completeOrder = async (id: number): Promise<void> => {
    try {
      await confirmReservation(id)
      await getReservationListData()
      uni.showToast({
        title: '完成订单成功',
        icon: 'success',
        duration: 2000,
      })
    } catch (error: any) {
      uni.showToast({
        title: error?.msg || '完成订单失败',
        icon: 'none',
        duration: 2000,
      })
    }
  }

  //  获取预约列表数据
  const getReservationListData = async (): Promise<void> => {
    const data = await getReservationList({
      appointStatus: currentOrderType.value,
      pageNum: pageNum.value,
      pageSize: 10,
    })
    if (!data?.length) {
      uni.showToast({ title: '暂无更多订单数据', icon: 'none', duration: 2000 })
      return
    }
    if (pageNum.value === 1) {
      reservationList.value = data
    } else {
      reservationList.value = reservationList.value?.concat(data)
    }
  }

  const triggered = ref(true) // 触发状态
  const freshing = ref(false)
  const isOpenRefresh = ref(true) // 是否开启下拉
  const pageNum = ref(1) // 页码

  // 下拉刷新
  const onRefresh = (): void => {
    if (freshing.value) {
      return
    }
    freshing.value = true
    if (!triggered.value) {
      triggered.value = true
    }
    pageNum.value = 1
    setTimeout(() => {
      triggered.value = false
      freshing.value = false
      getReservationListData()
    }, 500)
  }

  // 刷新复位
  const onRestore = (): void => {
    triggered.value = false
  }

  //  上拉加载
  const onReachScollBottom = (): void => {
    pageNum.value++
    getReservationListData()
  }

  // 订单类型
  const orderList: orderListType[] = [
    {
      title: '全部',
      type: '',
    },
    {
      title: '待服务',
      type: 'pending',
    },
    {
      title: '已服务',
      type: 'used',
    },
    {
      title: '过期/取消',
      type: 'canceled',
    },
  ]

  onShow(async () => {
    if (userInfoState.userInfo) {
      await getReservationListData()
    }
  })
</script>

<style>
  .box {
    width: 100%;
    height: 100vh;
    background: #f5f6f8;
  }

  .content {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .my-top {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 750rpx;
    height: 418rpx;
    overflow: hidden;
  }

  .banner {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 750rpx;
    height: 418rpx;
  }

  .title {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 88rpx;
    font-size: 40rpx;
    font-weight: 500;
    line-height: 88rpx;
    color: #fff;
    text-align: center;
  }

  .info {
    position: absolute;
    z-index: 10;
    width: 100%;
  }

  .user-info {
    align-items: center;
    width: 100%;
    padding-left: 54rpx;
    margin-top: 16rpx;
  }

  .avatar {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
  }

  .avatar-img {
    width: 128rpx;
    height: 128rpx;
  }

  .user-name {
    margin-left: 36rpx;
    font-size: 40rpx;
    font-weight: 500;
    color: #fff;
  }

  .main {
    position: relative;
    top: 348rpx;
    z-index: 10;
    height: 75vh;
    padding: 0 24rpx;
    overflow: hidden;
    overflow-y: auto;
  }

  .order-box {
    width: 100%;
    height: 75vh;
    padding: 40rpx 32rpx 0;
    background: #fff;
    border-radius: 16rpx;
  }

  .order-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .order-type-list {
    align-items: center;
    justify-content: space-between;
    margin-top: 32rpx;
  }

  .order-type-item {
    width: 148rpx;
    height: 60rpx;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 60rpx;
    color: #333;
    text-align: center;
    background: #f2f2f2;
    border-radius: 32rpx;
  }

  .active {
    font-weight: 500;
    color: #fff;
    background: #fe9393;
  }

  .order-lsit {
    height: 63.5vh;
    overflow-y: auto;
    background: #fff;
  }

  .order-lsit-item {
    padding: 32rpx 0;
    box-shadow: inset 0rpx -1rpx 0rpx 0rpx rgb(210 210 210 / 50%);
  }

  .order-info-image {
    position: relative;
    width: 192rpx;
    height: 192rpx;
  }

  .order-info-image image {
    width: 192rpx;
    height: 192rpx;
  }

  .order-info-type {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 192rpx;
    height: 40rpx;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 40rpx;
    color: #fff;
    text-align: center;
    background-color: rgb(0 0 0 / 50%);
  }

  .order-info-desc {
    margin-left: 12rpx;
  }

  .desc-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
  }

  .desc-price {
    padding-left: 10rpx;
    margin-top: 8rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #999;
  }

  .desc-time {
    padding-left: 10rpx;
    margin-top: 8rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #999;
  }

  .button-box {
    align-items: center;
    justify-content: center;
    margin-top: 36rpx;
  }

  .button-box-item {
    align-items: center;
    justify-content: center;
    width: 312rpx;
    height: 64rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #666;
    border-radius: 32rpx;
  }

  .no-data {
    align-items: center;
    margin-top: 25%;
  }

  .data-image {
    width: 174rpx;
    height: 158rpx;
  }

  .no-data text {
    margin-top: 20rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: #999;
  }
</style>
