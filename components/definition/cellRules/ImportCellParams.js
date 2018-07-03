import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import FileBrowser from '../../general/FileBrowser';
import ListComponent from '../../general/List';


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
      exploreOnlyDirs: false,
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.performAction = this.performAction.bind(this);
    
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
          cellArgs: this.refs.cellArgs.state.children
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

  showExplorerDialog(explorerParameter, exploreOnlyDirs) {
    this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs });
  };

  closeExplorerDialog(fieldValue) {
    var newState = { explorerDialogOpen: false };
    if (fieldValue) {
      switch (this.state.explorerParameter) {
        case "fileName":
          newState["fileName"] = fieldValue.path;
          break;
        case "modFolder":
          newState["modFolder"] = fieldValue.path;
          break;
        default:
          throw ("Not a valid parameter!");
      }
    }

    this.setState(newState);
  };

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
                onClick={() => this.showExplorerDialog('fileName', false)} readOnly
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
                onClick={() => this.showExplorerDialog('modFolder', true)} readOnly
              />
            </NetPyNEField>
            
            <div className="listStyle netpyneField">
              <ListComponent realType="dict" floatingLabelText="Cell Template Parameters (key:value pair)" ref="cellArgs"/>
            </div>
            
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
            
            <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
          </CardText>
        </Card>
      </Dialog>
    );
  };
};
