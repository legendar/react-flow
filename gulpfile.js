var gulp = require('gulp'),
  browserify = require('browserify'),
  del = require('del'),
  source = require('vinyl-source-stream'),
  babelify = require('babelify');


var paths = {
    srcJs: ['./main.js'],
    js: ['./bundle.js']
}


gulp.task('clean', function(done){
    del(['build'], done)
})


gulp.task('js', ['clean'], function() {
        browserify({debug: true})
        .transform(babelify)
        .require('./main.js', {entry: true})
        .bundle()
        .on("error", function (err) { console.log("Error: " + err.message); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./static/'));
})


// Rerun tasks whenever a file changes.
gulp.task('watch', ['js'], function() {
    gulp.watch(paths.srcJs, ['js']);
});
