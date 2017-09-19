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

    //this.setDuration = this.setDuration.bind(this);

  }

  setPage(page) {
    this.setState({ page: page });
  }

  // setDuration(event, value) {
  //   console.log("setDuration");
  //   GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'simConfig.duration', parameters:[this.state.model.name, 'duration', value]});
  // }

  handleDurationChange(event, index, value) {
    this.setState({ duration: value });
  }

  handleDtChange(event, index, value) {
    this.setState({ dt: value });
  }

  handleSeedsChange(event, index, value) {
    this.setState({ seeds: value });
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
        </Paper>
      </Card>);

    }
    return content;
  }
}

// # general
// - cfg.seeds = Dict({'conn': 1, 'stim': 1, 'loc': 1}) # Seeds for randomizers (connectivity, input stimulation and cell locations)
// - cfg.addSynMechs = True # whether to add synaptich mechanisms or not
// - cfg.includeParamsLabel = True # include label of param rule that created that cell, conn or stim
// - cfg.timing = True # show timing of each process
// - cfg.verbose = False # show detailed messages
//
// # save options
// - cfg.simLabel = '' # name of simulation (used as filename if none provided)
// - cfg.saveFolder = '' # path where to save output data
// - cfg.filename = 'model_output' # Name of file to save model output (if omitted then saveFolder+simLabel is used)
// - cfg.saveDataInclude = ['netParams', 'netCells', 'netPops', 'simConfig', 'simData']
// - cfg.timestampFilename = False # Add timestamp to filename to avoid overwriting
// - cfg.savePickle = False # save to pickle file
// - cfg.saveJson = False # save to json file
// - cfg.saveMat = False # save to mat file
// - cfg.saveHDF5 = False # save to HDF5 file
// - cfg.self.saveDpk = False # save to .dpk pickled file (not sure if working)
// - cfg.saveDat = False # save traces to .dat file(s) (not working)
// - cfg.saveCSV = False # save to txt file (not working)
// - cfg.backupCfgFile = [] # copy cfg file, list with [sourceFile,destFolder] (eg. ['cfg.py', 'backupcfg/'])
// - cfg.saveCellSecs = True # save all the sections info for each cell (False reduces time+space; available in netParams; prevents re-simulation)
// - cfg.saveCellConns = True # save all the conns info for each cell (False reduces time+space; prevents re-simulation)
//
// # error checking
// - *cfg.checkErrors = False # whether to validate the input parameters
// - cfg.checkErrorsVerbose = False # whether to print detailed errors duration
