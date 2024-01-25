module.exports = {
	// https://stylelint.nodejs.cn/user-guide/configure
	root: true,
	//插件是为支持方法、工具集、非标准 CSS 功能或非常具体的用例而构建的自定义规则或自定义规则集。
	//stylelint-order 是一个流行的插件包，用于对声明块中的属性等内容进行排序。
	plugins: ['stylelint-order'],
	// 扩展现有配置,第二个项目覆盖第一个项目中的规则,依此类推
	extends: [
		// stylelint-config-standard 是我们可以扩展的官方配置之一
		'stylelint-config-standard', //标准配置
		'stylelint-prettier/recommended',
		'stylelint-config-recommended-scss',
	],
	//rules 属性是一个对象，其键是规则名称，值是规则配置。默认情况下不启用任何规则。
	rules: {
		// https://stylelint.nodejs.cn/user-guide/rules
		'selector-class-pattern': null,
		'custom-property-pattern': null,
		'selector-pseudo-class-no-unknown': [
			true,
			{
				//进一步定制的辅助选项。
				ignorePseudoClasses: ['global'],
			},
		],
		'selector-pseudo-element-no-unknown': [
			true,
			{
				ignorePseudoElements: ['v-deep'],
			},
		],
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'function', 'if', 'each', 'include', 'mixin'],
			},
		],
		'no-empty-source': null,
		'named-grid-areas-no-invalid': null,
		'no-descending-specificity': null,
		'font-family-no-missing-generic-family-keyword': null,
		'rule-empty-line-before': [
			'always',
			{
				ignore: ['after-comment', 'first-nested'],
			},
		],
		'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
		'order/order': [
			[
				'dollar-variables',
				'custom-properties',
				'at-rules',
				'declarations',
				{
					type: 'at-rule',
					name: 'supports',
				},
				{
					type: 'at-rule',
					name: 'media',
				},
				'rules',
			],
			{ severity: 'warning' },
		],
	},
	//指定要在代码上使用的自定义语法
	customSyntax: 'postcss-html',
	ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json'],
	// 使用 overrides 属性，你可以指定要应用配置的文件子集
	overrides: [
		{
			files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
			extends: [
				'stylelint-config-recommended', //推荐配置
				'stylelint-config-html',
			],
			rules: {
				'keyframes-name-pattern': null,
				'selector-pseudo-class-no-unknown': [
					true,
					{
						ignorePseudoClasses: ['deep', 'global'],
					},
				],
				'selector-pseudo-element-no-unknown': [
					true,
					{
						ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
					},
				],
			},
		},
	],
};
