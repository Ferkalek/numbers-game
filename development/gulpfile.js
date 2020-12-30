// https://webdesign-master.ru/blog/tools/gulp-4-lesson.html

let preprocessor = "scss";

// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require("gulp");

// Подключаем Browsersync
const browserSync = require("browser-sync").create();

// Подключаем gulp-concat
const concat = require("gulp-concat");

// Подключаем gulp-uglify-es
const uglify = require("gulp-uglify-es").default;

// Подключаем модули gulp-sass и gulp-less
const scss = require("gulp-sass");
const less = require("gulp-less");

// Подключаем Autoprefixer
const autoprefixer = require("gulp-autoprefixer");

// Подключаем модуль gulp-clean-css
const cleancss = require("gulp-clean-css");

function browsersync() {
  browserSync.init({
    // Инициализация Browsersync
    server: { baseDir: "src/" }, // Указываем папку сервера
    notify: false, // Отключаем уведомления
    online: true, // Режим работы: true или false
  });
}

function scripts() {
  return src(["src/js/partials/lang.js", "src/js/partials/app.js"])
    .pipe(concat("main.js")) // Конкатенируем в один файл
    .pipe(uglify()) // Сжимаем JavaScript
    .pipe(dest("js/")) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
}

function styles() {
  return src("src/" + preprocessor + "/main." + preprocessor + "") // Выбираем источник: "src/sass/main.sass" или "src/less/main.less"
    .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat("main.css")) // Конкатенируем в файл app.min.js
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    ) // Создадим префиксы с помощью Autoprefixer
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } } /* , format: 'beautify' */,
      })
    ) // Минифицируем стили
    .pipe(dest("css/")) // Выгрузим результат в папку "css/"
    .pipe(browserSync.stream()); // Сделаем инъекцию в браузер
}

function startwatch() {
  // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(["src/**/*.js", "!src/**/*.min.js"], scripts);

  // Мониторим файлы препроцессора на изменения
  watch("src/**/" + preprocessor + "/**/*", styles);

  // Мониторим файлы HTML на изменения
  watch("src/**/*.html").on("change", browserSync.reload);
}

function buildcopy() {
  return src(
    [
      // Выбираем нужные файлы
      "src/css/**/*.min.css",
      "src/js/**/*.min.js",
      "src/**/*.html",
    ],
    { base: "src" }
  ) // Параметр "base" сохраняет структуру проекта при копировании
    .pipe(dest("dist")); // Выгружаем в папку с финальной сборкой
}

function cleandist() {
  return del("dist/**/*", { force: true }); // Удаляем всё содержимое папки "dist/"
}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(scripts, styles, browsersync, startwatch);

// Создаём новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist, styles, scripts, buildcopy);
