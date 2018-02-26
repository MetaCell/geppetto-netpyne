import React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Utils from '../../Utils';

const TransitionDialog = React.createClass({
    getInitialState() {
        return {
            transitionOpen: false,
            parallelSimulation: false
        };
    },

    componentWillReceiveProps: function (nextProps) {
        // switch (nextProps.tab) {
        //TODO: we need to define the rules here
        if (this.props.tab != nextProps.tab){
            this.setState({
                transitionOpen: true,
            });
        }
    },

    closeTransition() {
        this.setState({ transitionOpen: false });
    },

    instantiate(model) {
        GEPPETTO.CommandController.log("The NetPyNE model is getting instantiated...");
        Utils.sendPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [])
            .then(response => {
                this.closeTransition();
                GEPPETTO.Manager.loadModel(JSON.parse(response));
                GEPPETTO.CommandController.log("The NetPyNE model instantiation was completed");
            });
    },

    simulate(model) {
        GEPPETTO.CommandController.log("The NetPyNE model is getting simulated...");
        Utils.sendPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [this.state])
            .then(response => {
                this.closeTransition();
                GEPPETTO.Manager.loadModel(JSON.parse(response));
                GEPPETTO.CommandController.log("The NetPyNE model simulation was completed");
            });
    },

    render() {
        var confirmActionDialog = this.closeTransition;
        switch (this.props.tab) {
            case "define":
                var children  =  "You are back to network definition, any changes will require to reinstantiate your network."
                break;
            case "explore":
                var children = "We are about to instantiate your network, this could take some time.";
                confirmActionDialog = this.instantiate
                break;
            case "simulate":
                var children = (
                        <div>
                            We are about to simulate your network, this could take some time.
                            <Checkbox
                                label="Run parallel simulation"
                                id="runParallel"
                                checked={this.state.parallelSimulation}
                                onCheck={() => this.setState((oldState) => {
                                    return {
                                        parallelSimulation: !oldState.parallelSimulation,
                                    };
                                })}
                            />
                            <TextField
                                floatingLabelText="Number of cores"
                                onChange={(event) => this.setState({ cores: event.target.value })}
                            />
                        </div>
                    )
                    confirmActionDialog = this.simulate
                break;
        }

        return (
            <Dialog
                title="NetPyNE"
                actions={<FlatButton
                    label="Ok"
                    primary={true}
                    keyboardFocused={true}
                    onClick={confirmActionDialog}
                    id={"confirmModal"}
                />}
                modal={true}
                open={this.state.transitionOpen}
                onRequestClose={this.closeTransition}
            >
                {children}
            </Dialog>
        );
    },
});

export default TransitionDialog;