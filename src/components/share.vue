<script setup lang="js">
import {useRoute} from "vue-router"
let params = useRoute().params
let query = useRoute().query

console.log(params)
console.log(query)
</script>
<template>
{{  $route.params }}
{{  $route.query }}
</template>