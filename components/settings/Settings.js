import React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Utils from '../../Utils';
import FileBrowser from '../general/FileBrowser';

const SettingsDialog = React.createClass({


    getInitialState() {

        return {
            currentTab: "import",
            netParamsPath: "",
            netParamsModuleName: "",
            netParamsVariable: "netParams",
            simConfigPath: "",
            simConfigModuleName: "",
            simConfigVariable: "simConfig",
            modFolder: "",
            compileMod: false,
            explorerDialogOpen: false,
            explorerParameter: "",
            exploreOnlyDirs: false
        };
    },

    onChangeTab(value) {
        this.setState({ currentTab: value });
    },

    performAction() {
        // Show spinner
        if (this.state.currentTab == "import") {
            var action = 'netpyne_geppetto.importModel';
            var message = GEPPETTO.Resources.IMPORTING_MODEL;
        }
        else {
            var action = 'netpyne_geppetto.exportModel';
            var message = GEPPETTO.Resources.EXPORTING_MODEL;
        }
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, message);
        this.props.onRequestClose();

        // Import/Export model python side
        Utils
            .sendPythonMessage(action, [this.state])
            .then(() => {
                GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            });
    },

    showExplorerDialog(explorerParameter, exploreOnlyDirs) {
        this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs });
    },

    closeExplorerDialog(fieldValue) {
        var newState = { explorerDialogOpen: false };
        if (fieldValue) {
            var fileName = fieldValue.path.replace(/^.*[\\\/]/, '');
            var fileNameNoExtension= fileName.replace(/\.[^/.]+$/, "");
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
                default:
                    throw("Not a valid parameter!");
            }
        }
        this.setState(newState);
    },

    render() {

        const actions = [
            <FlatButton
                label={'CANCEL'}
                onTouchTap={this.props.onRequestClose}
                style={{ marginRight: 16 }}
            />,
            <RaisedButton
                primary
                label={this.state.currentTab == "import" ? 'Import' : 'Export'}
                onTouchTap={this.performAction}
            />
        ];

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                bodyStyle={{ overflow: 'auto' }}
                actions={actions}
            >
                <Tabs
                    style={{ paddingTop: 10 }}
                    value={this.state.currentTab}
                    onChange={this.onChangeTab}
                    tabTemplateStyle={{ float: 'left', height: '100%' }}
                >
                    <Tab value="import" label={'Import'}>
                        <Card style={{ padding: 10, float: 'left', width: '100%' }}>
                            <CardText>
                                <TextField className="netpyneFieldNoWidth" style={{width: '48%'}} floatingLabelText="NetParams path" value={this.state.netParamsPath} onClick={() => this.showExplorerDialog('netParamsPath', false)} readOnly/>
                                <TextField className="netpyneRightField" style={{width: '48%'}} floatingLabelText="SimConfig path" value={this.state.simConfigPath} onClick={() => this.showExplorerDialog('simConfigPath', false)} readOnly/>

                                <TextField className="netpyneFieldNoWidth" style={{width: '48%'}} floatingLabelText="NetParams module name" value={this.state.netParamsModuleName} onClick={() => this.showExplorerDialog('netParamsPath', false)} readOnly/>
                                <TextField className="netpyneRightField" style={{width: '48%'}} floatingLabelText="SimConfig module name" value={this.state.simConfigModuleName} onClick={() => this.showExplorerDialog('simConfigPath', false)} readOnly/>

                                <TextField className="netpyneFieldNoWidth" style={{width: '48%'}} floatingLabelText="NetParams variable" value={this.state.netParamsVariable} onChange={(event) => this.setState({ netParamsVariable: event.target.value })} />
                                <TextField className="netpyneRightField" style={{width: '48%'}} floatingLabelText="SimConfig variable" value={this.state.simConfigVariable} onChange={(event) => this.setState({ simConfigVariable: event.target.value })} />

                                <div style={{ marginTop: 30, float: 'left', clear: 'both', width: '48%' }}>
                                    <Checkbox
                                        style={{ float: 'left', clear: 'both' }}
                                        label="Compile mod files"
                                        checked={this.state.compileMod}
                                        onCheck={() => this.setState((oldState) => {
                                            return {
                                                compileMod: !oldState.compileMod,
                                            };
                                        })}
                                    />
                                    <TextField style={{ float: 'left', clear: 'both', width: '100%' }} floatingLabelText="Mod path folder" value={this.state.modFolder} onClick={() => this.showExplorerDialog('modFolder', true)} readOnly/>
                                </div>

                                <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
                            </CardText>
                        </Card>
                    </Tab>

                    <Tab value="export" label={'Export'}>
                        <div style={{ padding: 20 }}>
                            Click on export to download the model as a json fle. File will be stored in the path specified in Configuration > Save Configuration > File Name.
                        </div>
                    </Tab>
                </Tabs>

            </Dialog>
        );
    },
});

export default SettingsDialog;