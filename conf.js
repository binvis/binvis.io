module.exports = {
    dist: "build/",
    static: "build/static",
    js: {
        // Don't package these in the vendor distribution
        vendor_excludes: [
            "bootstrap"
        ],
        // Package these as well as the dependencies
        vendor_includes: [
            "react/addons",
            "filesaver/FileSaver.js",
            "toblob/canvas-toBlob.js"
        ],
        app: 'src/js/binvis.react.js',
        jshint: ["src/js/**/*.js"]
    },
    css: {
        vendor: ["src/css/vendor.less"],
        app: ["src/css/app.less"]
    },
    copy: [
        "src/examples/**/*",
    ],
    templates: [
        "src/index.html"
    ],
    fonts: ["src/fontawesome/fontawesome-webfont.*"],
};
