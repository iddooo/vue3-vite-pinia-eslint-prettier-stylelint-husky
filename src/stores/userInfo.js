import { defineStore } from 'pinia';
import { Session } from '../utils/storage';

export const useUserInfo = defineStore('userInfo', {
	state: () => ({
		userInfo: {
			userName: '',
			photo: '',
			time: '',
			roles: ['admin'],
			authBtnlist: [],
		},
	}),
	actions: {
		async setUserInfo() {
			// 获取用户信息
			if (Session.get('userInfo')) {
				//从缓存获取
				this.userInfo = Session.get('userInfo');
			} else {
				//从api获取用户信息
				const userInfo = await this.getApiUserInfo();
				this.userInfo = userInfo;
			}
		},
		// 从接口获取用户信息
		async getApiUserInfo() {
			return new Promise((resolve) => {
				// 模拟数据
				setTimeout(() => {
					const userName = 'admin';
					// 模拟数据
					let defaultRoles = [];
					let defaultAuthBtnList = [];
					// admin 页面权限标识 按钮权限标识
					let adminRoles = ['admin'];
					let adminAuthBtnList = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
					// test 页面权限标识 按钮权限标识
					let testRoles = ['common'];
					let testAuthBtnList = ['btn.add', 'btn.link'];

					if (userName == 'admin') {
						defaultRoles = adminRoles;
						defaultAuthBtnList = adminAuthBtnList;
					} else {
						defaultRoles = testRoles;
						defaultAuthBtnList = testAuthBtnList;
					}
					// 用户信息模拟数据
					const userInfos = {
						userName: userName,
						photo:
							userName === 'admin'
								? 'https://img2.baidu.com/it/u=1978192862,2048448374&fm=253&fmt=auto&app=138&f=JPEG?w=504&h=500'
								: 'https://img2.baidu.com/it/u=2370931438,70387529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
						time: new Date().getTime(),
						roles: defaultRoles,
						authBtnList: defaultAuthBtnList,
					};
					Session.set('userInfo', userInfos);
					resolve(userInfos);
				}, 0);
			});
		},
	},
});
