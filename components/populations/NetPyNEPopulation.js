import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Slider from '../general/Slider';
import Card, { CardHeader, CardText } from 'material-ui/Card';

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
      cellType: ["Pyr (for pyramidal neurons)", "FS (for fast-spiking interneurons)"],
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
    // Utils
    //   .sendPythonMessage('tests.POP_NUMCELLS_PARAMS', [])
    //   .then(function (response) {
    //     console.log("Getting Pop Dimensions Parameters");
    //     console.log("Response", response)
    //     _this.setState({ 'popDimensionsOptions': response });
    //   });

    this.popDimensionsOptions = [{ label: 'Density', value: 'density' }, { label: 'Number of Cells', value: 'numCells' }, { label: 'Grid Spacing', value: 'gridSpacing' }];



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
    this.setState({ dimension: value });
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

  getPopulationDimensionText() {
    var _this = this;
    return this.popDimensionsOptions.filter(function (p) { return p.value == _this.state.dimension })[0].label;
  }

  render() {
    return (
      <div>
        <Card initiallyExpanded={true}>
          <CardHeader
            title="General Parameters"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
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
              {(this.popDimensionsOptions != undefined) ?
                this.popDimensionsOptions.map(function (popDimensionsOption) {
                  return (<MenuItem value={popDimensionsOption.value} primaryText={popDimensionsOption.label} />)
                }) : null}

            </SelectField>


            {this.state.dimension != undefined ?
              <div style={{ float: 'right' }}><TextField
                floatingLabelText={this.getPopulationDimensionText()}
                onChange={this.setPopulationDimension}
              />
              </div> : null}
          </CardText>
        </Card>


        <Card>
          <CardHeader
            title="Spatial Distribution Parameters"
            subtitle="Spatial Distribution Parameters are incredible blabla"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <SelectField
              floatingLabelText="Range type"
              value={this.state.rangeTypeX}
              onChange={(event, index, value) => this.setState({ rangeTypeX: value })}
            >
              <MenuItem value="Range" primaryText="Absolute" />
              <MenuItem value="normRange" primaryText="Normalized" />
            </SelectField>
            <PythonControlledTextField
              style={{ float: 'right' }}
              floatingLabelText="Neuron positions in x-axis"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['x" + this.state.rangeTypeX + "']"} />

            <SelectField
              floatingLabelText="Range type"
              value={this.state.rangeTypeY}
              onChange={(event, index, value) => this.setState({ rangeTypeY: value })}
            >
              <MenuItem value="Range" primaryText="Absolute" />
              <MenuItem value="normRange" primaryText="Normalized" />
            </SelectField>
            <PythonControlledTextField
              style={{ float: 'right' }}
              floatingLabelText="Neuron positions in y-axis"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['y" + this.state.rangeTypeY + "']"} />

            <SelectField
              floatingLabelText="Range type"
              value={this.state.rangeTypeZ}
              onChange={(event, index, value) => this.setState({ rangeTypeZ: value })}
            >
              <MenuItem value="Range" primaryText="Absolute" />
              <MenuItem value="normRange" primaryText="Normalized" />
            </SelectField>
            <PythonControlledTextField
              style={{ float: 'right' }}
              floatingLabelText="Neuron positions in z-axis"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['z" + this.state.rangeTypeZ + "']"} />
          </CardText>
        </Card>

        {(this.state.cellModel == 'IntFire1') ?
          <Card>
            <CardHeader
              title={this.state.cellModel + " Model Parameters"}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              We need to extract this information from Neuron
            </CardText>
          </Card> : null}

        {(this.state.cellModel == 'NetStim' || this.state.cellModel == 'VecStim') ?
          <Card>
            <CardHeader
              title={this.state.cellModel + " Model Parameters"}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
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
                </div> : null}
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
                </div> : null}
            </CardText>
          </Card> : null}

        <Card>
          <CardHeader
            title={"Cell List"}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            We should replicate population parameters
            </CardText>
        </Card>

      </div>
    );
  }
}
