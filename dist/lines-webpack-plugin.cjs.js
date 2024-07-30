'use strict';

var fs = require('fs');

var path = require('path');
var LOG_COLOR = '\x1B[31m ';
var LinesWebpackPlugin = /** @class */ (function () {
    function LinesWebpackPlugin(options) {
        this.options = options;
        this.fileList = [];
    }
    LinesWebpackPlugin.prototype.checkFileLines = function (config, filePath) {
        var directory = config.directory, _a = config.allowedExtensions, allowedExtensions = _a === void 0 ? ['ts', 'tsx', 'js'] : _a, _b = config.excludedPaths, excludedPaths = _b === void 0 ? [] : _b, _c = config.maxLines, maxLines = _c === void 0 ? 600 : _c, _d = config.warningLines, warningLines = _d === void 0 ? 500 : _d, _e = config.errorStatus, errorStatus = _e === void 0 ? true : _e;
        if (filePath.startsWith(directory) &&
            allowedExtensions.includes(path.extname(filePath)) &&
            !excludedPaths.some(function (excludedPath) { return filePath.startsWith(excludedPath); })) {
            if (this.fileList.includes(filePath)) {
                return;
            }
            var content = fs.readFileSync(filePath, 'utf-8');
            var lines = content.split(/\r?\n/).length;
            if (lines > maxLines) {
                console.error("".concat(LOG_COLOR, "Error: File ").concat(filePath, " has more than maxLines(").concat(maxLines, ") lines\uFF1A").concat(lines));
                this.fileList.push(filePath);
                //不想影响构建过程,只是想要打印超出限制的文件,可以将errorStatus设置为false
                if (errorStatus) {
                    console.error("".concat(LOG_COLOR, "------LinesWebpackPlugin: Build error due to line limit exceeded------"));
                    process.exit(1);
                }
            }
            else if (lines > warningLines) {
                console.warn("".concat(LOG_COLOR, "Warning: File ").concat(filePath, " has more than warningLines(").concat(warningLines, ") lines\uFF1A").concat(lines));
                this.fileList.push(filePath);
            }
        }
    };
    LinesWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.normalModuleFactory.tap('LinesWebpackPlugin', function (nmf) {
            try {
                nmf.hooks.module.tap('LinesWebpackPlugin', function (module) {
                    var directoriesConfig = _this.options;
                    var filePath = module.resource;
                    if (!directoriesConfig || !Array.isArray(directoriesConfig)) {
                        console.error("".concat(LOG_COLOR, "Params must be an array:"), directoriesConfig);
                        return;
                    }
                    directoriesConfig.forEach(function (config) {
                        _this.checkFileLines(config, filePath);
                    });
                });
            }
            catch (err) {
                console.error(err);
            }
        });
    };
    return LinesWebpackPlugin;
}());

exports.LinesWebpackPlugin = LinesWebpackPlugin;
