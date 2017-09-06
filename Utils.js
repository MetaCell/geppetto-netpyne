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
            GEPPETTO.on(GEPPETTO.Events.Receive_Python_Message, function (data, taka,raka) {
                if (data.id == messageID){
                    resolve(data.response);
                }
                
            })
        );
    }
}