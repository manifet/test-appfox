const {SRC_PATH, DIST_PATH, NODE_ENV} = require("./gulp.config.js");
const {src, dest, task, series, watch, parallel} = require("gulp");

const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const rm = require("gulp-rm");
const gulpif = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const gcmq = require("gulp-group-css-media-queries");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const pug = require("gulp-pug");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

const reload = browserSync.reload;
sass.compiler = require("node-sass");

const ENV_DEV = NODE_ENV === "dev";
const ENV_PROD = NODE_ENV === "prod";

task("clean", () => {
    return src(`${DIST_PATH}/**/*`, {read: false}).pipe(rm());
});

task("copy:images", () => {
    return src(`${SRC_PATH}/images/**/*`)
        .pipe(dest(`${DIST_PATH}/images`))
        .pipe(reload({stream: true}));
});

task("copy:fonts", () => {
    return src(`${SRC_PATH}/fonts/**/*`)
        .pipe(dest(`${DIST_PATH}/fonts`))
        .pipe(reload({stream: true}));
});

task("html", () => {
    return src(`${SRC_PATH}/pages/*.pug`)
        .pipe(pug())
        .pipe(dest(DIST_PATH))
        .pipe(reload({stream: true}));
});

task('scripts', () => {
    return src(`${SRC_PATH}/scripts/*.js`)
        .pipe(concat("main.js"))
        .pipe(
            gulpif(
                ENV_PROD,
                babel({
                    presets: ["@babel/env"]
                })
            )
        )
        .pipe(gulpif(ENV_PROD, uglify()))
        .pipe(dest(DIST_PATH))
        .pipe(reload({stream: true}));
});

task("styles", () => {
    return src(`${SRC_PATH}/styles/main.scss`)
        .pipe(gulpif(ENV_DEV, sourcemaps.init()))
        .pipe(sassGlob())
        .pipe(sass().on("error", sass.logError))
        .pipe(gulpif(ENV_PROD, gcmq()))
        .pipe(gulpif(ENV_PROD, cleanCSS()))
        .pipe(gulpif(ENV_PROD, autoprefixer()))
        .pipe(gulpif(ENV_DEV, sourcemaps.write()))
        .pipe(dest(DIST_PATH))
        .pipe(reload({stream: true}));
});

task("server", () => {
    browserSync.init({
        server: {
            baseDir: DIST_PATH
        }
    });
});
task("watch", () => {
    watch(`${SRC_PATH}/images/**/*`, series("copy:images")).on("change", reload);
    watch(`${SRC_PATH}/fonts/**/*`, series("copy:fonts")).on("change", reload);
    watch(`${SRC_PATH}/pug/**/*.pug`, series("html")).on("change", reload);
    watch(`${SRC_PATH}/scripts/**/*.js`, series("scripts")).on("change", reload);
    watch(`${SRC_PATH}/sass/**/*.scss`, series("styles")).on("change", reload);
});

task(
    "default",
    series(
        "clean",
        parallel("copy:images", "copy:fonts", "html", "styles", "scripts"),
        parallel("watch", "server")
    )
);