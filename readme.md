# feng3d-editor
feng3d引擎编辑器
编辑器基于[react](https://github.com/facebook/react)、[material-ui](https://github.com/callemall/material-ui)开发。
使用webpack打包

## 运行项目
1. 安装webpack

    `cnpm install -g webpack`

1. 安装npm依赖

    `cnpm install`
    
1. 链接TypeScript，允许ts-loader使用全局安装的TypeScript，而不需要单独的本地拷贝。

    `npm link typescript`

1. 打包编译项目

    `webpack` 或者 `ctrl+shift+B`
    
1. 运行项目

    有两种方式运行该项目
        
    * 网页方式
        
        * 开启http服务器（比如http-server，使用cnpm install -g http-server安装，http-server命令开启）浏览index.html
        * 按F5键启动chrome浏览index.html文件（如果需要使用chrome进行调试，请安装VSCode插件Debugger for Chrome已经参考相关文档，不过我经历过多次无法正常调试的情况，目前只能估计插件版本问题）

    * 本地应用方式

        `npm start`

## 参考
[React & Webpack](http://www.tslang.cn/docs/handbook/react-&-webpack.html)