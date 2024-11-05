<script setup lang="ts">
import { ElImage, ElMessage } from 'element-plus'

const help = () => {
    ElMessage({message: "TODO", type: "warning"})
}
</script>

<template>
    <div style="display: flex; justify-content: center; align-items: center; height: 100px; width: 100%;">
        <el-text size="large" class="mx-1" type="primary" @click="help">Todo !</el-text>
    </div>
</template>