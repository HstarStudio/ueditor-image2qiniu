'use strict';

var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

var getFileContent = (filepath) => fs.readFileSync(filepath, 'utf8');

gulp.task('default', () => {
 return  gulp.src('./src/qiniuUpload.js')
  .pipe(replace('/*@inclide(assets/CryptoJS.js)*/', getFileContent('./src/assets/CryptoJS.js')))
  .pipe(replace('/*@include(upTokenBuilder.js)*/', getFileContent('./src/upTokenBuilder.js')))
  .pipe(gulp.dest('./dist'));
});