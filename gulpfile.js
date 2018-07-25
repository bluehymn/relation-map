var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var rev = require("gulp-rev");
var revCollector = require("gulp-rev-collector");
var buffer = require("vinyl-buffer");
var minifyHTML = require("gulp-minify-html");
var uglify = require("gulp-uglify");
var del = require("del");

var paths = {
  pages: ["demo/*.html"]
};

gulp.task("copyhtml", function() {
  del.sync(['dist/*']);
  return gulp.src("./demo/*.html").pipe(gulp.dest("dist"));
});

gulp.task("compile", function() {
  return browserify({
    basedir: ".",
    debug: false,
    entries: ["demo/index.ts"],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(rev())
    .pipe(uglify())
    .pipe(gulp.dest("dist"))
    .pipe(rev.manifest())
    .pipe(gulp.dest("rev"));
});

gulp.task("rev", function() {
  return gulp
    .src(["rev/*.json", "demo/*.html"])
    .pipe(
      revCollector({
        replaceReved: true,
        dirReplacements: {}
      })
    )
    .pipe(
      minifyHTML({
        empty: true,
        spare: true
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copyhtml", "compile", "rev"]);

var watcher = gulp.watch(["src/*.ts", "demo/*.ts", "demo/*.html"], ["default"]);
watcher.on("change", function(event) {
  console.log(
    "File " + event.path + " was " + event.type + ", running tasks..."
  );
});
