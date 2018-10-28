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
      open: false,
      fileName: '',
      cellName: '',
      modFolder: '',
      compileMod: false,
      importSynMechs: false,
      explorerDialogOpen: false,
      exploreOnlyDirs: false,
      errorMessage: undefined,
      errorDetails: undefined
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.performAction = this.performAction.bind(this);
    this.closeImportCellParams = this.closeImportCellParams.bind(this);
    this.cancelImportCellParams = this.cancelImportCellParams.bind(this);
  };

  updateCheck(name) {
    this.setState((oldState) => {
      return {
        [name]: !oldState[name],
      };
    });
  };

  componentWillReceiveProps(nextProps) {
    // switch (nextProps.tab) {
    //TODO: we need to define the rules here
    if (this.props.open != nextProps.open) {
      this.setState({
        open: true
      });
    }
  };

  processError(parsedResponse) {
    var parsedResponse = Utils.getErrorResponse(response);
    if (parsedResponse) {
        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
        this.setState({ open: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] })
        return true;
      }
      return false;
  };

  performAction = () => {
    // Show spinner
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.IMPORTING_MODEL);

    Utils
      .evalPythonMessage("netParams.cellParams['" + this.props.name + "']['conds']")
      .then((response) => {
        var data = {
          conds: response,
          label: this.props.name,
          fileName: this.state.fileName,
          cellName: this.state.cellName,
          cellArgs: this.refs.cellArgs.state.children
        };

        // Import template
        this.closeImportCellParams();
        Utils
          .evalPythonMessage('netpyne_geppetto.importCellTemplate', [data, this.state.modFolder, this.state.compileMod])
          .then(response => {
            if (!this.processError(response)) {
              GEPPETTO.CommandController.log("The cell params were imported");
              GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            }
          });
      });


  };

  closeImportCellParams() {
    this.setState({ open: false, errorMessage: undefined, errorDetails: undefined });
  }

  cancelImportCellParams() {
    this.closeImportCellParams();
    this.props.onRequestClose();
  }

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
    if (this.state.open) {
      var cancelAction = <FlatButton
        label={'CANCEL'}
        onTouchTap={this.cancelImportCellParams}
        style={{ marginRight: 16 }}
      />
      if (this.state.errorMessage == undefined) {
        var actions = [
          cancelAction,
          <RaisedButton
            primary
            label={"IMPORT"}
            onTouchTap={this.performAction}
          />
        ];
        var children = <Card style={{ padding: 10, float: 'left', width: '100%' }}>
          <CardTitle style={{ paddingBottom: 0 }} title={"Import Cell Template"} subtitle="Python or Hoc files" />
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
              <ListComponent realType="dict" floatingLabelText="Cell Template Parameters (key:value pair)" ref="cellArgs" />
            </div>

            <div style={{ width: '100%', float: 'left', marginTop: '15px' }}>
              <div style={{ float: 'left', width: '50%' }}>
                <NetPyNEField id="netParams.importCellParams.importSynMechs" className="netpyneCheckbox netpyneFieldNoWidth" noStyle>
                  <Checkbox
                    style={{ width: '90%' }}
                    checked={this.state.importSynMechs}
                    onCheck={(event) => this.updateCheck('importSynMechs')}
                  />
                </NetPyNEField>
              </div>

              <div style={{ float: 'right', width: '50%' }}>
                <NetPyNEField id="netParams.importCellParams.compileMod" className="netpyneCheckbox netpyneFieldNoWidth" noStyle>
                  <Checkbox
                    style={{ width: '90%' }}
                    checked={this.state.compileMod}
                    onCheck={(event) => this.updateCheck('compileMod')}
                  />
                </NetPyNEField>
              </div>
            </div>

            <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
          </CardText>
        </Card>
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
        var children = Utils.parsePythonException(this.state.errorDetails);
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
        </Dialog>);
    }
    return null;
  };
};
