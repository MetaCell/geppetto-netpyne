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

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');

export default class ImportCellParams extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      label: props.name,
      conds: {},
      fileName: '',
      cellName: '',
      modFolder: '',
      compileMod: false,
      importSynMechs: false,
      explorerDialogOpen: false
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

    // Import template
    Utils
      .sendPythonMessage('netpyne_geppetto.importCellTemplate', [this.state])
      .then(() => {
        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
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
          <CardTitle title="Import Cell Template" subtitle="Python or Hoc files" />
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

            <div style={{ width: '100%' }}>
              <div style={{ float: 'left', width: '50%' }}>
                <NetPyNEField id="netParams.importCellParams.importSynMechs" className="netpyneCheckbox">
                  <Checkbox
                    checked={this.state.importSynMechs}
                    onCheck={(event) => this.updateCheck('importSynMechs')}
                  />
                </NetPyNEField>
              </div>

              <div style={{ float: 'right', width: '50%' }}>
                <NetPyNEField id="netParams.importCellParams.compileMod" className="netpyneCheckbox">
                  <Checkbox
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
