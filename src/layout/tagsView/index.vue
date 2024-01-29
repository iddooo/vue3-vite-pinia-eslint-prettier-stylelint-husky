<template>
	<div class="layout-tagsview" :class="{ 'layout-tagsview-shadow': getThemeConfig.layout === 'classic' }">
		<el-scrollbar ref="scrollbarRef" @wheel.prevent="onHandleScroll">
			<ul class="layout-tagsview-ul" ref="tagsUlRef">
				<li
					v-for="(v, k) in state.tagsViewList"
					:key="k"
					class="layout-tagsview-ul-li"
					:data-url="v.url"
					:class="{ 'is-active': isActive(v) }"
					@click="onTagsClick(v, k)"
					:ref="
						(el) => {
							if (el) tagsRefs[k] = el;
						}
					"
				>
					<i class="iconfont icon-xihuan layout-tagsview-ul-li-iconfont" v-if="isActive(v)"></i>
					<SvgIcon :name="v.meta.icon" v-if="!isActive(v) && getThemeConfig.isTagsviewIcon" class="pr5" />
					<span>{{ v.meta.title }}</span>
					<template v-if="isActive(v)">
						<SvgIcon
							name="ele-RefreshRight"
							class="ml5 layout-tagsview-ul-li-refresh"
							@click.stop="refreshCurrentTagsView($route.fullPath)"
						/>
						<SvgIcon
							name="ele-Close"
							class="layout-tagsview-ul-li-icon layout-icon-active"
							v-if="!v.meta.isAffix"
							@click.stop="closeCurrentTagsView(getThemeConfig.isShareTagsView ? v.path : v.url)"
						/>
					</template>
					<SvgIcon
						name="ele-Close"
						class="layout-tagsview-ul-li-icon layout-icon-three"
						v-if="!v.meta.isAffix"
						@click.stop="closeCurrentTagsView(getThemeConfig.isShareTagsView ? v.path : v.url)"
					/>
				</li>
			</ul>
		</el-scrollbar>
	</div>
</template>

<script setup lang="js">
	import { ref, reactive, computed, onMounted } from 'vue';
	import { useThemeConfig } from '@/stores/themeConfig';
	import { useTagsviewRoutes } from '@/stores/tagsViewRoutes';
	import { useKeepAliveNames } from '@/stores/keepAliveNames';
	import { useRoutesList } from '@/stores/routesList';
	import { storeToRefs } from 'pinia';
	import { useRoute, useRouter } from 'vue-router';
	import { isObjectValueEqual } from '@/utils/arrayOperation';
	import mittBus from '@/utils/mitt';
	import { Session } from '@/utils/storage';
	import Sortable from 'sortablejs';
	// 定义变量内容
	//ref 除了处理响应式数据，还可以用于访问组件中的dom元素，组件实例，以及存储任何需要在组件中进行状态管理的值。比如定时器
	const scrollbarRef = ref();
	const tagsRefs = ref([]);
	const tagsUlRef = ref();
	const state = reactive({
		routeActive: '',
		routePath: '',
		tagsViewList: [],
		tagsViewRoutesList: [],
		tagsRefsIndex: 0,
		sortable: '',
	});
	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);
	const storesTagsviewRoutes = useTagsviewRoutes();
	const { tagsViewRoutes } = storeToRefs(storesTagsviewRoutes);
	const storesKeepALiveNames = useKeepAliveNames();
	const storesRoutesList = useRoutesList();
	const { routesList } = storeToRefs(storesRoutesList);
	const route = useRoute();
	const router = useRouter();

	// 获取布局配置信息
	const getThemeConfig = computed(() => {
		return themeConfig.value;
	});

	// 鼠标滚轮滚动
	const onHandleScroll = (e) => {
		scrollbarRef.value.$refs.wrapRef.scrollLeft += e.wheelDelta / 4;
	};
	// 获取 tagsView 的下标：用于处理 tagsView 点击时的横向滚动
	const getTagsRefsIndex = (path) => {
		nextTick(async () => {
			// await 使用该写法，防止拿取不到 tagsViewList 列表数据不完整
			let tagsViewList = await state.tagsViewList;
			state.tagsRefsIndex = tagsViewList.findIndex((v) => {
				if (getThemeConfig.value.isShareTagsView) {
					return v.path === path;
				} else {
					return v.url === path;
				}
			});
			// 添加初始化横向滚动条移动到对应位置
			tagsViewmoveToCurrentTag();
		});
	};
	// tagsView 横向滚动
	const tagsViewmoveToCurrentTag = () => {
		nextTick(() => {
			if (tagsRefs.value.length <= 0) return false;
			// 当前 li 元素
			let liDom = tagsRefs.value[state.tagsRefsIndex];
			// 当前 li 元素下标
			let liIndex = state.tagsRefsIndex;
			// 当前 ul 下 li 元素总长度
			let liLength = tagsRefs.value.length;
			// 最前 li
			let liFirst = tagsRefs.value[0];
			// 最后 li
			let liLast = tagsRefs.value[tagsRefs.value.length - 1];
			// 当前滚动条的值
			let scrollRefs = scrollbarRef.value.$refs.wrapRef;

			// 当前滚动条滚动宽度
			let scrollS = scrollRefs.scrollWidth;
			// 当前滚动条偏移宽度
			let offsetW = scrollRefs.offsetWidth;
			// 当前滚动条偏移距离
			let scrollL = scrollRefs.scrollLeft;
			// 上一个 tags li dom
			let liPrevTag = tagsRefs.value[state.tagsRefsIndex - 1];
			// 下一个 tags li dom
			let liNextTag = tagsRefs.value[state.tagsRefsIndex + 1];
			// 上一个 tags li dom 的偏移距离
			let beforePrevL = 0;
			// 下一个 tags li dom 的偏移距离
			let afterNextL = 0;
			if (liDom === liFirst) {
				// 头部
				scrollRefs.scrollLeft = 0;
			} else if (liDom === liLast) {
				// 尾部
				scrollRefs.scrollLeft = scrollS - offsetW;
			} else {
				// 非头/尾部
				if (liIndex === 0) beforePrevL = liFirst.offsetLeft - 5;
				else beforePrevL = liPrevTag?.offsetLeft - 5;
				if (liIndex === liLength) afterNextL = liLast.offsetLeft + liLast.offsetWidth + 5;
				else afterNextL = liNextTag.offsetLeft + liNextTag.offsetWidth + 5;
				if (afterNextL > scrollL + offsetW) {
					scrollRefs.scrollLeft = afterNextL - offsetW;
				} else if (beforePrevL < scrollL) {
					scrollRefs.scrollLeft = beforePrevL;
				}
			}
			// 更新滚动条，防止不出现
			scrollbarRef.value.update();
		});
	};
	// tagsView 高亮项
	const isActive = (v) => {
		if (!getThemeConfig.value.isShareTagsView) {
			return v.url ? v.url === state.routeActive : v.path === state.routePath;
		} else {
			return v.path === state.routePath;
		}
	};
	// 当前的 tagsView 项点击时
	const onTagsClick = (v, k) => {
		state.tagsRefsIndex = k;
		router.push(v);
		// 分栏布局时，收起/展开菜单
		if (getThemeConfig.value.layout === 'columns') {
			const item = routesList.value.find((r) => r.path.indexOf(`/${v.path.split('/')[1]}`) > -1);
			!item.children ? (getThemeConfig.value.isCollapse = true) : (getThemeConfig.value.isCollapse = false);
		}
	};
	// 1、添加 tagsView：未设置隐藏（isHide）也添加到在 tagsView 中（可开启多标签详情，单标签详情）
	const addTagsView = async (to) => {
		let path = to?.meta?.isDynamic ? to.meta.isDynamicPath : to.path;

		// 普通路由：参数不同，开启多个 tagsview
		if (!getThemeConfig.value.isShareTagsView) await solveAddTagsView(to);
		else await singleAddTagsView(to);
		if (state.tagsViewList.some((v) => v.path === path)) {
			// 防止首次进入界面时(登录进入) tagsViewList 不存浏览器中
			addBrowserSetSession(state.tagsViewList);
			// console.log('==============tagsViewList 存在 return==================');
			return false;
		}
		let item = state.tagsViewRoutesList.find((v) => v.path === path);
		// console.log('tagsViewList 不存在， 添加tagsview item===',item)
		// item 不存在
		if (!item) return false;
		// item 为超连接
		if (item?.meta?.isLink && !item.meta.isIframe) return false;
		// 动态路由 xxx/:id/:name 获取params 否则 获取query
		if (to?.meta?.isDynamic) item.params = to?.params ? to?.params : route.params;
		else item.query = to?.query ? to?.query : route.query;
		// item url :item.path-params1params2
		item.url = setTagsViewHighlight(item);
		// 将item 添加到 pinia keepAliveNames cachedViews
		await storesKeepALiveNames.addCachedView(item);
		// 将item 添加到state.tagsViewList
		state.tagsViewList.push({ ...item });
		await addBrowserSetSession(state.tagsViewList);
	};

	// 处理可开启多标签详情，单标签详情（动态路由（xxx/:id/:name"），普通路由处理）
	const solveAddTagsView = async (to) => {
		let isDynamicPath = to?.meta?.isDynamic ? to.meta.isDynamicPath : to.path;
		// console.log('[不共享标签 to path:]', isDynamicPath, '对比  [tagsViewList]', state.tagsViewList);
		let current = state.tagsViewList.filter(
			(v) =>
				v.path === isDynamicPath &&
				isObjectValueEqual(
					to?.meta?.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
					to?.meta?.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
				)
		);
		// console.log('path相同 且 参数 完全相同项', current);

		if (current.length <= 0) {
			// 防止：Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.
			let item = state.tagsViewRoutesList.find((v) => v.path === isDynamicPath);
			// item 不存在
			if (!item) return false;
			// item 为固定在 tagsView 栏上已添加
			if (item.meta.isAffix) return false;
			// item 为超连接
			if (item?.meta?.isLink && !item.meta.isIframe) return false;
			// 动态路由 xxx/:id/:name 获取params 否则 获取query
			if (to?.meta?.isDynamic) item.params = to?.params ? to?.params : route.params;
			else item.query = to?.query ? to?.query : route.query;
			// item url :item.path-params1params2
			item.url = setTagsViewHighlight(item);
			// 将item 添加到 pinia keepAliveNames cachedViews
			await storesKeepALiveNames.addCachedView(item);
			// 将item 添加到state.tagsViewList
			state.tagsViewList.push({ ...item });
			// console.log('==============完全相同项 不存在,添加tagsview item===', item);
			addBrowserSetSession(state.tagsViewList);
		}
	};
	// 处理单标签时，第二次的参数未覆盖第一次的 tagsViewList 值（Session Storage）
	const singleAddTagsView = async (to) => {
		let isDynamicPath = to?.meta?.isDynamic ? to.meta.isDynamicPath : to.path;
		// console.log('[共享标签 to path:]',isDynamicPath,'对比  [tagsViewList]',state.tagsViewList)
		state.tagsViewList.forEach((v) => {
			if (
				v.path === isDynamicPath &&
				!isObjectValueEqual(
					to?.meta?.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
					to?.meta?.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
				)
			) {
				// console.log('tagsViewList 存在 path 但是 parmas is not equal======覆盖参数')
				// console.log('v.params',v.params,'v.query',v.query,'to.params',to.params,'to.query',to.query)
				to?.meta?.isDynamic ? (v.params = to.params) : (v.query = to?.query);
				addBrowserSetSession(state.tagsViewList);
			}
		});
	};

	// 2、刷新当前 tagsView：
	const refreshCurrentTagsView = async (fullPath) => {
		///visualizingDemo1/11111/tom
		const decodeURIPath = decodeURI(fullPath);
		let item = {};
		state.tagsViewList.forEach((v) => {
			v.transUrl = transUrlParams(v);
			if (v.transUrl === decodeURIPath) item = v;
		});
		if (!item) return false;
		router.push(item);
		await storesKeepALiveNames.delCachedView(item);
		mittBus.emit('onTagsViewRefreshRouterView', fullPath);
		await storesKeepALiveNames.addCachedView(item);
	};

	// 处理 url，地址栏链接有参数时，tagsview 右键菜单刷新功能失效问题
	const transUrlParams = (v) => {
		let params = v.query && Object.keys(v.query).length > 0 ? v.query : v.params;
		if (!params) return v.path;
		let path = '';
		for (let [key, value] of Object.entries(params)) {
			if (v.meta?.isDynamic) path += `/${value}`;
			else path += `&${key}=${value}`;
		}
		// 判断是否是动态路由（xxx/:id/:name"）isDynamic
		if (v.meta?.isDynamic) {
			/**
			 *
			 * isFnClick 用于判断是通过方法调用，还是直接右键菜单点击（此处只针对动态路由）
			 * 原因：
			 * 1、右键菜单点击时，路由的 path 还是原始定义的路由格式，如：/params/dynamic/details/:t/:id/:tagsViewName
			 * 2、通过事件调用时，路由的 path 不是原始定义的路由格式，如：/params/dynamic/details/vue-next-admin/111/我是动态路由测试tagsViewName(非国际化)
			 *
			 * 所以右侧菜单点击时，需要处理路径拼接 v.path.split(':')[0]，得到路径 + 参数的完整路径
			 */
			return v.isFnClick ? decodeURI(v.path) : `${v.path.split(':')[0]}${path.replace(/^\//, '')}`;
		} else {
			return `${v.path}${path.replace(/^&/, '?')}`;
		}
	};

	// 3、关闭当前 tagsView：如果是设置了固定的（isAffix），不可以关闭
	const closeCurrentTagsView = (path) => {
		state.tagsViewList.map((v, k, arr) => {
			if (!v.meta?.isAffix) {
				if (getThemeConfig.value.isShareTagsView ? v.path === path : v.url === path) {
					storesKeepALiveNames.delCachedView(v);
					state.tagsViewList.splice(k, 1);
					setTimeout(() => {
						if (
							state.tagsViewList.length === k && getThemeConfig.value.isShareTagsView
								? state.routePath === path
								: state.routeActive === path
						) {
							// 最后一个且高亮时
							if (arr[arr.length - 1].meta.isDynamic) {
								// 动态路由（xxx/:id/:name"）
								if (k !== arr.length) router.push({ name: arr[k].name, params: arr[k].params });
								else router.push({ name: arr[arr.length - 1].name, params: arr[arr.length - 1].params });
							} else {
								// 普通路由
								if (k !== arr.length) router.push({ path: arr[k].path, query: arr[k].query });
								else router.push({ path: arr[arr.length - 1].path, query: arr[arr.length - 1].query });
							}
						} else {
							// 非最后一个且高亮时，跳转到下一个
							if (
								state.tagsViewList.length !== k && getThemeConfig.value.isShareTagsView
									? state.routePath === path
									: state.routeActive === path
							) {
								if (arr[k].meta.isDynamic) {
									// 动态路由（xxx/:id/:name"）
									router.push({ name: arr[k].name, params: arr[k].params });
								} else {
									// 普通路由
									router.push({ path: arr[k].path, query: arr[k].query });
								}
							}
						}
					}, 0);
				}
			}
		});
		addBrowserSetSession(state.tagsViewList);
	};

	// 设置 tagsView 高亮（多标签详情时使用，单标签详情未使用）
	const setTagsViewHighlight = (v) => {
		let params = v.query && Object.keys(v.query).length > 0 ? v.query : v.params;
		if (!params || Object.keys(params).length <= 0) return v.path;
		let path = '';
		for (let i in params) {
			path += params[i];
		}
		// 判断是否是动态路由（xxx/:id/:name"）v.path-params1params2
		return `${v.meta?.isDynamic ? v.meta.isDynamicPath : v.path}-${path}`;
	};
	// 获取 pinia 中的 tagsViewRoutes 列表
	const getTagsViewRoutes = async () => {
		state.routeActive = await setTagsViewHighlight(route);
		state.routePath = (await route.meta.isDynamic) ? route.meta.isDynamicPath : route.path;
		state.tagsViewList = [];
		state.tagsViewRoutesList = tagsViewRoutes.value;
		initTagsView();
	};
	// pinia 中获取路由信息：如果是设置了固定的（isAffix），进行初始化显示
	const initTagsView = async () => {
		if (Session.get('tagsViewList') && getThemeConfig.value.isCacheTagsView) {
			state.tagsViewList = await Session.get('tagsViewList');
		} else {
			await state.tagsViewRoutesList.map((v) => {
				if (v.meta?.isAffix && !v.meta.isHide) {
					v.url = setTagsViewHighlight(v);
					state.tagsViewList.push({ ...v });
					storesKeepALiveNames.addCachedView(v);
				}
			});
			await addTagsView(route);
		}
		// 初始化当前元素(li)的下标
		getTagsRefsIndex(getThemeConfig.value.isShareTagsView ? state.routePath : state.routeActive);
	};

	// 存储 tagsViewList 到浏览器临时缓存中，页面刷新时，保留记录
	const addBrowserSetSession = (tagsViewList) => {
		Session.set('tagsViewList', tagsViewList);
	};
	// 设置 tagsView 可以进行拖拽
	const initSortable = async () => {
		const el = document.querySelector('.layout-tagsview-ul');
		if (!el) return false;
		state.sortable.el && state.sortable.destroy();
		state.sortable = Sortable.create(el, {
			animation: 300,
			dataIdAttr: 'data-url',
			// 为true时sortable对象不能拖放排序等功能，为false时为可以进行排序，相当于一个开关；
			disabled: getThemeConfig.value.isSortableTagsView ? false : true,
			// 结束拖拽
			onEnd: () => {
				const sortEndList = [];
				state.sortable.toArray().map((val) => {
					state.tagsViewList.map((v) => {
						if (v.url === val) sortEndList.push({ ...v });
					});
				});
				addBrowserSetSession(sortEndList);
			},
		});
	};
	// 页面加载时
	onMounted(() => {
		// 初始化 pinia 中的 tagsViewRoutes 列表
		getTagsViewRoutes();
		initSortable();
	});
	// 路由更新时（组件内生命钩子）
	onBeforeRouteUpdate(async (to) => {
		state.routeActive = setTagsViewHighlight(to);
		state.routePath = to.meta.isDynamic ? to.meta.isDynamicPath : to.path;
		// console.log('[路由改变 to]', to);
		// 添加 tagsView
		await addTagsView(to);
		getTagsRefsIndex(getThemeConfig.value.isShareTagsView ? state.routePath : state.routeActive);
	});
</script>

<style scoped lang="scss">
	.layout-tagsview {
		background-color: var(--el-color-white);
		border-bottom: 1px solid var(--next-border-color-light);
		position: relative;
		z-index: 4;

		:deep(.el-scrollbar__wrap) {
			overflow-x: auto !important;
		}

		&-ul {
			list-style: none;
			margin: 0;
			height: 34px;
			display: flex;
			align-items: center;
			color: var(--el-text-color-regular);
			font-size: 12px;
			white-space: nowrap;
			padding: 0 15px;

			&-li {
				height: 26px;
				line-height: 26px;
				display: flex;
				align-items: center;
				border: 1px solid var(--next-border-color-light);
				padding: 0 15px;
				margin-right: 5px;
				border-radius: 2px;
				position: relative;
				z-index: 0;
				cursor: pointer;
				justify-content: space-between;

				&:hover {
					background-color: var(--el-color-primary-light-9);
					color: var(--el-color-primary);
					border-color: var(--el-color-primary-light-5);
				}

				&-iconfont {
					position: relative;
					left: -5px;
					font-size: 12px;
				}

				// close
				&-icon {
					border-radius: 100%;
					position: relative;
					height: 14px;
					width: 14px;
					text-align: center;
					line-height: 14px;
					right: -5px;

					&:hover {
						color: var(--el-color-white);
						background-color: var(--el-color-primary-light-3);
					}
				}

				// 当前active的close icon
				.layout-icon-active {
					display: block;
				}

				// 其他页的close icon
				.layout-icon-three {
					display: none;
				}
			}

			.is-active {
				color: var(--el-color-white);
				background: var(--el-color-primary);
				border-color: var(--el-color-primary);
				transition: border-color 3s ease;
			}
		}
	}

	.layout-tagsview-shadow {
		box-shadow: rgb(0 21 41 / 4%) 0 1px 4px;
	}
</style>
