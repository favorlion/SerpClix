var  gulp = require("gulp"),
    rename = require("gulp-rename"),
    del = require("del"),
    exec = require("child_process").execSync,
    path = require("path"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    VENV = "~/venvs/webp2/bin/python",
    ADDON_DOWNLOAD_DIR = "website/payments/downloads",
    ADDON_DOWNLOAD_NAME = "serpclixclicksense.xpi";

gulp.task("create_test_addon", createAddon("Firefox-Ext/test/res", "addon.xpi"));

gulp.task("package_addon", createAddon(ADDON_DOWNLOAD_DIR, ADDON_DOWNLOAD_NAME));

gulp.task("create_signed_addon", function() {
  exec("web-ext sign  -s WebExtension --api-key user:10512494:837 --api-secret 374a025c6c7e68c7e88444c8fe32e37d707f7220777eb436be38afa17cf6e21b")
});

gulp.task("minify_html", function() {
  return gulp.src("website/**/*.html")
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(function(f) {
        return path.dirname(f.path);
      }));
});

gulp.task("collectstatic", function() {
  return exec(VENV + " website/manage.py collectstatic")
});

gulp.task("minify_js", ["collectstatic"], function() {
  return gulp.src("website/static/**/*.js")
      .pipe(uglify())
      .pipe(gulp.dest(function(f) {
        return path.dirname(f);
      }));
});

function createAddon(dest, targetName) {
  return function() {
    exec("jpm xpi");
    gulp.src("*.xpi")
      .pipe(rename(targetName))
      .pipe(gulp.dest(dest))
      .on("end", function () {
        del("./*.xpi");
      });
  }
}
