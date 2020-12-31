"use strict";

module.exports = function(grunt) {

    grunt.initConfig({

        ngSearchDuplicateFactories: {
            default: {
                files: {
                    src: "**"
                }
            }
        },
    });

    grunt.loadTasks('tasks');

    // by default, lint and run all tests
    grunt.registerTask('default', ['ngSearchDuplicateFactories']);
};
