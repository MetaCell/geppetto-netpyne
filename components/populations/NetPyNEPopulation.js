import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Slider from '../general/Slider';


var PythonControlledCapability = require('../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);
var PythonControlledSlider = PythonControlledCapability.createPythonControlledComponent(Slider);

var Utils = require('../../Utils');

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

export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props);

    var _this = this;
    this.state = {
      model: props.model,
      page: 'main',
      cellModel: '',
      cellType: ["Pyr (for pyramidal neurons)", "FS (for fast-spiking interneurons)"]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDimensionChange = this.handleDimensionChange.bind(this);
    this.handleRangeTypeChange = this.handleRangeTypeChange.bind(this);
    this.setPopulationDimension = this.setPopulationDimension.bind(this);
    this.setPage = this.setPage.bind(this);
    this.handleCellTypeChange = this.handleCellTypeChange.bind(this);
    this.cellModelChange = this.cellModelChange.bind(this);
    this.handleCellTypeDemoChange = this.handleCellTypeDemoChange.bind(this);


    // Get available population parameters
    Utils
      .sendPythonMessage('tests.POP_NUMCELLS_PARAMS', [])
      .then(function (response) {
        console.log("Getting Pop Dimensions Parameters");
        console.log("Response", response)
        _this.setState({ 'popDimensionsOptions': response });
      });

  }

  setPage(page) {
    this.setState({ page: page });
  }

  setPopulationDimension(event, value) {
    console.log("setPopulationDimension");

    // Set Population Dimension
    Utils
      .sendPythonMessage('netParams.popParams.setParam', [this.state.model.name, this.state.dimension, value])
      .then(function (response) {
        console.log("Setting Pop Dimensions Parameters");
        console.log("Response", response)
      });
  }

  handleRangeTypeChange(event, index, value) {
    this.setState({ rangeType: value, rangeTypeSuffix: value });
  }

  handleDimensionChange(event, index, value) {
    this.setState({ dimension: value, dimensionVariable: value });
  }

  handleCellTypeDemoChange(event, index, value) {
    this.setState({ cellTypeValue: value });
  }

  handleChange(event) {
    var model = this.state.model;
    model.name = event.target.value;
    this.setState({ model: model });
  }

  handleCellTypeChange(event, isInputChecked) {
    this.setPage((isInputChecked) ? 'artificial' : 'main');
  }

  cellModelChange(event) {
    var value = event.currentTarget.value;
    this.setState({ cellModel: value })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  render() {
    if (this.state.page == 'main') {
      var content = (<div>
        <TextField
          value={this.state.model.name}
          floatingLabelText="The name of your population"
        /><br />

        <PythonControlledTextField
          floatingLabelText="Cell Model"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['cellModel']"} />
        <br />

        <PythonControlledSelectField
          floatingLabelText="Cell Type"
          requirement={this.props.requirement}
          onChange={this.handleCellTypeDemoChange}
          value={this.state.cellTypeValue}
          model={"netParams.popParams['" + this.state.model.name + "']['cellType']"}>
          {(this.state.cellType != undefined) ?
            this.state.cellType.map(function (ct) {
              return (<MenuItem value={ct} primaryText={ct} />)
            }) : null}

        </PythonControlledSelectField>
        <br />

        <SelectField
          floatingLabelText="Population dimension"
          value={this.state.dimension}
          onChange={this.handleDimensionChange}
        >
          {(this.state.popDimensionsOptions != undefined) ?
            this.state.popDimensionsOptions.map(function (popDimensionsOption) {
              return (<MenuItem value={popDimensionsOption} primaryText={popDimensionsOption} />)
            }) : null}

        </SelectField>
        <br />
        <TextField
          onChange={this.setPopulationDimension}
        />
        <br />
        <FlatButton label="See Spatial Distribution Parameters" fullWidth={true} secondary={true} onClick={() => this.setPage('distribution')} />
      </div>);
    }
    else if (this.state.page == 'distribution') {
      var content = (<div>
        <FlatButton label="Back" fullWidth={true} secondary={true} onClick={() => this.setPage('main')} />

        <SelectField
          floatingLabelText="Range type"
          value={this.state.rangeType}
          onChange={this.handleRangeTypeChange}
        >
          <MenuItem value="Range" primaryText="Absolute" />
          <MenuItem value="normRange" primaryText="Normalized" />
        </SelectField>
        <br />
        <PythonControlledTextField
          floatingLabelText="Neuron positions in x-axis"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['x" + this.state.rangeTypeSuffix + "']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Neuron positions in y-axis"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['y" + this.state.rangeTypeSuffix + "']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Neuron positions in z-axis"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['z" + this.state.rangeTypeSuffix + "']"} />
        <br />



      </div>);;
    }
    else if (this.state.page == 'artificial') {
      var content = (<div>
        <TextField
          value={this.state.model.name}
          floatingLabelText="The name of your population"
        /><br />

        <PythonControlledTextField
          floatingLabelText="Cell Model"
          requirement={this.props.requirement}
          onBlur={this.cellModelChange}
          model={"netParams.popParams['" + this.state.model.name + "']['cellModel']"} />
        <br />

        <PythonControlledTextField
          floatingLabelText="Number of Cells"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['numCells']"} />
        <br />

        <PythonControlledTextField
          floatingLabelText="Parameters of artificial cells (To be expanded)"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['taum']"} />
        <br />

        {(this.state.cellModel == 'NetStim' || this.state.cellModel == 'VecStim') ?
          <div>
            <PythonControlledTextField
              floatingLabelText="Spike Interval"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['interval']"} />
            <br />
            <PythonControlledTextField
              floatingLabelText="Firing Rate"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['rate']"} />
            <br />

            <PythonControlledSlider
              preText="Noise. Fraction of noise in NetStim."
              proText=" from a range of 0 (deterministic) to 1 (completely random)"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['noise']"} />
            <br />
            <PythonControlledTextField
              floatingLabelText="Start"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['start']"} />
            <br />
            <PythonControlledTextField
              floatingLabelText="Number"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['number']"} />
            <br />
            <PythonControlledTextField
              floatingLabelText="Seed"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['seed']"} />
            <br />
          </div>
          : null}
        {(this.state.cellModel == 'VecStim') ?
          <div>
            <PythonControlledTextField
              floatingLabelText="Spike Time"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['spkTimes']"} />
            <br />
            <PythonControlledTextField
              floatingLabelText="Pulses (to be expanded) start (ms), end (ms), rate (Hz), and noise (0 to 1) "
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['pulses']"} />

            <br />
          </div> :
          null}
      </div>)
    }
    return (
      <div>
        <Toggle
          label="Artificial Cells (point processes)"
          defaultToggled={false}
          onToggle={this.handleCellTypeChange}
        />
        {content}
      </div>
    );
  }
}
