const common = require("@acdf/build").common;
const path = require("path");

const LIBRARY_MAP = common.buildLibraryMap(common.paths.dist.absolute.MODULE_DIR, {});

/**
 * Loads the extern functions and properties into the global scope. Used to replicate the global JS scope within an
 * Adobe Campaign workflow.
 *
 * @param  {global} global the global scope object
 */
function loadExterns(global) {
    const externs = require();
    for (let key of Object.keys(externs)) {
        global[key] = externs[key];
    }
}

function loadIntoScope(global, requirePath) {
    const externs = require(requirePath);
    for (let key of Object.keys(externs)) {
        global[key] = externs[key];
    }
}

function library(global, libraryName) {
    const libraryPath = LIBRARY_MAP[`${common.CONFIG.namespace}:${libraryName}`];

    if (!libraryPath) {
        throw `Attempting to test file ${libraryPath}, but it is not a library`;
    }

    loadIntoScope(global, path.resolve(process.cwd(), "externs.js"));
    loadIntoScope(global.ING, libraryPath);
}

function activity(global) {
    loadIntoScope(global, path.resolve(process.cwd(), "externs.js"));
}

module.exports = {
    loadExterns: loadExterns,
    library: library,
    activity: activity,
};
