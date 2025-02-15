## 使用全局变量的方法

### 1. 使用 provide/inject

在上级组件里使用 ` provide('var_name', 'var_value') `

然后在下级组件里就可以使用 ` inject('var_name') ` 获取到变量的值了

但是有个缺点就是, 变量是只读的, 无法直接修改。解决办法是使用引用类型, 如：` const obj = reactive({var: 'value'}); provide('obj', obj); `，
那么下级组件修改变量的值，也会影响上级组件，如：` const obj = inject('obj'); obj.var = 'new_value'; `

### 2. 使用` globalProperties `
在 main.ts 里添加：` app.config.globalProperties.$var_name = 'var_value'; `

然后在其他组件里就可以使用
``` ts
const { proxy } = getCurrentInstance()
console.log(proxy.$var_name)
```
缺点也是同上，同样通过引用类型达到修改的目的

### 3. 使用 localStorage

### 4. 使用 vuex 的 store

### 5. 使用 axios 的 defaults 存储全局变量，注意不要影响到后续的 ajax 请求

### 6. 封装一个函数


## 如何保持登录状态
a. 使用localStorage
1. 登录成功后，将用户信息保存到本地，比如 localStorage，或者 sessionStorage，或者 cookie。
2. 在页面加载时，检查本地存储中是否有用户信息，如果有，则自动登录。
3. 在退出登录时，清除本地存储中的用户信息。
登录状态的保持，主要分为两种方式：
1. 服务端状态保持：通过服务端保存用户的登录状态，在每次请求时携带用户信息，服务端根据用户信息判断用户是否登录。这种方式在服务端实现比较简单，但是客户端需要发送更多的请求，并且服务端需要处理更多的请求。
2. 客户端状态保持：通过客户端保存用户的登录状态，在每次请求时携带用户信息，客户端根据用户信息判断用户是否登录。这种方式在客户端实现比较简单，但是服务端需要处理更多的请求，并且客户端需要发送更多的请求。
3. 服务端状态保持：通过服务端保存用户的登录状态，在每次请求时携带用户信息，服务端根据用户信息判断用户是否登录。这种方式在服务端实现比较简单，但是客户端需要发送更多的请求。
4. 双向状态保持：通过服务端保存用户的登录状态，在每次请求时携带用户信息，同时客户端也保存用户的登录状态，客户端根据服务端返回的用户信息判断用户是否登录。这种方式既在客户端也服务端实现比较简单，但是需要客户端和服务端同时处理更多的请求。
1. 登录状态保持：通过服务端保存用户的登录状态，在每次请求时携带用户信息，同时客户端也保存用户的登录状态，客户端根据服务端返回的用户信息判断用户是否登录。这种方式既在客户端也服务端实现比较简单，但是需要客户端和服务端同时处理更多的请求。

b. 使用vuex
1. 状态管理：Vuex是一个专为Vue应用程序开发的状态管理库，它可以将应用的多个组件之间的数据进行集中管理，并实现组件之间的数据共享。通过使用Vuex，我们可以将复杂的状态管理问题转化为简单的数据流问题，从而简化开发过程。
2. 优点：
- 集中管理状态：Vuex将应用的多个组件之间的数据进行集中管理，可以避免组件之间的数据传递问题，简化开发过程。
- 数据共享：Vuex提供了全局的store，使得多个组件可以共享同一个数据源，实现数据共享。
- 状态管理：Vuex提供了一系列的API，如getter、mutation、action等，用于管理状态的变化，实现状态的更新和修改。
3. 使用步骤：
1. 安装：npm install vuex
2. 创建vuex实例：在main.ts中引入Vuex，并创建一个Vuex实例，并挂载到Vue的根实例上。
```javascript
import { createStore } from 'vuex'

const store = createStore({})
const app = createApp(App)
app.use(store)
app.mount('#app')
```
2. 定义状态：在Vuex中，状态通常被定义为一个对象，该对象包含了多个属性，每个属性代表一个状态。
```javascript
const state = {}
const mutations = {}
const actions = {}
const getters = {}
const store = createStore({})
```

## 图片缓存


## element-plus 的通知和弹窗不能正确显示

需先导入相关样式
```javascript
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
```

## 取消 el-upload 自带的上传功能，自行实现更丰富的如分片上传等功能
因为自带的上传功能不能通用axios的相关配置，要认证上传、配置上传地址、消息头等很麻烦，所以自行完成上传功能更符合业务逻辑

设置`action`为#， `auto-upload` 为 `false`，增加 `on-change="handleUploadFunc"` 事件，在拖拽或打开文件时执行自定义上传逻辑，就可以配合axios一起使用了，其中handleUploadFunc函数功能根据具体需求实现。 如我自行实现的分片上传并在完成后通知服务端合并分片的功能：
``` js
const onFileChange: UploadProps['onChange'] = async (file, fileList) => {
    uploadingList.value.push({ ...file })

    let filename = file.name
    const fsize = file.size || 0
    const chunkNum = Math.ceil(fsize / chunkSize)
    if (chunkNum > 0) {
        var failed = false
        for (let i = 0; i < chunkNum; i++) {
            const chunk = file.raw?.slice(i * chunkSize, Math.min((i + 1) * chunkSize, fsize))
            try {
                const result = await uploadChunk(chunk, filename, i)
                if (result.status != 200) {
                    failed = true
                }
            } catch (err) {
                failed = true
                console.log(err)
            }
        }
        if (!failed) {
            const data = {
                filename: paths + filename,
                chunkIndex: chunkNum,
            }
            const ret = await axios.post('/uploadOver', data, { headers: headers.value })
            if (ret.status != 200) {
                ElMessage.error("文件上传失败")
            }
        }
    }
}
```

## 在 el-table 里字段长度太长，导致页面全是过长的字符串

官方文档说可以设置 `show-overflow-tooltip` 属性, 但是实际上只是增加一个tooltip显示，我们想要的是增加tooltip显示完整字符串的同时，表格里只截取显示原始字符串前面一段没超最大显示量的字符,并末尾追加省略号或其他符号等表示没显示完全。

经实践后，需要去掉 `show-overflow-tooltip` 属性，自行实现截取显示和鼠标悬停后气泡里显示完整字符串的功能：
``` html
<el-table-column prop="name" label="文件名" min-width="280">
    <template #default="scope">
        <!-- tips悬浮提示 -->
        <el-tooltip :content="scope.row.name">
            {{ scope.row.name.length > 30 ? scope.row.name.substring(0, 30) + " ..." : scope.row.name }}
        </el-tooltip>
    </template>
</el-table-column>
```


## 暗黑模式切换

跟着[官方的教程](https://element-plus.org/zh-CN/guide/dark-mode.html)没效果，不知道哪里出问题了。

实践后发现这样做比较方便：
1. 在 `main.ts` 里引入样式：
```javascript
import 'element-plus/dist/index.css'; // 默认样式
import 'element-plus/theme-chalk/dark/css-vars.css';
```

2. 在 `App.vue` 里设置 `isDark` 属性，加个button或图标控制黑白模式切换：
```javascript
<template>
  <div>
    <el-button @click="toggleDarkMode">切换黑暗模式</el-button>
    <el-card class="box-card">
      <div>黑暗模式</div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  const classList = document.documentElement.classList;
  if (isDark.value) {
    classList.add('dark');
  } else {
    classList.remove('dark');
  }
};
</script>
```