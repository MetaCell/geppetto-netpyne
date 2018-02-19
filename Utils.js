import GeppettoJupyterUtils from '../../js/communication/geppettoJupyter/GeppettoJupyterUtils';

const Utils = {

    sendPythonMessage: function (command, parameters) {
        return GeppettoJupyterUtils.sendPythonMessage(command, parameters);
    },

    execPythonCommand: function (command) {
        return GeppettoJupyterUtils.execPythonCommand(command);
    },

    getAvailableKey: function (model, prefix) {
        if (model == undefined) {
            return prefix;
        }
        // Get New Available ID
        var id = prefix;
        var i = 2;
        while (model[id] != undefined) {
            id = prefix + " " + i++;
        }
        return id;
    },

    getMetadataField: function (key, field) {
        if (key == undefined) {
            return;
        }
        var currentObject;
        var nextObject = window.metadata;
        key.split('.').forEach((item) => {
            if (item in nextObject) {
                currentObject = nextObject[item];
                if ("children" in currentObject) {
                    nextObject = currentObject["children"];
                }
            }
            else {
                currentObject = undefined;
                return;
            }
        });
        return (currentObject == undefined) ? currentObject : currentObject[field];
    },

    getHTMLType: function (key) {
        var type = this.getMetadataField(key, "type")

        switch (type) {
            case "int":
                var htmlType = "number"
                break;
            default:
                var htmlType = "text"
                break;
        }
        return htmlType;

    },

    isObject: function (item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    },

    mergeDeep: function (target, source) {
        let output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    },

    getFieldsFromMetadataTree: function (tree, callback) {
        function iterate(object, path) {
            if (Array.isArray(object)) {
                object.forEach(function (a, i) {
                    iterate(a, path.concat(i));
                });
                return;
            }
            if (object !== null && typeof object === 'object') {
                Object.keys(object).forEach(function (k) {
                    // Don't add the leaf to path
                    iterate(object[k], (typeof object[k] === 'object') ? path.concat(k) : path);

                });
                return;
            }

            // Push to array of field id. Remove children and create id string
            modelFieldsIds.push(path.filter(path => path != 'children').join('.'));
        }

        // Iterate the array extracting the fields Ids
        var modelFieldsIds = [];
        iterate(tree, []);

        // Generate model fields based on ids
        var modelFields = [];
        modelFieldsIds.filter((v, i, a) => a.indexOf(v) === i).map((id) => modelFields.push(callback(id, 0)))
        return modelFields;
    },

    renameKey(path, oldValue, newValue, callback) {
        this.sendPythonMessage('netpyne_geppetto.rename', [path, oldValue, newValue])
            .then((response) => {
                callback(response, newValue);
            })
    },

    pauseSync(callback) {
        this.sendPythonMessage('timer.pause', []).then(callback());
    },

    resumeSync(callback) {
        this.sendPythonMessage('timer.resume', []).then(callback());
    }

}

export default Utils