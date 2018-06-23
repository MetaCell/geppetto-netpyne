import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import FileBrowser from '../../general/FileBrowser';

export default class ImportCellParams extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      cellName: '',
      modFolder: '',
      compileMod: false,
      importSynMechs: false,
      explorerDialogOpen: false,
      
      cellArgs: {},
      newItemValue: ""
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.performAction = this.performAction.bind(this);
    
    this.addChild = this.addChild.bind(this);
    this.handleNewItemChange = this.handleNewItemChange.bind(this);
  };

  updateCheck(name) {
    this.setState((oldState) => {
      return {
        [name]: !oldState[name],
      };
    });
  };

  performAction = () => {
    // Show spinner
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.IMPORTING_MODEL);

    Utils
      .sendPythonMessage("netParams.cellParams['" + this.props.name + "']['conds']")
      .then((response) => {
        var data = {
          conds : response,
          label : this.props.name,
          fileName : this.state.fileName,
          cellName : this.state.cellName,
          cellArgs: this.state.cellArgs
        };

        // Import template
        Utils
          .sendPythonMessage('netpyne_geppetto.importCellTemplate', [data, this.state.modFolder, this.state.compileMod])
          .then(() => {
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
          });
    });
    this.props.onRequestClose();

  };

  showExplorerDialog(explorerParameter) {
    this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter });
  };

  closeExplorerDialog(fieldValue) {
    var newState = { explorerDialogOpen: false };
    if (fieldValue) {
      switch (this.state.explorerParameter) {
        case "fileName":
          newState["fileName"] = fieldValue.path;
          break;
        case "modFolder":
          var fileName = fieldValue.path.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
          var path = fieldValue.path.split(fileName)[0];
          newState["modFolder"] = path;
          break;
        default:
          throw ("Not a valid parameter!");
      }
    }

    this.setState(newState);
  };
  
  isValid(value) {
    return (value.match(/:/g)||[]).length==1 && !value.startsWith(":") && !value.endsWith(":");    
  }

  getErrorMessage() {
    return 'Key:Value pairs must be separated by a colon --> : ';    
  }

  handleNewItemChange(event) {
    this.setState({ newItemValue: event.target.value, newItemErrorText: '' })
  }

  addChild() {
    if (this.isValid(this.state.newItemValue)) {
      var cellArgs = this.state.cellArgs;
      var newValue = this.state.newItemValue.split(":").map(entry => {
        return entry
      });
      if (!isNaN(newValue[1])) { 
        newValue[1] = parseFloat(newValue[1])
      }
      cellArgs[newValue[0]] = newValue[1];
      this.setState({ cellArgs: cellArgs, newItemValue: "" });
    } 
    else {
    this.setState({ newItemErrorText: this.getErrorMessage() })
    }
  }

  removeChild(key) {
    var cellArgs = this.state.cellArgs;
    delete cellArgs[key];
    this.setState({ cellArgs: cellArgs, newItemValue: "" });
  }

  render() {
    const actions = [
      <FlatButton
        label={'CANCEL'}
        onTouchTap={this.props.onRequestClose}
        style={{ marginRight: 16 }}
      />,
      <RaisedButton
        primary
        label={"IMPORT"}
        onTouchTap={this.performAction}
      />
    ];
    
    const cellArgs = Object.keys(this.state.cellArgs).map((key) => {
      return <div key={key} style={{ marginRight: 30, float: 'left' }}>
        <TextField
          value={key + " : " + this.state.cellArgs[key]}
          id={key}
          // onChange={this.handleChildChange}
          style={{ width: 100}}
          inputStyle={{color:"rgb(2, 188, 212)"}}
          disabled
        />
        <IconButton
          iconStyle={{ width: 7, height: 7 }}
          className={"listButtonSmall"}
          onClick={() => this.removeChild(key)}
          tooltip="Remove item from the list"
        >
          <FontIcon className={"fa fa-minus-circle listIcon"} />
        </IconButton>
      </div>
    });

    return (
      <Dialog
        open={this.props.open}
        onRequestClose={this.props.onRequestClose}
        bodyStyle={{ overflow: 'auto' }}
        actions={actions}
      >
        <Card style={{ padding: 10, float: 'left', width: '100%' }}>
          <CardTitle style={{paddingBottom: 0}} title="Import Cell Template" subtitle="Python or Hoc files" />
          <CardText>
            <NetPyNEField id="netParams.importCellParams.fileName" className="netpyneFieldNoWidth">
              <TextField
                value={this.state.fileName}
                onClick={() => this.showExplorerDialog('fileName')} readOnly
              />
            </NetPyNEField>

            <NetPyNEField id="netParams.importCellParams.cellName" className="netpyneRightField">
              <TextField
                value={this.state.cellName}
                onChange={(event) => this.setState({ cellName: event.target.value })}
              />
            </NetPyNEField>

            <NetPyNEField id="netParams.importCellParams.modFolder" className="netpyneRightField" >
              <TextField
                value={this.state.modFolder}
                onClick={() => this.showExplorerDialog('modFolder')} readOnly
              />
            </NetPyNEField>
            
            <TextField
              floatingLabelText={"Add new key:value pair"}
              onChange={this.handleNewItemChange}
              value={this.state.newItemValue}
              style={{ width: '90%' }}
              errorText={this.state.newItemErrorText}
            />
            {!this.state.newItemErrorText &&
              <IconButton
                iconStyle={{ width: 10, height: 10 }}
                className={"listButtonLarge"}
                onClick={this.addChild}
                tooltip="Add item to the dictionary"
              >
                <FontIcon className={"fa fa-plus-circle listIcon"} />
              </IconButton>
            }

            {cellArgs.length > 0 && <div style={{marginTop:'15px', marginLeft: '50px', padding: '0px 5px', float: 'left' }}>{cellArgs}</div>}

            <div style={{ width: '100%', float: 'left', marginTop: '15px' }}>
              <div style={{ float: 'left', width: '50%' }}>
                <NetPyNEField id="netParams.importCellParams.importSynMechs" className="netpyneCheckbox netpyneFieldNoWidth" noStyle>
                  <Checkbox
                    style={{width: '90%'}}
                    checked={this.state.importSynMechs}
                    onCheck={(event) => this.updateCheck('importSynMechs')}
                  />
                </NetPyNEField>
              </div>

              <div style={{ float: 'right', width: '50%' }}>
                <NetPyNEField id="netParams.importCellParams.compileMod" className="netpyneCheckbox netpyneFieldNoWidth" noStyle>
                  <Checkbox
                    style={{width: '90%'}}
                    checked={this.state.compileMod}
                    onCheck={(event) => this.updateCheck('compileMod')}
                  />
                </NetPyNEField>
              </div>
            </div>
            
            

            <FileBrowser open={this.state.explorerDialogOpen} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
          </CardText>
        </Card>
      </Dialog>
    );
  };
};
