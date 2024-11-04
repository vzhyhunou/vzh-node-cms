import { createRequire } from 'node:module';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

const config = ({
    REACT_APP_SRC,
    REACT_APP_BASE,
    BUILD_PATH
}) => ({
    plugins: [react(), eslint()],
    server: {
        port: 3013
    },
    define: {
        'process.env': {
            REACT_APP_SRC,
            REACT_APP_BASE
        }
    },
    build: {
        outDir: BUILD_PATH
    },
    base: REACT_APP_BASE,
    /* https://github.com/orgs/react-hook-form/discussions/3894
    ... useForm has been imported from react-hook-form/dist/index.cjs.js otherwise
    useFormContext has been imported from react-hook-form/dist/index.esm.mjs */
    resolve: {
        alias: (require => ({
            'react-hook-form': require.resolve('react-hook-form'),
            '@tanstack/react-query': require.resolve('@tanstack/react-query')
        }))(createRequire(import.meta.url))
    }
});

const srcConfig = {
    back: params => (config => ({
        ...config,
        server: {
            ...config.server,
            proxy: {
                '/api': {
                    target: 'http://localhost:8093'
                },
                '/login': {
                    target: 'http://localhost:8093'
                },
                '/static': {
                    target: 'http://localhost:8093'
                }
            }
        }
    }))(config(params)),
    fake: config
};

export default defineConfig(
    ({mode}) => (
        params => srcConfig[params.REACT_APP_SRC](params)
    )(loadEnv(mode, process.cwd(), ''))
);