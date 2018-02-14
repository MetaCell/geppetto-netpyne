import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import clone from 'lodash.clone';
import Utils from '../../../Utils';
import FontIcon from 'material-ui/FontIcon';
import CardText from 'material-ui/Card';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import NetPyNEField from '../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

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

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name });
  }

  render() {
    var that = this;


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

          <NetPyNEField id="netParams.connParams.sec">
            <PythonControlledTextField 
               model={"netParams.connParams['" + this.props.name + "']['sec']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.loc" >
            <PythonControlledTextField 
              model={"netParams.connParams['" + this.props.name + "']['loc']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.synMech" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['synMech']"}
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


          <NetPyNEField id="netParams.connParams.delay" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['delay']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.plasticity" >
            <PythonControlledTextField
              fullWidth={true} model={"netParams.connParams['" + this.props.name + "']['plasticity']"}
            />
          </NetPyNEField>

        </div>
    }
    else if (this.state.sectionId == "Pre Conditions") {
      var content = <div>Add pre conditions</div>
    }
    else if (this.state.sectionId == "Post Conditions") {
      var content = <div>Add post conditions</div>
    }


    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'General', 'General', 'fa-bars'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Pre Conditions', 'Pre Conditions', 'fa-caret-square-o-left'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Post Conditions', 'Post Conditions', 'fa-caret-square-o-right'));

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
}
