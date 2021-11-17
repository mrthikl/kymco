// Gruntfile.js
module.exports = (grunt) => {
  // Load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
  require("load-grunt-tasks")(grunt);
  const mozjpeg = require("imagemin-mozjpeg");
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    dirs: {
      dest: "src/dest",
      css: "src/css",
      scss: "src/scss",
      img: "src/img",
      js: "src/js",
    },

    // minify / uglify js
    uglify: {
      my_target: {
        files: {
          "<%= dirs.dest %>/jsmain.min.js": ["<%= dirs.js %>/libs/*.js"],
        },
      },
    },
    cssmin: {
      options: {
        keepSpecialComments: 0,
      },
      my_target: {
        files: [
          {
            "<%= dirs.dest %>/stylelibs.min.css": ["<%= dirs.css %>/**/*.css"],
          },
        ],
      },
    },
    sass: {
      dist: {
        options: {
          style: "compressed",
          sourcemap: false,
          noCache: true,
          lineNumbers: true,
        },
        files: {
          "<%= dirs.dest %>/style.min.css": "<%= dirs.scss %>/style.scss",
        },
      },
    },

    // imagemin
    imagemin: {
      static: {
        options: {
          optimizationLevel: 3,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()], // Example plugin usage
        },
      },
      dynamic: {
        files: [
          {
            expand: true,
            cwd: "<%= dirs.dest %>/img",
            src: ["**/*.{png,jpg,svg}"],
            dest: "<%= dirs.dest %>/img",
          },
        ],
      },
    },

    watch: {
      options: {
        livereload: true,
        spawn: false,
      },
      sass: {
        files: "<%= dirs.scss %>/**/**/*.scss",
        tasks: ["sass"],
      },
      // cssmin: {
      //     files: "<%= dirs.css %>/**/*.css",
      //     tasks: ['cssmin']
      // },
      uglify: {
        files: ["<%= dirs.js %>/*.js"],
        tasks: ["uglify"],
      },
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            "<%= dirs.dest %>/style.min.css",
            "src/*.html",
            "<%= dirs.dest %>/*.js",
            "<%= dirs.dest %>/img/**/*.{png,jpg,svg}"
          ],
        },
        options: {
          watchTask: true,
          server: "src",
        },
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-browser-sync");
  grunt.registerTask("default", ["browserSync", "watch", "imagemin"]);
};
