<template>
	<div v-if="isShowBreadcrumb" class="layout-navbars-breadcrumb">
		<SvgIcon
			class="layout-navbars-breadcrumb-icon"
			:size="16"
			:name="themeConfig.isCollapse ? 'ele-Expand' : 'ele-Fold'"
			@click="onThemeConfigChange"
		></SvgIcon>
		<el-breadcrumb :separator-icon="ArrowRight" class="layout-navbars-breadcrumb-content">
			<el-breadcrumb-item v-for="(v, i) in state.breadcrumbList" :key="i">
				<span v-if="i === state.breadcrumbList.length - 1" class="layout-navbars-breadcrumb-span">
					<SvgIcon :name="v.meta.icon" class="layout-navbars-breadcrumb-iconfont" v-if="themeConfig.isBreadcrumbIcon" />
					<span>{{ v.meta.title }}</span>
				</span>
				<a v-else @click.prevent="onBreadcrumbClick(v)">
					<SvgIcon :name="v.meta.icon" class="layout-navbars-breadcrumb-iconfont" v-if="themeConfig.isBreadcrumbIcon" />
					<span>{{ v.meta.title }}</span>
				</a>
			</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script setup lang="js">
	import { useThemeConfig } from '@/stores/themeConfig';
	import { useRoutesList } from '@/stores/routesList';
	import { storeToRefs } from 'pinia';
	import { ArrowRight } from '@element-plus/icons-vue';
	import { reactive, computed, onMounted } from 'vue';
	import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

	const stores = useRoutesList();
	const { routesList } = storeToRefs(stores);
	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);

	// 当前路由 route 与 路由实例
	const route = useRoute();
	const router = useRouter();

	// 展开/收起左侧菜单点击
	const onThemeConfigChange = () => {
		themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
	};

	// 定义变量
	const state = reactive({
		breadcrumbList: [],
		routeSplit: [],
		routeSplitCurPath: '',
		routeSplitCurIndex: 1,
	});

	// 动态设置经典、横向布局不显示
	const isShowBreadcrumb = computed(() => {
		initRouteSplit(route.path);
		const { layout, isBreadcrumb } = themeConfig.value;
		if (layout === 'classic' || layout === 'transverse') return false;
		else return isBreadcrumb ? true : false;
	});
	// 处理面包屑数据
	const getBreadcrumbList = (arr) => {
		arr.forEach((item) => {
			if (state.routeSplitCurPath === item.path) {
				state.breadcrumbList.push(item);
				++state.routeSplitCurIndex;
				state.routeSplitCurPath += `/${state.routeSplit[state.routeSplitCurIndex]}`;
				if (item.children) getBreadcrumbList(item.children);
			}
		});
	};
	// 当前路由字符串切割成数组，并删除第一项空内
	const initRouteSplit = (path) => {
		state.routeSplit = path.split('/');
		state.routeSplit.shift();
		state.routeSplitCurPath = `/${state.routeSplit[0]}`;
		state.routeSplitCurIndex = 0;
		state.breadcrumbList = [routesList.value[0]];
		// 将/path 用/分割
		getBreadcrumbList(routesList.value);
		if (route.name === 'home' || (route.name === 'notFound' && state.breadcrumbList.length > 1)) state.breadcrumbList.shift();
	};

	const onBreadcrumbClick = (v) => {
		const { redirect, path } = v;
		if (redirect) router.push(redirect);
		else router.push(path);
	};
	// 页面加载时
	onMounted(() => {
		initRouteSplit(route.path);
	});
	//路由更新时
	onBeforeRouteUpdate((to) => {
		initRouteSplit(to.path);
	});
</script>

<style scoped lang="scss">
	.layout-navbars-breadcrumb {
		flex: 1;
		height: inherit;
		display: flex;
		align-items: center;

		.layout-navbars-breadcrumb-content {
			flex: 1;
			height: inherit;
			display: flex;
			align-items: center;
		}

		.layout-navbars-breadcrumb-icon {
			cursor: pointer;
			font-size: 18px;
			color: var(--next-bg-topBarColor);
			height: 100%;
			width: 40px;
			opacity: 0.8;

			&:hover {
				opacity: 1;
			}
		}

		.layout-navbars-breadcrumb-span {
			display: flex;
			opacity: 0.7;
			color: var(--next-bg-topBarColor);
		}

		.layout-navbars-breadcrumb-iconfont {
			font-size: 14px;
			margin-right: 5px;
		}

		:deep(.el-breadcrumb__separator) {
			opacity: 0.7;
			color: var(--next-bg-topBarColor);
		}

		:deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) {
			font-weight: unset !important;
			color: var(--next-bg-topBarColor);

			&:hover {
				color: var(--el-color-primary) !important;
			}
		}
	}
</style>
