<template>
	<div>
		<button @click="login">login</button>
	</div>
</template>

<script setup lang="js">
	import { useRouter } from 'vue-router';
	import { Session } from '../../utils/storage';

	const router = useRouter();

	const login = () => {
		Session.set('token', new Date());
		router.push('/');
	};
</script>

<style scoped lang="scss"></style>
