module.exports = {
  root: true,
  // 继承某些已有的规则
  extends: [
    'stylelint-config-standard', // 配置 stylelint 拓展插件
    'stylelint-config-html/vue', // 配置 vue 中 template 样式格式化
    'stylelint-config-standard-scss', // 配置 stylelint scss 插件
    'stylelint-config-recommended-vue/scss', // 配置 vue 中 scss 样式格式化
    'stylelint-config-recess-order', // 配置 stylelint css 属性书写顺序插件,
  ],
  overrides: [
    // 扫描 .vue/html 文件中的 <style> 标签内的样式
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }], // 忽略 rpx 单位
    // 忽略的未知的类型选择器
    'selector-type-no-unknown': [
      true,
      { ignoreTypes: ['page', 'navigator', 'scroll-view', 'swiper', 'scroll-view'] },
    ],

    // 忽略指定的@
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['function', 'if', 'each', 'include', 'mixin', 'for'],
      },
    ],
    'no-duplicate-selectors': null, // 允许出现重复的选择器
    'no-empty-source': null, // 禁止空源码
    'no-descending-specificity': null, // 选择器优先级的问题
    'font-family-no-missing-generic-family-keyword': null, // font-family 属性值是否包含通用字体关键字
    // 在注释后和第一个嵌套规则之前忽略空行
    'rule-empty-line-before': ['always', { except: ['after-single-line-comment', 'first-nested'] }],
    // 忽略属性费用覆盖
    'declaration-block-no-shorthand-property-overrides': null,
    // 忽略未知属性 lines
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['lines'],
      },
    ],
    // 允许使用媒体特性名称  min-device-pixel-ratio
    'media-feature-name-no-unknown': [
      true,
      {
        ignoreMediaFeatureNames: 'min-device-pixel-ratio',
      },
    ],
    // 忽略未知伪元素
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'],
      },
    ],
  },

  ignoreFiles: [
    'node_modules/**/*',
    'build/**/*',
    'src/uni_modules/**/*',
    'src/js_sdk/**',
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    'src/androidPrivacy.json',
  ],
  quoteProps: 'consistent',
}
