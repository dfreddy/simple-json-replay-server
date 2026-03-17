import _ from "underscore";

const optionsConfig = {
    port: {
        default: 6660,
        desc: "\tport number used by mock replay server",
        type: "number"
    },
    folder: {
        default: "app_mock",
        desc: "\tmock data folder, you can give relative or absolute path"
    },
    delay: {
        default: 0,
        desc: "\tglobal settings for delay a response in milliseconds, 0 means no delay, negative value means timeout",
        type: "number"
    }
};

export function parseArguments() {
    let MOCK_DATA_FOLDER = "app_mock";
    let args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("You can use below options to start the server:  (eg. --port=6660 )");
        _.each(optionsConfig, function (value, key) {
            console.log("--" + key + "    " + value.desc);
        });
    }

    //default options
    let options = {};
    _.each(optionsConfig, function (value, key) {
        return (options[key] = value["default"]);
    });

    _.each(args, function (arg) {
        _.each(optionsConfig, function (option, key) {
            let optionName = "--" + key + "=";
            if (arg.startsWith(optionName)) {
                if (option.type == "number") {
                    let value = Number(arg.replace(optionName, ""));
                    if (!isNaN(value)) {
                        options[key] = value;
                    } else {
                        console.log(key + " is not a valid number, use default value [" + options[key] + "]\n");
                    }
                } else {
                    options[key] = arg.replace(option, "");
                }
            }
        });
    });

    return options;
}
