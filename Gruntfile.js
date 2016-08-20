module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            css: {
                src: "public/stylesheets/*.css",
                dest: "public/stylesheets/stage/styles.css"
            },
            js: {
                src: "public/javascripts/lib/*.js",
                dest: "public/javascripts/libs.js"
            }
        },
        cssmin: {
            dist: {
                src: "public/stylesheets/stage/styles.css",
                dest: "public/stylesheets/dist/styles.min.css"
            }
        },
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "public/javascripts",
                    src: ["*.js", "!**/*.min.js"],
                    dest: "public/javascripts/dist",
                    ext: ".min.js"
                }]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Default task(s).
    grunt.registerTask("default", ["concat", "cssmin", "uglify"]);
};
