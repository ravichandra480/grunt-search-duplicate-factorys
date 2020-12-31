"use strict";

module.exports = function(grunt) {

    grunt.initConfig({

        searchDuplicateNgFactories: {
            default: {
                files: {
                    src: "**"
                }
            }
        },
    });

    grunt.loadTasks('tasks');

    // by default, lint and run all tests
    grunt.registerTask('default', ['searchDuplicateNgFactories']);
};
