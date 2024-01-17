<template>
	<MenuList :menuList="state.menuList" />
</template>

<script setup lang="js">
	import { defineAsyncComponent, reactive } from 'vue';

	const MenuList = defineAsyncComponent(() => import('./menu/menuList.vue'));

	// 定义变量
	const state = reactive({
		menuList: [
			{
				name: 1,
				children: [
					{
						name: '1-1',
						children: [
							{
								name: '1-1-1',
							},
						],
					},
					{ name: '1-2' },
				],
			},
			{
				name: 2,
			},
		],
	});
</script>

<style scoped lang="scss">
	.container {
		background-color: pink;
		font-size: large;
	}

	ul {
		list-style: none;
		font-size: 12px;
		color: #333;
		line-height: 48px;

		a {
			text-decoration: none;
			color: #333;
		}

		li:nth-of-type(n) {
			background-color: #ccc;
		}

		li:nth-of-type(2n) {
			background-color: #eee;
		}
	}
</style>
