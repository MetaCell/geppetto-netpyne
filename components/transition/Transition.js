import React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Utils from '../../Utils';

const TransitionDialog = React.createClass({
    getInitialState() {
        return {
            transitionOpen: true,
            parallelSimulation: false,
            previousTab: "define",
            errorMessage: undefined,
            errorDetails: undefined
        };
    },

    componentWillReceiveProps: function (nextProps) {
        // switch (nextProps.tab) {
        //TODO: we need to define the rules here
        if (this.props.tab != nextProps.tab) {
            this.setState({
                transitionOpen: true,
                previousTab: this.props.tab
            });
        }
    },

    cancelTransition() {
        this.closeTransition();
        if (this.props.cancelTransition) {
            this.props.cancelTransition();
        }
    },

    closeTransition() {
        this.setState({ transitionOpen: false });
    },

    processError(parsedResponse) {
        if (parsedResponse.hasOwnProperty("type") && parsedResponse['type'] == 'ERROR') {
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            this.setState({ transitionOpen: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] })
            return true;
        }
        return false;
    },

    instantiate() {
        GEPPETTO.CommandController.log("The NetPyNE model is getting instantiated...");
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.INSTANTIATING_MODEL);
        this.closeTransition();
        Utils.sendPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [])
            .then(response => {
                var parsedResponse = JSON.parse(response);
                if (!this.processError(parsedResponse)) {
                    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
                    GEPPETTO.Manager.loadModel(parsedResponse);
                    GEPPETTO.CommandController.log("The NetPyNE model instantiation was completed");
                    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                }
            });
    },

    simulate() {
        GEPPETTO.CommandController.log("The NetPyNE model is getting simulated...");
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.RUNNING_SIMULATION);
        this.closeTransition();
        Utils.sendPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [this.state])
            .then(response => {
                var parsedResponse = JSON.parse(response);
                if (!this.processError(parsedResponse)) {
                    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
                    GEPPETTO.Manager.loadModel(parsedResponse);
                    GEPPETTO.CommandController.log("The NetPyNE model simulation was completed");
                    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                }
            });
    },

    render() {
        //Once the dialog closes it can't be reopened (which is useful when we need to throw an error) 
        //therefore we just return null when transitionOpen is false
        if (this.state.transitionOpen) {
            var cancelAction = (<FlatButton
                label="CANCEL"
                primary={true}
                onClick={this.cancelTransition}
            />)
            var title = "NetPyNE";
            var actions = [];
            if (this.state.errorMessage == undefined) {
                switch (this.props.tab) {
                    case "define":
                        var children = "You are back to network definition, any changes will require to reinstantiate your network."
                        var confirmAction = (<FlatButton
                            label="Ok"
                            primary={true}
                            keyboardFocused={true}
                            onClick={this.closeTransition}
                        />);
                        actions = [confirmAction];
                        break;
                    case "explore":
                        var children = "We are about to instantiate your network, this could take some time.";
                        var confirmAction = (<FlatButton
                            label="Ok"
                            primary={true}
                            keyboardFocused={true}
                            onClick={this.instantiate}
                            id="okInstantiateNetwork"
                        />);
                        if (this.state.previousTab == 'define') {
                            actions = [cancelAction, confirmAction];
                        }
                        else {
                            actions = [confirmAction];
                        }
                        break;
                    case "simulate":
                        var children = (
                            <div>
                                <div >
                                    We are about to simulate your network, this could take some time.
                                    </div>
                                <div style={{ marginTop: '35px' }}>
                                    <Checkbox
                                        label="Run parallel simulation"
                                        id="runParallelSimulation"
                                        checked={this.state.parallelSimulation}
                                        onCheck={() => this.setState((oldState) => {
                                            return {
                                                parallelSimulation: !oldState.parallelSimulation,
                                            };
                                        })}
                                    />
                                </div>
                                <div className="netpyneRightField">
                                    <TextField
                                        floatingLabelText="Number of cores"
                                        type="number"
                                        onChange={(event) => this.setState({ cores: event.target.value })}
                                    />
                                </div>
                            </div>
                        )
                        var confirmAction = (<FlatButton
                            label="Ok"
                            primary={true}
                            keyboardFocused={true}
                            onClick={this.simulate}
                            id={"runSimulation"}
                        />);
                        if (this.state.previousTab == 'define') {
                            actions = [cancelAction, confirmAction];
                        }
                        else {
                            actions = [confirmAction];
                        }

                        break;
                }
            }
            else {
                title = this.state.errorMessage
                var children = this.state.errorDetails;
                actions = [cancelAction];
            }

            return (<Dialog
                title={title}
                actions={actions}
                modal={true}
                open={true}
                onRequestClose={this.closeTransition}
                bodyStyle={{ overflow: 'auto' }}
                style={{ whiteSpace: "pre-wrap" }}
            >
                {children}
            </Dialog>);
        }
        return null;
    },
});

export default TransitionDialog;