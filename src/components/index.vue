<script setup lang="ts">
import { StarFilled } from '@element-plus/icons-vue'
</script>

<template>
  <el-carousel :interval="3000" type="card" height="354px">
    <el-carousel-item v-for="item in 3" :key="item">
      <!-- <h5>{{ item }}</h5> -->
       <!--快  安全  简单-->
      <el-image :src="`feat${item}.webp`"></el-image>
    </el-carousel-item>
  </el-carousel>

  <div>
    <span>一款在线网盘. </span>
    <el-divider content-position="left">>>>>>>>>>>>>>>></el-divider>
    <span>
       快速         安全          简单易用
    </span>
    <el-divider>
      <el-icon><star-filled /></el-icon>
      <el-icon><star-filled /></el-icon>
      <el-icon><star-filled /></el-icon>
      <el-icon><star-filled /></el-icon>
      <el-icon><star-filled /></el-icon>
    </el-divider>
    <span>快来使用吧 .</span>
    <el-divider content-position="right"><<<<<<<<<<<<<<<<</el-divider>
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