var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task("default", function() {
    var options = {
        port: 1338,
        livereload: false
    }

    gulp.src(".").pipe(webserver(options));
});