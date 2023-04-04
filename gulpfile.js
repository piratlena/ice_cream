const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const webpack = require("webpack-stream");

const dist = "dist";

gulp.task("server", function () {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });

  gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("styles", function () {
  return gulp
    .src("src/assets/sass/**/*.+(scss|sass)")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(browserSync.stream());
});

gulp.task("html", function () {
  return gulp
    .src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist/"));
});

gulp.task("scripts", function () {
  return gulp.src("src/js/**/*.js").pipe(gulp.dest("dist/js"));
});

gulp.task("fonts", function () {
  return gulp.src("src/assets/fonts/**/*").pipe(gulp.dest("dist/assets/fonts"));
});

gulp.task("images", function () {
  return gulp
    .src("src/assets/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/assets/img"));
});

gulp.task("icons", function () {
  return gulp.src("src/assets/icons/**/*").pipe(gulp.dest("dist/assets/icons"));
});

gulp.task("watch", function () {
  gulp.watch("src/assets/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
  gulp.watch("src/*.html").on("change", gulp.parallel("html"));
  gulp.watch("./src/js/*.js").on("change", browserSync.reload);
});
gulp.task(
  "default",
  gulp.parallel(
    "watch",
    "server",
    "styles",
    "html",
    "scripts",
    "fonts",
    "icons",
    "html",
    "images"
  )
);

gulp.task("copy-html", () => {
  return gulp
    .src("src/index.html")
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
});

gulp.task("build-js", () => {
  return gulp
    .src("./src/js/main.js")
    .pipe(
      webpack({
        mode: "development",
        output: {
          filename: "script.js",
        },
        watch: false,
        devtool: "source-map",
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(dist))
    .on("end", browserSync.reload);
});

gulp.watch("./src/index.html", gulp.parallel("copy-html"));
gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));

gulp.task("build", gulp.parallel("copy-html", "build-js"));

function vendorJS() {
  const modules = [
    "node_modules/swiper/swiper-bundle.min.js",
    "node_modules/swiper/swiper-bundle.min.js.map",
  ];

  return src(modules).pipe(dest("dist/js"));
}

function vendorCSS() {
  const modules = ["node_modules/swiper/swiper-bundle.min.css"];

  return src(modules).pipe(dest("dist/css"));
}
exports.copy = gulp.parallel(vendorCSS, vendorJS);
