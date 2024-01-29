import { defineStore } from 'pinia';

/**
 * 布局配置
 */
export const useThemeConfig = defineStore('themeConfig', {
	state: () => ({
		themeConfig: {
			/**
			 * 全局主题
			 */
			// 默认 primary 主题颜色
			primary: '#409eff',

			/**
			 * 顶栏设置
			 */
			/**
			 * 顶栏设置
			 */
			// 默认顶栏导航背景颜色
			topBar: '#ffffff',
			// 默认顶栏导航字体颜色
			topBarColor: '#606266',
			/**
			 * 菜单设置
			 */
			// 菜单背景颜色
			menuBar: '#545c64',
			// 菜单默认字体颜色
			menuBarColor: '#eaeaea',
			// 菜单高亮背景色
			menuBarActiveColor: 'rgba(0, 0, 0, 0.2)',
			/**
			 * 界面设置
			 */
			// 是否开启菜单水平折叠效果
			isCollapse: false,
			// 是否开启菜单手风琴效果
			isUniqueOpened: true,
			// 是否开启 Breadcrumb，强制经典、横向布局不显示
			isBreadcrumb: true,
			// 是否开启 Breadcrumb 图标
			isBreadcrumbIcon: true,
			// 是否开启 Tagsview
			isTagsview: true,
			// 是否开启 Tagsview 图标
			isTagsviewIcon: true,
			// 是否开启 TagsView 缓存
			isCacheTagsView: false,
			// 是否开启 TagsView 拖拽
			isSortableTagsView: true,
			// 是否开启 TagsView 共用
			isShareTagsView: false,
			/**
			 * 界面显示
			 */
			// 是否开启侧边栏 Logo
			isShowLogo: true,
			/**
			 * 布局切换
			 * 注意：为了演示，切换布局时，颜色会被还原成默认，代码位置：/@/layout/topBar/setings.vue
			 * 中的 `initSetLayoutChange(设置布局切换，重置主题样式)` 方法
			 */
			// 布局切换：可选值"<defaults|classic|transverse|columns>"，默认 defaults
			layout: 'defaults',
			/**
			 * 全局网站标题 / 副标题
			 */
			// 网站主标题（菜单导航、浏览器当前网页标题）
			globalTitle: 'vvv',
		},
	}),
	actions: {
		setThemeConfig(state) {
			this.themeConfig = state.themeConfig;
		},
	},
});
