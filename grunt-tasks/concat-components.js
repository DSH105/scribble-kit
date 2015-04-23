// http://stackoverflow.com/questions/21918202

module.exports = function(grunt) {

    var config = grunt.option('config');
    var parent = 'concat';
    var fileTypes = {'js': config.scripts, 'css': config.styles + '/css'};

    grunt.registerTask('concat-components', 'Finds and prepares modules for concatenation.', function() {

        for (var key in fileTypes) {

            if (fileTypes.hasOwnProperty(key)) {
                var componentsPath = config.app + '/' + fileTypes[key] + '/vendor/components';
                // get all module directories
                grunt.file.expand(componentsPath + '/*').forEach(function(dir) {

                    // get the module name from the directory name
                    var dirName = dir.substr(dir.lastIndexOf('/') + 1);

                    // get the current concat object from initConfig
                    var concat = grunt.config.get(parent) || {};

                    // create a subtask for each module, find all src files
                    // and combine into a single js file per module
                    concat[dirName] = {
                        src: [dir + '/**/*.' + key],
                        dest: config.dist + '/' + fileTypes[key] + '/vendor/components/' + dirName + '.' + key
                    };

                    // add module subtasks to the concat task in initConfig
                    grunt.config.set(parent, concat);
                });
            }
        }

        grunt.task.run('concat');
    });
};
