// 字体图标 css url
const cssCdnUrlList = ['//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', '//at.alicdn.com/t/c/font_4420553_a3l9fleg038.css'];

// js url
const jsCdnUrlList = [];
// 动态批量设置字体图标
// <link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
// <link href="//at.alicdn.com/t/c/font_4420553_a3l9fleg038.css" rel="stylesheet">
export function setCssCdn() {
	if (cssCdnUrlList.length <= 0) return false;
	cssCdnUrlList.map((v) => {
		let link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = v;
		link.crossOrigin = 'anonymous';
		document.getElementsByTagName('head')[0].appendChild(link);
	});
}
// 动态批量设置第三方js
/* <script src="//at.alicdn.com/t/c/font_4420553_a3l9fleg038.js"></script>; */
export function setJsCdn() {
	if (jsCdnUrlList.length <= 0) return false;
	jsCdnUrlList.map((v) => {
		let link = document.createElement('script');
		link.src = v;
		document.body.appendChild(link);
	});
}

/**
 * 批量设置字体图标、动态js
 * @method cssCdn 动态批量设置字体图标
 * @method jsCdn 动态批量设置第三方js
 */
const setIntroduction = {
	// 设置css
	cssCdn: () => {
		setCssCdn();
	},
	// 设置js
	jsCdn: () => {
		setJsCdn();
	},
};

export default setIntroduction;
