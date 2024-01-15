<template>
	<div class="container">
		{{ name }}
	</div>
	<h1 class="text-3xl font-bold underline">Hello world!</h1>
	<ul>
		<li><a href="#" class="w-0">这是第1个li元素</a></li>
		<li><a href="#" class="p">这是第2个li元素</a></li>
		<li><a href="#" class="p">这是第3个li元素</a></li>
		<li><a href="#" class="p">这是第4个li元素</a></li>
		<li><a href="#" class="p">这是第5个li元素</a></li>
		<li><a href="#" class="p">这是第6个li元素</a></li>
		<li><a href="#" class="p">这是第7个li元素</a></li>
		<li><a href="#" class="p">这是第8个li元素</a></li>
	</ul>
	<p class="footer flex justify-items-center">this is footer</p>
</template>

<script setup lang="js">
import { ref } from 'vue';
const name = ref('user1');
</script>

<style scoped lang="scss">
.container {
	background-color: pink;
	font-size: large;
}

ul {
	list-style: none;
	font-size: 12px;
	color: #333;
	line-height: 48px;

	a {
		text-decoration: none;
		color: #333;
	}

	li:nth-of-type(n) {
		background-color: #ccc;
	}

	li:nth-of-type(2n) {
		background-color: #eee;
	}
}
</style>
