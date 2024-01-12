<template>
	<el-config-provider>
		<!-- <router-view /> -->
		<Layout />
	</el-config-provider>
</template>

<script setup lang="js">
import { defineAsyncComponent } from 'vue';
// 引入组件
const Layout = defineAsyncComponent(() => import('@/layout/index.vue'));
</script>

<style scoped lang="scss"></style>
