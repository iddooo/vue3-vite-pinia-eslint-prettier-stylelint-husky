import { defineStore } from 'pinia';

export const useTagsviewRoutes = defineStore('tagsViewRoutes', {
	state: () => ({
		tagsViewRoutes: [],
	}),
	actions: {
		async setTagsViewRoutes(data) {
			this.tagsViewRoutes = data;
		},
	},
});
