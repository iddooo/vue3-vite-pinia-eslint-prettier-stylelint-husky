<template>
	<el-header class="layout-header">
		<TopBar />
		<TagsView v-if="setShowTagsView" />
	</el-header>
</template>

<script setup lang="js">
	import { computed, defineAsyncComponent } from 'vue';
	import { useThemeConfig } from '@/stores/themeConfig.js';
	import { storeToRefs } from 'pinia';
	// 引入组件
	const TopBar = defineAsyncComponent(() => import('@/layout/topBar/index.vue'));
	const TagsView = defineAsyncComponent(() => import('@/layout/tagsview/index.vue'));

	// 定义变量内容
	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);

	// 是否显示 tagsView
	const setShowTagsView = computed(() => {
		let { layout, isTagsview } = themeConfig.value;
		return layout !== 'classic' && isTagsview;
	});
</script>

<style scoped lang="scss"></style>
