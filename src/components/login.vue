<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, reactive, inject, getCurrentInstance } from 'vue'
import { FormInstance, ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import axios from 'axios';

const router = useRouter()
const g = inject('g')
const form = reactive({
  email: '',
  password: '',
});

const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入正确的邮箱地址' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
});
const loginFormRef = ref<FormInstance>();

const { proxy } = getCurrentInstance()
const submitForm = () => {
  console.log(proxy.serverAddr)
  if (!loginFormRef.value) return;
  loginFormRef.value.validate((valid) => {
    if (valid) {
      console.log('表单验证成功');
      console.log(form)
      axios.post('/login', form,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ).then(res => {
        console.log(res.data.message)
        g.token = JSON.parse(res.data.message).token
        g.userInfo = JSON.parse(JSON.parse(res.data.message).user)
        g.user = form.email
        localStorage.setItem('user', g.userInfo.name)
        localStorage.setItem('email', form.email)
        localStorage.setItem('phone', g.userInfo.phone)
        localStorage.setItem('token', g.token)
        ElMessage({ message: `欢迎 ${form.email}`, type: 'success' })
        console.log(g)
        // 不能刷新导航条
        //router.push('/')
        window.location.replace('/files')
      }).catch((err) => {
        ElMessageBox.alert(err.response.data.message, 'error', {
          confirmButtonText: 'OK',
          callback: (action: Action) => {
            ElMessage({
              type: 'error',
              message: `登录失败`,
              //message: `action: ${action}`,
            })
          },
        })
      })
    } else {
      console.log('表单验证失败');
    }
  });
};

</script>

<template>
  <div class="login-container">
    <el-form :model="form" :rules="rules" ref="loginFormRef" label-width="auto" class="login-form">
      <h2 class="title">登录</h2>
      <el-form-item prop="email" label="email">
        <el-input v-model="form.email" placeholder="邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item prop="password" label="password">
        <el-input v-model="form.password" type="password" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item label-width="130px">
        <el-button type="primary" bg @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #f5f7fa;
}

.login-form {
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}
</style>