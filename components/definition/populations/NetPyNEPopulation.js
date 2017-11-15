import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import Toggle from 'material-ui/Toggle';
import Slider from '../../general/Slider';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import AutoComplete from 'material-ui/AutoComplete';


import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import AdapterComponent from '../../general/AdapterComponent';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
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

    this.popDimensionsOptions = [{ label: 'Density', value: 'density' }, { label: 'Number of Cells', value: 'numCells' }, { label: 'Grid Spacing', value: 'gridSpacing' }];
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model, selectedIndex: 0, sectionId: "General" });
  }

  getPopulationDimensionText() {
    return this.popDimensionsOptions.filter((p) => { return p.value == this.state.dimension })[0].label;
  }

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  componentDidUpdate(prevProps, prevState) {
    if (this.state.model.name != prevState.model.name) {
      var newState = Object.keys(this.state)
        .filter(key => (key !== 'model' && key !== 'selectedIndex' && key !== 'sectionId'))
        .reduce((result, current) => {
          result[current] = '';
          return result;
        }, {});
      this.setState(newState);
    }
    else if (this.state.cellModel != prevState.cellModel) {
      // Set Population Dimension Python Side
      Utils
        .sendPythonMessage('api.getParametersForCellModel', [this.state.cellModel])
        .then((response) => {
          // console.log("Getting Parameters For Cell Model");
          // console.log("Response", response);

          var cellModelFields = [];
          if (Object.keys(response).length != 0) {
            // Merge the new metadata with the current one
            window.metadata = Utils.mergeDeep(window.metadata, response);
            // console.log("New Metadata", window.metadata);

            // Get Fields for new metadata
            cellModelFields = Utils.getFieldsFromMetadataTree(response, (key) => {
              return (<NetPyNEField id={key} style={styles.netpyneField}>
                <PythonControlledTextField
                  model={"netParams.popParams['" + this.state.model.name + "']['" + key.split(".").pop() + "']"}
                />
              </NetPyNEField>);
            });
          }
          this.setState({ cellModelFields: cellModelFields });
        });
    }
  }

  getBottomNavigationItem(index, sectionId, label, icon) {
    return <BottomNavigationItem
      key={sectionId}
      label={label}
      icon={(<FontIcon className={"fa " + icon}></FontIcon>)}
      onClick={() => this.select(index, sectionId)}
    />
  }

  generateMenu() {
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationItem(0, 'General', 'General', 'fa-bars'));
    bottomNavigationItems.push(this.getBottomNavigationItem(1, 'SpatialDistribution', 'Spatial Distribution', 'fa-cube'));
    if (typeof this.state.cellModelFields != "undefined" && this.state.cellModelFields != '') {
      bottomNavigationItems.push(this.getBottomNavigationItem(2, this.state.cellModel, this.state.cellModel + " Model", 'fa-balance-scale'));
    }
    bottomNavigationItems.push(this.getBottomNavigationItem(3, 'CellList', 'Cell List', 'fa-list'));
    return bottomNavigationItems;
  }

  render() {
    if (this.state.sectionId == "General") {
      var content =
        <div>
          <TextField
            value={this.state.model.name}
            style={styles.netpyneField}
            onChange={(event) => Utils.renameKey('netParams.popParams', this.state.model.name, event.target.value, (response, newValue) => {
              var model = this.state.model;
              model.name = newValue;
              this.setState({ model: model });
            })}
            floatingLabelText="The name of your population"
          /><br />

          <NetPyNEField id="netParams.popParams.cellModel" style={styles.netpyneField}>
            <PythonControlledAutoComplete
              dataSource={[]}
              model={"netParams.popParams['" + this.state.model.name + "']['cellModel']"}
              searchText={this.state.cellModel}
              onChange={(value) => this.setState({ cellModel: value })}
              openOnFocus={true} />
          </NetPyNEField>
          <br />

          <NetPyNEField id="netParams.popParams.cellType" style={styles.netpyneField}>
            <PythonControlledTextField
              model={"netParams.popParams['" + this.state.model.name + "']['cellType']"}
            />
          </NetPyNEField>
          <br />

          <NetPyNEField id="netParams.popParams.numCells" style={styles.netpyneField}>
            <SelectField
              value={this.state.dimension}
              onChange={(event, index, value) => this.setState({ dimension: value })}
            >
              {(this.popDimensionsOptions != undefined) ?
                this.popDimensionsOptions.map(function (popDimensionsOption) {
                  return (<MenuItem key={popDimensionsOption.value} value={popDimensionsOption.value} primaryText={popDimensionsOption.label} />)
                }) : null}

            </SelectField>
          </NetPyNEField>
          {this.state.dimension != undefined && this.state.dimension != "" ?
            <NetPyNEField id={"netParams.popParams." + this.state.dimension} style={styles.netpyneRightField}>
              <PythonControlledTextField
                
                handleChange={(event, value) => {
                  var newValue = (event.target.type == 'number') ? parseFloat(value) : value;

                  // Set Population Dimension Python Side
                  Utils
                    .sendPythonMessage('netParams.popParams.setParam', [this.state.model.name, this.state.dimension, newValue])
                    .then(function (response) {
                      console.log("Setting Pop Dimensions Parameters");
                      console.log("Response", response);
                    });

                  // Update State
                  this.setState({ dimensionValue: newValue });
                }}
                model={"netParams.popParams['" + this.state.model.name + "']['" + this.state.dimension + "']"}
                value={this.state.dimensionValue}
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
              <MenuItem key="xRange" value="xRange" primaryText="Absolute" />
              <MenuItem key="xnormRange" value="xnormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeX != undefined) ?
            <div style={styles.netpyneRightField}>
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
              <MenuItem key="yRange" value="yRange" primaryText="Absolute" />
              <MenuItem key="ynormRange" value="ynormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeY != undefined) ?
            <div style={styles.netpyneRightField}>
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
              <MenuItem key="zRange" value="zRange" primaryText="Absolute" />
              <MenuItem key="znormRange" value="znormRange" primaryText="Normalized" />
            </SelectField>
          </NetPyNEField>
          {(this.state.rangeTypeZ != undefined) ?
            <div style={styles.netpyneRightField}>
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
            {this.generateMenu()}
          </BottomNavigation>
        </CardText>
        <br />
        {content}
      </div>
    );
  }
}
