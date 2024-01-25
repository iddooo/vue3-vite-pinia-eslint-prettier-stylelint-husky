<template>
	<div class="h-screen">
		<el-aside class="layout-aside" :class="setCollapseStyle">
			<Logo v-if="setShowLogo" />
			<el-scrollbar class="flex-auto">
				<MenuList :menuList="state.menuList" />
			</el-scrollbar>
		</el-aside>
	</div>
</template>

<script setup lang="js">
	import { computed, defineAsyncComponent, onBeforeMount, reactive, watch } from 'vue';
	import { useRoutesList } from '@/stores/routesList';
	import { useThemeConfig } from '@/stores/themeConfig';
	import { storeToRefs } from 'pinia';
	import mittBus from '@/utils/mitt';
	// 组件
	const MenuList = defineAsyncComponent(() => import('@/layout/menu/menuList.vue'));
	const Logo = defineAsyncComponent(() => import('@/layout/logo/index.vue'));

	/** menulist */
	// 定义变量
	const state = reactive({
		menuList: [],
		clientWidth: 0,
	});
	const storesRoutesList = useRoutesList();
	const { routesList } = storeToRefs(storesRoutesList);

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
	/** aside */
	const storesThemeConfig = useThemeConfig();
	const { layout, themeConfig, menuBar } = storeToRefs(storesThemeConfig);

	const setCollapseStyle = computed(() => {
		let { isCollapse } = themeConfig.value;
		const asideBrTheme = ['#FFFFFF', '#FFF', '#fff', '#ffffff'];
		const asideBrColor = asideBrTheme.includes(menuBar) ? 'layout-el-aside-br-color' : '';
		// 判断是否是手机端
		if (state.clientWidth < 1000) {
			if (isCollapse) {
				// 弹窗添加蒙层
				document.body.setAttribute('class', 'el-popup-parent--hidden');
				const layoutEle = document.querySelector('.layout-container');
				const modeDivs = document.createElement('div');
				modeDivs.setAttribute('class', 'layout-aside-mobile-mode');
				layoutEle.appendChild(modeDivs);
				// 添加蒙层点击事件
				modeDivs.addEventListener('click', closeLayoutAsideMobileMode);
				return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-open'];
			} else {
				//关闭蒙版
				closeLayoutAsideMobileMode();
				// 菜单隐藏
				return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-close'];
			}
		} else {
			if (layout === 'columns' || layout === 'classic') {
				// 分栏布局、经典布局，菜单收起时宽度给 1px，防止切换动画消失
				if (isCollapse) return [asideBrColor, 'layout-aside-pc-1'];
				else return [asideBrColor, 'layout-aside-pc-220'];
			} else {
				// 其它布局给 64px
				if (isCollapse) return [asideBrColor, 'layout-aside-pc-64'];
				else return [asideBrColor, 'layout-aside-pc-220'];
			}
		}
	});
	// 关闭移动端蒙版
	const closeLayoutAsideMobileMode = () => {
		const el = document.querySelector('.layout-aside-mobile-mode');
		el?.setAttribute('style', 'animation: error-img-two 0.3s');
		setTimeout(() => {
			el?.parentNode?.removeChild(el);
		}, 300);
		const clientWidth = document.body.clientWidth;
		if (clientWidth < 1000) themeConfig.value.isCollapse = false;
		document.body.setAttribute('class', '');
	};
	// 设置菜单导航是否固定（移动端）
	const initMenuFixed = (clientWidth) => {
		state.clientWidth = clientWidth;
	};
	// 页面加载前
	onBeforeMount(() => {
		initMenuFixed(document.body.clientWidth);
		setFilterRoutes();
		// 监听窗口大小改变时(适配移动端)
		mittBus.on('layoutMobileResize', (res) => {
			initMenuFixed(res.clientWidth);
			closeLayoutAsideMobileMode();
		});
	});
	// 设置显示/隐藏 logo
	const setShowLogo = computed(() => {
		const { layout, isShowLogo } = themeConfig.value;
		return (isShowLogo && layout === 'defaults') || (isShowLogo && layout === 'columns');
	});
</script>

<style lang="scss"></style>
