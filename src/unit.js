const common = require("@acdf/build").common;
const path = require("path");

const LIBRARY_MAP = common.buildScriptMap(common.paths.dist.absolute.MODULE_DIR, {});

/**
 * Loads the functions and properties  of the file at requirePath into the global scope. 
 * 
 * Used to replicate the global JS scope within an Adobe Campaign environment and to simulate
 * loadLibrary() using CommonJS.
 * 
 * @param {object} global the global object
 * @param {string} requirePath path to a CommonJS module
 */
function loadIntoScope(global, requirePath) {
    const externs = require(requirePath);
    for (let key of Object.keys(externs)) {
        global[key] = externs[key];
    }
}

/**
 * Converts the script name (eg: "acdf:helloWorld.activity.js") to require-able 
 * absolute path to the ES6 compiled script (eg: "/tmp/demo/dist/modules/js/workflow/helloWorld.activity.js").
 * 
 * @param {string} scriptName the name of the script to test
 * @returns the real path of the ES6 script to test
 */
function getEs6ScriptPath(scriptName) {
    const scriptPath = LIBRARY_MAP[`${common.CONFIG.namespace}:${scriptName}`];
    if (!scriptPath) {
        throw `Attempting to test file ${scriptName}, but it is not a library`;
    }
    return scriptPath;
}

function loadBasics(global) {
    loadIntoScope(global, path.resolve(process.cwd(), "externs.js"));
    global.loadLibrary = name => require(LIBRARY_MAP[name])
}

function library(global, scriptName) {
    loadBasics(global);
    global[common.CONFIG.namespace] = {};
    loadIntoScope(global[common.CONFIG.namespace], getEs6ScriptPath(scriptName));
}

function activity(global, scriptName) {
    loadBasics(global);
    return getEs6ScriptPath(scriptName);
}

module.exports = {
    library: library,
    activity: activity,
};
