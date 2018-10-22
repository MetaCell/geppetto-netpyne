import React from 'react';
import TextField from 'material-ui/TextField'
import { blue500 } from 'material-ui/styles/colors';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import FileBrowser from '../../general/FileBrowser';
import ActionDialog from './ActionDialog';

export default class ImportExportNeuroML extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            neuroMLFolder: '',
            fileName: '',
            explorerDialogOpen: false,
            explorerParameter: "",
            exploreOnlyDirs: false
        }
    }

    // performAction() { // send here the message+
    //     if (this.props.mode=='IMPORT'){
    //         var tab = 'define'
    //         var action = 'netpyne_geppetto.importNeuroML';
    //         var message = GEPPETTO.Resources.IMPORTING_MODEL;
    //     }
    //     else if (this.props.mode=='EXPORT') {
    //         var tab = 'simulate'
    //         var action = 'netpyne_geppetto.exportNeuroML';
    //         var message = GEPPETTO.Resources.EXPORTING_MODEL;
    //     }
        
    //     this.props.performAction(action, message, {...this.state, tab:tab})
    //     this.setState({actionExecuted: true})
    // }

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
        switch(this.props.mode) { // maybe use it for import/export option
            case 'IMPORT': 
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
                var tab = 'define'
                var command = 'netpyne_geppetto.importNeuroML';
                var message = GEPPETTO.Resources.IMPORTING_MODEL;
                var buttonLabel = 'Import'
                var title = 'Import'
                var action = 'ImportNeuroML'
                break
            case 'EXPORT':
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
                var tab = 'simulate'
                var command = 'netpyne_geppetto.exportNeuroML';
                var message = GEPPETTO.Resources.EXPORTING_MODEL;
                var buttonLabel = 'Export'
                var title = 'Export'
                var action = 'ExportNeuroML'
                break
        }
        return (
            <ActionDialog
                command ={command}
                message = {message}
                args = {{tab: tab, action: action, ...this.state}}
                buttonLabel={buttonLabel}
                title={title}
                {...this.props}>
                <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                    {header}
                    {content}
                </Card>
            </ActionDialog>
        )
    }
}