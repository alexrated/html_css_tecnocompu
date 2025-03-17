/*
Archivo>   >>> gulpfile.js
Proyecto   >>> TecnoCompu Gaming Store Web App
Aprendices >>> 
               Javier Alexander Echeverri Agudelo
               Miguel Alfredo Bermúdez Longas
Programa   >>> ADSO, SENA
Ficha      >>> 2977434
Fecha      >>> diciembre de 2024

-En este archivo se escribe el código JavaScript para
 realizar las compilaciones del código SCSS a CSS, se
 minifica el código CSS, se comprimen imágenes y se
 convierten a formatos web (webp y avif)
*/

// Se importan módulos JS:
const { src, dest, watch, series, parallel } = require('gulp');

// CSS y dependencias SASS:
const sass = require('gulp-sass')(require('sass')); // Se importan 2 módulos y se guardan en la función sass
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// Manejo de errores (excepciones)
const plumber = require('gulp-plumber');

// Sourcemaps:
const sourcemaps = require('gulp-sourcemaps');

// Minificar el código CSS compilado desde formato SCSS:
const cssnano = require('cssnano');

// Dependencias de imágenes:
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Función para realizar la compilación del código SCSS a CSS:
function css(done)
{
  // ***** pasos para compilar SCSS *****
  src('src/scss/app.scss') // 1. Archivo a compilar
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass()) // 2. Compilar
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css')); // 3. Guardar la hoja de estilos .css  
  done();
}

// Guardar imágenes en el directorio "build":
function imagenes() {
  return src('src/img/**/*')
    .pipe( imagemin( {optimizationLevel: 3} ) )
    .pipe( dest('build/img') );
}

// Convertir de .jpg a .webp:
function versionWebp() {
  return src('src/img/**/*.{png,jpg}')
    .pipe(webp())
    .pipe(dest('build/img'));
}

// .jpg a .avif:
function versionAvif() {
 const opciones = {
   quality: 50
 }
 return src('src/img/**/*.{png,jpg}')
   .pipe(avif(opciones))
   .pipe(dest('build/img'));
}

// Función Watch para recarga automática en LiveServer (no se puede llamar "watch"):
function dev(done)
{
  watch('src/scss/**/*.scss', css);
  watch('src/img/**/*', imagenes);
  done();
}

// Exportando funciones EN ORDEN para ser ejecutadas por terminal (usar el comando gulp + nombre de la función:)
exports.css = css;
exports.dev = dev;
exports.build = series(imagenes, versionWebp, versionAvif, css);
// exports.build = series(imagenes, versionWebp, css);
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);
// exports.default = series(imagenes, versionWebp, css, dev);
// exports.default = series(css, dev);