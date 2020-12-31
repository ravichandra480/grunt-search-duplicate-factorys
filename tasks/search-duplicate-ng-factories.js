var fs = require('fs');

"use strict";
module.exports = function (grunt) {
    grunt.registerMultiTask(
        "searchDuplicateNgFactories",
        "Grunt plugin that searches for duplicate angular factories",
        ngSearchDuplicateFactories
    );
    function ngSearchDuplicateFactories() {
        var duplicates = [];
        this.files.forEach(function (file) {
            var filePaths = [];
            var allFactoryNames = new Set();
            var matches = {};
            file.src.forEach(function (filepath) {
                if (grunt.file.isDir(filepath)) {
                    return;
                }
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                } else {
                    filePaths.push(filepath);
                }
            });
            filePaths.forEach((filePath) => {
                var file = filePath;
                var src = grunt.file.read(file);
                var lines = src.split("\n");
                var factoryNames = [];
                var searchStringStart = 'factory(';
                var searchStringEnd = ',';
                lines.forEach((line) => {
                    var factoryName = null;
                    if (line) {
                        var firstIndex = line.lastIndexOf(searchStringStart);
                        var lastIndex = line.lastIndexOf(searchStringEnd);
                        if (firstIndex > -1 && lastIndex > -1) {
                            factoryName = line.substring(
                                firstIndex + searchStringStart.length, lastIndex
                            );
                        }
                        if (factoryName) {
                            factoryNames.push(factoryName);
                            allFactoryNames.add(factoryName);
                        }
                    }
                });
                matches[file] = factoryNames;
            });
            Array.from(allFactoryNames).forEach((factoryName) => {
                var filePaths = [];
                var allMatchedFactoryNameCount = 0;
                Object.keys(matches).forEach((filePath) => {
                    var matchedFactoryNameCount = 0;
                    matchedFactoryNameCount = matchedFactoryNameCount + findFrequency(matches[filePath], factoryName);
                    allMatchedFactoryNameCount = allMatchedFactoryNameCount + matchedFactoryNameCount;
                    if (matchedFactoryNameCount > 0) {
                        filePaths.push({
                            filePath: filePath,
                            frequency: matchedFactoryNameCount
                        })
                    }
                });
                if (allMatchedFactoryNameCount > 1) {
                    filePaths.forEach((fileInfo) => {
                        duplicates.push({
                            factoryName: factoryName,
                            sourceFilePath: fileInfo.filePath,
                            frequency: fileInfo.frequency
                        });
                    });
                }
            });
        });

        if (duplicates.length > 0) {
            createXlsLogFile(duplicates);
            console.log(JSON.stringify(duplicates, null, 4));
            console.log('\x1b[41m', '\x1b[37m', 'Number of duplicate factories : ' + duplicates.length, '\x1b[0m');
            console.log('\x1b[44m', '\x1b[37m', 'Log info can be find in the file duplicate-ng-factories.xls', '\x1b[0m');
            grunt.fail.fatal("Duplicate factory's found this will break application");
        }
        console.log("====== No duplicate factory names ==========");
    }

    function findFrequency(arr, searchValue) {
        return arr.filter((value) => value.toLowerCase() === searchValue.toLowerCase()).length;
    }

    function createXlsLogFile(data) {
        fs.createWriteStream("duplicate-ng-factories.xls");
        var CSV;
        var row = 'Factory name' + ',' + 'Source file path' + ',' + 'Number of times name used';
        row = row.slice(0, -1);
        CSV += row + '\r\n';
        for (var i = 0; i < data.length; i++) {
            row = "";
            for (var index in data[i]) {
                row += '"' + data[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }
        grunt.file.write("duplicate-ng-factories.xls", CSV);
    }
};
