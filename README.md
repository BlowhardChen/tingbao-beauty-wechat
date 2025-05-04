### 项目简介

项目使用uniapp搭建，以vue3 + ts + pinia + uni-ui开发，配合husky,prettier,eslint,cz-g,lint-staged等规范项目。

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
pnpm run dev:h5

# 微信小程序
pnpm dev:mp-weixin
然后使用微信开发者工具打开dist/dev/mp-weixi目录即可
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
│   ├── styles                # 全局样式
│   ├── types                 # 类型声明文件
│   ├── utils                 # 全局方法
│   ├── App.vue               # 入口页面
│   ├── manifest.json         # 配置appid等打包信息
│   ├── pages.json            # 配置页面路由等页面类信息
│   ├── uni.scss              # uni-app 内置的常用样式变量
│   └── main.ts               # Vue初始化入口文件
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
