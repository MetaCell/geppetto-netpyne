import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Utils from '../../../Utils';
import FontIcon from 'material-ui/FontIcon';
import CardText from 'material-ui/Card';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import NetPyNEField from '../../general/NetPyNEField';
import ListComponent from '../../general/List';
import NetPyNECoordsRange from '../../general/NetPyNECoordsRange';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class NetPyNEConnectivityRule extends React.Component {

  constructor(props) {
    super(props);
    var _this = this;
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General"
    };
  }

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      // Rename the population in Python
      Utils.renameKey('netParams.connParams', storedValue, newValue, (response, newValue) => { that.renaming = false; });
      that.renaming = true;
    });

  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  getBottomNavigationItem(index, sectionId, label, icon) {
    return <BottomNavigationItem
      key={sectionId}
      label={label}
      icon={(<FontIcon className={"fa " + icon}></FontIcon>)}
      onClick={() => this.select(index, sectionId)}
    />
  }


  postProcessMenuItems(pythonData, selected) {
    return pythonData.map((name) => (
      <MenuItem
        key={name}
        insetChildren={true}
        checked={selected.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
    ));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name });
  }

  render() {
    if (this.state.sectionId == "General") {
      var content =
        <div>
          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            floatingLabelText="The name of the connectivity rule"
            className={"netpyneField"}
          />

          <NetPyNEField id="netParams.connParams.sec" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.connParams['" + this.props.name + "']['sec']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.loc" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.connParams['" + this.props.name + "']['loc']"}
            />
          </NetPyNEField>

          <NetPyNEField id={"netParams.connParams.synMech"} >
            <PythonMethodControlledSelectField
              model={"netParams.connParams['" + this.props.name + "']['synMech']"}
              method={"netpyne_geppetto.getAvailableSynMech"}
              postProcessItems={this.postProcessMenuItems}
              multiple={false}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.connParams.convergence" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['convergence']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.connParams.divergence" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['divergence']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.connParams.probability" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['probability']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.synsPerConn" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['synsPerConn']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.weight" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['weight']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.delay" className="listStyle" noStyle>
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['delay']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.plasticity" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['plasticity']"}
            />
          </NetPyNEField>

        </div>
    }
    else if (this.state.sectionId == "Pre Conditions") {
      var content = <div>
        <NetPyNEField id={"netParams.connParams.preConds.pop"} >
          <PythonMethodControlledSelectField
            model={"netParams.connParams['" + this.props.name + "']['preConds']['pop']"}
            method={"netpyne_geppetto.getAvailablePops"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.connParams.preConds.cellModel"} >
          <PythonMethodControlledSelectField
            model={"netParams.connParams['" + this.props.name + "']['preConds']['cellModel']"}
            method={"netpyne_geppetto.getAvailableCellModels"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.connParams.preConds.cellType"} >
          <PythonMethodControlledSelectField
            model={"netParams.connParams['" + this.props.name + "']['preConds']['cellType']"}
            method={"netpyne_geppetto.getAvailableCellTypes"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        
        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.connParams'}
          conds={'preConds'}
          items={[
            {value: 'x', label:'absolute'}, 
            {value: 'xnorm', label:'normalized'}
          ]}
        />

        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.connParams'}
          conds={'preConds'}
          items={[
            {value: 'y', label:'absolute'}, 
            {value: 'ynorm', label:'normalized'}
          ]}
        />

        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.connParams'}
          conds={'preConds'}
          items={[
            {value: 'z', label:'absolute'}, 
            {value: 'znorm', label:'normalized'}
          ]}
        />
      
      </div>
    }
    else if (this.state.sectionId == "Post Conditions") {
      var content = <div>
        <NetPyNEField id={"netParams.connParams.postConds.pop"} >
          <PythonMethodControlledSelectField
            model={"netParams.connParams['" + this.props.name + "']['postConds']['pop']"}
            method={"netpyne_geppetto.getAvailablePops"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.connParams.postConds.cellModel"} >
          <PythonMethodControlledSelectField
            model={"netParams.connParams['" + this.props.name + "']['postConds']['cellModel']"}
            method={"netpyne_geppetto.getAvailableCellModels"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.connParams.postConds.cellType"} >
          <PythonMethodControlledSelectField
            model={"netParams.connParams['" + this.props.name + "']['postConds']['cellType']"}
            method={"netpyne_geppetto.getAvailableCellTypes"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>
        
        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.connParams'}
          conds={'postConds'}
          items={[
            {value: 'x', label:'absolute'}, 
            {value: 'xnorm', label:'normalized'}
          ]}
        />

        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.connParams'}
          conds={'postConds'}
          items={[
            {value: 'y', label:'absolute'}, 
            {value: 'ynorm', label:'normalized'}
          ]}
        />

        <NetPyNECoordsRange 
          name={this.props.name} 
          model={'netParams.connParams'}
          conds={'postConds'}
          items={[
            {value: 'z', label:'absolute'}, 
            {value: 'znorm', label:'normalized'}
          ]}
        />
        
      </div>
    }


    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'General', 'General', 'fa-bars'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Pre Conditions', 'Pre-synaptic cells conditions', 'fa-caret-square-o-left'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Post Conditions', 'Post-synaptic cells conditions', 'fa-caret-square-o-right'));

    return (
      <div>
        <CardText>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            {bottomNavigationItems}
          </BottomNavigation>
        </CardText>
        <br />
        {content}
      </div>
    );

  }

  handleChange = (event, index, values) => this.setState({ values });

}
