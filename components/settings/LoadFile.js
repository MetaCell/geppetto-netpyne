import React from 'react';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { grey400, orange500, blue500 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import FileBrowser from '../general/FileBrowser';

export default class LoadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionExecuted: false,
            jsonModelFolder: "",
            modFolder: "",
            compileMod: false,
            explorerDialogOpen: false,
            explorerParameter: "",
            exploreOnlyDirs: false,
            areModFieldsRequired: '',

            loadNetParams: true,
            loadSimCfg: false,
            loadSimData: false,
            loadNet: false,
            loadAll: false
        }
        this.options = [
            {label: 'High level specs.', label2: 'netParams and simConfig', state: 'loadNetParams'},
            {label: 'Configuration', label2: 'simConfig.py', state: 'loadSimCfg'},
            {label: 'Data', label2: 'Spikes, traces, etc.', state: 'loadSimData'},
            {label: 'Cells', label2: 'Instanciated Network', state: 'loadNet'},
            {label: 'All', label2: 'Load everything', state: 'loadAll'}
        ]
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
        if (this.state.areModFieldsRequired===undefined) { //this is cause of the warning (if mod in SelectField is not selected)
        }
        else if (this.state.areModFieldsRequired==='') {
            this.setState({areModFieldsRequired: undefined, actionExecuted: true})
            this.props.performAction('abort')
        }
        else {
            var action = 'netpyne_geppetto.importModel';
            var message = GEPPETTO.Resources.IMPORTING_MODEL;
            this.props.performAction(action, message, {...this.state, importFormat: 'json'})
            this.setState({actionExecuted: true})
        }
    }

    showExplorerDialog(explorerParameter, exploreOnlyDirs) {
        this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs })
    }

    closeExplorerDialog(fieldValue) {
        var newState = { explorerDialogOpen: false };
        if (fieldValue) {
            switch (this.state.explorerParameter) {
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
    }

    render() {
        var loadModFiles = (
            <div>
                <SelectField
                    className="netpyneField"
                    errorText={this.state.areModFieldsRequired===undefined?"This field is required.":false}
                    errorStyle={{color: orange500}}
                    floatingLabelText="Are custom mod files required for this model?"
                    value={this.state.areModFieldsRequired}
                    onChange={(event, index, value) => this.setState({areModFieldsRequired: value})}
                >
                    <MenuItem value={true} primaryText="yes, this model requires custom mods." />
                    <MenuItem value={false} primaryText="no, only NEURON build-in mods." />
                </SelectField>
                <TextField 
                    className="netpyneField" 
                    style={{ cursor: 'pointer', width: '100%'}} 
                    floatingLabelText="Mod path folder"
                    disabled={this.state.areModFieldsRequired===''?true:!this.state.areModFieldsRequired} 
                    value={this.state.modFolder} 
                    onClick={() => this.showExplorerDialog('modFolder', true)} 
                    readOnly 
                />
                <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
                <Checkbox
                    className={"netpyneCheckbox"}
                    style={{ width: '100%', marginTop: 50}}
                    disabled={this.state.areModFieldsRequired===''?true:!this.state.areModFieldsRequired}
                    label="Compile mod files"
                    checked={this.state.compileMod}
                    onCheck={() => this.setState((oldState) => {return {compileMod: !oldState.compileMod}})}
                />
            </div>
        )
        
        var header = <CardHeader title="Load previews work" subtitle="JSON file" titleColor={blue500} />
        var content = (
            <CardText style={{}}>
                <div style={{width: '100%', marginTop: -30}}>
                    <div style={{width: '40%', float:'right'}}>
                        <List >
                            {this.options.map(el => {return<ListItem  style={{height: 50}}
                                leftCheckbox= {<Checkbox onCheck={() => this.setState(({[el.state]: oldState, ...others}) => {return {[el.state]: !oldState}})} checked={this.state[el.state]} />}
                                primaryText={el.label}
                                secondaryText={el.label2}
                                />})
                            }
                        </List>
                    </div>
                    <div style={{width: '50%'}}>
                        <TextField className="netpyneField" style={{cursor: 'pointer' }} floatingLabelText="json model path" value={this.state.jsonModelFolder} onClick={() => this.showExplorerDialog('jsonModelFolder', false)} readOnly />
                        {loadModFiles}
                    </div>
                </div>
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