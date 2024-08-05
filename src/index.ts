'use strict'
import {Compiler} from 'webpack';
import fs from "fs";

const path = require('path');


// 定义插件配置接口
interface DirectoryConfig {
    directory: string; // 需要检测的目录
    allowedExtensions?: string[]; // 需要检测的文件后缀
    maxLines?: number; // 报错最大行数，默认600
    warningLines?: number; // 警告最大行数，默认500
    excludedPaths?: string[]; // 需要排除文件夹或文件，默认[]
    errorStatus?: boolean; // 如果超过报错限制行数构建过程是否终止，默认true
}

const LOG_COLOR_WARNING = '\x1B[35m '
const LOG_COLOR_ERROR = '\x1B[31m '

class LinesWebpackPlugin {

    private options: DirectoryConfig[];
    private fileList: string[];

    constructor(options: DirectoryConfig[]) {
        this.options = options;
        this.fileList = [];
    }

    private checkFileLines(config: DirectoryConfig, filePath: string): void {
        const {
            directory,
            allowedExtensions = ['ts','tsx','js'],
            excludedPaths = [],
            maxLines = 600,
            warningLines = 500,
            errorStatus = true
        } = config;
        if (
            filePath.startsWith(directory) &&
            allowedExtensions.includes(path.extname(filePath)) &&
            !excludedPaths.some(excludedPath => filePath.startsWith(excludedPath))
        ) {
            if (this.fileList.includes(filePath)) {
                return
            }

            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split(/\r?\n/).length;
            if (lines > maxLines) {
                console.error(`${LOG_COLOR_ERROR}Error: File ${filePath} has more than maxLines(${maxLines}) lines：${lines}`);
                this.fileList.push(filePath)
                //不想影响构建过程,只是想要打印超出限制的文件,可以将errorStatus设置为false
                if (errorStatus) {
                    console.error(`${LOG_COLOR_ERROR}------LinesWebpackPlugin: Build error due to line limit exceeded------`);
                    process.exit(1)
                }
            } else if (lines > warningLines) {
                console.warn(`${LOG_COLOR_WARNING}Warning: File ${filePath} has more than warningLines(${warningLines}) lines：${lines}`);
                this.fileList.push(filePath)
            }
        }
    }

    apply(compiler: Compiler) {
        compiler.hooks.normalModuleFactory.tap('LinesWebpackPlugin', (nmf: any) => {
            try {
                nmf.hooks.module.tap('LinesWebpackPlugin', (module:any) => {
                    const directoriesConfig = this.options;
                    const filePath = module.resource;
                    if (!directoriesConfig || !Array.isArray(directoriesConfig)) {
                        console.error(`${LOG_COLOR_ERROR}Params must be an array:`, directoriesConfig)
                        return;
                    }
                    directoriesConfig.forEach(config => {
                        this.checkFileLines(config, filePath);
                    })
                });
            } catch (err) {
                console.error(err)
            }

        });
    }
}

export {LinesWebpackPlugin, DirectoryConfig}