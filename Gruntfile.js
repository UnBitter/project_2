module.exports = function(grunt) {
	grunt.initConfig({
		clean: ['prod', '.sass-cache/'],
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
		sass: {
			prod: {
				files: {
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/css/main.css': 'dev/sass/main.scss'
				},
				options: {
					compass: true,
					style: 'compressed'
				}
			}
		},
		bower_concat: {
			all: {
				dest: 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.js',
				exclude: ['modernizr']
			}
		},
		concat: {
			main: {
				src: [
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.js',
					'dev/js/*.js'
				],
				dest: 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.js'
			}
		},
		// Сжимаем
		uglify: {
			main: {
				files: {
					// Результат задачи concat
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.js': '<%= concat.main.dest %>',
					'prod/build_<%= grunt.template.today("m-d-yyyy") %>/js/modernizr.js' : 'bower_components/modernizr/modernizr.js'
				}
			}
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					src: ['dev/img/*.{png,jpg,gif}'],
					dest: 'prod/build_<%= grunt.template.today("m-d-yyyy") %>/img'
				}]
			}
		},
		watch: {
			all: {
				options: {
					livereload: true
				},
				files: ['prod/build_<%= grunt.template.today("m-d-yyyy") %>/*']
			},
			javascript: {
				files: ['dev/js/libs/jquery.js', 'dev/js/*.js'],
				tasks: ['concat', 'uglify']
			},
			scss: {
				files: ['dev/sass/*.scss'],
				tasks: 'sass'
			},
			templates: {
				files: ['dev/templates/*.jade', 'dev/templates/incl/*.jade'],
				tasks: 'jade'
			},
			images: {
				files: ['dev/img/*.{png,jpg,gif}'],
				tasks: 'imagemin'
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
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'clean',
		'connect',
		'jade',
		'sass',
		'bower_concat',
		'concat',
		'uglify',
		'imagemin',
		'watch'
	]);
};