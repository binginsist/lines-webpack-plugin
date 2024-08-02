const path = require("path");
const {LinesWebpackPlugin} = require("../dist/lines-webpack-plugin.cjs.js");

module.exports = {
    entry: path.resolve(__dirname, "./demo/index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
    },
    mode: "development",
    module: {
        rules: []
    },
    plugins: [
        new LinesWebpackPlugin(
            //可以配置多个检测规则
            [
                {
                    directory: path.resolve(__dirname, './demo'), // 需要检测的目录
                    allowedExtensions: ['.ts', '.js'], // 需要检测的文件后缀
                    maxLines: 12, // 报错最大行数，默认600
                    warningLines: 8, // 警告最大行数，默认500
                    excludedPaths: [path.resolve(__dirname, './demo/list')], // 需要排除文件夹或文件，默认[]
                    errorStatus: false // 如果超过报错限制行数构建过程是否终止，默认true
                }
            ]
        )
    ]
};



