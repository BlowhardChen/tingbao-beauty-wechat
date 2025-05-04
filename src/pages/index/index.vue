<template>
  <view class="box">
    <view class="content flex-col">
      <!-- banner -->
      <view class="banner">
        <image src="@/static/index/banner.png" mode="scaleToFill" />
      </view>
      <!-- 美甲 -->
      <view class="projiect flex-col">
        <view class="projiect-title">
          <image src="@/static/index/title-1.png" mode="scaleToFill" />
        </view>
        <view class="projiect-content">
          <view class="projiect-content-item flex-row">
            <view class="image">
              <image src="@/static/index/image1.png" mode="scaleToFill" />
            </view>
            <view class="desc" style="border-radius: 0rpx 80rpx 0rpx 0rpx">
              <view class="desc-title">
                <text>手部本甲</text>
              </view>
              <view class="desc-title2">
                <text>(任意款式)</text>
              </view>
              <view class="price">
                <text style="font-size: 28rpx">￥</text>
                <text>99</text>
              </view>
              <view class="button flex-row" @click="clickBookNow"> <text>立即预约</text> </view>
            </view>
          </view>
          <view class="projiect-content-item flex-row" style="margin-top: 32rpx">
            <view class="desc" style="border-radius: 0rpx 0rpx 0rpx 80rpx">
              <view class="desc-title">
                <text>手部延长甲</text>
              </view>
              <view class="desc-title2">
                <text>(任意款式+半贴甲片)</text>
              </view>
              <view class="price">
                <text style="font-size: 28rpx">￥</text>
                <text>199</text>
              </view>
              <view class="button flex-row" @click="clickBookNow"><text>立即预约</text> </view>
            </view>
            <view class="image">
              <image src="@/static/index/image2.png" mode="scaleToFill" />
            </view>
          </view>
        </view>
      </view>
      <!-- 美睫  -->
      <view class="projiect flex-col" style="background: #fff">
        <view class="projiect-title">
          <image src="@/static/index/title-2.png" mode="scaleToFill" />
        </view>
        <view class="projiect-content">
          <view class="projiect-content-item flex-row">
            <view class="image">
              <image src="@/static/index/image1.png" mode="scaleToFill" />
            </view>
            <view
              class="desc"
              style="border: 2rpx solid #eee; border-radius: 0rpx 80rpx 0rpx 0rpx"
            >
              <view class="desc-title">
                <text>单根美睫</text>
              </view>
              <view class="desc-title2">
                <text>(不限根数+下睫毛)</text>
              </view>
              <view class="price">
                <text style="font-size: 28rpx">￥</text>
                <text>99</text>
              </view>
              <view class="button flex-row" @click="clickBookNow"> <text>立即预约</text> </view>
            </view>
          </view>
          <view class="projiect-content-item flex-row" style="margin-top: 32rpx">
            <view
              class="desc"
              style="border: 2rpx solid #eee; border-radius: 0rpx 0rpx 0rpx 80rpx"
            >
              <view class="desc-title">
                <text>款式美睫</text>
              </view>
              <view class="desc-title2">
                <text>(漫画/仙子/泰式)</text>
              </view>
              <view class="price">
                <text style="font-size: 28rpx">￥</text>
                <text>199</text>
              </view>
              <view class="button flex-row" @click="clickBookNow"><text>立即预约</text> </view>
            </view>
            <view class="image">
              <image src="@/static/index/image2.png" mode="scaleToFill" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { onShow } from '@dcloudio/uni-app'

  const clickBookNow = (): void => {
    uni.setStorageSync('projectInfo', JSON.stringify({}))
    uni.switchTab({ url: '/pages/reservation/index' })
  }

  onShow(() => {
    console.log('onShow')
  })
</script>

<style lang="scss" scoped>
  .box {
    padding-bottom: 28rpx;
    background: #f5f6f8;
  }

  .content {
    align-items: center;
    justify-content: center;
    height: auto;
    overflow-y: auto;
  }

  .banner {
    width: 100%;
    height: 580rpx;

    > image {
      width: 100%;
      height: 100%;
    }
  }

  .projiect {
    align-items: center;
    width: 100%;
    height: auto;
    padding: 64rpx 0 80rpx;
    background: #fff0f0;
  }

  .projiect-title {
    width: 508rpx;
    height: 60rpx;

    > image {
      width: 100%;
      height: 100%;
    }
  }

  .projiect-content {
    width: 100%;
    height: auto;
    padding: 0 24rpx;
    margin-top: 68rpx;
  }

  .projiect-content-item {
    justify-content: center;
    width: 100%;
  }

  .image {
    width: 360rpx;
    height: 280rpx;

    > image {
      width: 100%;
      height: 100%;
    }
  }

  .desc {
    width: 334rpx;
    height: 280rpx;
    padding: 28rpx 0 0 48rpx;
    background: #fff;
  }

  .desc-title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
  }

  .desc-title2 {
    font-size: 24rpx;
    font-weight: 400;
    color: #333;
  }

  .price {
    font-size: 56rpx;
    font-weight: bold;
    color: #fe9393;
  }

  .button {
    justify-content: center;
    width: 160rpx;
    height: 48rpx;
    margin-top: 12rpx;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 48rpx;
    color: #fff;
    letter-spacing: 1px;
    background: #fe9393;
    border-radius: 24rpx;
  }
</style>
