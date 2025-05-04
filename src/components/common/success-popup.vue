<template>
  <!-- 通用中间弹窗 -->
  <view class="popup-box">
    <view class="popup-content flex-col">
      <view class="popup-content-top flex-col">
        <view class="icon">
          <image src="@/static/project/icon-success.png" alt="" />
        </view>
        <view class="msg">
          <text> 预约成功 </text>
        </view>
      </view>
      <view class="divider"></view>
      <view class="popup-bottom flex-row">
        <view class="btn-left" @click="clickLeftBtn">
          <text>关闭</text>
        </view>
        <view class="cross"></view>
        <view class="btn-right" @click="clickRightBtn">
          <text>查看</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  const emits = defineEmits(['leftBtn', 'rightBtn'])

  const clickLeftBtn = (): void => {
    emits('leftBtn')
  }

  const clickRightBtn = (): void => {
    emits('rightBtn')
  }
</script>

<style lang="scss" scoped>
  .popup-box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 750rpx;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
  }

  .popup-content {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2000;
    width: 480rpx;
    height: 308rpx;
    background: #fff;
    border-radius: 16rpx;
    box-shadow: 0rpx -4rpx 12rpx 0rpx rgb(0 0 0 / 10%);
    transform: translate(-50%, -50%);
  }

  .popup-content-top {
    align-items: center;
    justify-content: center;
  }

  .popup-content {
    align-items: center;
  }

  .icon {
    width: 64rpx;
    height: 64rpx;
    margin-top: 48rpx;
  }

  .icon image {
    width: 64rpx;
    height: 64rpx;
  }

  .msg {
    margin: 32rpx 0;
    font-size: 40rpx;
    font-weight: 500;
    color: #000;
  }

  .divider {
    width: 480rpx;
    height: 2rpx;
    background: #ededed;
  }

  .popup-bottom {
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 102rpx;
  }

  .btn-left {
    flex: 1;
    font-size: 36rpx;
    font-weight: 500;
    color: #000;
    text-align: center;
  }

  .btn-right {
    flex: 1;
    font-size: 36rpx;
    font-weight: 500;
    color: #08ae3c;
    text-align: center;
  }

  .cross {
    width: 2rpx;
    height: 32rpx;
    border: 1rpx solid #ededed;
  }
</style>
