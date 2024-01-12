module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-essential'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
	},
	plugins: ['@typescript-eslint', 'vue'],
	rules: {
		'vue/no-v-html': 'off',
		'vue/require-default-prop': 'off',
		'vue/require-explicit-emits': 'off',
		'vue/multi-word-component-names': 'off',
		'@typescript-eslint/no-explicit-any': 'off', // any
		'no-debugger': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off', // setup()
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'vue/html-self-closing': [
			'error',
			{
				html: {
					void: 'always',
					normal: 'always',
					component: 'always',
				},
				svg: 'always',
				math: 'always',
			},
		],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
	},
	globals: {
		global: 'readonly',
	},
};
