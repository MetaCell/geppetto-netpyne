import React from 'react';
import TextField from 'material-ui/TextField';
import { CardText } from 'material-ui/Card';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import DimensionsConnection from '../../../redux/reduxconnect/DimensionsConnection';
import NetPyNECoordsRange from '../../general/NetPyNECoordsRange';
import Dialog from 'material-ui/Dialog/Dialog';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';


var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);


export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General",
      errorMessage: undefined,
      errorDetails: undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name, selectedIndex: 0, sectionId: "General" });
  }

  setPopulationDimension = (value) => {
    //this.setState({ cellModel: value });
    this.triggerUpdate(() => {
      // Set Population Dimension Python Side
      Utils
        .evalPythonMessage('api.getParametersForCellModel', [value])
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
                  model={"netParams.popParams['" + this.state.currentName + "']['" + key.split(".").pop() + "']"}
                />
              </NetPyNEField>);
            });
          }
          this.setState({ cellModelFields: cellModelFields, cellModel: value });
        });
    });

  }

  getModelParameters = () => {
    var select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId })

    var modelParameters = [];
    modelParameters.push(<BottomNavigationItem id={'generalPopTab'} key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => select(0, 'General')} />);
    modelParameters.push(<BottomNavigationItem id={'spatialDistPopTab'} key={'SpatialDistribution'} label={'Spatial Distribution'} icon={<FontIcon className={"fa fa-cube"} />} onClick={() => select(1, 'SpatialDistribution')} />);
    if (typeof this.state.cellModelFields != "undefined" && this.state.cellModelFields != '') {
      modelParameters.push(<BottomNavigationItem key={this.state.cellModel} label={this.state.cellModel + " Model"} icon={<FontIcon className={"fa fa-balance-scale"} />} onClick={() => select(2, this.state.cellModel)} />);
    }
    modelParameters.push(<BottomNavigationItem key={'CellList'} label={'Cell List'} icon={<FontIcon className={"fa fa-list"} />} onClick={() => select(3, 'CellList')} />);

    return modelParameters;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.model == undefined ||
      this.state.currentName != nextState.currentName ||
      this.state.cellModelFields != nextState.cellModelFields ||
      this.state.sectionId != nextState.sectionId ||
      this.state.selectedIndex != nextState.selectedIndex;
  }

  handleRenameChange = (event) => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "Population");

    if(triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey('netParams.popParams', storedValue, newValue, (response, newValue) => { 
          this.renaming = false
          this.props.updateCards()
	      });
        this.renaming = true;
      });
    }
  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  render() {
    var actions = [
      <RaisedButton
        primary
        label={"BACK"}
        onTouchTap={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
      />
    ];
    var title = this.state.errorMessage;
    var children = this.state.errorDetails;
    var dialogPop = (this.state.errorMessage != undefined)? <Dialog
                                                              title={title}
                                                              open={true}
                                                              actions={actions}
                                                              bodyStyle={{ overflow: 'auto' }}
                                                              style={{ whiteSpace: "pre-wrap" }}>
                                                              {children}
                                                            </Dialog> : undefined;
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

          <NetPyNEField id="netParams.popParams.cellType" >
            <PythonControlledTextField
              callback={(newValue, oldValue) => {
                Utils.evalPythonMessage("netpyne_geppetto.propagate_field_rename", ['cellType', newValue, oldValue])
                console.log(`Netpyne   -> New value ${newValue}, oldValue: ${oldValue}`)
                this.props.updateCards()
              }}
              model={"netParams.popParams['" + this.props.name + "']['cellType']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.popParams.cellModel" >
            <PythonControlledTextField
              callback={(newValue, oldValue) => {
                Utils.evalPythonMessage("netpyne_geppetto.propagate_field_rename", ['cellModel', newValue, oldValue])
                this.props.updateCards()
              }}
              model={"netParams.popParams['" + this.props.name + "']['cellModel']"}
            />
          </NetPyNEField>

          <DimensionsConnection modelName={this.props.name} />
          {dialogPop}
        </div>
    }
    else if (this.state.sectionId == "SpatialDistribution") {
      var content = 
        <div>
          <NetPyNECoordsRange
            id={"xRangePopParams"}
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              {value: 'xRange', label:'Absolute'}, 
              {value: 'xnormRange', label:'Normalized'}
            ]}
          />

          <NetPyNECoordsRange 
            id="yRangePopParams"
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              {value: 'yRange', label:'Absolute'}, 
              {value: 'ynormRange', label:'Normalized'}
            ]}
          />

          <NetPyNECoordsRange 
            id="zRangePopParams"
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              {value: 'zRange', label:'Absolute'}, 
              {value: 'znormRange', label:'Normalized'}
            ]}
          />
        </div>
    }
    else if (this.state.sectionId == "CellList") {
      var content = <div>Option to provide individual list of cells. Coming soon ...</div>
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
