import _ from "underscore";
import * as pjson from "../package.json" with { type: "json" };

export function print(message, option) {
    if (process.env.NODE_ENV == "TEST") {
        return;
    }

    process.stdout.write("[MOCK] ");
    if (option) {
        console.log(message, option);
    } else {
        console.log(message);
    }
}

export function warning(message) {
    message = "\x1b[33m" + message + "\x1b[0m";
    print(message);
}

export function printVersion() {
    console.log("\nversion: " + pjson.default.version + "\n");
}

//Check if a value in a deep branch of a map exists in another map object
export function partialContains(fullObject, partialObject) {
    if (!partialObject || _.isEmpty(partialObject)) {
        return 0;
    }

    if (!fullObject) {
        return -1;
    }

    var match = 0;

    // _.find because we want to break from the loop if anything doesn't match
    // _.each will not be able to break completely
    _.find(_.keys(partialObject), function (key) {
        var value = partialObject[key];
        var fullObjectValue = fullObject[key];

        if (typeof value === "object" && typeof fullObjectValue === "object") {
            match = partialContains(fullObjectValue, value);
            if (match < 0) {
                return true;
            }
        } else if (fullObjectValue != value) {
            match = -1;
            return true;
        }
        match++;
    });

    return match;
}
