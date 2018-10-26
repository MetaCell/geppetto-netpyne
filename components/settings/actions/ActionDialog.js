import React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Utils from '../../../Utils';

const styles = {
    cancel: {
        marginRight: 10
    }
}

export default class ActionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            errorMessage: undefined,
            errorDetails: undefined
        }
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.open != prevProps.open) {
            this.setState({
                open: this.props.open
            });
        }
    }

    performAction = () => {
        if (this.props.isFormValid === undefined || this.props.isFormValid()){
            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, this.props.message);
						this.closeDialog();
						if (this.props.command == "netpyne_geppetto.deleteModel") {
							Object.keys(window).forEach(key => {
								if (key.startsWith("Popup") && key != "PopupsController") {
									window[key].destroy()
								}
							})
						}
            Utils
                .evalPythonMessage(this.props.command, [this.props.args])
                .then(response => {
                    //var parsedResponse = JSON.parse(response);
                    var parsedResponse = response;
                    if (!this.processError(parsedResponse)) {
                        if (this.props.args.tab!=undefined) {
                            this.props.changeTab(this.props.args.tab, this.props.args);
                        }
                        if (this.props.args.tab=='simulate' && this.props.action != 'ExportNeuroML') {
                            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
                            GEPPETTO.Manager.loadModel(response);
                            GEPPETTO.CommandController.log("The NetPyNE model " + this.props.args.tab + " was completed");
                        }
                        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                        this.props.onRequestClose();
                    }
						});
        }
    }
    
    closeDialog = () => {
        this.setState({ open: false, errorMessage: undefined, errorDetails: undefined})
    }

    cancelDialog = () => {
        this.setState({ open: false, errorMessage: undefined, errorDetails: undefined})
        this.props.onRequestClose();
    }

    processError = (response) => {
        // if (parsedResponse.hasOwnProperty("type") && parsedResponse['type'] == 'ERROR') {
        //     GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
        //     this.setState({ open: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details']})
        //     return true;
        // }
        // return false;

        var parsedResponse = Utils.getErrorResponse(response);
        if (parsedResponse) {
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            this.setState({ open: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details']})
            return true;
        }
        return false;
        
    }

    render() {
        if (this.state.open) {
            var cancelAction = <FlatButton label="CANCEL" primary={true} onClick={this.cancelDialog} style={styles.cancel}/>;
            if (this.state.errorMessage == undefined) {
                var title = this.props.title
                var actions = [
                    cancelAction, 
                    <RaisedButton id="appbarPerformActionButton" primary label={this.props.buttonLabel} onClick={this.performAction}/>
                ];
                var content = this.props.children;
            }
            else {
                var actions = [
                    cancelAction,
                    <RaisedButton
                        primary
                        label={"BACK"}
                        onClick={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
                    />
                ];
                var title = this.state.errorMessage;
                var content = this.state.errorDetails;
            }
            return (
                <Dialog
                    title={title}
                    modal={true}
                    actions={actions}
                    open={this.state.open}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ whiteSpace: "pre-wrap" }}
                    onRequestClose={()=>this.closeDialog()}
                >
                  {content}   
                </Dialog>
            );
        }
        return null;
    }
};
