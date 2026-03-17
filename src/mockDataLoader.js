import { globSync } from "glob"; //load many files and filtering with some rules at one shot
import fs from "fs";
import _ from "underscore";
import * as util from "./util.js";

//requestMappings should be a map with path as a key
let requestMappings = {};

export function buildMappings(mockDataConfig) {
    //config is not valid
    if (!mockDataConfig.request && !mockDataConfig.response) {
        return false;
    }

    if (!mockDataConfig.request.path) {
        return false;
    }

    var path = mockDataConfig.request.path.toLowerCase();

    setDefaults(mockDataConfig);

    if (requestMappings[path]) {
        requestMappings[path].push(mockDataConfig);
    } else {
        requestMappings[path] = [mockDataConfig];
    }
}

export function loadRequestMappings(folder) {
    // util.print("build up the mapping trees");

    let mockFiles = globSync(folder + "/**/*.json");

    _.each(mockFiles, function (filePath) {
        try {
            var mockDataConfig = JSON.parse(fs.readFileSync(filePath, "utf8"));
            mockDataConfig.filePath = filePath;
            buildMappings(mockDataConfig);
        } catch (e) {
            util.warning(filePath + " - failed: " + e.message);
        }
        util.print("loaded: " + filePath);
    });

    return requestMappings;
}

function setDefaults(mockDataConfig) {
    _.defaults(mockDataConfig.request, {
        method: "GET"
    });

    _.defaults(mockDataConfig.response, {
        status: 200
    });

    return mockDataConfig;
}

export function getRequestMappings() {
    return requestMappings;
}

export function reset() {
    requestMappings = {};
}
