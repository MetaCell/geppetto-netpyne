import React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import { Card, CardText } from 'material-ui/Card';
import { orange500 } from 'material-ui/styles/colors';
import { Tabs, Tab } from 'material-ui/Tabs';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import Utils from '../../Utils';
import FileBrowser from '../general/FileBrowser';

const SettingsDialog = React.createClass({


    getInitialState() {

        return {
            open: false,
            currentTab: "import",
            netParamsPath: "",
            netParamsModuleName: "",
            netParamsVariable: "netParams",
            simConfigPath: "",
            simConfigModuleName: "",
            simConfigVariable: "simConfig",
            modFolder: "",
            compileMod: false,
            jsonModelFolder: "",
            explorerDialogOpen: false,
            explorerParameter: "",
            exploreOnlyDirs: false,
            errorMessage: undefined,
            errorDetails: undefined,
            scriptName: 'script_output',
            exportFormat: "data",
            importFormat: "py",
            areModFieldsRequired: ''
        };
    },
    
    componentWillReceiveProps(nextProps) {
        if (this.props.open != nextProps.open) {
            this.setState({
                open: true
            });
        }
    },

    processError(parsedResponse) {
        if (parsedResponse.hasOwnProperty("type") && parsedResponse['type'] == 'ERROR') {
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            this.setState({ open: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] })
            return true;
        }
        return false;
    },

    performAction() {
        //Show spinner
        if (this.state.currentTab=='import' && this.state.areModFieldsRequired==''){
          this.setState({areModFieldsRequired: undefined})
        }
        else {
            if (this.state.currentTab == "import") {
                var action = 'netpyne_geppetto.importModel';
                var message = GEPPETTO.Resources.IMPORTING_MODEL;
            }
            else if (this.state.currentTab == "export") {
                if (this.state.exportFormat == "data") {
                    var action = 'netpyne_geppetto.exportModel';
                }
                else {
                    var action = 'netpyne_geppetto.generateScript';
                }
                var message = GEPPETTO.Resources.EXPORTING_MODEL;
            }

            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, message);

            // Import/Export model python side
            this.closeDialog();
            Utils
                .sendPythonMessage(action, [this.state])
                .then(response => {
                    var parsedResponse = JSON.parse(response);
                    if (!this.processError(parsedResponse)) {
                        this.props.onRequestClose();
                        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                    }
                });
        }
    },

    showExplorerDialog(explorerParameter, exploreOnlyDirs) {
        this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs });
    },

    closeExplorerDialog(fieldValue) {
        var newState = { explorerDialogOpen: false };
        if (fieldValue) {
            var fileName = fieldValue.path.replace(/^.*[\\\/]/, '');
            var fileNameNoExtension = fileName.replace(/\.[^/.]+$/, "");
            var path = fieldValue.path.split(fileName).slice(0, -1).join('');
            switch (this.state.explorerParameter) {
                case "netParamsPath":
                    newState["netParamsPath"] = path;
                    newState["netParamsModuleName"] = fileNameNoExtension;
                    break;
                case "simConfigPath":
                    newState["simConfigPath"] = path;
                    newState["simConfigModuleName"] = fileNameNoExtension;
                    break;
                case "modFolder":
                    newState["modFolder"] = fieldValue.path;
                    break;
                case "jsonModelFolder":
                    newState["jsonModelFolder"] = fieldValue.path;
                    break;
                default:
                    throw ("Not a valid parameter!");
            }
        }
        this.setState(newState);
    },

    closeDialog() {
        this.setState({ open: false, errorMessage: undefined, errorDetails: undefined })

    },

    cancelDialog() {
        this.closeDialog();
        this.props.onRequestClose();
    },
    
    render() {
        var renderMod = (
          <div>
            <SelectField
                className="netpyneField"
                errorText={this.state.areModFieldsRequired==undefined?"This field is required.":false}
                errorStyle={{color: orange500}}
                floatingLabelText="Are custom mod files required for this model?"
                value={this.state.areModFieldsRequired}
                onChange={(event, index, value) => this.setState({areModFieldsRequired: value})}
            >
                <MenuItem value={true} primaryText="yes, this model requires custom mods." />
                <MenuItem value={false} primaryText="no, this model only requires NEURON build-in mods." />
            </SelectField>
            <TextField 
              className="netpyneFieldNoWidth" 
              style={{ float: 'left', width: '48%', cursor: 'pointer' }} 
              floatingLabelText="Mod path folder"
              disabled={this.state.areModFieldsRequired==''?true:!this.state.areModFieldsRequired} 
              value={this.state.modFolder} 
              onClick={() => this.showExplorerDialog('modFolder', true)} 
              readOnly 
            />
            <div style={{ float: 'right', width: '49%', marginTop:25}}>
              <Checkbox
                  disabled={this.state.areModFieldsRequired==''?true:!this.state.areModFieldsRequired}
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
            <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
          </div>
        )
      var renderPy =  (
        <CardText>
          <TextField className="netpyneFieldNoWidth" style={{ width: '48%', cursor: 'pointer' }} floatingLabelText="NetParams path" value={this.state.netParamsPath} onClick={() => this.showExplorerDialog('netParamsPath', false)} readOnly />
          <TextField className="netpyneRightField" style={{ width: '48%', cursor: 'pointer' }} floatingLabelText="SimConfig path" value={this.state.simConfigPath} onClick={() => this.showExplorerDialog('simConfigPath', false)} readOnly />
          <TextField className="netpyneFieldNoWidth" style={{ width: '48%' }} floatingLabelText="NetParams variable" value={this.state.netParamsVariable} onChange={(event) => this.setState({ netParamsVariable: event.target.value })} />
          <TextField className="netpyneRightField" style={{ width: '48%' }} floatingLabelText="SimConfig variable" value={this.state.simConfigVariable} onChange={(event) => this.setState({ simConfigVariable: event.target.value })} />
          {renderMod}
        </CardText>
      )
      
      var renderJson = (
        <CardText>
          <TextField className="netpyneField" style={{width: '48%', cursor: 'pointer' }} floatingLabelText="json model path" value={this.state.jsonModelFolder} onClick={() => this.showExplorerDialog('jsonModelFolder', false)} readOnly />
          {renderMod}
        </CardText>
      )
      
        if (this.state.open) {
            var cancelAction = (<FlatButton
                label="CANCEL"
                primary={true}
                onClick={this.cancelDialog}
            />)

            if (this.state.errorMessage == undefined) {
                var actions = [
                    cancelAction,
                    <RaisedButton
                        primary
                        label={this.state.currentTab == "import" ? 'Import' : 'Export'}
                        onTouchTap={this.performAction}
                    />
                ];
                var children = <Tabs
                    style={{ paddingTop: 10 }}
                    value={this.state.currentTab}
                    onChange={(value) => this.setState({ currentTab: value })}
                    tabTemplateStyle={{ float: 'left', height: '100%' }}
                >
                    <Tab value="import" label={'Import'}>
                        <Card style={{ padding: 10, float: 'left', width: '100%' }}>
                          <SelectField
                              style={{marginLeft: 20}}
                              floatingLabelText="Select import data type"
                              value={this.state.importFormat}
                              onChange={(event, index, value)=>this.setState({importFormat: value})}
                          >
                              <MenuItem value={"py"} primaryText="NetPyNE code" />
                              <MenuItem value={"json"} primaryText="JSON file" />
                          </SelectField>
                          {this.state.importFormat=='py'?renderPy:renderJson}
                        </Card>
                    </Tab>

                    <Tab value="export" label={'Export'}>
                        <Card style={{ padding: 10, float: 'left', width: '100%' }}>
                            <SelectField
                                style={{ marginLeft: 20 }}
                                floatingLabelText="Select export method"
                                value={this.state.exportFormat}
                                onChange={(event, index, value) => this.setState({ exportFormat: value })}
                            >
                                <MenuItem value={"data"} primaryText="Data files" />
                                <MenuItem value={"py"} primaryText="Python files" />
                            </SelectField>
                            <div style={{ marginLeft: 20, float: 'left', color: 'rgba(0, 0, 0, 0.6)', marginBottom: 10 }}>
                                {this.state.exportFormat == 'data' ?
                                    <span style={{ marginTop: 20, float: 'left' }}>* Go to:  - Configuration Tab > Save Configuration -  to select data and formats to be exported.</span> :
                                    <div>
                                        <TextField className="netpyneField" floatingLabelText="File name" value={this.state.scriptName} onChange={(event) => this.setState({ scriptName: event.target.value })} />
                                        <span style={{ marginTop: 20, float: 'left' }}>* File will be saved in the current working directory (where you initialized NetPyNE-UI)}</span>
                                    </div>}
                            </div>
                        </Card>
                    </Tab>
                </Tabs>
            }
            else {
                var actions = [
                    cancelAction,
                    <RaisedButton
                        primary
                        label={"BACK"}
                        onTouchTap={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
                    />
                ];
                var title = this.state.errorMessage;
                var children = this.state.errorDetails;
            }
            return (
                <Dialog
                    title={title}
                    open={this.props.open}
                    actions={actions}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    {children}
                </Dialog>
            );
        }
        return null;
    },
});

export default SettingsDialog;
