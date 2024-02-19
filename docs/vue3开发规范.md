
# Vue3 基础规范

# 1.1、项目命名
全部采用小写方式， 以中划线分隔。

正例：`smart-admin`
反例：`mall_management-system / mallManagementSystem`

# 1.2、目录、文件命名
目录、文件名 均以 小写方式， 以中划线分隔。

正例：`/head-search/`、`/shopping-car/`、`smart-logo.png`、`role-form.vue`
反例：`/headSearch/`、 `smartLogo.png`、 `RoleForm.vue`

# 1.3、单引号、双引号、分号
html中、vue的template 中 标签属性 使用 双引号
所有js中的 字符串 使用 单引号
所有js中的代码行换行要用 分号

# Vue3 组合式 API规范

# 2.1、 使用setup语法糖
组件必须使用 setup 语法糖
全局都要使用setup语法糖

# 2.2、组合式Composition API 规范
组件内必须使用模块化思想，把代码 进行 拆分；
参照 vue3官方文档对于 Composition Api的理解： 更灵活的代码组织 (opens new window)，组合式Api，即 Composition API 解决的是让 相互关联的代码在一起，以更方便的组织代码
__EX:__  

<script setup>
// 各种需要导入
import xxxxx;
import xxxxx;
import xxxxx;

// -------- 定义组件属性和对外暴露的方法、以及抛出的事件 --------

// -------- 表格查询的 变量和方法 --------

// -------- 批量操作的 变量和方法 --------

// -------- 表单的 变量和方法 --------

</script>

# 2.3 模板引用变量Ref
对于vue3中的模板引用ref，即 ref 是作为一个特殊的 attribute,使用 ref方法，参数为空 进行声明变量。变量必须以 Ref为结尾。template中的ref 也必须以 Ref 为结尾。
__EX:__  
<input ref="inputRef">
const inputRef = ref();

# 2.4 变量和方法的注释
在使用Composition Api进行代码编写时，我们有效的组织了代码，但是由于Composition Api变量和方法会写到一起，这时候注释就变得很有必要 要求：

<!-- 变量都加上注释,方法必须加上注释 比如
  // 查询 公告 默认值
  const queryFormState = {
    noticeTypeId: undefined, //分类
    keywords: '', //标题、作者、来源
    documentNumber: '', //文号
  };
  // 查询 公告 请求表单
  const queryForm = reactive({ ...queryFormState }); -->

  **PS: 该规范不做强制要求， 但是关键变量及函数方法必须写明注释**

# Vue3 组件规范

# 3.1、 组件文件名
组件文件名应该为 pascal-case 格式
正例：
components
|- my-component.vue

反例：
components
|- myComponent.vue
|- MyComponent.vue

# 3.2、 父子组件文件名
和父组件紧密耦合的子组件应该以父组件名作为前缀命名 正例：

components
|- todo-list.vue
|- todo-list-item.vue
|- todo-list-item-button.vue
|- user-profile-options.vue （完整单词）
反例：

components
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
|- UProfOpts.vue （使用了缩写）

# 3.3、 组件属性
组件属性较多，应该主动换行。

正例：

<MyComponent foo="a" bar="b" baz="c"
    foo="a" bar="b" baz="c"
    foo="a" bar="b" baz="c"
 />
反例：

<MyComponent foo="a" bar="b" baz="c" foo="a" bar="b" baz="c" foo="a" bar="b" baz="c" foo="a" bar="b" baz="c"/>

# 3.4、 模板中表达式
组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。复杂表达式会让你的模板变得不那么声明式。我们应该尽量描述应该出现的是什么，而非如何计算那个值。而且计算属性和方法使得代码可以重用。

正例：

<template>
  <p>{{ normalizedFullName }}</p>
</template>

// 复杂表达式移入一个计算属性
computed: {
  normalizedFullName: function () {
​    return this.fullName.split(' ').map(function (word) {
​      return word[0].toUpperCase() + word.slice(1)
​    }).join(' ')
  }
}
反例：

<template>
  <p>
       {{
          fullName.split(' ').map(function (word) {
​             return word[0].toUpperCase() + word.slice(1)
           }).join(' ')
        }}
  </p>
</template>

# 3.5、 标签顺序
单文件组件应该总是让标签顺序保持为 <template> 、<script>、 <style>

# Vue Router 规范
# 4.1、 页面传参
页面跳转，例如 A 页面跳转到 B 页面，需要将 A 页面的数据传递到 B 页面，推荐使用 路由参数进行传参，即 {query:param}

正例：

let id = ' 123';
this.$router.push({ name: 'userCenter', query: { id: id } });

# 4.2、 path 和 name 命名规范
path kebab-case命名规范（尽量与vue文件的目录结构保持一致，因为目录、文件名都是kebab-case，这样很方便找到对应的文件）
path 必须以 / 开头，即使是children里的path也要以 / 开头。如下示例
经常有这样的场景：某个页面有问题，要立刻找到这个vue文件，如果不用以/开头，path为parent和children组成的，可能经常需要在router文件里搜索多次才能找到，而如果以/开头，则能立刻搜索到对应的组件
name 命名规范采用KebabCase([大驼峰])命名规范且和component组件名保持一致！（因为要保持keep-alive特性，keep-alive按照component的name进行缓存，所以两者必须高度保持一致）
正例
<!-- export const reload = [
  {
    path: '/reload',
    name: 'reload',
    component: Main,
    meta: {
      title: '动态加载',
      icon: 'icon'
    },

    children: [
      {
        path: '/reload/smart-reload-list',
        name: 'SmartReloadList',
        meta: {
          title: 'SmartReload',
          childrenPoints: [
            {
              title: '查询',
              name: 'smart-reload-search'
            },
            {
              title: '执行reload',
              name: 'smart-reload-update'
            },
            {
              title: '查看执行结果',
              name: 'smart-reload-result'
            }
          ]
        },
        component: () =>
          import('@/views/reload/smart-reload/smart-reload-list.vue')
      }
    ]
  }
]; -->

# Vue 项目规范
# 5.1、 目录规范
src                               源码目录
|-- api                              所有api接口
|-- assets                           静态资源，images, icons, styles等
|-- components                       公用组件
|-- config                           配置信息
|-- constants                        常量信息，项目所有Enum, 全局常量等
|-- directives                       自定义指令
|-- i18n                             国际化
|-- lib                              外部引用的插件存放及修改文件
|-- mock                             模拟接口，临时存放
|-- plugins                          插件，全局使用
|-- router                           路由，统一管理
|-- store                            vuex/pinia, 统一管理
|-- theme                            自定义样式主题
|-- utils                            工具类
|-- views                            视图目录
|   |-- role                             role模块名
|   |-- |-- role-list.vue                    role列表页面
|   |-- |-- role-add.vue                     role新建页面
|   |-- |-- role-update.vue                  role更新页面
|   |-- |-- index.scss                      role模块样式
|   |-- |-- components                      role模块通用组件文件夹
|   |-- employee                         employee模块

# 5.2、 api 目录
api文件要以api为结尾，比如 employee-api.js、login-api.js，方便查找
api文件必须导出对象必须以Api为结尾，如：employeeApi、noticeApi
api中以一个对象将方法包裹
api中的注释，必须和后端 swagger 文档保持一致，同时保留后端作者

# 5.3、 assets 目录
assets 为静态资源，里面存放 images, styles, icons 等静态资源，静态资源命名格式为 kebab-case

|assets
|-- icons
|-- images
|   |-- background-color.png
|   |-- upload-header.png
|-- styles

# 5.4、 components 目录
此目录应按照组件进行目录划分，目录命名为 kebab-case，一个组件必须一个单独的目录 ；
目的：

一个组件一个目录是为了将来组件的扩展，因为这是整个项目公用的组件
组件入口必须为 index.vue，原因也是因为这是整个项目公用的组件
举例如下：

|components
|-- error-log
|   |-- index.vue
|   |-- index.less
|-- markdown-editor
|   |-- index.vue
|   |-- index.js
|-- kebab-case

# 5.5、 constants 目录
此目录存放项目所有常量和枚举
具体要求：

常量文件要以 const 为结尾，比如login-const.js、file-const.js
变量要：大写下划线，比如 LOGIN_RESULT_ENUM、LOGIN_SUCCESS、LOGIN_FAIL
如果是 枚举，变量必须以 ENUM为结尾，如：LOGIN_RESULT_ENUM、CODE_FRONT_COMPONENT_ENUM
目录结构：

|constants
|-- index-const.js
|-- role-const.js
|-- employee-const.js

# 5.6、 router 与 store 目录
这两个目录一定要将业务进行拆分，不能放到一个 js 文件里。

router 尽量按照 views 中的结构保持一致

store 按照业务进行拆分不同的 js 文件

# 5.7、 views 目录
目录要求，按照模块划分，其中具体文件名要求如下：

如果是列表页面，要以list为结尾，如role-list.vue、cache-list.vue
如果是 表单页面，要以 form为结尾，如 role-form.vue、notice-add-form.vue
如果是 modal弹窗，要以 modal为结尾，如 表单弹窗 role-form-modal.vue，详情 role-detail-modal.vue
如果是 drawer 抽屉页面，要同上以 Drawer为结尾
|-- views                                        视图目录
|   |-- role                                     role模块名
|   |   |-- role-list.vue                        role列表页面
|   |   |-- role-add-form.vue                    role新建页面
|   |   |-- role-update-form-modal.vue           role更新页面
|   |   |-- index.scss                           role模块样式
|   |   |-- components                           role模块通用组件文件夹
|   |   |   |-- role-title-modal.vue             role弹出框组件
|   |-- employee                                 employee模块
|   |-- behavior-log                             行为日志log模块
|   |-- code-generator                           代码生成器模块
