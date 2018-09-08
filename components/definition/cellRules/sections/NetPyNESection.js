import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import CardText from 'material-ui/Card';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';
import Utils from '../../../../Utils';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';

export default class NetPyNESection extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General"
    };
    this.setPage = this.setPage.bind(this);
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
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
      Utils.renameKey("netParams.cellParams['" + that.props.cellRule + "']['secs']", storedValue, newValue, (response, newValue) => { });
    });

  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 500);
  }

  getBottomNavigationItem(index, sectionId, label, icon, id) {

    return <BottomNavigationItem
      id={id}
      key={sectionId}
      label={label}
      icon={(<FontIcon className={"fa " + icon}></FontIcon>)}
      onClick={() => this.select(index, sectionId)}
    />
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name});
  }
  
  postProcessMenuItems(pythonData, selected) {
    if (pythonData[this.props.cellRule]!= undefined) {
      return pythonData[this.props.cellRule].map((name) => (
        <MenuItem
          id={name+"MenuItem"}
          key={name}
          value={name}
          primaryText={name}
        />
      ));
    }
  };
      
  render() {

    var content;
    var that = this;
    if (this.state.sectionId == "General") {
      content = (
        <div>
      
          <TextField
            id={"cellParamsSectionName"}
            onChange={this.handleRenameChange}
            value = {this.state.currentName}
            floatingLabelText="The name of the section"
            className={"netpyneField"}
          />
          <br /><br />
          <IconButton
            id={"cellParamsGoMechsButton"}
            className={"gearThumbButton " + (this.props.selected ? "selectedGearButton" : "")}
            onClick={() => that.props.selectPage("mechanisms")}
          >
            <FontIcon color={changeColor} hoverColor={hoverColor} className="gpt-fullgear" />
            <span className={"gearThumbLabel"}>Mechanisms</span>
          </IconButton>
        </div>
      )
    }
    else if (this.state.sectionId == "Geometry") {

      content = (<div>
        <NetPyNEField id="netParams.cellParams.secs.geom.diam" >
          <PythonControlledTextField model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['diam']"} />
        </NetPyNEField>

        <NetPyNEField id="netParams.cellParams.secs.geom.L" >
          <PythonControlledTextField model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['L']"} />
        </NetPyNEField>

        <NetPyNEField id="netParams.cellParams.secs.geom.Ra" >
          <PythonControlledTextField model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['Ra']"} />
        </NetPyNEField>

        <NetPyNEField id="netParams.cellParams.secs.geom.cm" >
          <PythonControlledTextField model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['cm']"} />
        </NetPyNEField>

        <NetPyNEField id="netParams.cellParams.secs.geom.pt3d" className="listStyle">
          <PythonControlledListComponent
            model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['pt3d']"} />
        </NetPyNEField>

      </div>)
    }
    else if (this.state.sectionId == "Topology") {
      content = (<div>
        <NetPyNEField id="netParams.cellParams.secs.topol.parentSec" >
          <PythonMethodControlledSelectField
            model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['topol']['parentSec']"}
            method={"netpyne_geppetto.getAvailableSections"}
            postProcessItems={this.postProcessMenuItems}
          />
        </NetPyNEField>
        <br />
        
        <NetPyNEField id="netParams.cellParams.secs.topol.parentX" >
          <PythonControlledTextField
            model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['topol']['parentX']"}
          />
        </NetPyNEField>
        <br />
        
        <NetPyNEField id="netParams.cellParams.secs.topol.childX" >
          <PythonControlledTextField
            model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['topol']['childX']"} 
          />
        </NetPyNEField>
      </div>)
    }


    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'General', 'General', 'fa-bars', 'sectionGeneralTab'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Geometry', 'Geometry', 'fa-cube', 'sectionGeomTab'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Topology', 'Topology', 'fa-tree', 'sectionTopoTab'));
    
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
