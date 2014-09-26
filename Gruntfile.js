module.exports = function(grunt) {
	grunt.initConfig({
		jade: {
			compile: {
				files: [{
					src: ['dev/templates/*.jade', '!dev/templates/incl/*.jade'],
					dest: 'prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>',
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
					'prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>/css/main.css': 'dev/sass/main.scss'
				},
				options: {
					compass: true,
					style: 'compressed'
				}
			}
		},
		bower_concat: {
			all: {
				dest: 'prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>/js/_bower.js',
				exclude: ['modernizr']
			}
		},
		concat: {
			main: {
				src: [
					'prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>/js/_bower.js',
					'dev/js/*.js'
				],
				dest: 'prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.js'
			}
		},
		// Сжимаем
		uglify: {
			main: {
				files: {
					// Результат задачи concat
					'prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>/js/scripts.min.js': '<%= concat.main.dest %>'
				}
			}
		},
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					src: ['dev/img/*.{png,jpg,gif}'],
					dest: 'prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>/img'
				}]
			}
		},
		watch: {
			livereload: {
				options: {
					livereload: true
				},
				files: ['prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>/*']
			},
			js: {
				files: ['dev/js/libs/jquery.js', 'dev/js/*.js'],
				tasks: ['concat', 'uglify']
			},
			sass: {
				files: ['dev/sass/*.scss'],
				tasks: 'sass'
			},
			jade: {
				files: ['dev/templates/*.jade', '!templates/incl/*.jade'],
				tasks: 'jade'
			},
			imagemin: {
				files: ['dev/img/*.{png,jpg,gif}'],
				tasks: 'imagemin'
			}
		},
		connect: {
			server: {
				options: {
					port: 3000,
					base: 'prod/builds/prod_build_<%= grunt.template.today("m-d-yyyy") %>'
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
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