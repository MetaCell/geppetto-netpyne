import React from 'react';
import TextField from 'material-ui/TextField';
import {blue500} from 'material-ui/styles/colors';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import FileBrowser from '../general/FileBrowser';

export default class ExportToDocker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionExecuted: false,
            label: 'my_docker_container',
            modFolder: '',
            explorerDialogOpen: false,
            explorerParameter: ''
        }
    }

    componentDidUpdate() {
        if (this.props.actionRequired && !this.state.actionExecuted) {
            this.performAction()
        }
        else if (!this.props.actionRequired && this.state.actionExecuted) {
            this.setState({actionExecuted: false})
        }
    }

    performAction() {
        var action = 'netpyne_geppetto.create_docker_container';
        var message = 'CREATING DOCKER CONTAINER';
        this.props.performAction(action, message, this.state)
        this.setState({actionExecuted: true})
    }
    
    showExplorerDialog(explorerParameter, exploreOnlyDirs) {
        this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter})
    }

    closeExplorerDialog(fieldValue) {
        var newState = { explorerDialogOpen: false };
        if (fieldValue) {
            switch (this.state.explorerParameter) {
                case "modFolder":
                    newState["modFolder"] = fieldValue.path;
                    break;
                default:
                    throw ("Not a valid parameter!");
            }
        }
        this.setState(newState);
    }

    render() {
        var header =  <CardHeader title="Docker" titleColor={blue500} subtitle="Create a Docker container for your model" />
        var content = (
            <CardText style={{marginTop: -22}}>
                <TextField className="netpyneField" floatingLabelText="Container name" value={this.state.label} onClick={(e, v) => this.setState({label: v})}/>
                <TextField 
                    className="netpyneField" 
                    style={{ cursor: 'pointer', width: '100%'}} 
                    floatingLabelText="Path to mod folder"
                    value={this.state.modFolder} 
                    onClick={() => this.showExplorerDialog('modFolder', true)} 
                    readOnly 
                />
                <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={true} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
                <br/><h5> </h5>
                <h5>The container is build in the background, so you can keep working or close the GUI.</h5>
                <h5>Check out.log and err.log in the folder where you initialized the GUI</h5>
            </CardText>
        )
        return (
            <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                {header}
                {content}
            </Card>
        )
    }
}