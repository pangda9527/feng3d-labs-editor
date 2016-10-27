// var webpack = require('webpack');
// var path = require('path');
// var node_modules = path.resolve(__dirname, 'node_modules');//绝对路径，以兼容 Windows 环境？
// var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
// var pathToReactDom = path.resolve(node_modules, 'react/dist/react-dom.min.js');
// var env = process.env.NODE_ENV;
// var env = 'production';
// console.log('webpack', env);
module.exports = {
    // cache:true, //watch 自动开启
    //支持 electron 专用模块；web下导致：process is not defined
    //target: 'electron', 

    entry: "./src/index.tsx",
    output: {
        filename: "./build/bundle.js",
    },
    // entry: path.resolve(__dirname, 'src/index.tsx'),
    // output: {
    //     path: path.resolve(__dirname, 'build'),
    //     filename: 'bundle.js',
    // },

    // plugins: [
    //     new webpack.DefinePlugin({
    //         'process.env.NODE_ENV': JSON.stringify(env)
    //     })
    // ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        //  alias: {
        //   'react': pathToReact,
        //   'react-dom': pathToReactDom   
        // },
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
            //,{test: /\.(png|jpg)$/,loader: 'url?limit=25000'}
            //,{test: /\.(png|jpg)$/,loader: 'file-loader'}
            //{test: /\.css$/, loader: 'style!css'}
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ],
        // noParse: [pathToReact,pathToReactDom]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        // "react": "React",
        // "react-dom": "ReactDOM"
    },
};