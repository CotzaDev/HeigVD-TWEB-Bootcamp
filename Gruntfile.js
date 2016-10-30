// Grunt tasks

module.exports = function (grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
		'* <%= pkg.name %> - v<%= pkg.version %> - MIT LICENSE <%= grunt.template.today("yyyy-mm-dd") %>. \n' +
		'* @author <%= pkg.author %>\n' +
		'*/\n',

		clean: {
			dist: ['src', 'libs']
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			app: {
				src: ['app/modules/**/*.js']
			}
		},

		exec: {
			bowerInstaller: 'bower-installer'
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: false
			},
			base: {
				src: [
					// Angular Project Dependencies,
					'app/app.js',
					'app/app.config.js',
					'app/modules/**/*Module.js',
					'app/modules/**/*Route.js',
					'app/modules/**/*Ctrl.js',
					'app/modules/**/*Service.js',
					'app/modules/**/*Directive.js'
				],
				dest: 'build/assets/js/<%= pkg.name %>-appbundle.js'
			},
			build: {
				src: [
					// Angular Project Dependencies,
					'libs/js/angular/angular.js',
					'libs/js/angular-aria/angular-aria.js',
					'libs/js/angular-resource/angular-resource.js',
					'libs/js/angular-mocks/angular-mocks.js',
					'libs/js/angular-cookies/angular-cookies.js',
					'libs/js/angular-sanitize/angular-sanitize.js',
					'libs/js/angular-animate/angular-animate.js',
					'libs/js/angular-touch/angular-touch.js',
					'libs/js/jquery/jquery.js',
					'libs/js/angular-ui-router/angular-ui-router.js',
					'libs/js/angular-aria/angular-aria.js',
					'libs/js/angular-material/angular-material.js',
					'libs/js/angular-messages/angular-messages.js',
					'libs/js/angular-material-icons/angular-material-icons.min.js',
					'libs/js/chart.js/Chart.js',
					'libs/js/angular-chart.js/angular-chart.js',
					'libs/js/github-url-to-object/gh.js'
				],
				dest: 'build/assets/js/<%= pkg.name %>-angularbundle.js'
			}
		},

		concat_css: {
	    options: {
	    },
	    build: {
				src: [
				],
	      dest: 'build/assets/css/<%= pkg.name %>-angularbundle.css'
	    },
  	},

		uglify: {
			options: {
				banner: '<%= banner %>',
				report: 'min'
			},
			base: {
				src: ['<%= concat.base.dest %>'],
				dest: 'build/assets/js/<%= pkg.name %>-angscript.min.js'
			},
			basePlugin: {
				src: [ 'src/plugins/**/*.js' ],
				dest: 'build/assets/js/plugins/',
				expand: true,
				flatten: true,
				ext: '.min.js'
			}
		},

		connect: {
			server: {
				options: {
					keepalive: true,
					port: 4000,
					base: '.',
					hostname: 'localhost',
					debug: true,
					livereload: true,
					open: true
				}
			}
		},
		concurrent: {
			tasks: ['connect', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},

		watch: {
			app: {
				files: 'app/*/*',
				tasks: ['jshint:app'],
				options: {
					livereload: true
				}
			}
		},

		injector: {
			options: {
				ignorePath: 'build/'
			},
			dev: {
				files: {
					'index.html': [
						'bower.json',
						'app/app.js',
						'app/app.config.js',
						'app/**/*Module.js',
						'app/**/*Route.js',
						'app/**/*Ctrl.js',
						'app/**/*Service.js',
						'app/**/*Directive.js'
					]
				}
			},
			production: {
				files: {
					'build/index.html': [
						'build/assets/js/<%= pkg.name %>*.js',
						'build/assets/css/<%= pkg.name %>*.css'
					]
				}
			}
		},

		ngtemplates: {
			app: {
				src: 'app/modules/**/*.html',
				dest: 'build/assets/js/<%= pkg.name %>-templates.js',
				options: {
					module: '<%= pkg.name %>',
					root: '/',
					standAlone: false
				}
			}
		},

		copy: {
    	production: {
				files: [{
					expand: true,
					cwd: 'assets',
					src: '**',
					dest: 'build/assets/'
				},
				{
					expand: true,
					cwd: 'images',
					src: '**',
					dest: 'build/images/'
				},
				{
					expand: true,
					src: 'index.html',
					dest: 'build/'
				}]
			}
		}

	});

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project if something fail.
	grunt.option('force', true);

	// Register grunt tasks
	grunt.registerTask("build", [
		"jshint",
		"exec",
		"concat",
		"concat_css",
		"ngtemplates",
		"copy:production",
		"injector:production"
		//"clean"
	]);

	// Development task(s).
	grunt.registerTask('dev', ['injector:dev', 'concurrent']);

};
