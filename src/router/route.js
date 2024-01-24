/**
 * 定义动态路由
 * 前端添加路由，在顶级路由的`children 数组`中添加
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上，比如：首页
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

export const dynamicRoutes = [
	{
		path: '/',
		name: '/',
		component: () => import('@/layout/index.vue'),
		redirect: '/home',
		meta: {},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home/index.vue'),
				meta: {
					title: 'home',
					isHide: false,
					isKeepAlive: true,
					isAffix: true,
					isLink: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-House',
				},
			},
			{
				path: '/test',
				name: 'test',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/test/test1',
				meta: {
					title: 'test',
					isHide: false,
					isKeepAlive: true,
					isAffix: true,
					isLink: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'fa fa-address-card-o',
				},
				children: [
					{
						path: '/test1',
						name: 'test1',
						component: () => import('@/views/test/test1.vue'),
						meta: {
							title: 'test1',
							isHide: false,
							isKeepAlive: true,
							isAffix: true,
							isLink: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-pengzhuangjiance',
						},
					},
					{
						path: '/test2',
						name: 'test2',
						component: () => import('@/views/test/test2.vue'),
						meta: {
							title: 'test2',
							isHide: false,
							isKeepAlive: true,
							isAffix: true,
							isLink: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'iconfont icon-puguang',
						},
					},
				],
			},
			/**
			 * 提示：此处为大数据全屏界面
			 */
			{
				path: '/visualizingDemo1',
				name: 'visualizingDemo1',
				component: () => import('@/views/visualizing/demo1.vue'),
				meta: {
					title: 'visualizingDemo1',
					icon: 'iconfont icon-shizhongshezhi',
				},
			},
		],
	},
];

/**
 * 定义404,401界面
 * @link 参考 https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('@/views/error/404.vue'),
		meta: {
			title: 'notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('@/views/error/401.vue'),
		meta: {
			title: 'noPower',
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端路由请在 `dynamicRoutes 数组`中添加
 */

export const staticRoutes = [
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: 'login',
		},
	},
];
