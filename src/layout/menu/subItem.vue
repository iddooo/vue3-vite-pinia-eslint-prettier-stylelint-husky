<template>
	<template v-for="item in chils">
		<el-sub-menu :index="item.path" :key="item.path" v-if="item.children && item.children.length > 0">
			<template #title>
				<span>icon todo</span>
				<span>menu title {{ item.name }}</span>
			</template>
			<subItem :chils="item.children"></subItem>
		</el-sub-menu>
		<template v-else>
			<el-menu-item :index="item.path" :key="item.path">
				<span>icon todo</span>
				<template #title>{{ item.name }}</template>
			</el-menu-item>
		</template>
	</template>
</template>

<script setup lang="js">
	import { computed } from 'vue';
	// 定义父组件传递过来的数据
	const props = defineProps({
		chils: Array,
		default: () => [],
	});

	const chils = computed(() => {
		return props.chils;
	});
</script>

<style scoped lang="scss"></style>
