var webpack = require('webpack'),
    path = require('path'),
    fileSystem = require('fs-extra'),
    env = require('./utils/env'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    TerserPlugin = require('terser-webpack-plugin');
var {CleanWebpackPlugin} = require('clean-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || './';

var alias = {
    'react-dom': '@hot-loader/react-dom',
};

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'eot',
    'otf',
    'svg',
    'ttf',
    'woff',
    'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
    alias['secrets'] = secretsPath;
}

var options = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        options: path.join(__dirname, 'src', 'pages', 'Options', 'index.jsx'),
        popup: path.join(__dirname, 'src', 'pages', 'Popup', 'Popup.jsx'),
        background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js'),
        contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.js'),
        tabs: path.join(__dirname, 'src', 'pages', 'Function','Office','tabs', 'index.jsx'),
        notify: path.join(__dirname, 'src', 'pages', 'Function','Office','notify', 'index.jsx'),
        link: path.join(__dirname, 'src', 'pages', 'Function','Office','link', 'index.jsx'),
        codeArea: path.join(__dirname, 'src', 'pages', 'Function','Office','codeArea', 'index.jsx'),
        todolist: path.join(__dirname, 'src', 'pages', 'Function','Office','todolist', 'index.jsx'),
        scenario: path.join(__dirname, 'src', 'pages', 'Function','Office','scenario', 'index.jsx'),
        yml: path.join(__dirname, 'src', 'pages', 'Function','Usual','yml', 'index.jsx'),
        fragement: path.join(__dirname, 'src', 'pages', 'Function','Record','fragement', 'index.jsx'),
        myfetch: path.join(__dirname, 'src', 'pages', 'Function','Record','myfetch', 'index.jsx'),
        notebook: path.join(__dirname, 'src', 'pages', 'Function','Record','notebook', 'index.jsx'),
        httpstrShow: path.join(__dirname, 'src', 'pages', 'Function','Usual','httpstrShow', 'index.jsx'),
        webRequest: path.join(__dirname, 'src', 'pages', 'Function','Record','webRequest', 'index.jsx'),
        base64: path.join(__dirname, 'src', 'pages', 'Function','Usual','base64', 'index.jsx'),
        filediff: path.join(__dirname, 'src', 'pages', 'Function','Usual','filediff', 'index.jsx'),
        awk: path.join(__dirname, 'src', 'pages', 'Function','Usual','awk', 'index.jsx'),
        devtools: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.js'),
        panel: path.join(__dirname, 'src', 'pages', 'Panel', 'index.jsx'),
    },
    chromeExtensionBoilerplate: {
        notHotReload: ['background', 'contentScript', 'devtools'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        publicPath: ASSET_PATH,
    },
    module: {
        rules: [
            {
                // look for .css or .scss files
                test: /\.(css|scss)$/,
                // in the `src` directory
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],

            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
                                modifyVars: {
                                    'primary-color': '#1DA57A',
                                    'link-color': '#1DA57A',
                                    'border-radius-base': '2px',
                                },
                                javascriptEnabled: true,
                            },
                        },
                    }],
            },
            {
                test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
                type: 'asset/resource',
                exclude: /node_modules/,
                // loader: 'file-loader',
                // options: {
                //   name: '[name].[ext]',
                // },
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/,
            },
            {test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/},
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'source-map-loader',
                    },
                    {
                        loader: 'babel-loader',
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: alias,
        extensions:
            fileExtensions
                .map((extension) => '.' + extension)
                .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    },
    plugins: [
        new CleanWebpackPlugin({verbose: false}),
        new webpack.ProgressPlugin(),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/manifest.json',
                    to: path.join(__dirname, 'build'),
                    force: true,
                    transform: function (content, path) {
                        // generates the manifest file using the package.json informations
                        return Buffer.from(
                            JSON.stringify({
                                description: process.env.npm_package_description,
                                version: process.env.npm_package_version,
                                ...JSON.parse(content.toString()),
                            })
                        );
                    },
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/pages/Content/content.styles.css',
                    to: path.join(__dirname, 'build'),
                    force: true,
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets/img/logo.png',
                    to: path.join(__dirname, 'build'),
                    force: true,
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets/img/top.png',
                    to: path.join(__dirname, 'build'),
                    force: true,
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/pages/Function/sandbox.html',
                    to: path.join(__dirname, 'build'),
                    force: true,
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/pages/Function/cros.json',
                    to: path.join(__dirname, 'build'),
                    force: true,
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
            filename: 'options.html',
            chunks: ['options'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
            filename: 'popup.html',
            chunks: ['popup'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.html'),
            filename: 'devtools.html',
            chunks: ['devtools'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Panel', 'index.html'),
            filename: 'panel.html',
            chunks: ['panel'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Office','tabs', 'index.html'),
            filename: 'tabs.html',
            chunks: ['tabs'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Office','notify', 'index.html'),
            filename: 'notify.html',
            chunks: ['notify'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Office','link', 'index.html'),
            filename: 'link.html',
            chunks: ['link'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Office','codeArea', 'index.html'),
            filename: 'codeArea.html',
            chunks: ['codeArea'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Office','todolist', 'index.html'),
            filename: 'todolist.html',
            chunks: ['todolist'],
            cache: false,
        }),
         new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Office','scenario', 'index.html'),
            filename: 'scenario.html',
            chunks: ['scenario'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Usual','yml', 'index.html'),
            filename: 'yml.html',
            chunks: ['yml'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Record','fragement', 'index.html'),
            filename: 'fragement.html',
            chunks: ['fragement'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Record','myfetch', 'index.html'),
            filename: 'myfetch.html',
            chunks: ['myfetch'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Record','notebook', 'index.html'),
            filename: 'notebook.html',
            chunks: ['notebook'],
            cache: false,
        }),
         new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Usual','base64', 'index.html'),
            filename: 'base64.html',
            chunks: ['base64'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Usual','filediff', 'index.html'),
            filename: 'filediff.html',
            chunks: ['filediff'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Usual','awk', 'index.html'),
            filename: 'awk.html',
            chunks: ['awk'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Usual','httpstrShow', 'index.html'),
            filename: 'httpstrShow.html',
            chunks: ['httpstrShow'],
            cache: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'pages', 'Function','Record','webRequest', 'index.html'),
            filename: 'webRequest.html',
            chunks: ['webRequest'],
            cache: false,
        }),
    ],
    infrastructureLogging: {
        level: 'info',
    },
};

if (env.NODE_ENV === 'development') {
    options.devtool = 'cheap-module-source-map';
} else {
    options.optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
    };
}

module.exports = options;
