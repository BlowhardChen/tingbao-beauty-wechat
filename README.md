### 项目简介

项目使用uniapp搭建，以vue3 + ts + pinia + uni-ui开发，配合husky,prettier,eslint,cz-g,lint-staged等规范项目，可发布安卓和 ios。

地图使用高德地图叠加谷歌卫星影像，部分页面使用 5+app 的原生 plus 对象

### 运行程序

1. 安装依赖

```shell
# npm
npm i --registry=https://registry.npmmirror.com

# pnpm
pnpm i --registry=https://registry.npmmirror.com
```

2. 运行程序

```shell
# H5端
npm run dev:h5

# App端
需 HbuilderX 工具，运行 - 运行到手机或模拟器
```

每次提交代码前需执行下述步骤

- **Lint：**

```text
# eslint 检测代码
pnpm lint:eslint

# prettier 格式化代码
pnpm lint:prettier

# stylelint 格式化样式
pnpm lint:stylelint
```

- **commit：**

```text
# 提交代码（提交前会自动执行 lint:lint-staged 命令）
pnpm commit
```

### 代码提交

```text

 # 拉取代码后在远程创建自己的开发分支 如 dev_cwy

```

### 工程结构解析

```
├── .husky                    # Git Hooks
├── .vscode                   # VS Code 插件 + 设置
├── dist                      # 打包文件夹（可删除重新打包）
├── components                # 全局组件
├── src/                      # 源代码
│   ├── assets                # 存放应用引用的本地静态资源的目录
│   ├── pages                 # 页面目录
│   ├── store                 # pinia 状态管理
│   ├── types                 # 类型声明文件
│   ├── utils                 # 全局方法
│   ├── components            # 全局组件
│   ├── App.vue               # 入口页面
│   ├── manifest.json         # 配置appid等打包信息
│   ├── pages.json            # 配置页面路由等页面类信息
│   ├── uni.scss              # uni-app 内置的常用样式变量
│   └── main.ts               # Vue初始化入口文件
├── styles                    # 全局样式
├── types                     # 类型声明文件
├── utils                     # 全局方法
├── .eslintrc.cjs             # eslint 配置
├── .prettierrc.json          # prettier 配置
├── .gitignore                # git 忽略文件
├── .stylelintrc.cjs          # stylelint 忽略文件
├── commitlint.config.cjs     # commitlint 配置
├── lint-staged.config.cjs    # lint-staged 配置
├── index.html                # H5端首页
├── package.json              # package.json 依赖
├── tsconfig.json             # typescript 配置
└── vite.config.ts            # vite 配置
```
