import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { orange500, blue500 , grey400 } from 'material-ui/styles/colors';
import FileBrowser from '../../general/FileBrowser';
import ActionDialog from './ActionDialog';

export default class ImportExportHLS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
						fileName: "output",
            netParamsPath: "",
            netParamsModuleName: "",
            netParamsVariable: "netParams",
            simConfigPath: "",
            simConfigModuleName: "",
            simConfigVariable: "simConfig",
            modFolder: "",
            loadMod: '',
            compileMod: false,
            explorerDialogOpen: false,
            explorerParameter: "",
            exploreOnlyDirs: false,
            filterFiles: false,
            netParamsHovered: 'hidden'
        }

        this.isFormValid = this.isFormValid.bind(this);
    }

    isFormValid(){
        if (this.props.mode == 'IMPORT'){
            // FIXME: Set to undefine to show error text. No particularly elegant
            if (this.state.loadMod === ''){
                this.setState({loadMod: undefined})
            }
            return this.state.loadMod !== undefined && this.state.loadMod !== ''
        }
        else{
            return true;
        }
    }

    showExplorerDialog(explorerParameter, exploreOnlyDirs, filterFiles) {
        this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs, filterFiles: filterFiles })
    }

    closeExplorerDialog(fieldValue) {
        var newState = { explorerDialogOpen: false };
        if (fieldValue) {
            var fileName = fieldValue.path.replace(/^.*[\\\/]/, '');
            var fileNameNoExtension = fileName.replace(/\.[^/.]+$/, "");
            var path = fieldValue.path.split(fileName).slice(0, -1).join('');
            switch (this.state.explorerParameter) {
                case "netParamsPath":
                    newState["netParamsPath"] = path;
                    newState["simConfigPath"] = path;
                    newState["netParamsModuleName"] = fileNameNoExtension;
                    newState["simConfigModuleName"] = fileNameNoExtension;
                    break;
                case "simConfigPath":
                    newState["simConfigPath"] = path;
                    newState["simConfigModuleName"] = fileNameNoExtension;
                    break;
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
        switch(this.props.mode) {
            case 'IMPORT':
                var header =  <CardHeader title="High Level Specification" titleColor={blue500} subtitle="Python file" />
                var content = 
                    <CardText style={{marginTop: -33}}>
												<TextField 
														id="appbarImportFileName"
														readOnly
                            className="netpyneFieldNoWidth"
                            style={{width:'48%'}}
                            value={this.state.netParamsModuleName}
                            onClick={() => this.showExplorerDialog('netParamsPath', false, '.py')} 
                            floatingLabelText="NetParams file:"
                            underlineStyle={{borderWidth:'1px'}}
                            errorText={this.state.netParamsPath?'path: '+this.state.netParamsPath:''} 
                            errorStyle={{color: grey400}}
                        />
                        <TextField className="netpyneRightField" style={{ width: '48%' }} floatingLabelText="NetParams variable" value={this.state.netParamsVariable} onChange={(event) => this.setState({ netParamsVariable: event.target.value })} />
                        <TextField 
                            readOnly 
                            className="netpyneFieldNoWidth" 
                            style={{marginTop: 15, width:'48%'}}
                            value={this.state.simConfigModuleName} 
                            onClick={() => this.showExplorerDialog('simConfigPath', false, '.py')} 
                            floatingLabelText="SimConfig file:"
                            underlineStyle={{borderWidth:'1px'}}
                            errorText={this.state.simConfigPath?'path: '+this.state.simConfigPath:''} 
                            errorStyle={{color: grey400}}
                        />
                        <TextField className="netpyneRightField" style={{ width: '48%', marginTop: 15}} floatingLabelText="SimConfig variable" value={this.state.simConfigVariable} onChange={(event) => this.setState({ simConfigVariable: event.target.value })} />
                        <div >
                            <SelectField
																id="appbarImportRequiresMod"
                                className="netpyneField"
                                style={{marginTop:0}}
                                errorText={this.state.loadMod===undefined?"This field is required.":false}
                                errorStyle={{color: orange500}}
                                floatingLabelText="Are custom mod files required for this model?"
                                value={this.state.loadMod}
                                onChange={(event, index, value) => this.setState({loadMod: value})}
                            >
                                <MenuItem value={true} primaryText="yes, this model requires custom mods." />
                                <MenuItem id="appbarImportRequiresModNo" value={false} primaryText="no, this model only requires NEURON build-in mods." />
                            </SelectField>
                            <TextField 
                            className="netpyneFieldNoWidth" 
                            style={{ float: 'left', width: '48%', cursor: 'pointer', marginTop: -20 }} 
                            floatingLabelText="Path to mod files"
                            disabled={this.state.loadMod===''?true:!this.state.loadMod} 
                            value={this.state.modFolder} 
                            onClick={() => this.showExplorerDialog('modFolder', true, false)} 
                            readOnly 
                            />
                            <div style={{ float: 'right', width: '48%', marginTop: 20}}>
                            <Checkbox
                                disabled={this.state.loadMod===''?true:!this.state.loadMod}
                                className="netpyneCheckbox"
                                label="Compile mod files"
                                checked={this.state.compileMod}
                                onCheck={() => this.setState((oldState) => {
                                    return {
                                        compileMod: !oldState.compileMod,
                                    };
                                })}
                            />
                            </div>
                            <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} filterFiles={this.state.filterFiles} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
                        </div>
                    </CardText>
                    var command = 'netpyne_geppetto.importModel';
                    var message = 'IMPORTING MODEL';
                    var buttonLabel = 'Import'
                    var title = 'Import'
                break;
            case 'EXPORT':
                var header =  <CardHeader title="High Level Specification" titleColor={blue500} subtitle="Python file" />
                var content = <CardText style={{marginTop: -33}}>
                    <TextField
                        className="netpyneField"
                        hintText="File name"
                        floatingLabelText="File name"
                        value={this.state.fileName}
                        onChange={(e, v) => {this.setState({fileName: v})}}
                    />
                </CardText>
                var command = 'netpyne_geppetto.exportHLS';
                var message = 'EXPORTING MODEL';
                var buttonLabel = 'Export'
                var title = 'Export'
                break
        }
        return (
            <ActionDialog
                command ={command}
                message = {message}
                buttonLabel={buttonLabel}
                args={this.state}
                title={title}
                isFormValid={this.isFormValid}
                {...this.props}>
                <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                    {header}
                    {content}
                </Card>
            </ActionDialog>
        )
    }
}