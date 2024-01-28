<template>
	<div>{{ userInfo.id }}</div>
	<div>{{ userInfo.name }}</div>
</template>

<script setup lang="js">
	import { computed } from 'vue';
	import { useRoute } from 'vue-router';
	const route = useRoute();

	const userInfo = computed(() => {
		return route.params;
	});
</script>

<style scoped lang="scss"></style>
