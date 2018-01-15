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

const SettingsDialog = React.createClass({


    getInitialState() {

        return {
            currentTab: "import",
            modelPath: "",
            moduleName: "",
            simConfigVariable: "simConfig",
            netParamsVariable: "netParams",
            modFolder: "",
            compileMod: false
        };
    },

    onChangeTab(value) {
        this.setState({ currentTab: value });
    },

    performAction() {
        // Set Population Dimension Python Side
        Utils
            .sendPythonMessage('netpyne_geppetto.importModel', [this.state])
            .then(()=>{
                this.props.onRequestClose();
            });
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
                actions={actions}
            >

                <Tabs style={{ paddingTop: 10 }} value={this.state.currentTab} onChange={this.onChangeTab}>
                    <Tab value="import" label={'Import'}>
                        <Card style={{ padding: 10, margin: 10 }}>
                            <CardText>

                                <TextField floatingLabelText="Model Path" value={this.state.modelPath} onChange={(event)=>this.setState({modelPath: event.target.value})}/><br/>
                                <TextField floatingLabelText="Module name" value={this.state.moduleName}  onChange={(event)=>this.setState({moduleName: event.target.value})}/><br/>
                                <TextField floatingLabelText="NetParams variable" value={this.state.netParamsVariable}  onChange={(event)=>this.setState({netParamsVariable: event.target.value})}/><br/>
                                <TextField floatingLabelText="SimConfig variable" value={this.state.simConfigVariable}  onChange={(event)=>this.setState({simConfigVariable: event.target.value})}/>

                                <div style={{marginTop: 30}}>
                                    <Checkbox
                                        label="Compile mod files"
                                        checked={this.state.compileMod}
                                        onCheck={() => this.setState((oldState) => {
                                            return {
                                                compileMod: !oldState.compileMod,
                                            };
                                        })}
                                    />
                                    <TextField floatingLabelText="Mod Path Folder" value={this.state.modFolder}  onChange={(event)=>this.setState({modFolder: event.target.value})}/><br/>
                                </div>

                            </CardText>
                        </Card>
                    </Tab>

                    <Tab value="export" label={'Export'}>
                        Path specified in simConfig
                    </Tab>
                </Tabs>

            </Dialog>
        );
    },
});

export default SettingsDialog;