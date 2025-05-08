<script setup lang="ts">
  import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
  import { useProjectInfoStore, useUserInfoStore } from '@/stores'
  import { login } from './services/user'

  const userInfoStore = useUserInfoStore()
  const projectInfoStore = useProjectInfoStore()
  onLaunch(() => {
    if (!userInfoStore.userInfo) {
      uni.login({
        provider: 'weixin',
        success: async (res) => {
          if (!res.code) {
            return showLoginFail('微信登录失败，请稍后重试')
          }
          try {
            // 使用 code 调用后台登录接口
            const data = await login(res.code)
            useUserInfoStore().setToken(data.token)
            useUserInfoStore().setUserInfoData(data.userinfo)
          } catch (error: any) {
            showLoginFail(error?.msg || '登录失败，请稍后重试')
          }
        },
        fail: (err) => {
          showLoginFail('微信登录失败，请检查网络或稍后重试')
        },
      })
    }
    console.log('onLaunch')
  })

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
