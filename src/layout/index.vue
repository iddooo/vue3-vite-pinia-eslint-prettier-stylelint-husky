<template>
	<MenuList :menuList="state.menuList" />
	<ParentView />
</template>

<script setup lang="js">
	import { defineAsyncComponent, onMounted, reactive, watch } from 'vue';
	import { useRoutesList } from '@/stores/routesList';
	import { useThemeConfig } from '@/stores/themeConfig';
	import { storeToRefs } from 'pinia';
	const MenuList = defineAsyncComponent(() => import('./menu/menuList.vue'));
	const ParentView = defineAsyncComponent(() => import('./routerView/parent.vue'));

	// 定义变量
	const state = reactive({
		menuList: [
			// {
			// 	name: 1,
			// 	children: [
			// 		{
			// 			name: '1-1',
			// 			children: [
			// 				{
			// 					name: '1-1-1',
			// 				},
			// 			],
			// 		},
			// 		{ name: '1-2' },
			// 	],
			// },
			// {
			// 	name: 2,
			// },
		],
	});

	const storesRoutesList = useRoutesList();
	const { routesList } = storeToRefs(storesRoutesList);

	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);
	// 设置/过滤路由（非静态路由/是否显示在菜单中）
	const setFilterRoutes = () => {
		let { layout } = themeConfig.value;
		if (layout == 'classic') {
			state.menuList = delClassicChildren(filterRoutesFun(routesList.value));
		} else {
			state.menuList = filterRoutesFun(routesList.value);
		}
	};
	// 路由过滤递归函数
	const filterRoutesFun = (arr) => {
		return arr
			.filter((item) => !item.meta.isHide)
			.map((item) => {
				item = Object.assign({}, item);
				if (item.children) item.children = filterRoutesFun(item.children);
				return item;
			});
	};
	// classic布局中菜单 删除路由中的children
	const delClassicChildren = (arr) => {
		arr.map((v) => {
			if (v.children) delete v.children;
		});
		return arr;
	};

	// 监听用户权限切换，用于演示 `权限管理 -> 前端控制 -> 页面权限` 权限切换不生效
	watch(
		() => routesList.value,
		() => {
			setFilterRoutes();
		}
	);
	//页面加载
	onMounted(() => {
		setFilterRoutes();
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
