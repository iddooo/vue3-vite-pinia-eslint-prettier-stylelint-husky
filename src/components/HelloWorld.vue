<script setup>
import { ref } from 'vue';

defineProps({
	msg: String,
});

const count = ref(0);
</script>

<template>
	<h1>{{ msg }}{{ count }}</h1>

	<div class="abc">abc</div>
	<ul>
		<li>thismamclac</li>
		<li>ncasmk</li>
		<li>ncasmk</li>
		<li>ncasmk</li>
		<li>ncasmk</li>
		<li>ncasmk</li>
		<li>ncasmk</li>
		<li>ncasmk</li>
	</ul>
</template>

<style scoped lang="scss">
.read-the-docs {
	color: #888;
}

.abc {
	font-size: 20px;
}

ul > li {
	font-size: 12px;
	color: red;
}

ul > li:nth-of-type(even) {
	background-color: rgb(247 247 8);
}
</style>
