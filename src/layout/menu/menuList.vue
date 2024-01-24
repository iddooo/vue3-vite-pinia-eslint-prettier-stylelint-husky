<template>
	<!-- router 启用 vue-router 模式。以 index 作为 path 进行路由跳转  -->
	<el-menu router v-bind="state">
		<template v-for="item in menuList">
			<el-sub-menu :index="item.path" :key="item.path" v-if="item.children && item.children.length > 0">
				<template #title>
					<SvgIcon :name="item.meta.icon" />
					<span>menu title {{ item.name }}</span>
				</template>
				<subItem :chils="item.children" />
			</el-sub-menu>
			<template v-else>
				<el-menu-item :index="item.path" :key="item.path">
					<SvgIcon :name="item.meta.icon" />
					<template #title>{{ item.name }}</template>
				</el-menu-item>
			</template>
		</template>
	</el-menu>
</template>

<script setup lang="js">
	import { computed, reactive, defineAsyncComponent, watch } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useThemeConfig } from '@/stores/themeConfig.js';

	const subItem = defineAsyncComponent(() => import('./subItem.vue'));

	// 父组件传过来的值:menuList
	// props是响应式的，并且会在传入新的 props 时同步更新。如果你解构了 props 对象，解构出的变量将会丢失响应性。因此我们推荐通过 props.xxx 的形式来使用其中的 props。
	const props = defineProps({
		menuList: {
			type: Array,
			default: () => [],
		},
	});
	// 获取响应式的menuList
	// 通过computed返回一个只读的响应式 ref 对象。
	const menuList = computed(() => {
		return props.menuList;
	});

	// 定义内容变量
	// 获取该store的方法式直接调用该回调函数
	// 解构store中的数据，和vue的props一样会丢失响应性,利用pinia的storeToRefs函数，将state中的数据变为了响应式的
	const storesConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesConfig);

	// 定义变量
	const state = reactive({
		// 默认激活菜单的 index
		defaultActive: '',
		// 是否水平折叠收起菜单 isCollapse
		isCollapse: false,
		// 是否只保持一个子菜单的展开 isUniqueOpened
		uniqueOpened: true,
		// 菜单展示模式  layout:transverse -> horizontal
		mode: 'vertical',
		// 菜单的背景颜色 layout:transverse ? topBar : menuBar
		backgroundColor: 'transparent',
		//菜单默认字体颜色 layout:transverse ? topBarColor :menuBarColor
		textColor: '#303133',
		// 活动菜单项的字体颜色 themeConfig.value.primary
		activeTextColor: '#409EFF',
	});
	// 监听 themeConfig 配置文件的变化，更新菜单 state数据
	watch(
		() => [
			themeConfig.value.primary,
			themeConfig.value.layout,
			themeConfig.value.isCollapse,
			themeConfig.value.isUniqueOpened,
			themeConfig.value.menuBar,
			themeConfig.value.menuBarColor,
			themeConfig.value.topBar,
			themeConfig.value.topBarColor,
		],
		([primary, layout, isCollapse, isUniqueOpened, menuBar, menuBarColor, topBar, topBarColor]) => {
			document.body.clientWidth <= 100 ? (state.isCollapse = false) : (state.isCollapse = isCollapse);

			state.uniqueOpened = isUniqueOpened;
			state.activeTextColor = primary;

			if (layout === 'transverse') {
				state.mode = 'horizontal';
				state.backgroundColor = topBar;
				state.textColor = topBarColor;
			} else {
				state.mode = 'vertical';
				state.backgroundColor = menuBar;
				state.textColor = menuBarColor;
			}
		},
		{ immediate: true }
	);
</script>

<style scoped lang="scss">
	--text-color {
		color: blue;
	}
</style>
