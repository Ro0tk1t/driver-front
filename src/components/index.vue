<script setup lang="ts">
import { StarFilled } from '@element-plus/icons-vue'
</script>

<template>
  <el-carousel :interval="3000" type="card" height="400px">
    <el-carousel-item v-for="item in 5" :key="item">
      <h3>{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>

  <div>
    <span>一款在线网盘. </span>
    <el-divider content-position="left">Rabindranath Tagore</el-divider>
    <span>
      My wishes are fools, they shout across thy song, my Master. Let me but
      listen.
    </span>
    <el-divider>
      <el-icon><star-filled /></el-icon>
    </el-divider>
    <span>快来下载使用吧 .</span>
    <el-divider content-position="right">Rabindranath Tagore</el-divider>
  </div>
</template>

<style scoped>
.el-carousel {
  margin-top: 130px;
  margin-bottom: 50px;
}

.el-carousel__item {
  color: #1f52b1;
  background-color: #fff;
}
</style>