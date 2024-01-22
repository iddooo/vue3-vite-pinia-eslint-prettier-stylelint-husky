import { dynamicRoutes, notFoundAndNoPower } from './route';
import router, { formatFlatteningRoutes, formatTwoStageRoutes } from './index';
import { useUserInfo } from '../stores/userInfo';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '../stores/routesList';
import { useTagsviewRoutes } from '../stores/tagsViewRoutes';
// 前端控制路由
/**
 *路由初始化
 */
export async function initFrontEndControlRoutes() {
	// 触发初始化用户信息
	await useUserInfo().setUserInfo();
	//动态添加路由 过滤isKeepAlive路由 添加到pinia keepAliveNames 中
	await setAddRoute();
	// 过滤有权限的路由到 pinia routesList中 及 缓存多级嵌套数据处理后的一维数组
	setFilterMenuAndTagsViewRoutes();
}

/**
 * 添加动态路由
 * @method router.addroute
 * @description 将 dynamicRoutes 多级嵌套数组处理成只保留二级 [{path:'/',children:[]}],因为keepalive只支持二级缓存
 * @link https://router.vuejs.org/zh/api/interfaces/Router.html#Methods-addRoute
 * 注意：
 */
export async function setAddRoute() {
	const filterRouteEnd = await setFilterRouteEnd();
	filterRouteEnd.forEach((route) => {
		router.addRoute(route);
	});
}
/**
 * 获取当前用户权限识别的路由数组
 * @description 替换 dynamicRoutes 处理成二级嵌套数组 第一个顶级 children 的路由
 * @description 递归过滤有权限的路由
 * @description 加上 notFoundAndNoPower 在layout布局中匹配404 ， 401
 * @returns 返回替换后的路由数组
 */
export async function setFilterRouteEnd() {
	const storesUserInfo = useUserInfo();
	const { userInfo } = storeToRefs(storesUserInfo);
	let filterRouteEnd = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes));
	filterRouteEnd[0].children = [...setFilterHasRolesMenu(filterRouteEnd[0].children, userInfo.value.roles), ...notFoundAndNoPower];
	return filterRouteEnd;
}

/**
 * 递归过滤有权限的路由, 将路由添加到到 pinia routesList 中， 以及缓存处理后的一维路由到 tagsViewRoutes中 ，将 isKeepAlive:true 的路由名字 添加到pinia keepAliveNames 中
 * @description 用于左侧菜单，横向菜单的显示
 * @description 用于 tagsView、菜单搜索
 */
export async function setFilterMenuAndTagsViewRoutes() {
	const storesRoutesList = useRoutesList();
	const storesTagesViewRoutes = useTagsviewRoutes();
	const storesUserInfo = useUserInfo();
	const { userInfo } = storeToRefs(storesUserInfo);
	// 递归过滤有权限的路由 左侧菜单嵌套路由
	const hasRolesMenu = setFilterHasRolesMenu(dynamicRoutes[0].children, userInfo.value.roles);
	storesRoutesList.setRoutesList(hasRolesMenu);
	// 展开过滤后的嵌套路由，处理成一维数组，用于 tagsView、菜单搜索
	const flatteningHasRolesRoutes = formatFlatteningRoutes(hasRolesMenu);
	storesTagesViewRoutes.setTagsViewRoutes(flatteningHasRolesRoutes);
}

/**
 * 递归过滤有权限的路由方法
 * @returns 返回用户权限识别的路由数组
 */
export function setFilterHasRolesMenu(routes, roles) {
	const menu = [];
	routes.forEach((route) => {
		const item = { ...route };
		if (hasRoles(roles, item)) {
			if (item.children) item.children = setFilterHasRolesMenu(item.children, roles);
			menu.push(item);
		}
	});
	return menu;
}
/**
 * 判断 `meta.roles` 中是否包含当前登录的权限
 */
export function hasRoles(roles, route) {
	if (route.meta && route.meta.roles) {
		return roles.some((role) => route.meta.roles.includes(role));
	} else {
		return true;
	}
}
