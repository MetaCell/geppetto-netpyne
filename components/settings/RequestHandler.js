import React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Utils from '../../Utils';

export default class RequestHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            actionRequired: false,
            errorMessage: undefined,
            errorDetails: undefined,
            spinning: false
        }
    }
    
    componentDidUpdate = () => {
        if (this.props.open != this.state.open && this.state.spinning==false) {
            this.setState({
                open: this.props.open
            });
        }
    }

    performAction = (action, message, args) => {
        if (action==='abort') {
            this.setState({actionRequired: false})
        }
        else {
            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, message);
            this.closeDialog();
            Utils
                .sendPythonMessage(action, [args])
                .then(response => {
                    var parsedResponse = JSON.parse(response);
                    if (!this.processError(parsedResponse)) {
                        this.props.onRequestClose();
                        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                        this.setState({spinning: false})
                    }
            });
        }
    }

    closeDialog = () => {
        this.setState({ open: false, spinning: true, errorMessage: undefined, errorDetails: undefined, actionRequired: false })
    }

    cancelDialog = () => {
        this.setState({ open: false, errorMessage: undefined, errorDetails: undefined, actionRequired: false })
        this.props.onRequestClose();
    }

    processError = (parsedResponse) => {
        if (parsedResponse.hasOwnProperty("type") && parsedResponse['type'] == 'ERROR') {
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            this.setState({ open: true, spinning: false, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details']})
            return true;
        }
        return false;
    }

    requestActionToChild = () => {
        this.setState({actionRequired: true})
    }

    render() {
        if (this.state.open) {
            var cancelAction = <FlatButton label="CANCEL" primary={true} onClick={this.cancelDialog} />

            if (this.state.errorMessage == undefined) {
                var title = this.props.title
                var actions = [
                    cancelAction, 
                    <RaisedButton primary label={this.props.buttonLabel} onTouchTap={this.requestActionToChild}/>
                ];
                var content = React.Children.map(this.props.children, child => {
                    return React.cloneElement(child, {
                        requestID: this.props.requestID, 
                        performAction: this.performAction, 
                        actionRequired: this.state.actionRequired
                    })
                })
            }
            else {
                var actions = [
                    cancelAction,
                    <RaisedButton
                        primary
                        label={"BACK"}
                        onTouchTap={() => this.setState({ errorMessage: undefined, errorDetails: undefined , actionRequired: false})}
                    />
                ];
                var title = this.state.errorMessage;
                var content = this.state.errorDetails;
            }
            return (
                <Dialog
                    title={title}
                    open={this.state.open}
                    actions={actions}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    {content}
                </Dialog>
            );
        }
        return null;
    }
}