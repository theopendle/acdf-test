const common = require("@acdf/build").common;
const path = require("path");

const LIBRARY_MAP = common.buildLibraryMap(common.paths.dist.absolute.MODULE_DIR, {});

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

function loadBasics(global) {
    loadIntoScope(global, path.resolve(process.cwd(), "externs.js"));
    global.loadLibrary = name => require(LIBRARY_MAP[name])
}

function library(global, libraryName) {
    loadBasics(global);

    const libraryPath = LIBRARY_MAP[`${common.CONFIG.namespace}:${libraryName}`];

    if (!libraryPath) {
        throw `Attempting to test file ${libraryName}, but it is not a library`;
    }
    global[common.CONFIG.namespace] = {};    
    loadIntoScope(global[common.CONFIG.namespace], libraryPath);
}

function activity(global) {
    loadBasics(global);
}

module.exports = {
    library: library,
    activity: activity,
};
