<template>
	<el-header class="layout-header">
		<TopBar />
		<!-- Tagviews -->
	</el-header>
</template>

<script setup lang="js">
	import { defineAsyncComponent } from 'vue';

	const TopBar = defineAsyncComponent(() => import('@/layout/topBar/index.vue'));
</script>

<style scoped lang="scss"></style>
