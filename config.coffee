exports.config =
  modules:
    definition: false
    wrapper: false
  paths:
    public: 'public'
    watched: ['angular']
  notifications: true
  files:
    stylesheets:
      joinTo:
        'css/app.css': /^(angular|vendor|bower_components)/
      order:
        before: ['angular/app.sass']
    templates:
      joinTo:
        'js/templates.js': /^angular/
    javascripts:
      joinTo:
        'js/app.js': /^angular/
        'js/vendor.js': /^bower_components/
      order:
        before: ['angular/app.js']
  server:
    path: 'server.js'
    port: 8080
  watcher:
    usePolling: true
  plugins:
    sass:
      mode: 'ruby'
    autoprefixer:
      browsers: ["last 1 version", "> 1%", "ie 8", "ie 7"]
      cascade: false
  minify: true