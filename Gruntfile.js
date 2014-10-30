module.exports = function(grunt) {
	grunt.initConfig({
		clean: ['prod', '.sass-cache/'],
		copy: {
			main: {
				files: [{
					expand: true,
					src: '**',
					dest: 'dev/stylesheets/bootstrap/',
					cwd: 'bower_components/bootstrap-sass-official/assets/'
				}, {
					expand: true,
					src: '**',
					dest: 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/fonts/',
					cwd: 'dev/fonts/'
				}]
			}
		},
		jade: {
			compile: {
				files: [{
					src: ['**/*.jade', '!**/incl/*.jade'],
					dest: 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/',
					cwd: 'dev/templates',
					expand: true,
					ext: '.html'
				}]
			},
			options: {
				pretty: true
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
					preserveLineBreaks: true,
					removeScriptTypeAttributes: true
				},
				files: {
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/index.html': 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/index.html'
				}
			}
		},
		sass: {
			prod: {
				files: {
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/css/main.css': 'dev/stylesheets/main.scss',
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/css/email_main.css': 'dev/stylesheets/email_main.scss'
				},
				options: {
					compass: true,
					style: 'compressed'
				}
			}
		},
		premailer: {
			simple: {
				options: {
					removeComments: true
				},
				files: [{
					expand: true,
					src: ['prod/build_<%= grunt.template.today("m-d-yyyy") %>/email/*.html'],
					dest: ''
				}]
			}
		},
		bower_concat: {
			all: {
				dest: 'dev/js/libs/_libs.js',
				exclude: ['modernizr', 'requirejs', 'normalize.scss']
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			main: {
				src: [
					'dev/js/libs/_libs.js',
					'dev/js/*.js'
				],
				dest: 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.min.js'
			}
		},
		// Сжимаем
		uglify: {
			options: {
				mangle: false,
				compress: true
			},
			main: {
				files: {
					// Результат задачи concat
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.min.js': '<%= concat.main.dest %>'
				}
			}
		},
		zopfli: {
			'compress-plugins': {
				'options': {
					'report': false, // don’t show original and compressed size (default: `true`)
					'iterations': 50, // min value: `1`; (undocumented) max value: `99999999999` (default: `15`)
					'format': 'zlib', // `'gzip'`, `'zlib'`, `'deflate'` (default: `'gzip'`)
					'splitLast': true // perform block splitting first instead of last (default: `false`)
				},
				'files': {
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.min.js.gz': 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.min.js'
				}
			}
		},
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					src: ['**/*.{png,jpg,gif}'],
					cwd: 'dev/img',
					dest: 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/img/'
				}]
			}
		},
		watch: {
			javascript: {
				files: [ /*'dev/js/libs/jquery.js', */ 'dev/js/*.js'],
				tasks: ['concat' /*, 'uglify'*/ ],
				options: {
					livereload: true
				}
			},
			scss: {
				files: ['dev/stylesheets/*.scss'],
				tasks: 'sass',
				options: {
					livereload: true
				}
			},
			templates: {
				files: ['dev/templates/*.jade', 'dev/templates/incl/*.jade', 'dev/templates/email/*.jade'],
				tasks: 'jade',
				options: {
					livereload: true
				}
			},
			images: {
				files: ['dev/img/*.{png,jpg,gif}'],
				tasks: ['imagemin'],
				options: {
					livereload: true
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 3000,
					base: 'prod/build_<%= grunt.template.today("m-d-yyyy") %>'
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	// grunt.loadNpmTasks('grunt-webp');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-premailer');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-zopfli');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'clean',
		'copy',
		'connect',
		'jade',
		'sass',
		'bower_concat',
		'concat',
		//'uglify',
		'imagemin',
		// 'webp',
		'watch'
	]);

	grunt.registerTask('product', [
		'clean',
		//'copy',
		// 'connect',
		'jade',
		'htmlmin',
		'sass',
		'bower_concat',
		'concat',
		'uglify',
		'zopfli',
		'imagemin'
	]);

	grunt.registerTask('email', [
		'clean',
		'connect',
		'jade',
		'sass',
		'premailer',
		'imagemin',
		'watch'
	]);
};