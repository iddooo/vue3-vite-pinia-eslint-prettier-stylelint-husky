<template>
	<!-- ele-xxx-->
	<!-- 由于SVG图标默认不携带任何属性，可以使用 el-icon 为 SVG 图标提供属性 
        <el-icon :size="size" :color="color">
            <Edit />
        </el-icon>
        注意：使用ele-xxx别名注册elemnet plus svg;
    -->
	<i v-if="isShowIconSvg" class="el-icon" :style="setSvgStyle">
		<component :is="getIconName"></component>
	</i>
	<!-- 本地图片 -->
	<div v-else-if="isShowImg" :style="setImgOutStyle">
		<img :src="getIconName" alt="" :style="setImgInStyle" />
	</div>
	<!-- iconfont icon-xxxx -->
	<!-- fa fa-camera-retro -->
	<i v-else :class="getIconName" :style="setSvgStyle" />
</template>

<script setup lang="js">
	import { computed } from 'vue';

	const props = defineProps({
		// svg 图标组件名字
		name: {
			type: String,
		},
		// svg 大小
		size: {
			type: Number,
			default: () => 14,
		},
		// svg 颜色
		color: {
			type: String,
		},
	});

	const getIconName = computed(() => {
		return props.name;
	});

	const setSvgStyle = computed(() => {
		return `font-size: ${props.size}px;color: ${props.color};`;
	});

	// 用户判断elementplus 自带svg图标的显示
	const isShowIconSvg = computed(() => {
		return props.name?.startsWith('ele-');
	});

	// 在线链接、本地引入地址前缀
	const linesString = ['https', 'http', '/src', '/public', '/assets', 'data:image', import.meta.env.VITE_PUBLIC_PATH];

	// 用户判断在线连接，本地引入图片的显示
	const isShowImg = computed(() => {
		return linesString.find((str) => props.name?.startsWith(str));
	});
	// 设置图片样式
	const setImgOutStyle = computed(() => {
		return `width: ${props.size}px;height: ${props.size}px;display: inline-block;overflow: hidden;`;
	});
	const setImgInStyle = computed(() => {
		const filterStyle = [];
		const compatibles = ['-webkit', '-ms', '-o', '-moz'];
		compatibles.forEach((j) => filterStyle.push(`${j}-filter: drop-shadow(${props.color} 30px 0);`));
		return `width: ${props.size}px;height: ${props.size}px;position: relative;left: -${props.size}px;${filterStyle.join('')}`;
	});
</script>
<style scoped lang="scss"></style>
