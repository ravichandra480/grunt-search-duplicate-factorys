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
                    duplicates.push({
                        factoryName: factoryName,
                        source:  filePaths
                    });
                }
            });
        });

        if (duplicates.length > 0) {
            console.log(JSON.stringify(duplicates, null, 4));
            grunt.log.writeln(JSON.stringify(duplicates, null, 4));
            grunt.fail.fatal("Duplicate factory's found this will break application");
        }
        console.log("====== No duplicate factory names ==========");
    }
    function findFrequency(arr, searchValue) {
        return arr.filter((value) => value.toLowerCase() === searchValue.toLowerCase()).length;
    }
};
