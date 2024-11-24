<script setup lang="ts">
import { computed, ref, provide, reactive } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

import Nav from './components/nav.vue'
import { isDark, toggleDark } from './config'
//import HelloWorld from './components/HelloWorld.vue'
//import Index from './components/index.vue'
import Footer from './components/footer.vue'

const g = reactive({
  language: 'zh-cn',
  user: '',
  userInfo: {},
  token: '',
  theme: 'light',
})
provide('g', g)
const locale = computed(() => (g.language === 'zh-cn' ? zhCn : en))

const calc = (v: number) => {
  return v + 'px'
}
</script>

<template>
  <!-- <UseDark v-slot="{ isDark, toggleDark }"> -->
    <div class="HMF">
      <el-container>
        <el-header>
          <Nav></Nav>
        </el-header>
        <el-main height="700px">
          <!-- <Index></Index>
        <router-view></router-view> -->
          <RouterView></RouterView>
        </el-main>
        <el-footer>
          <Footer></Footer>
        </el-footer>
      </el-container>
    </div>
    <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" /> -->
  <!-- </UseDark> -->
</template>

<style scoped>
.el-container {
  min-height: 100vh;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
