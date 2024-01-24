import { defineAsyncComponent } from 'vue';
import * as icons from '@element-plus/icons-vue';
// 引入组件
const SvgIcon = defineAsyncComponent(() => import('./index.vue'));

/**
 *
 * @param app  Vue实例
 * @description element plus svg使用： https://element-plus.gitee.io/zh-CN/component/icon.html
 */
export const installSvg = (app) => {
	// 使用ele - xxx别名注册elemnet plus svg;
	for (const [key, component] of Object.entries(icons)) {
		app.component(`ele-${key}`, component);
	}
	// 注册SvgIcon
	app.component('SvgIcon', SvgIcon);
};
