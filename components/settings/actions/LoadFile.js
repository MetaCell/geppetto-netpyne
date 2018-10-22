import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { orange500, blue500, grey400} from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import FileBrowser from '../../general/FileBrowser';
import ActionDialog from './ActionDialog';

const loadOptions = [
    {label: 'High level specs.', label2: 'netParams', state: 'loadNetParams'},
    {label: 'High level specs.', label2: 'simConfig', state: 'loadSimCfg'},
    {label: 'Cells', label2: 'Instanciated Network', state: 'loadNet'},
    {label: 'Data', label2: 'Spikes, traces, etc.', state: 'loadSimData'}
]

export default class LoadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonModelFolder: "",
            modFolder: "",
            compileMod: false,
            explorerDialogOpen: false,
            explorerParameter: "",
            exploreOnlyDirs: false,
            areModFieldsRequired: '',
            jsonPath: '',
            modPath: '',
            loadNetParams: true,
            loadSimCfg: true,
            loadSimData: true,
            loadNet: true,
        }
        this.isFormValid = this.isFormValid.bind(this);
        
    }

    showExplorerDialog(explorerParameter, exploreOnlyDirs) {
        this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs })
    }

    closeExplorerDialog(fieldValue) {
        var newState = { explorerDialogOpen: false };
        if (fieldValue) {
            let fileName = fieldValue.path.replace(/^.*[\\\/]/, '');
            let path = fieldValue.path.split(fileName).slice(0, -1).join('');     
            switch (this.state.explorerParameter) {
                case "modFolder":
                    newState["modFolder"] = fieldValue.path;
                    newState["modPath"] = path;
                    break;
                case "jsonModelFolder":
                    newState["jsonModelFolder"] = fieldValue.path;
                    newState["jsonPath"] = path;
                    break;
                default:
                    throw ("Not a valid parameter!");
            }
        }
        this.setState(newState);
    }

    isFormValid(){
        // FIXME: Set to undefine to show error text. No particularly elegant
        if (this.state.areModFieldsRequired === ''){
            this.setState({areModFieldsRequired: undefined})
        }
        return this.state.areModFieldsRequired !== undefined && this.state.areModFieldsRequired !== ''
    }

    render() {
        // freeze instance means we will get the latest instance, so it will not be required an update of the instance in the future.
        // similar for simulation
        // tab controls whether we want to move to a different tab or to stay where we are. undefined == 'I dont want to move to other tab'
        let freezeInstance = this.state.loadNet ? true : false
        let freezeSimulation = freezeInstance && this.state.loadSimData ? true : false
        let tab = this.state.loadSimData || this.state.loadNet ? 'simulate' : 'define'
        
        return (
            <ActionDialog
                command ={'netpyne_geppetto.loadModel'}
                message = {'LOADING FILE'}
                buttonLabel={'Load'}
                title={'Load file'}
                isFormValid={this.isFormValid}
                args={{...this.state, tab:tab, freezeInstance: freezeInstance, freezeSimulation: freezeSimulation}}
                {...this.props}>
                <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                    <CardHeader title="Load previews work" subtitle="JSON file" titleColor={blue500} />
                    <CardText style={{marginTop: -22}}>
                        <div style={{width: '100%', marginTop: -22}}>   
                            <TextField 
                                readOnly
                                className="netpyneField" 
                                style={{cursor: 'pointer', marginBottom:15 }} 
                                floatingLabelText="Json file:" 
                                value={this.state.jsonModelFolder} 
                                onClick={() => this.showExplorerDialog('jsonModelFolder', false)}
                                underlineStyle={{borderWidth:'1px'}}
                                errorText={this.state.jsonPath!=''?'path: '+this.state.jsonPath:''} 
                                errorStyle={{color: grey400}}
                            />
                            <List> 
                                {loadOptions.map((loadOption, index) => {return<ListItem  style={{height: 50, width:'49%', float:index%2==0?'left':'right'}}
                                    key={index}
                                    leftCheckbox= {<Checkbox onCheck={() => this.setState(({[loadOption.state]: oldState, ...others}) => {return {[loadOption.state]: !oldState}})} checked={this.state[loadOption.state]} />}
                                    primaryText={loadOption.label}
                                    secondaryText={loadOption.label2}
                                    />})
                                }
                            </List>
                            <div>
                                <SelectField
                                    className="netpyneField"
                                    errorText={this.state.areModFieldsRequired===undefined?"This field is required.":false}
                                    errorStyle={{color: orange500, marginBottom:-40}}
                                    floatingLabelText="Are custom mod files required for this model?"
                                    value={this.state.areModFieldsRequired}
                                    onChange={(event, index, value) => this.setState({areModFieldsRequired: value})}
                                >
                                    <MenuItem value={true} primaryText="yes, this model requires custom mods." />
                                    <MenuItem value={false} primaryText="no, only NEURON build-in mods." />
                                </SelectField>
                                <TextField 
                                    readOnly
                                    className="netpyneFieldNoWidth" 
                                    style={{ float: 'left', width: '48%', cursor: 'pointer' , marginBottom: 15, marginTop:-10}} 
                                    floatingLabelText="Mod folder:"
                                    disabled={this.state.areModFieldsRequired===''?true:!this.state.areModFieldsRequired} 
                                    value={this.state.modFolder} 
                                    onClick={() => this.showExplorerDialog('modFolder', true)} 
                                    underlineStyle={{borderWidth:'1px'}}
                                    errorText={this.state.modPath!=''?'path: '+this.state.modPath:''} 
                                    errorStyle={{color: grey400}}
                                />
                                <div style={{ float: 'right', width: '47%', marginTop:25}}>
                                    <Checkbox
                                        className={"netpyneCheckbox"}
                                        disabled={this.state.areModFieldsRequired===''?true:!this.state.areModFieldsRequired}
                                        label="Compile mod files"
                                        checked={this.state.compileMod}
                                        onCheck={() => this.setState((oldState) => {return {compileMod: this.state.areModFieldsRequired?!oldState.compileMod:false}})}
                                    />
                                </div>
                                <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} filterFiles={'.json'} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
                            </div>
                        </div>
                    </CardText>
                </Card>
            </ActionDialog>
        )
    }
}