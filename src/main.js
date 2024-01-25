import { createApp } from 'vue';
import './styles/tailwind.css';
import App from './App.vue';
import pinia from './stores';
import router from './router';
import { installSvg } from './components/svgIcon/install';
import '@/styles/index.scss';

const app = createApp(App);
/** iconfont fontawesome4.7*/
// // 下载到本地 public/iconfont 导入字体图标
// import '/public/iconfont/iconfont.css';
// // 下载到本地 public/font-awesome 导入字体图标
// import '/public/font-awesome/css/font-awesome.min.css';
// 通过cdn导入才能使用iconfont fontawesome4.7字体图标
import setIntroduction from './utils/setIconfont';
setIntroduction.cssCdn();
// 注册SvgIcon
installSvg(app);

app.use(pinia).use(router).mount('#app');
