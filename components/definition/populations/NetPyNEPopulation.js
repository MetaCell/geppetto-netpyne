import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Card, { CardText } from 'material-ui/Card';
import AutoComplete from 'material-ui/AutoComplete';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Utils from '../../../Utils';
import DimensionsComponent from './Dimensions';
import OneDimRange from '../../general/OneDimRange';
import NetPyNEField from '../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledAutoComplete = PythonControlledCapability.createPythonControlledControl(AutoComplete);

export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General"
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name, selectedIndex: 0, sectionId: "General" });
  };

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
                  model={"netParams.popParams['" + that.state.currentName + "']['" + key.split(".").pop() + "']"}
                />
              </NetPyNEField>);
            });
          }
          that.setState({ cellModelFields: cellModelFields, cellModel: value });
        });
    });
  };

  getModelParameters = () => {
    var select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId })

    var modelParameters = [];
    modelParameters.push(<BottomNavigationItem key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => select(0, 'General')} />);
    modelParameters.push(<BottomNavigationItem key={'SpatialDistribution'} label={'Spatial Distribution'} icon={<FontIcon className={"fa fa-cube"} />} onClick={() => select(1, 'SpatialDistribution')} />);
    if (typeof this.state.cellModelFields != "undefined" && this.state.cellModelFields != '') {
      modelParameters.push(<BottomNavigationItem key={this.state.cellModel} label={this.state.cellModel + " Model"} icon={<FontIcon className={"fa fa-balance-scale"} />} onClick={() => select(2, this.state.cellModel)} />);
    };
    modelParameters.push(<BottomNavigationItem key={'CellList'} label={'Cell List'} icon={<FontIcon className={"fa fa-list"} />} onClick={() => select(3, 'CellList')} />);

    return modelParameters;
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.model == undefined ||
      this.state.currentName != nextState.currentName ||
      this.state.cellModelFields != nextState.cellModelFields ||
      this.state.sectionId != nextState.sectionId ||
      this.state.selectedIndex != nextState.selectedIndex;
  };

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      // Rename the population in Python
      Utils.renameKey('netParams.popParams', storedValue, newValue, (response, newValue) => { that.renaming = false });
      that.renaming = true;
    });
  };

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    };
    this.updateTimer = setTimeout(updateMethod, 1000);
  };

  render() {
    if (this.state.sectionId == "General") {
      var content =
        <div id="populationMetadata">
          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            floatingLabelText="The name of your population"
            className={"netpyneField"}
            id={"populationName"}
          />
          
          <NetPyNEField id="netParams.popParams.cellModel" >
            <PythonControlledAutoComplete
              dataSource={[]}
              model={"netParams.popParams['" + this.props.name + "']['cellModel']"}
              searchText={this.state.cellModel}
              onChange={(value) => this.setPopulationDimension(value)}
              openOnFocus={true}
              id={"popCellModel"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.popParams.cellType" >
            <PythonControlledTextField
              model={"netParams.popParams['" + this.props.name + "']['cellType']"}
              id={"popCellType"}
            />
          </NetPyNEField>

          <DimensionsComponent modelName={this.props.name} />
        </div>
    }
    else if (this.state.sectionId == "SpatialDistribution") {
      var content = 
        <div>
          <OneDimRange 
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              {value: 'xRange', label:'absolute'}, 
              {value: 'xnormRange', label:'normalized'}
            ]}
          />
          
          <OneDimRange 
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              {value: 'yRange', label:'absolute'}, 
              {value: 'ynormRange', label:'normalized'}
            ]}
          />
          
          <OneDimRange 
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              {value: 'zRange', label:'absolute'}, 
              {value: 'znormRange', label:'normalized'}
            ]}
          />
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
  };
};
