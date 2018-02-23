import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import CardText from 'material-ui/Card';
import Utils from '../../../../../Utils';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

var PythonControlledCapability = require('../../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);

export default class NetPyNEMechanism extends React.Component {

  constructor(props) {
    super(props);
    var _this = this;
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General"
    };


    this.setPage = this.setPage.bind(this);
  }

  setPage(page) {
    this.setState({ page: page });
  }

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      // Rename the population in Python
      Utils.renameKey("netParams.cellParams['" + that.props.cellRule + "']['secs']['" + that.props.section + "']['mechs']", storedValue, newValue, (response, newValue) => { });
    });

  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 500);
  }

  getBottomNavigationItem(index, sectionId, label, icon) {

    return <BottomNavigationItem
      key={sectionId}
      label={label}
      icon={(<FontIcon className={"fa " + icon}></FontIcon>)}
      onClick={() => this.select(index, sectionId)}
    />
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name});
  }

  render() {

    var content;
    if (this.state.sectionId == "General") {
      content = (
        <div>
          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            floatingLabelText="The name of the mechanism"
            className={"netpyneField"}
          />
        </div>
      )

    }
    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'General', 'General', 'fa-bars'));

    return (
      <div>

        <CardText zDepth={0}>
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
