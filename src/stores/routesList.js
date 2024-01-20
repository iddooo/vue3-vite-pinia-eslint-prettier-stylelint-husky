import { defineStore } from 'pinia';

/**
 * 路由列表
 */
export const useRoutesList = defineStore('routesList', {
	state: () => ({
		routesList: [],
	}),
	actions: {
		async setRoutesList(data) {
			this.routesList = data;
		},
	},
});
