<script setup lang="ts">
  import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
  import { useProjectInfoStore } from '@/stores'

  const projectInfoStore = useProjectInfoStore()
  onLaunch(() => {
    console.log('onLaunch')
  })

  onShow(() => {
    console.log('onShow')
  })

  onHide(() => {
    console.log('onHide')
    projectInfoStore.removeProjectInfoData()
  })
</script>

<style lang="scss">
  /* 每个页面公共css */
  view,
  navigator,
  input,
  scroll-view {
    box-sizing: border-box;
  }

  button::after {
    border: none;
  }

  image {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }

  // 超出省略
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }
</style>
