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
                :src="'/static/my/avatar.png'"
                referrer="no-referrer|origin|unsafe-url"
                mode="scaleToFill"
              />
            </view>
            <view class="user-name" @click="goLogin">
              <text>{{
                userInfoState.userInfo?.name ? userInfoState.userInfo.name : '请登录'
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
            :refresher-enabled="isOpenRefresh"
            :refresher-triggered="triggered"
            :refresher-threshold="100"
            @refresherrefresh="onRefresh"
            @refresherrestore="onRestore"
            @scrolltolower="onReachScollBottom"
          >
            <view class="order-lsit-item">
              <view class="order-info flex-row">
                <view class="order-info-image">
                  <image
                    class="avatar-img"
                    :src="'/static/my/image.png'"
                    referrer="no-referrer|origin|unsafe-url"
                    mode="scaleToFill"
                  />
                  <view class="order-info-type">
                    <text>待服务</text>
                  </view>
                </view>
                <view class="order-info-desc">
                  <view class="desc-title"><text>【手部本甲】本甲任意款式</text></view>
                  <view class="desc-price"><text>价格: ￥99</text></view>
                  <view class="desc-time"><text>创建时间: 2025-04-30 11:20:00</text></view>
                  <view class="desc-time"><text>预约时间: 2025-05-01 11:00:00</text></view>
                  <view class="desc-time"><text>取消时间: 2025-05-01 11:00:00</text></view>
                  <view class="desc-time"><text>过期时间: 2025-05-01 11:00:00</text></view>
                </view>
              </view>
              <view class="button-box flex-row">
                <view
                  class="button-box-item flex-row"
                  style="margin-right: 14rpx; border: 1rpx solid #e3e3e3"
                >
                  <text>取消预约</text>
                </view>
                <view class="button-box-item flex-row" style="color: #ff7575; background: #ffecec"
                  ><text>完成服务</text></view
                >
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useUserInfoStore } from '@/stores'
  import { onShow } from '@dcloudio/uni-app'
  import { login } from '../../service/user'

  interface orderListType {
    title: string
    type: string
  }

  const userInfoState = useUserInfoStore()

  // 获取屏幕边界到安全区域距离
  const { safeAreaInsets } = uni.getSystemInfoSync()

  const userInfo = ref({
    avatar: '',
    name: '',
  })

  const goLogin = () => {
    uni.login({
      provider: 'weixin', // 微信登录
      success: (res) => {
        if (res.code) {
          // 获取到的临时登录凭证
          console.log('微信登录成功，获取到的 code:', res.code)
          // 发送 code 到后台获取 openid 和 session_key
          login(res.code)
            .then((response) => {
              console.log('登录成功', response)
              uni.showToast({
                title: '登录成功',
                icon: 'success',
              })
            })
            .catch((error) => {
              console.error('登录失败', error)
              uni.showToast({
                title: '登录失败',
                icon: 'none',
              })
            })
        } else {
          uni.showToast({
            title: '登录失败',
            icon: 'none',
          })
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '登录失败',
          icon: 'none',
        })
      },
    })
  }

  const currentOrderType = ref('all')

  const changeOrderType = (item: orderListType) => {
    currentOrderType.value = item.type
  }

  const triggered = ref(true) // 触发状态
  const freshing = ref(false)
  const isOpenRefresh = ref(true) // 是否开启下拉
  const pageSize = ref(0) // 页码

  // 下拉刷新
  const onRefresh = (): void => {
    if (freshing.value) {
      return
    }
    freshing.value = true
    if (!triggered.value) {
      triggered.value = true
    }
    pageSize.value = 0
    setTimeout(() => {
      triggered.value = false
      freshing.value = false
    }, 500)
  }

  // 刷新复位
  const onRestore = (): void => {
    triggered.value = false
  }

  //  上拉加载
  const onReachScollBottom = (): void => {
    pageSize.value++
  }

  // 订单类型
  const orderList: orderListType[] = [
    {
      title: '全部',
      type: 'all',
    },
    {
      title: '待服务',
      type: '',
    },
    {
      title: '已服务',
      type: '',
    },
    {
      title: '过期/取消',
      type: '',
    },
  ]

  onShow(() => {
    console.log('onShow', userInfoState)
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
</style>
