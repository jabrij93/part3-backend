import globals from 'globals';

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.commonjs,
                ...globals.es2021,
            },
        },
        rules: {
            // Add your rules here
        },
    },
    {
        files: [".eslintrc.{js,cjs}"],
        languageOptions: {
            sourceType: 'script',
            globals: {
                ...globals.node,
            },
        },
        env: {
            node: true,
        },
    },
];
