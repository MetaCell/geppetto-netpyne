import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Card, { CardHeader, CardText } from 'material-ui/Card';

var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);

const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width: 350,
    height: 350,
    float: 'left'
  },
  cardContent: {
  }
};

export default class NetPyNESimConfig extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      page: 'main'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleDtChange = this.handleDtChange.bind(this);
    this.handleSeedsChange = this.handleSeedsChange.bind(this);
    this.handleAddSynMechsChange = this.handleAddSynMechsChange.bind(this);
    this.handleIncludeParamsLabelChange = this.handleIncludeParamsLabelChange.bind(this);
    this.handleTimingChange = this.handleTimingChange.bind(this);
    this.handleVerboseChange = this.handleVerboseChange.bind(this);
    this.handleSimLabelChange = this.handleSimLabelChange.bind(this);
    this.handleSaveFolderChange = this.handleSaveFolderChange.bind(this);
    this.handleFileNameChange = this.handleFileNameChange.bind(this);

    this.handleSaveDataIncludeChange = this.handleSaveDataIncludeChange.bind(this);
    this.handleTimestampFilenameChange = this.handleTimestampFilenameChange.bind(this);
    this.handleSavePickleChange = this.handleSavePickleChange.bind(this);
    this.handleSaveJsonChange = this.handleSaveJsonChange.bind(this);

    this.handleSaveMatChange = this.handleSaveMatChange.bind(this);
    this.handleSaveHDF5Change = this.handleSaveHDF5Change.bind(this);
    this.handleSaveDpkChange = this.handleSaveDpkChange.bind(this);
    this.handleSaveCSVChange = this.handleSaveCSVChange.bind(this);

    this.handleBackupCfgFileChange = this.handleBackupCfgFileChange.bind(this);
    this.handleSaveCellSecsChange = this.handleSaveCellSecsChange.bind(this);
    this.handleSaveCellConnsChange = this.handleSaveCellConnsChange.bind(this);
    this.handleCheckErrorsChange = this.handleCheckErrorsChange.bind(this);
    this.handleCheckErrorsVerboseChange = this.handleCheckErrorsVerboseChange.bind(this);

  }

  setPage(page) {
    this.setState({ page: page });
  }
  
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.duration', parameters:[this.state.model.name, 'duration', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.dt', parameters:[this.state.model.name, 'dt', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.seeds', parameters:[this.state.model.name, 'seeds', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.addSynMechs', parameters:[this.state.model.name, 'addSynMechs', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.includeParamsLabel', parameters:[this.state.model.name, 'includeParamsLabel', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.timing', parameters:[this.state.model.name, 'timing', value]});

  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.verbose', parameters:[this.state.model.name, 'verbose', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.simLabel', parameters:[this.state.model.name, 'simLabel', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveFolder', parameters:[this.state.model.name, 'saveFolder', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.fileName', parameters:[this.state.model.name, 'fileName', value]});

  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveDataInclude', parameters:[this.state.model.name, 'saveDataInclude', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.timestampFilename', parameters:[this.state.model.name, 'timestampFilename', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.savePickle', parameters:[this.state.model.name, 'savePickle', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveJson', parameters:[this.state.model.name, 'saveJson', value]});

  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveMat', parameters:[this.state.model.name, 'saveMat', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveHDF5', parameters:[this.state.model.name, 'saveHDF5', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveDpk', parameters:[this.state.model.name, 'saveDpk', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveCSV', parameters:[this.state.model.name, 'saveCSV', value]});

  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.backupCfgFile', parameters:[this.state.model.name, 'backupCfgFile', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveCellSecs', parameters:[this.state.model.name, 'saveCellSecs', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.saveCellConns', parameters:[this.state.model.name, 'saveCellConns', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.checkErrors', parameters:[this.state.model.name, 'checkErrors', value]});
  GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.checkErrorsVerbose', parameters:[this.state.model.name, 'checkErrorsVerbose', value]});

  handleDurationChange(event, index, value) {
    this.setState({ duration: value });
  }

  handleDtChange(event, index, value) {
    this.setState({ dt: value });
  }

  handleSeedsChange(event, index, value) {
    this.setState({ seeds: value });
  }

  handleAddSynMechsChange(event, index, value) {
    this.setState({ addSynMechs: value });
  }

  handleIncludeParamsLabelChange(event, index, value) {
    this.setState({ includeParamsLabel: value });
  }

  handleTimingChange(event, index, value) {
    this.setState({ timing: value });
  }

  handleVerboseChange(event, index, value) {
    this.setState({ verbose: value });
  }

  handleSimLabelChange(event, index, value) {
    this.setState({ simLabel: value });
  }

  handleSaveFolderChange(event, index, value) {
    this.setState({ saveFolder: value });
  }

  handleFileNameChange(event, index, value) {
    this.setState({ fileName: value });
  }

  handleSaveDataIncludeChange(event, index, value) {
    this.setState({ saveDataInclude: value });
  }

  handleTimestampFilename(event, index, value) {
    this.setState({ timestampFilename: value });
  }

  handleSavePickleChange(event, index, value) {
    this.setState({ savePickle: value });
  }

  handleSaveJsonFilenameChange(event, index, value) {
    this.setState({ saveJson: value });
  }

  handleSaveMatChange(event, index, value) {
    this.setState({ saveMat: value });
  }

  handleSaveJsonChange(event, index, value) {
    this.setState({ saveJson: value });
  }

  handleSaveDpkChange(event, index, value) {
    this.setState({ saveDpk: value });
  }

  handleSaveDatChange(event, index, value) {
    this.setState({ saveDat: value });
  }

  handleSaveCsvChange(event, index, value) {
    this.setState({ saveCsv: value });
  }

  handleBackupCfgFileChange(event, index, value) {
    this.setState({ backupCfgFile: value });
  }

  handleSaveCellSecsChange(event, index, value) {
    this.setState({ saveCellSecs: value });
  }

  handleSaveCellConnsChange(event, index, value) {
    this.setState({ saveCellConns: value });
  }

  handleCheckErrorsChange(event, index, value) {
    this.setState({ checkErrors: value });
  }

  handleCheckErrorsVerboseChange(event, index, value) {
    this.setState({ checkErrorsVerbose: value });
  }

  handleChange(event) {
    var model = this.state.model;
    model.name = event.target.value;
    this.setState({
      model: model,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      model: nextProps.model
    });
  }

  render() {
    var content;

    if (this.state.page == 'main') {
      content = (
        <Card style={styles.card}>
          <CardHeader
            title="Configuration"
            subtitle="General configuration"
            actAsExpander={true}
            showExpandableButton={true}
          />

            <Paper style={styles.tabContainer} expandable={true}>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.duration"}
                  floatingLabelText="Duration"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.dt"}
                  floatingLabelText="Dt"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.seeds"}
                  floatingLabelText="Seeds"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.addSynMechs"}
                  floatingLabelText="Add Syn Mechs"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.includeParamsLabel"}
                  floatingLabelText="Include Params Label"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.timing"}
                  floatingLabelText="Timing"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.verbose"}
                  floatingLabelText="Verbose"
                /><br />
              </div>

            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.simLabel"}
                floatingLabelText="Sim Label"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveFolder"}
                floatingLabelText="Save Folder"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.filename"}
                floatingLabelText="File Name"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDataInclude"}
                floatingLabelText="Save Data Include"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.timestampFilename"}
                floatingLabelText="Timestamp File Name"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.savePickle"}
                floatingLabelText="Save Pickle"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveJson"}
                floatingLabelText="Save Json"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveMat"}
                floatingLabelText="Save Mat"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveHDF5"}
                floatingLabelText="Save HDF5"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDpk"}
                floatingLabelText="Save Dpk"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDat"}
                floatingLabelText="Save Dat"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCsv"}
                floatingLabelText="Save Csv"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCellSecs"}
                floatingLabelText="Save Cell Secs"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCellConns"}
                floatingLabelText="Save Cell Conns"
              /><br />
            </div>

            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.checkError"}
                floatingLabelText="Check Errors"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.checkError"}
                floatingLabelText="Check Errors"
              /><br />
            </div>
          </Paper>

       </Card>);

    }
    return content;
  }
}
