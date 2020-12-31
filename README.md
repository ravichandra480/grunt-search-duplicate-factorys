# grunt-search-duplicate-ng-factories

This is a Grunt plugin that searches a list of files for duplicate factory names, if it founds any duplicate match it will fail the build

### Installation

In your project folder, run the following command:

```js
npm install grunt-search-duplicate-ng-factories --save-dev
```

Once the plugin has been installed, you need to add this line of JS to your gruntfile:

```js
grunt.loadNpmTasks('grunt-search-duplicate-ng-factories');
grunt.registerTask('default', ['searchDuplicateNgFactories']);
```


### Usage examples

```js
grunt.initConfig({
    searchDuplicateNgFactories: {
        default: {
            files: {
                src: "test/**"
            }
        }
    },
});
