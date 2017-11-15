import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import CardText from 'material-ui/Card';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);

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

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';

export default class NetPyNESection extends React.Component {

  constructor(props) {
    super(props);

    var _this = this;
    this.state = {
      model: props.model,
      selectedIndex: 0,
      sectionId: "General"
    };


    this.setPage = this.setPage.bind(this);


    // Get available population parameters
    // Utils
    //   .sendPythonMessage('tests.POP_NUMCELLS_PARAMS', [])
    //   .then(function (response) {
    //     console.log("Getting Pop Dimensions Parameters");
    //     console.log("Response", response)
    //     _this.setState({ 'popDimensionsOptions': response });
    //   });

  }

  setPage(page) {
    this.setState({ page: page });
  }

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  getBottomNavigationItem(index, sectionId, label, icon) {

    return <BottomNavigationItem
      label={label}
      icon={(<FontIcon className={"fa " + icon}></FontIcon>)}
      onClick={() => this.select(index, sectionId)}
    />
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  render() {

    var content;
    var that = this;
    if (this.state.sectionId == "General") {
      content = (
        <div>
          <TextField
            value={this.state.model.name}
            floatingLabelText="The name of the section"
          />
          <br /><br />
          <IconButton
            className={"gearThumbButton " + (this.props.selected ? "selectedGearButton" : "")}
            onClick={() => that.props.selectPage("mechanisms")}
          >
            <FontIcon color={changeColor} hoverColor={hoverColor} className="gpt-fullgear" />
            <span className={"gearThumbLabel"}>Mechanisms</span>
          </IconButton>
        </div>
      )
    }
    else if (this.state.sectionId == "Geometries") {
      content = (<div>
        <PythonControlledTextField
          floatingLabelText="Diameter"
          
          model={"netParams.cellParams['" + this.state.model.parent.name + "']['secs']['" + this.state.model.name + "']['geom']['diam']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="L"
          
          model={"netParams.cellParams['" + this.state.model.parent.name + "']['secs']['" + this.state.model.name + "']['geom']['L']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Ra"
          
          model={"netParams.cellParams['" + this.state.model.parent.name + "']['secs']['" + this.state.model.name + "']['geom']['Ra']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Pt3d"
          
          model={"netParams.cellParams['" + this.state.model.parent.name + "']['secs']['" + this.state.model.name + "']['geom']['pt3d']"} />
        <br />

      </div>)
    }
    else if (this.state.sectionId == "Topology") {
      content = (<div>
        <PythonControlledTextField
          floatingLabelText="Parent Section"
          
          model={"netParams.cellParams['" + this.state.model.parent.name + "']['secs']['" + this.state.model.name + "']['topol']['parentSec']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Parent x"
          
          model={"netParams.cellParams['" + this.state.model.parent.name + "']['secs']['" + this.state.model.name + "']['topol']['parentX']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Child x"
          
          model={"netParams.cellParams['" + this.state.model.parent.name + "']['secs']['" + this.state.model.name + "']['topol']['childX']"} />
      </div>)
    }
    else if (this.state.sectionId == "Ions") {
      content = (<div>TBD</div>
      )
    }


    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'General', 'General', 'fa-bars'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Geometries', 'Geometries', 'fa-cube'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Topology', 'Topology', 'fa-tree'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Ions', 'Ions', 'fa-dot-circle-o'));

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
