const { resolve } = require('path')
const WebpackBar = require('webpackbar')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const glob = require('glob')
const { PROJECT_PATH, SPEAR_PATH, isDev } = require('../constants')

const getCssLoaders = (importLoaders) => [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
        loader: 'css-loader',
        options: {
            modules: false,
            sourceMap: isDev,
            importLoaders,
        },
    },
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                    autoprefixer: {
                        grid: true,
                        flexbox: 'no-2009',
                    },
                    stage: 3,
                }),
                require('postcss-normalize'),
            ],
            sourceMap: isDev,
        },
    },
]

const entry = glob.sync(`${resolve(PROJECT_PATH, './packages')}/**/index.js`)
  .reduce((x, y) => Object.assign(x, {
    [y.split('/').slice(-2, -1)]: y,
  }), {});


module.exports = {
    entry: entry,
    output: {
        filename: `js/[name]${isDev ? '' : '.[contenthash:8]'}.js`,
        path: resolve(PROJECT_PATH, './dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    resolveLoader: {
        modules: [resolve(SPEAR_PATH, 'node_modules')],
    },
    module: {
        rules: [
            {
                test: /\.(tsx?|js)$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    // 无法写在.babelrc里
                    presets: [
                        [
                            `${SPEAR_PATH}/node_modules/@babel/preset-env`,
                            {
                                modules: false,
                            },
                        ],
                        `${SPEAR_PATH}/node_modules/@babel/preset-react`,
                        `${SPEAR_PATH}/node_modules/@babel/preset-typescript`,
                    ],
                    plugins: [
                        [
                            `${SPEAR_PATH}/node_modules/@babel/plugin-transform-runtime`,
                            {
                                corejs: {
                                    version: 3,
                                    proposals: true,
                                },
                                useESModules: true,
                            },
                        ],
                    ],
                },
                include: [
                    resolve(PROJECT_PATH, './packages'),
                ],
            },
            {
                test: /\.css$/,
                use: getCssLoaders(1),
            },
            {
                test: /\.less$/,
                use: [
                    ...getCssLoaders(2),
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: isDev,
                        },
                    },
                ],
            },
          {
            test: /\.(png|jpg|jpeg|svg|gif)$/,
            type: 'asset',
            generator: {
              filename: 'assets/images/[contenthash:8].[name][ext]',
            },
          },
        ],
    },
    plugins: [
        new WebpackBar({
            name: isDev ? '正在启动...' : '正在打包...',
            color: '#45bf39',
        }),
        // new ForkTsCheckerWebpackPlugin({
        //     typescript: {
        //         configFile: resolve(SPEAR_PATH, './tsconfig.json'),
        //     },
        // }),
        new webpack.HotModuleReplacementPlugin(),
        !isDev &&
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css',
                ignoreOrder: false,
            }),
        new webpack.BannerPlugin({
            raw: true,
            banner: '/** @preserve banner comment demo */',
        }),
    ].filter(Boolean),
    externals: {},
    optimization: {
        minimize: !isDev,
        minimizer: [
            !isDev &&
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        compress: { pure_funcs: ['console.log'] },
                    },
                }),
            !isDev && new CssMinimizerPlugin()
        ].filter(Boolean),
        splitChunks: {
            chunks: 'all',
        },
    },
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename],
        },
        name: 'production-cache'
    },
    stats: 'errors-only',
}
