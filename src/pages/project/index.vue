<template>
  <view class="box">
    <view class="content">
      <view class="top flex-row" :style="{ marginTop: safeAreaInsets!.top + 'px' }">
        <view class="top-icon">
          <image src="@/static/project/icon-back.png" mode="scaleToFill" @click="backView" />
        </view>
        <view class="title">
          <text>服务项目</text>
        </view>
        <view class="top-icon"> </view>
      </view>
      <view class="search">
        <view class="search-box flex-row">
          <image src="@/static/project/icon-search.png" mode="scaleToFill" />
          <input type="text" placeholder="请输入搜索内容" />
        </view>
      </view>
      <!-- main -->
      <view class="project-box flex-row">
        <view class="sidebar flex-col">
          <view
            class="sidebar-item"
            v-for="(item, index) in sidebarList"
            :key="index"
            :class="{ active: item.type === currentSelectSidebar }"
            @click="selectSidebar(item)"
          >
            <view class="type" v-if="item.type === currentSelectSidebar"></view>
            <text>{{ item.title }}</text>
          </view>
        </view>
        <view class="project-list">
          <view
            class="project-list-item flex-row"
            v-for="(item, index) in projectList"
            :key="index"
          >
            <view class="project-list-item-image">
              <image :src="item.imageUrl" mode="scaleToFill" />
            </view>
            <view class="project-list-item-info">
              <view class="title">
                <text>【{{ item.name }}】{{ item.activity }}</text>
              </view>
              <view class="time">
                <text>约{{ item.durationMinutes }}分钟</text>
              </view>
              <view class="project-select flex-row">
                <view class="price">
                  <text style="font-size: 28rpx">￥</text>
                  <text>{{ item.price }}</text>
                  <text
                    style="font-size: 28rpx"
                    v-if="(item.price === 128 && item.name === '手部延长甲') || item.price === 158"
                    >起</text
                  >
                </view>
                <view class="button" @click="selectProject(item)">选择</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import { getProjectList } from '@/services/project'
  import type { ProjectList } from '@/types/project'
  import { onShow } from '@dcloudio/uni-app'
  import { ref } from 'vue'

  // 获取屏幕边界到安全区域距离
  const { safeAreaInsets } = uni.getSystemInfoSync()

  // 返回
  const backView = () => {
    uni.navigateBack()
  }

  const currentSelectSidebar = ref<string | number>('')
  const projectList = ref<ProjectList[]>([])
  // 选择侧边栏
  const selectSidebar = (item: { title: string; type: string | number }) => {
    currentSelectSidebar.value = item.type
    getProjectListData(item.type)
  }

  // 选择项目
  const selectProject = (project: ProjectList): void => {
    uni.navigateBack({
      delta: 1,
      success: () => {
        uni.$emit('selectProject', {
          project,
        })
      },
    })
  }

  // 获取项目列表
  const getProjectListData = async (appointTypeId?: number | string): Promise<void> => {
    try {
      const data = await getProjectList(appointTypeId)
      projectList.value = data
    } catch (error) {}
  }

  const sidebarList = [
    {
      title: '全部',
      type: '',
    },
    {
      title: '手部美甲',
      type: 1,
    },
    {
      title: '美睫',
      type: 2,
    },
    {
      title: '足部美甲',
      type: 3,
    },
  ]

  onShow(async () => {
    await getProjectListData()
  })
</script>
<style lang="scss" scoped>
  .box {
    height: 100vh;
    padding-bottom: 28rpx;
    background-color: #fff;
  }

  .content {
    position: relative;
    height: auto;
    overflow: hidden;
  }

  .top {
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 88rpx;
    padding: 0 20rpx;
    background-color: #fff;
  }

  .top-icon {
    width: 52rpx;
    height: 52rpx;
  }

  .top-icon image {
    width: 52rpx;
    height: 52rpx;
  }

  .title {
    font-size: 40rpx;
    font-weight: 500;
    color: #000;
  }

  .search {
    padding: 24rpx 32rpx;
  }

  .search-box {
    align-items: center;
    height: 64rpx;
    background: #f4f4f4;
    border-radius: 32rpx;
  }

  .search-box image {
    width: 32rpx;
    height: 32rpx;
    padding: 0 24rpx;
  }

  .search-box input {
    flex: 1;
  }

  .project-box {
    height: 82vh;
    background: #fff;
  }

  .sidebar {
    width: 148rpx;
    height: 100%;
    background: #f5f5f5;
    border-radius: 24rpx 0rpx 0rpx;
  }

  .sidebar-item {
    position: relative;
    height: 108rpx;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 108rpx;
    color: #333;
    text-align: center;
  }

  .active {
    font-size: 28rpx;
    font-weight: 500;
    color: #fe9393;
    background: #fff;
  }

  .type {
    position: absolute;
    top: 50%;
    left: 0;
    width: 6rpx;
    height: 40rpx;
    background: #fe9393;
    transform: translateY(-50%);
  }

  .project-list {
    flex: 1;
    height: 82vh;
    overflow-y: auto;
    background-color: #fff;
  }

  .project-list-item {
    align-items: center;
    padding: 0 16rpx;
    margin-bottom: 16rpx;
  }

  .project-list-item-image {
    width: 192rpx;
    height: 192rpx;
  }

  .project-list-item-image image {
    width: 192rpx;
    height: 192rpx;
  }

  .project-list-item-info {
    flex: 1;
    padding: 0 16rpx;
  }

  .title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
  }

  .time {
    padding-left: 10rpx;
    margin-top: 16rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #999;
  }

  .project-select {
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
  }

  .price {
    padding-left: 10rpx;
    font-size: 56rpx;
    font-weight: 500;
    color: #ff7b7b;
  }

  .button {
    width: 112rpx;
    height: 40rpx;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 40rpx;
    color: #fff;
    text-align: center;
    background: #fe9393;
    border-radius: 24rpx;
  }
</style>
