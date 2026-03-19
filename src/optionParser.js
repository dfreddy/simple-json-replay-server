import _ from "underscore";

const optionsConfig = {
    port: {
        default: 6660,
        desc: "\tport number used by the mock replay server (default 6660)",
        type: "number"
    },
    folder: {
        default: "app_mock",
        desc: "\tmock data folder, you can give a relative or absolute path (default: app_mock)"
    },
    delay: {
        default: 0,
        desc: "\tglobal setting for delaying a response in milliseconds; default 0 means no delay, negative value means timeout",
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
