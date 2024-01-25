<template>
	<component :is="layouts[themeConfig.layout]" />
</template>

<script setup lang="js">
	import { defineAsyncComponent } from 'vue';
	import { useThemeConfig } from '@/stores/themeConfig';
	import { storeToRefs } from 'pinia';
	import mittBus from '@/utils/mitt';
	import { Local } from '@/utils/storage';

	// 引入组件
	const layouts = {
		defaults: defineAsyncComponent(() => import('@/layout/theme/defaults.vue')),
		classic: defineAsyncComponent(() => import('@/layout/theme/classic.vue')),
		columns: defineAsyncComponent(() => import('@/layout/theme/columns.vue')),
		transverse: defineAsyncComponent(() => import('@/layout/theme/transverse.vue')),
	};
	// 定义变量内容
	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);

	// 窗口大小改变
	const onLayoutResize = () => {
		if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout);
		const clientWidth = document.body.clientWidth;
		// 手机不支持切换布局 只支持defaults
		if (clientWidth < 1000) {
			themeConfig.value.isCollapse = false;
			mittBus.emit('layoutMobileResize', {
				layout: 'defaults',
				clientWidth,
			});
		} else {
			mittBus.emit('layoutMobileResize', {
				layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
				clientWidth,
			});
		}
	};
	// 页面加载前
	onBeforeMount(() => {
		onLayoutResize();
		window.addEventListener('resize', onLayoutResize);
	});
	// 页面卸载时
	onUnmounted(() => {
		window.removeEventListener('resize', onLayoutResize);
	});
</script>

<style scoped lang="scss"></style>
