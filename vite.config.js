import { loadEnv, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
const viteConfig = defineConfig((ConfigEnv) => {
	let env = loadEnv(ConfigEnv.mode, process.cwd());
	return {
		root: process.cwd(),
		plugins: [
			vue(),
			AutoImport({
				imports: ['vue', 'vue-router', 'vuex'],
				// 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
				dts: 'src/auto-import.d.ts',
			}),
			//element plus和自定义组件按需自动引入
			Components({
				dirs: ['src/components'], // 目标文件夹
				extensions: ['vue', 'jsx'], // 文件类型
				dts: 'src/components.d.ts', // 输出文件，里面都是一些import的组件键值对
				// ui库解析器
				resolvers: [ElementPlusResolver()],
			}),
			// 帮助我们在使用组件库时,自动引入组件的样式
			createStyleImportPlugin({
				resolves: [ElementPlusResolve()],
			}),
			//在setup语法中使用name属性
			vueSetupExtend(),
			//使用 gzip 或者 brotli 来压缩资源
			viteCompression(),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, '.', 'src'),
			},
		},
		// 开发服务器相关的配置选项。
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT,
			open: env.VITE_OPEN,
			proxy: {
				'/api': {
					target: 'https://xxx.com',
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		// 构建相关的配置选项
		build: {
			// 指定构建输出目录，默认为 'dist'。
			outDir: 'dist',
			// 打包大小限制 default 500
			chunkSizeWarningLimit: 1500,
			// 可以配置 Rollup 的插件、模块解析方式、代码拆分等。
			rollupOptions: {
				output: {
					chunkFileNames: 'static/js/[name]-[hash].js',
					entryFileNames: 'static/js/[name]-[hash].js',
					//静态资源的命名,[ext]为文件扩展名[name]表示文件名，[hash]hash值
					assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
				},
			},
		},
	};
});

export default viteConfig;
