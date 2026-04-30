'use strict';

const build = require('@microsoft/sp-build-web');
const path = require("path");
const fs = require('fs');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.resolve.alias = {
      "@src": path.resolve(__dirname, "./lib"),
      components: path.resolve(__dirname, "./lib/components/"),
      utils: path.resolve(__dirname, "./lib/utils/"),
      styles: path.resolve(__dirname, "./lib/styles/"),
      types: path.resolve(__dirname, "./lib/types/"),
      hooks: path.resolve(__dirname, "./lib/hooks/"),
      services: path.resolve(__dirname, "./lib/services/"),
      store: path.resolve(__dirname, "./lib/store/"),
      appSettings: path.resolve(__dirname, "./lib/appSettings.js")
    };
    return generatedConfiguration;
  },
});

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};


// run "gulp update-appSettings --env DEV" (DEV, INT, PREPRO, PRO)
build.task("update-appSettings", {
  execute: (config) => {

    function updateResource(permissionRequests, newResource) {
          for (var i = 0; i < permissionRequests.length; i++) {
              if (permissionRequests[i].resource.toLowerCase() !== "microsoft graph") {
                    permissionRequests[i].resource = newResource;
              }
          }
    }

    return new Promise((resolve, reject) => {
      const env = config.args["env"] || environmentInfo.stage;
      console.log("Enviroment:", env);
      try {
        const appSettingsAll = JSON.parse(
          fs
            .readFileSync("src/appSettings.all.json", {
              encoding: "utf8",
            })
            .toString("utf8")
            .replace(/^\uFEFF/, "")
        );
        let appSettings = {};
        Object.keys(appSettingsAll.enviroment[env]).forEach(
          (key) => {
            appSettings[key] =
              appSettingsAll.enviroment[env][key];
          }
        );
        fs.writeFileSync(
          "src/appSettings.json",
          JSON.stringify(appSettings, null, 5)
        );
        fs.writeFileSync(
          "src/appSettings.js",
          "define([], function() { return " +
          JSON.stringify(appSettings, null, 5) +
          "});"
        );
        const configPackageJSON = JSON.parse(fs.readFileSync("config/package-solution.json", { encoding: 'utf8' }).toString('utf8').replace(/^\uFEFF/, ''));
        updateResource(configPackageJSON.solution.webApiPermissionRequests, appSettings.AzureAd.ApplicationName);
        fs.writeFileSync('config/package-solution.json', JSON.stringify(configPackageJSON, null, 5));

        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
});


/* fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve */

build.task('increase-version', {
     execute: (config) => {
          return new Promise((resolve, reject) => {
               try {
                    const configPackageJSON = JSON.parse(fs.readFileSync("config/package-solution.json", { encoding: 'utf8' }).toString('utf8').replace(/^\uFEFF/, ''));
                    // console.log("Current version", configPackageJSON.solution.version);
                    let version = configPackageJSON.solution.version;
                    const index = version.lastIndexOf('.');
                    const buildNumber = parseInt(version.slice(index + 1)) + 1;
                    version = `${version.slice(0, index)}.${buildNumber}`;
                    // console.log("New version:", version);
                    configPackageJSON.solution.version = version;
                    fs.writeFileSync('config/package-solution.json', JSON.stringify(configPackageJSON, null, 5));
                    resolve();
               }
               catch (err) {
                    console.error(err);
                    reject(err);
               }
          });
     }
});

build.initialize(require('gulp'));

