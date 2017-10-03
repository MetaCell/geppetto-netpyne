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
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import AutoComplete from 'material-ui/AutoComplete';


var Utils = require('../../Utils');
import NetPyNEField from '../general/NetPyNEField';
import AdapterComponent from '../general/AdapterComponent';

var PythonControlledCapability = require('../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);
var PythonControlledSlider = PythonControlledCapability.createPythonControlledComponent(Slider);
var PythonControlledAutoComplete = PythonControlledCapability.createPythonControlledComponent(AutoComplete);
var PythonControlledAdapterComponent = PythonControlledCapability.createPythonControlledComponent(AdapterComponent);


const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width: 350,
    height: 350,
    float: 'left'
  },
  netpyneField: {
    float: 'left',
    clear: 'left',
    marginRight: '20px'
  },
  netpyneRightField: {
    float: 'left'
  }

};


export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      model: props.model,
      selectedIndex: 0,
      sectionId: "General"
    };

    this.handleChange = this.handleChange.bind(this);
    this.setPopulationDimension = this.setPopulationDimension.bind(this);

    // var _this = this;
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

  setPopulationDimension(event, value) {
    // Set Population Dimension Python Side
    Utils
      .sendPythonMessage('netParams.popParams.setParam', [this.state.model.name, this.state.dimension, value])
      .then(function (response) {
        console.log("Setting Pop Dimensions Parameters");
        console.log("Response", response);
      });

    // Update State
    this.setState({ dimensionValue: value });
  }

  handleChange(event) {
    var model = this.state.model;
    model.name = event.target.value;
    this.setState({ model: model });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  getPopulationDimensionText() {
    var _this = this;
    return this.popDimensionsOptions.filter(function (p) { return p.value == _this.state.dimension })[0].label;
  }

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  getBottomNavigationItem(index, sectionId, label, icon) {

    return <BottomNavigationItem
      label={label}
      icon={(<FontIcon className={"fa " + icon}></FontIcon>)}
      onClick={() => this.select(index, sectionId)}
    />
  }

  render() {
    if (this.state.sectionId == "General") {
      var content =
        <div>
          <TextField
            value={this.state.model.name}
            style={styles.netpyneField}
            onChange={this.handleChange}
            floatingLabelText="The name of your population"
          /> <br />

          <NetPyNEField id="netParams.popParams.cellModel" style={styles.netpyneField}>
            <PythonControlledAutoComplete
              floatingLabelText={Utils.getMetadataField("netParams.popParams.cellModel", "label")}
              dataSource={Utils.getMetadataField("netParams.popParams.cellModel", "suggestions")}
              requirement={this.props.requirement}
              searchText={this.state.cellModel}
              onChange={(value) => this.setState({ cellModel: value })}
              model={"netParams.popParams['" + this.state.model.name + "']['cellModel']"}
              openOnFocus={true} />

          </NetPyNEField>
          <br />

          <NetPyNEField id="netParams.popParams.cellType" style={styles.netpyneField}>
            <PythonControlledTextField
              floatingLabelText={Utils.getMetadataField("netParams.popParams.cellType", "label")}
              requirement={this.props.requirement}
              onChange={(event) => this.setState({ cellTypeValue: event.target.value })}
              value={this.state.cellTypeValue}
              model={"netParams.popParams['" + this.state.model.name + "']['cellType']"} />
          </NetPyNEField>
          <br />

          <NetPyNEField id="netParams.popParams.numCells" style={styles.netpyneField}>
            <SelectField
              floatingLabelText={Utils.getMetadataField("netParams.popParams.numCells", "label")}
              value={this.state.dimension}
              onChange={(event, index, value) => this.setState({ dimension: value })}
            >
              {(this.popDimensionsOptions != undefined) ?
                this.popDimensionsOptions.map(function (popDimensionsOption) {
                  return (<MenuItem value={popDimensionsOption.value} primaryText={popDimensionsOption.label} />)
                }) : null}

            </SelectField>
          </NetPyNEField>
          {this.state.dimension != undefined ?
            <NetPyNEField id={"netParams.popParams." + this.state.dimension} style={styles.netpyneRightField}>
              <TextField
                floatingLabelText={this.getPopulationDimensionText()}
                hintText={Utils.getMetadataField("netParams.popParams." + this.state.dimension, "hintText")}
                value={this.state.dimensionValue}
                onChange={this.setPopulationDimension}
              />
            </NetPyNEField>
            : null
          }
        </div>
    }
    else if (this.state.sectionId == "SpatialDistribution") {
      var content =
        <div>
          <NetPyNEField id={"netParams.popParams.xRange"} style={styles.netpyneField}>
            <SelectField
              floatingLabelText="Range type"
              value={this.state.rangeTypeX}
              onChange={(event, index, value) => this.setState({ rangeTypeX: value })}
            >
              <MenuItem value="xRange" primaryText="Absolute" />
              <MenuItem value="xnormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeX != undefined) ?
            <div style={styles.netpyneRightField}>
              <PythonControlledAdapterComponent
                requirement={this.props.requirement}
                model={"netParams.popParams['" + this.state.model.name + "']['" + this.state.rangeTypeX + "']"}
                convertToPython={(state) => {
                  if (state.minXAxis != undefined && state.maxXAxis != undefined) {
                    return "[" + state.minXAxis + "," + state.maxXAxis + "]";
                  }
                }}
                convertFromPython={(prevProps, prevState, value) => {
                  if (value != undefined && prevProps.value != value) {
                    var arrayValue = JSON.parse(value);
                    return { minXAxis: arrayValue[0], maxXAxis: arrayValue[1] };
                  }
                }}
              >
                <TextField
                  floatingLabelText="Min x-axis"
                  id="minXAxis"
                />
                <TextField
                  floatingLabelText="Max x-axis"
                  id="maxXAxis"
                />
              </PythonControlledAdapterComponent>
            </div>
            : null}
          <br />
          <NetPyNEField id={"netParams.popParams.yRange"} style={styles.netpyneField}>
            <SelectField
              floatingLabelText="Range type"
              value={this.state.rangeTypeY}
              onChange={(event, index, value) => this.setState({ rangeTypeY: value })}
            >
              <MenuItem value="yRange" primaryText="Absolute" />
              <MenuItem value="ynormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeY != undefined) ?
            <div style={styles.netpyneRightField}>
              <PythonControlledAdapterComponent
                requirement={this.props.requirement}
                model={"netParams.popParams['" + this.state.model.name + "']['" + this.state.rangeTypeY + "']"}
                convertToPython={(state) => {
                  if (state.minYAxis != undefined && state.maxYAxis != undefined) {
                    return "[" + state.minYAxis + "," + state.maxYAxis + "]";
                  }
                }}
                convertFromPython={(prevProps, prevState, value) => {
                  if (value != undefined && prevProps.value != value) {
                    var arrayValue = JSON.parse(value);
                    return { minYAxis: arrayValue[0], maxYAxis: arrayValue[1] };
                  }
                }}
              >
                <TextField
                  floatingLabelText="Min y-axis"
                  id="minYAxis"
                />
                <TextField
                  floatingLabelText="Max y-axis"
                  id="maxYAxis"
                />
              </PythonControlledAdapterComponent>
            </div>
            : null}
          <br />

          <NetPyNEField id={"netParams.popParams.zRange"} style={styles.netpyneField}>
            <SelectField
              floatingLabelText="Range type"
              id={"netParams.popParams." + this.state.rangeTypeZ}
              value={this.state.rangeTypeZ}
              onChange={(event, index, value) => this.setState({ rangeTypeZ: value })}
            >
              <MenuItem value="zRange" primaryText="Absolute" />
              <MenuItem value="znormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeZ != undefined) ?
            <div style={styles.netpyneRightField}>
              <PythonControlledAdapterComponent
                requirement={this.props.requirement}
                model={"netParams.popParams['" + this.state.model.name + "']['" + this.state.rangeTypeZ + "']"}
                convertToPython={(state) => {
                  if (state.minZAxis != undefined && state.maxZAxis != undefined) {
                    return "[" + state.minZAxis + "," + state.maxZAxis + "]";
                  }
                }}
                convertFromPython={(prevProps, prevState, value) => {
                  if (value != undefined && prevProps.value != value) {
                    var arrayValue = JSON.parse(value);
                    return { minZAxis: arrayValue[0], maxZAxis: arrayValue[1] };
                  }
                }}
              >
                <TextField
                  floatingLabelText="Min z-axis"
                  id="minZAxis"
                />
                <TextField
                  floatingLabelText="Max z-axis"
                  id="maxZAxis"
                />
              </PythonControlledAdapterComponent>
            </div>
            : null}
        </div>
    }
    else if (this.state.sectionId == "NetStim" || this.state.sectionId == "VecStim") {
      var content =
        <div>
          <div>
            <PythonControlledTextField
              style={styles.netpyneField}
              floatingLabelText="Spike Interval"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['interval']"} />
            <br />
            <PythonControlledTextField
              style={styles.netpyneField}
              floatingLabelText="Firing Rate"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['rate']"} />
            <br />
            <PythonControlledSlider
              style={styles.netpyneField}
              preText="Noise. Fraction of noise in NetStim."
              proText=" from a range of 0 (deterministic) to 1 (completely random)"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['noise']"} />
            <br />
            <PythonControlledTextField
              style={styles.netpyneField}
              floatingLabelText="Start"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['start']"} />
            <br />
            <PythonControlledTextField
              style={styles.netpyneField}
              floatingLabelText="Number"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['number']"} />
            <br />
            <PythonControlledTextField
              style={styles.netpyneField}
              floatingLabelText="Seed"
              requirement={this.props.requirement}
              model={"netParams.popParams['" + this.state.model.name + "']['seed']"} />
            <br />
          </div>

          {(this.state.cellModel == 'VecStim') ?
            <div>
              <PythonControlledTextField
                style={styles.netpyneField}
                floatingLabelText="Spike Time"
                requirement={this.props.requirement}
                model={"netParams.popParams['" + this.state.model.name + "']['spkTimes']"} />
              <br />
              <PythonControlledTextField
                style={styles.netpyneField}
                floatingLabelText="Pulses (to be expanded) start (ms), end (ms), rate (Hz), and noise (0 to 1) "
                requirement={this.props.requirement}
                model={"netParams.popParams['" + this.state.model.name + "']['pulses']"} />
            </div> : null
          }
        </div>
    }
    else if (this.state.sectionId == "CellList") {
      var content = <div>We should replicate population parameters</div>
    }

    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationItem(index, 'General', 'General', 'fa-question'));
    index++;
    bottomNavigationItems.push(this.getBottomNavigationItem(index, 'SpatialDistribution', 'Spatial Distribution', 'fa-question'));
    if (this.state.cellModel == 'NetStim' || this.state.cellModel == 'VecStim') {
      // We should do something like this -> this.getSpecificModelParameter() so we consider also IntFire1, etc.
      index++;
      bottomNavigationItems.push(this.getBottomNavigationItem(index, this.state.cellModel, this.state.cellModel + " Model", 'fa-question'));
    }
    index++;
    bottomNavigationItems.push(this.getBottomNavigationItem(index, 'CellList', 'Cell List', 'fa-question'));


    return (
      <div>
        <Paper zDepth={1}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            {bottomNavigationItems}
          </BottomNavigation>
        </Paper>

        {content}
      </div>


    );
  }
}
