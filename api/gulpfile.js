const gulp = require('gulp');

const gulpWatch = require('gulp-watch');
const gulpTS = require('gulp-typescript');

const tsProject = gulpTS.createProject('tsconfig.json');

const compileTarget = './app/';

function humblebundle() {
	return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('app'));
}

gulp.task('default', function () {
	return humblebundle();
});

gulp.task('watch:ts', function () {
	return gulpWatch('src/**/*.ts', {
		ignoreInitial: false
	})
	.pipe(gulp.dest('default'));
});


const babel = require('gulp-babel');
//var rename = require('gulp-rename');

gulp.task('tsc', function() {

	return gulp.src("src/**/*.ts", { base: "./" })
		.pipe(tsProject())
	/*	.pipe(babel({
			presets: ['es2015'],
		//	optional: ["runtime"]
			plugins: [
				[ "babel-plugin-root-import", {
					"rootPathSuffix": "app/"
				}]
			],
		}))	*/
//		.pipe(rename(function (path) {
//			path.extname = ".js";
//		}))
		.pipe(gulp.dest("./app/"));
});

//gulp.task('ts-babel', ['tsc', 'babel']);


/*
		"babel-eslint": "7.1.1",

		"plugins": [ [
			"babel-root-slash-import", {
				"rootPathSuffix": "src"
			}
		] ],



"baseUrl": "src",
"paths": {
    "actions/*": [ "app/actions/*" ],
    "selectors/*": [ "app/selectors/*" ],
    "ui/*": [ "app/ui/*" ],
    "logger": [ "util/logger" ],
}


*/

var del = require('del');

gulp.task('clean', function() {
	// You can use multiple globbing patterns as you would with `gulp.src`
	return del(['build']);
});
