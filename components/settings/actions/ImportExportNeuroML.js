import React from 'react';
import TextField from 'material-ui/TextField'
import { blue500 } from 'material-ui/styles/colors';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import FileBrowser from '../../general/FileBrowser';

export default class ImportExportNeuroML extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionExecuted: false,
            neuroMLFolder: '',
            fileName: '',
            explorerDialogOpen: false,
            explorerParameter: "",
            exploreOnlyDirs: false
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

    performAction() { // send here the message+
        if (this.props.requestID==3){
            var tab = 'define'
            var action = 'netpyne_geppetto.importNeuroML';
            var message = GEPPETTO.Resources.IMPORTING_MODEL;
        }
        else if (this.props.requestID==6) {
            var tab = 'simulate'
            var action = 'netpyne_geppetto.exportNeuroML';
            var message = GEPPETTO.Resources.EXPORTING_MODEL;
        }
        
        this.props.performAction(action, message, {...this.state, tab:tab})
        this.setState({actionExecuted: true})
    }

    showExplorerDialog(explorerParameter, exploreOnlyDirs) {
        this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs })
    }

    closeExplorerDialog(fieldValue) {
        var newState = { explorerDialogOpen: false };
        if (fieldValue) {
            switch (this.state.explorerParameter) {
                case "neuroMLFolder":
                    newState["neuroMLFolder"] = fieldValue.path;
                    break;
                default:
                    throw ("Not a valid parameter!");
            }
        }
        this.setState(newState);
    }
    
    render() {
        switch(this.props.requestID) { // maybe use it for import/export option
            case 3: 
                var header =  <CardHeader title="Import from NeuroML" subtitle="NeuroML file" titleColor={blue500}/>
                var content = <CardText style={{marginTop: -30}}>
                    <TextField 
                        className="netpyneField" 
                        style={{ cursor: 'pointer', width: '100%'}} 
                        floatingLabelText="Mod path folder"
                        value={this.state.neuroMLFolder} 
                        onClick={() => this.showExplorerDialog('neuroMLFolder', false)} 
                        readOnly 
                    />
                    <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} filterFiles={'.nml'} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
                </CardText>
                break
            case 6:
                var header = <CardHeader title="Export to NeuroML" subtitle="NeuroML file" titleColor={blue500} />
                var content = <CardText style={{marginTop: -30}}>
                    <TextField
                        className="netpyneField"
                        hintText="File name"
                        floatingLabelText="File name"
                        value={this.state.fileName}
                        onChange={(e, v) => {this.setState({fileName: v})}}
                    />
                </CardText>
                break
            default:
                var header = <CardHeader title="" subtitle="" titleColor={blue500} />
                var content = <CardText style={{marginTop: -30}}></CardText>
        }
        return (
            <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                {header}
                {content}
            </Card>
        )
    }
}