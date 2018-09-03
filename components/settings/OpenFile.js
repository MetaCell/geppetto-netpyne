import React from 'react';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { orange500, blue500 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import FileBrowser from '../general/FileBrowser';

export default class OpenFile extends React.Component {
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
            areModFieldsRequired: ''
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
        var importModFiles = (
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
                <MenuItem value={false} primaryText="no, this model only requires NEURON build-in mods." />
            </SelectField>
            <TextField 
              className="netpyneFieldNoWidth" 
              style={{ float: 'left', width: '48%', cursor: 'pointer' }} 
              floatingLabelText="Mod path folder"
              disabled={this.state.areModFieldsRequired===''?true:!this.state.areModFieldsRequired} 
              value={this.state.modFolder} 
              onClick={() => this.showExplorerDialog('modFolder', true)} 
              readOnly 
            />
            <div style={{ float: 'right', width: '48%', marginTop:25}}>
              <Checkbox
                  disabled={this.state.areModFieldsRequired===''?true:!this.state.areModFieldsRequired}
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

        switch(this.props.requestID) {
            case 0:
                var header = <CardHeader title="Open a model" subtitle="JSON file" titleColor={blue500} />
                var content = (
                    <CardText style={{marginTop: -30}}>
                        <TextField className="netpyneField" style={{width: '48%', cursor: 'pointer' }} floatingLabelText="json model path" value={this.state.jsonModelFolder} onClick={() => this.showExplorerDialog('jsonModelFolder', false)} readOnly />
                        {importModFiles}
                    </CardText>
                )
                break;
            default:
                var content = <div></div>
        }
        
        return (
            <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                {header}
                {content}
            </Card>
        )
    }
}