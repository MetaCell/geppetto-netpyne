module.exports = {
    ID: function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    },
    sendPythonMessage: function (command, parameters) {
        var messageID = this.ID();
        GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, { id: messageID, command: command, parameters: parameters });

        return new Promise((resolve, reject) =>
            GEPPETTO.on(GEPPETTO.Events.Receive_Python_Message, function (data) {
                if (data.id == messageID) {
                    resolve(data.response);
                }

            })
        );
    },

    execPythonCommand: function (command) {
        console.log('Executing command', command);
        var kernel = IPython.notebook.kernel;
        kernel.execute(command);
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
    }

}