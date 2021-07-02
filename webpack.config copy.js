const path = require("path");
const glob = require("glob");

let jsSrc = glob.sync("./src/client/js/**/*.js");
let cssSrc = glob.sync("./src/client/js/*.css");
let fileSrc = jsSrc.concat(cssSrc);

const entryFiles = glob.sync("./src/client/js/**/*.js").reduce((previousValue, currentValue, currentIndex, array) => {
    return typeof previousValue === "string"
        ? {
              [path.basename(previousValue, path.extname(previousValue))]: previousValue,
              [path.basename(currentValue, path.extname(currentValue))]: currentValue,
          }
        : { ...previousValue, [path.basename(currentValue, path.extname(currentValue))]: currentValue };
});

console.log(entryFiles);
module.exports = {
    entry: entryFiles,
    mode: "development",
    output: {
        // filename: "[name].js",
        // path: path.resolve(__dirname, "assets", "js"),
        filename: "[name].js",
        path: path.resolve(__dirname, "assets"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                },
            },
        ],
    },
};
