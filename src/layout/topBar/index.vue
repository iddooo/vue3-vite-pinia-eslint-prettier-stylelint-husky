<template>
	<div class="layout-topbars-index">
		<!-- logo breadcrumb setting user -->
		<Breadcrumb />
	</div>
</template>

<script setup lang="js">
	import { defineAsyncComponent } from 'vue';

	const Breadcrumb = defineAsyncComponent(() => import('@/layout/topBar/breadcrumb.vue'));
</script>

<style scoped lang="scss">
	.layout-topbars-index {
		height: 50px;
		display: flex;
		align-items: center;
		background: var(--next-bg-topBar);
		border-bottom: 1px solid var(--next-border-color-light);
	}
</style>
