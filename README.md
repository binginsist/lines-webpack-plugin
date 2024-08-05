<h1 align="center">lines-webpack-plugin</h1>

<p align="center">用于限制项目中指定目录下每个文件行数的webpack插件</p>

<p align="center">
    <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/binginsist/lines-webpack-plugin" />
    <img src="https://img.shields.io/github/languages/top/binginsist/lines-webpack-plugin?style=flat-square&color=green"  alt="GitHub top language" />
    <img src="https://img.shields.io/badge/dynamic/json?color=green&label=github&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dgithub%26queryKey%3Dbinginsist&style=flat-square&logo=github" />
    <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/binginsist/lines-webpack-plugin?color=yellow">
</p>

---

## 简介

前端项目开发中，文件行数过多，影响代码的可读性。本插件可以自定义指定目录下每个文件的行数限制，超过限制则警告或者报错。可以用于提醒开发者合理规划文件大小。

## 安装使用

### 1. 安装包使用方式

```shell
# npm
npm install lines-webpack-plugin -D
或
npm install lines-webpack-plugin -D --registry=https://registry.npmmirror.com

# yarn
yarn add lines-webpack-plugin -D
```

### 2.如何使用
- webpack.config.js 中引入插件
```js
const path = require("path");
const {LinesWebpackPlugin} = require("lines-webpack-plugin");
```

```js
plugins: [
    new LinesWebpackPlugin(
        //可以配置多个检测规则
        [
            {
                directory: path.resolve(__dirname, './demo'), // 需要检测的目录
                allowedExtensions: ['.ts', '.js'], // 需要检测的文件后缀,默认['ts','tsx','js']
                maxLines: 12, // 报错最大行数，默认600
                warningLines: 8, // 警告最大行数，默认500
                excludedPaths: [path.resolve(__dirname, './demo/list')], // 需要排除文件夹或文件，默认[]
                errorStatus: false // 如果超过报错限制行数构建过程是否终止，默认true
            }
        ]
    )
]
```

- 使用webpack-chain时
```js
const path = require("path");
const {LinesWebpackPlugin} = require("lines-webpack-plugin");
```

```js
config.plugin('LinesWebpackPlugin').use(LinesWebpackPlugin,
        [
            [{
                directory: path.resolve(__dirname, './demo'), // 需要检测的目录
                allowedExtensions: ['.ts', '.js'], // 需要检测的文件后缀,默认['ts','tsx','js']
                maxLines: 12, // 报错最大行数，默认600
                warningLines: 8, // 警告最大行数，默认500
                excludedPaths: [path.resolve(__dirname, './demo/list')], // 需要排除文件夹或文件，默认[]
                errorStatus: false // 如果超过报错限制行数构建过程是否终止，默认true
            }]
        ]
    );
return config;
```
### 3. 参数说明
- 可以定义多个规则，所以参数传入的是一个数组，数组中为一个或多个对象，每个对象参数说明如下： 

| 参数                | 说明                                                 | 默认值                         |
|:------------------|:---------------------------------------------------|:----------------------------|
| directory         | 需要检测项目中的哪个文件夹,使用path.resolve(__dirname, './')      | 必填                          |
| allowedExtensions | 需要检测的文件的后缀名                                        | 选填,默认值['ts','tsx','js']     |
| maxLines | 当检测的文件超过报错最大行数时，会打印出超出的文件路径及当前文件行数                 | 选填,默认值600                    |
| warningLines | 当检测的文件超过警告最大行数时，会打印出超出的文件路径及当前文件行数                 | 选填,默认值500                   |
| excludedPaths | 需要排除哪些文件或者文件夹                                      | 选填,默认值[]                    |
| errorStatus | 如果超过报错限制行数构建过程是否终止                                 | 选填,默认值true                  |


### 4. 测试例子

```shell
# npm
cd lines-webpack-plugin

npm install 
或
npm install --registry=https://registry.npmmirror.com

npm run example
```
### 5. 提示内容

```text
Warning: File E:\other\ceshi\plugins\lines-webpack-plugin\example\demo\warning.js has more than warningLines(8) lines：9
Error: File E:\other\ceshi\plugins\lines-webpack-plugin\example\demo\test.js has more than maxLines(12) lines：18
超出警告或者报错限制行数，会在控制台打印如上内容
第一条为警告提示内容，颜色为洋红色
第二条为报错提示内容，颜色为红色

```