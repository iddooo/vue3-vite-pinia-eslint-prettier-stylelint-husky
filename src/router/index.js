import { createRouter, createWebHashHistory } from 'vue-router';
import { notFoundAndNoPower, staticRoutes } from './route';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { initFrontEndControlRoutes } from './frontEnd.js';
import { useKeepAliveNames } from '@/stores/keepAliveNames';
import { Session } from '../utils/storage.js';
import { useRoutesList } from '../stores/routesList.js';
import { storeToRefs } from 'pinia';

/**
 * 创建路由实例
 * @link 参考 https://router.vuejs.org/zh/api/#Functions-createRouter
 */
const router = createRouter({
	history: createWebHashHistory(),
	/**
	 * 说明：
	 * 1. notFoundAndNoPower 为401，404界面
	 * 2. 登录后需要将v notFoundAndNoPower 添加到动态路由中，防止401，404全屏，不在layout布局中
	 */
	routes: [...staticRoutes, ...notFoundAndNoPower],
});

/**
 * 处理多级嵌套数组展开成一维数组
 * @param arr
 * @returns 返回处理后的一维数组
 */
export function formatFlatteningRoutes(arr) {
	if (arr.length < 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}
/**
 * 一维数组处理成二级嵌套数组（只保留二级，二级以上全部处理成二级，keep-alive支持二级缓存
 * @description isKeepAlive 处理 `name` 值，顶级关闭，全部不缓存
 * @link 参考 https://cn.vuejs.org/api/built-in-components.html#keepalive
 * @param arr
 * @returns 返回将一维数组重新处理成 `dynamicRoutes`格式
 */
export function formatTwoStageRoutes(arr) {
	const newArr = [];
	const cacheList = [];
	arr.forEach((v) => {
		if (v.path == '/') {
			// newArr[0].path = v.path;
			// newArr[0].component = v.component;
			// newArr[0].name = v.name;
			// newArr[0].redirect = v.redirect;
			// newArr[0].meta = v.meta;
			newArr.push({ path: v.path, name: v.name, component: v.component, redirect: v.redirect, meta: v.meta, children: [] });
		} else {
			newArr[0].children.push({ ...v });
			// 存 name 值，keep-alive 中 include 使用，实现路由的缓存
			// 顶级关闭，全部不缓存
			if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
				cacheList.push(v.name);
				const stores = useKeepAliveNames();
				stores.setCacheKeepAlive(cacheList);
			}
		}
	});
	return newArr;
}
/**
 * 路由加载前
 */
router.beforeEach(async (to, from, next) => {
	// console.log('路由加载前 to', to.path);
	NProgress.configure({ showSpinner: false });
	NProgress.start();
	let token = Session.get('token');
	// debugger;
	if (!token && to.path === '/login') {
		// console.log('to login next:');
		next();
		NProgress.done();
	} else {
		if (!token) {
			// console.log('!token next: /login');
			next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
			Session.clear();
			NProgress.done();
		} else if (token && to.path === '/login') {
			// console.log('next: /home');
			next('/home');
			NProgress.done();
		} else {
			const storesRoutesList = useRoutesList();
			const { routesList } = storeToRefs(storesRoutesList);
			// console.log('routeslist', routesList.value);
			// 解决刷新时，一直跳 404 页面问题
			// to.query 防止页面刷新时，普通路由带参数时，参数丢失。动态路由（xxx/:id/:name"）isDynamic 无需处理
			// 解决无限循环问题，每次跳转到一个路由的时候都会 触发 全局守卫 由于判断条件未改变 所以 一直循环
			if (routesList.value.length === 0) {
				// 初始化动态路由，再次进入
				await initFrontEndControlRoutes();
				// console.log('next:', to.path);
				next({ path: to.path, query: to.query });
			} else {
				// 动态路由已经添加，直接next
				// console.log('next');
				next();
			}
			NProgress.done();
		}
	}
});

/**
 * 路由加载后
 */
router.afterEach(() => {
	// console.log(router, router.getRoutes());
	NProgress.done();
});

export default router;
