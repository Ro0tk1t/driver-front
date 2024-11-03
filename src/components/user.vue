<script setup lang="ts">

const loc = localStorage
</script>

<template>  
    <div class="user-container">
        <div class="user-info">
            <div class="user-avatar">
                <!-- TODO: use Service worker -->
                <img src="https://avatars.githubusercontent.com/u/1019875?v=4" alt="">
            </div>
            <div class="user-name">
                用户名：<p>{{ loc.getItem('user')}}</p>
            </div>
        </div>
    </div>
</template>