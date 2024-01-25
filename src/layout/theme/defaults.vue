<template>
	<el-container class="layout-container">
		<LayoutAside />
		<el-container>
			<LayoutHeader />
			<el-main>
				<ParentView />
			</el-main>
			<el-footer>Footer</el-footer>
		</el-container>
	</el-container>
</template>

<script setup lang="js">
	import { defineAsyncComponent } from 'vue';

	const LayoutAside = defineAsyncComponent(() => import('@/layout/component/LayoutAside.vue'));
	const LayoutHeader = defineAsyncComponent(() => import('@/layout/component/LayoutHeader.vue'));
	const ParentView = defineAsyncComponent(() => import('@/layout/routerView/parent.vue'));
</script>

<style scoped lang="scss"></style>
