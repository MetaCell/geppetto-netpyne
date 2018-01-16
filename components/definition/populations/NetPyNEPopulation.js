import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import Toggle from 'material-ui/Toggle';
import Slider from '../../general/Slider';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import AutoComplete from 'material-ui/AutoComplete';
import FontIcon from 'material-ui/FontIcon';
import clone from 'lodash.clone';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import AdapterComponent from '../../general/AdapterComponent';
import DimensionsComponent from './Dimensions';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);
var PythonControlledAutoComplete = PythonControlledCapability.createPythonControlledControl(AutoComplete);
var PythonControlledAdapterComponent = PythonControlledCapability.createPythonControlledControl(AdapterComponent);


export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props);
    var model = clone(props.model);
    this.state = {
      model: model,
      currentName: model.name,
      selectedIndex: 0,
      sectionId: "General"
    };

    
    this.ranges = [
      { value: 'xRange', stateVariable: 'rangeTypeX' }, { value: 'xnormRange', stateVariable: 'rangeTypeX' },
      { value: 'yRange', stateVariable: 'rangeTypeY' }, { value: 'ynormRange', stateVariable: 'rangeTypeY' },
      { value: 'zRange', stateVariable: 'rangeTypeZ' }, { value: 'znormRange', stateVariable: 'rangeTypeZ' }
    ]
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.model.name, model: nextProps.model, selectedIndex: 0, sectionId: "General" });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.model.name != prevState.model.name) {
      var newState = Object.keys(this.state)
        .filter(key => (key !== 'model' && key !== 'selectedIndex' && key !== 'sectionId' && key !== 'currentName'))
        .reduce((result, current) => {
          result[current] = '';
          return result;
        }, {});
      this.setState(newState);
      this.updateLayout();
    }
  }

  setPopulationDimension = (value) => {
    //this.setState({ cellModel: value });
    var that = this;
    this.triggerUpdate(function () {
      // Set Population Dimension Python Side
      Utils
        .sendPythonMessage('api.getParametersForCellModel', [value])
        .then((response) => {

          var cellModelFields = "";
          if (Object.keys(response).length != 0) {
            // Merge the new metadata with the current one
            window.metadata = Utils.mergeDeep(window.metadata, response);
            // console.log("New Metadata", window.metadata);
            cellModelFields = [];
            // Get Fields for new metadata
            cellModelFields = Utils.getFieldsFromMetadataTree(response, (key) => {
              return (<NetPyNEField id={key} >
                <PythonControlledTextField
                  model={"netParams.popParams['" + that.state.model.name + "']['" + key.split(".").pop() + "']"}
                />
              </NetPyNEField>);
            });
          }
          that.setState({ cellModelFields: cellModelFields, cellModel: value });
        });
    });

  }

  updateLayout() {

    //Range Type X
    const getRange = (value, stateVariable) => {
      Utils
        .sendPythonMessage("'" + value + "' in netParams.popParams['" + this.state.model.name + "']")
        .then((response) => {
          if (response) {
            var newState = {};
            newState[stateVariable] = value;
            this.setState(newState)
          }
        });
    }

    this.ranges.forEach((range) => { getRange(range.value, range.stateVariable) })


  }

  componentDidMount() {
    this.updateLayout();
  }

  getModelParameters = () => {
    var select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId })

    var modelParameters = [];
    modelParameters.push(<BottomNavigationItem key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => select(0, 'General')} />);
    modelParameters.push(<BottomNavigationItem key={'SpatialDistribution'} label={'Spatial Distribution'} icon={<FontIcon className={"fa fa-cube"} />} onClick={() => select(1, 'SpatialDistribution')} />);
    if (typeof this.state.cellModelFields != "undefined" && this.state.cellModelFields != '') {
      modelParameters.push(<BottomNavigationItem key={this.state.cellModel} label={this.state.cellModel + " Model"} icon={<FontIcon className={"fa fa-balance-scale"} />} onClick={() => select(2, this.state.cellModel)} />);
    }
    modelParameters.push(<BottomNavigationItem key={'CellList'} label={'Cell List'} icon={<FontIcon className={"fa fa-list"} />} onClick={() => select(3, 'CellList')} />);

    return modelParameters;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.model == undefined || this.state.currentName != nextState.currentName || this.state.cellModelFields != nextState.cellModelFields || this.state.model != nextState.model || this.state.dimension != nextState.dimension || this.state.sectionId != nextState.sectionId || this.state.selectedIndex != nextState.selectedIndex || this.state.rangeTypeX != nextState.rangeTypeX || this.state.rangeTypeY != nextState.rangeTypeY || this.state.rangeTypeZ != nextState.rangeTypeZ;
  }

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.state.model.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      // Rename the population in Python
      Utils.renameKey('netParams.popParams', storedValue, newValue, (response, newValue) => { });
    });

  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 500);
  }

  render() {
    if (this.state.sectionId == "General") {
      var content =
        <div>

          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            floatingLabelText="The name of your population"
            className={"netpyneField"}
          />



          <NetPyNEField id="netParams.popParams.cellModel" >
            <PythonControlledAutoComplete
              dataSource={[]}
              model={"netParams.popParams['" + this.state.model.name + "']['cellModel']"}
              searchText={this.state.cellModel}
              onChange={(value) => this.setPopulationDimension(value)}
              openOnFocus={true} />
          </NetPyNEField>

          <NetPyNEField id="netParams.popParams.cellType" >
            <PythonControlledTextField
              model={"netParams.popParams['" + this.state.model.name + "']['cellType']"}
            />
          </NetPyNEField>

          <DimensionsComponent model={this.state.model} />
          
        </div>
    }
    else if (this.state.sectionId == "SpatialDistribution") {
      var content =
        <div>
          <NetPyNEField id={"netParams.popParams.xRange"} >
            <SelectField
              floatingLabelText="Range type"
              value={this.state.rangeTypeX}
              onChange={(event, index, value) => this.setState({ rangeTypeX: value })}
            >
              <MenuItem key="xRange" value="xRange" primaryText="Absolute" />
              <MenuItem key="xnormRange" value="xnormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeX != undefined) ?
            <div className={"netpyneRightField"}>
              <PythonControlledAdapterComponent
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
                <TextField floatingLabelText="Min x-axis" id="minXAxis" />
                <TextField floatingLabelText="Max x-axis" id="maxXAxis" />
              </PythonControlledAdapterComponent>
            </div>
            : null}
          <br />
          <NetPyNEField id={"netParams.popParams.yRange"} >
            <SelectField
              floatingLabelText="Range type"
              value={this.state.rangeTypeY}
              onChange={(event, index, value) => this.setState({ rangeTypeY: value })}
            >
              <MenuItem key="yRange" value="yRange" primaryText="Absolute" />
              <MenuItem key="ynormRange" value="ynormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeY != undefined) ?
            <div className={"netpyneRightField"}>
              <PythonControlledAdapterComponent
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
                <TextField floatingLabelText="Min y-axis" id="minYAxis" />
                <TextField floatingLabelText="Max y-axis" id="maxYAxis" />
              </PythonControlledAdapterComponent>
            </div>
            : null}
          <br />

          <NetPyNEField id={"netParams.popParams.zRange"} >
            <SelectField
              floatingLabelText="Range type"
              id={"netParams.popParams." + this.state.rangeTypeZ}
              value={this.state.rangeTypeZ}
              onChange={(event, index, value) => this.setState({ rangeTypeZ: value })}
            >
              <MenuItem key="zRange" value="zRange" primaryText="Absolute" />
              <MenuItem key="znormRange" value="znormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeZ != undefined) ?
            <div className={"netpyneRightField"}>
              <PythonControlledAdapterComponent
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
                <TextField floatingLabelText="Min z-axis" id="minZAxis" />
                <TextField floatingLabelText="Max z-axis" id="maxZAxis" />
              </PythonControlledAdapterComponent>
            </div>
            : null}
        </div>
    }
    else if (this.state.sectionId == "CellList") {
      var content = <div>We should replicate population parameters</div>
    }
    else {
      var content = <div>{this.state.cellModelFields}</div>;
    }

    return (
      <div>
        <CardText>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            {this.getModelParameters()}
          </BottomNavigation>
        </CardText>
        <br />
        {content}
      </div>
    );
  }
}
