<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue'
import { FormInstance, ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import axios from 'axios';

const { proxy } = getCurrentInstance()
console.log(proxy)
console.log(proxy.serverAddr)
//proxy.set("serverAddr", "hello")
//proxy.serverAddr = 'hello'
console.log(proxy.ownKeys)
const form = reactive({
    username: '',
    email: '',
    password: '',
    phone: '',
});
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名' },
        { min: 3, message: '用户名长度至少为3' }
    ],
    email: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '请输入正确的邮箱地址' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    phone: [
        { message: '请输入手机号' },
        //{type: 'number', message: '请输入正确的手机号'},
    ]
});

const registerFormRef = ref<FormInstance>();
const submit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            axios.post(proxy.serverAddr + '/register', form,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => {
                    if (res.status != 200 || res.data.code != 200) {
                        ElMessageBox.alert(res.data.msg, '注册失败', {
                            confirmButtonText: '确定',
                            type: 'error'
                        })
                    }
                    console.log(res.data)
                    if (res.data.code === 200){
                        ElMessage({message: '注册成功', type: 'success'})
                        setTimeout(function (){
                            window.location = '/login'
                        }, 888)
                    }
                }).catch(function (error) {
                    ElMessageBox.alert(error.response.data.message, 'Title', {
                        // if you want to disable its autofocus
                        // autofocus: false,
                        confirmButtonText: 'OK',
                        callback: (action: Action) => {
                            ElMessage({
                                type: 'error',
                                message: `注册失败`,
                                //message: `action: ${action}`,
                            })
                        },
                    })
                })
        } else {
            console.log('error submit!');
            return false;
        }
    })
}
const reset = () => {
    registerFormRef.value?.resetFields();
}
</script>

<template>
    <div class="register-container">
        <el-form ref="registerFormRef" :model="form" :rules="rules" label-width="auto" class="register-form">
            <el-form-item prop="username" label="username">
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="email">
                <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="phone" label="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label-width="90px">
                <el-button type="primary" bg @click="submit(registerFormRef)">注册</el-button>
                <el-button type="info" bg @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    background-color: #f5f7fa;
}

.register-form {
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