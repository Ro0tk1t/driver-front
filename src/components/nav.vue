<script setup lang="ts">
import { ref, inject } from "vue"
import { useRouter } from 'vue-router'
import { ElImage, ElMessage } from 'element-plus'
import { Icon } from '@iconify/vue';

const router = useRouter()
const g = inject('g')
const activeIndex = ref('1')
const loc = localStorage
function handleSelect(key: string, keyPath: string) {
  console.log(key, keyPath);
}
const goIndex = () => {
  router.push('/')
}
const goLogin = () => {
  router.push('/login')
}
const goRegister = () => {
  router.push('/register')
}
const goHelp = () => {
  router.push('/help')
}
const setZHCN = () => {
  g.language = 'zh-cn'
}
const setEN = () => {
  g.language = 'en'
}
const logout = () => {
  //localStorage.removeItem('token')
  ElMessage({ message: `${g.user} 退出成功, 欢迎下次再来`, type: 'success' })
  g.token = ''
  g.user = ''
  loc.token = ''
  window.location.reload()
}
</script>

<template>
  <el-menu :default-active="activeIndex" class="nev-menu" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <el-menu-item index="1">
      <RouterLink to="/">首页</RouterLink>
    </el-menu-item>
    <el-menu-item index="2">帮助</el-menu-item>
    <el-sub-menu index="3">
      <template #title>
        <Icon icon="ooui:language" />
      </template>
      <el-menu-item index="3-1" @click="setZHCN">中文</el-menu-item>
      <el-menu-item index="3-2" @click="setEN">English</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="4">
      <!-- <Icon icon="ls:dark" />
        <Icon icon="material-symbols:dark-mode-outline" /> -->
      <Icon icon="line-md:light-dark-loop" />
    </el-menu-item>
    <el-menu-item index="5">
      <Icon icon="pajamas:github" />
    </el-menu-item>
    <el-menu-item index="6">
      <p v-if="!loc.token" @click="goLogin">登录</p>
      <p v-else @click="logout">登出</p>
    </el-menu-item>
    <el-menu-item index="7">
      <p v-if="!loc.token">
        <RouterLink to="register">注册</RouterLink>
      </p>
      <p v-else>
        <RouterLink to="user">用户</RouterLink>
      </p>
    </el-menu-item>
  </el-menu>
</template>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(2) {
  margin-right: auto;
}
</style>