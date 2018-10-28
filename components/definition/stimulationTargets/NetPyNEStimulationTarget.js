import React, { Component } from 'react';
import CardText from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import CondsIcon from 'material-ui/svg-icons/maps/local-offer';
import StimTargetIcon from 'material-ui/svg-icons/action/reorder';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import StimulationConditions from './StimulationConditions';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

export default class NetPyNEStimulationTarget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      sourceTypeNetStim: false,
      selectedIndex: 0,
      sectionId: "General"
    };
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
    this.postProcessMenuItems4SynMech = this.postProcessMenuItems4SynMech.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.select = this.select.bind(this);
  };
  
  componentWillReceiveProps(nextProps) {
    if (this.state.currentName!=nextProps.name) {
      this.setState({ currentName: nextProps.name, selectedIndex:0, sectionId:'General'});
    };
  };

  componentDidMount() {
    GEPPETTO.trigger('subscribe_to_global_refresh', this.refs)
  }
  
  componentWillUnmount() {
    GEPPETTO.trigger('unsubscribe_from_global_refresh', this.refs)
  }
  
  // componentDidUpdate(prevState, prevProps) {
  //   console.log("%cREFS: ", "color:pink")
  //   console.log(this.refs)
  //   if (this.state.sourceTypeNetStim && !prevState.sourceTypeNetStim) {
  //     GEPPETTO.trigger('subscribe_to_global_refresh', {...this.refs['stimTargetParams.synMech']})
  //   }
  //   else if (!this.state.sourceTypeNetStim && prevState.sourceTypeNetStim) 
  //     GEPPETTO.trigger('unsubscribe_from_global_refresh', {...this.refs['stimTargetParams.synMech']})
  // }

  handleRenameChange = (event) => {
    var that = this;
    var storedValue = this.props.name;
    var newValue = event.target.value;
    this.setState({ currentName: newValue });
    this.triggerUpdate(function () {
      Utils.renameKey('netParams.stimTargetParams', storedValue, newValue, (response, newValue) => { that.renaming=false;});
      that.renaming=true;
    });
  };

  triggerUpdate(updateMethod) {
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    };
    this.updateTimer = setTimeout(updateMethod, 1000);
  };

  handleSelection = (selection) => {
    Utils
      .evalPythonMessage("'NetStim' == netpyne_geppetto.netParams.stimSourceParams['" + selection + "']['type']")
      .then((response) => {
        this.setState({sourceTypeNetStim: response})
        if (response) {
          GEPPETTO.trigger('subscribe_to_global_refresh', { stimTargetParamsSynMech: this.refs.stimTargetParamsSynMech })
        }
        else {
          GEPPETTO.trigger('unsubscribe_from_global_refresh', { stimTargetParamsSynMech: this.refs.stimTargetParamsSynMech })
        }
      });
  };
  
  postProcessMenuItems = (pythonData, selected) => {
    if (selected!=Object & selected!='') {
      this.handleSelection(selected);
    };
    return pythonData.map((name) => (
      <MenuItem
        id={name+"MenuItem"}
        key={name}
        value={name}
        primaryText={name}
      />
    ));
  };
  
  postProcessMenuItems4SynMech = (pythonData, selected) => {
    return pythonData.map((name) => (
      <MenuItem
        id={name+"MenuItem"}
        key={name}
        value={name}
        primaryText={name}
      />
    ));
  };
  
  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });
  
  getBottomNavigationItem(index, sectionId, label, icon, id) {
    return <BottomNavigationItem
      id={id}
      key={sectionId}
      label={label}
      icon={icon}
      onClick={() => this.select(index, sectionId)}
    />
  };
  
  render() {
    if (this.state.sectionId == "General") {
      var content = (
        <div>
          <TextField
            onChange={this.handleRenameChange}
            value = {this.state.currentName}
            disabled={this.renaming}
            className={"netpyneField"}
            id={"targetName"}
          />
          <br/>
          
          <NetPyNEField id={"netParams.stimTargetParams.source"} >
            <PythonMethodControlledSelectField
              ref={"stimTargetParams.source"}
              model={"netParams.stimTargetParams['" + this.props.name + "']['source']"}
              method={"netpyne_geppetto.getAvailableStimSources"}
              postProcessItems={this.postProcessMenuItems}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimTargetParams.sec">
            <PythonControlledTextField
              model={"netParams.stimTargetParams['" + this.props.name + "']['sec']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimTargetParams.loc">
            <PythonControlledTextField
              model={"netParams.stimTargetParams['" + this.props.name + "']['loc']"}
            />
          </NetPyNEField>
        </div>
      );
      if (this.state.sourceTypeNetStim) {
        var extraContent = (
          <div>
            <NetPyNEField id={"netParams.stimTargetParams.synMech"} >
              <PythonMethodControlledSelectField
                ref={"stimTargetParamsSynMech"}
                model={"netParams.stimTargetParams['" + this.props.name + "']['synMech']"}
                method={"netpyne_geppetto.getAvailableSynMech"}
                postProcessItems={this.postProcessMenuItems4SynMech}
              />
            </NetPyNEField>

            <NetPyNEField id="netParams.stimTargetParams.weight" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['weight']"}
              />
            </NetPyNEField>
            
            <NetPyNEField id="netParams.stimTargetParams.delay" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['delay']"}
              />
            </NetPyNEField>
            
            <NetPyNEField id="netParams.stimTargetParams.synsPerConn" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['synsPerConn']"}
              />
            </NetPyNEField>
          </div>
        );
      } else {
        var extraContent = <div/>
      };
    } else if (this.state.sectionId == "Conditions") {
        var content = <StimulationConditions name={this.state.currentName}/>
    };
    
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'General', 'General', <StimTargetIcon />, 'stimTargetGeneralTab'));
    bottomNavigationItems.push(this.getBottomNavigationItem(index++, 'Conditions', 'Conditions',<CondsIcon/>, 'stimTargetCondsTab')); 
    
    return (
      <div>
        <CardText>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            {bottomNavigationItems}
          </BottomNavigation>
        </CardText>
        <br />
        {content}
        {extraContent}
      </div>
    );
  }
};
