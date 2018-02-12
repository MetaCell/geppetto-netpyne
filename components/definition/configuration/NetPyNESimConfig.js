import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';

import NetPyNEField from '../../general/NetPyNEField';
import Utils from '../../../Utils';
var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);

export default class NetPyNESimConfig extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      selectedIndex: 0,
      sectionId: "General"
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      model: nextProps.model
    });
  }

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  render() {
    var content;
    if (this.state.sectionId == 'General') {
      content =
        <div>
          <NetPyNEField id="simConfig.seeds" >
            <PythonControlledTextField model={"simConfig.seeds"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.addSynMechs" className={"netpyneCheckbox"} >
            <PythonControlledCheckbox model={"simConfig.addSynMechs"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.includeParamsLabel" className={"netpyneCheckbox"} >
            <PythonControlledCheckbox model={"simConfig.includeParamsLabel"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.timing" className={"netpyneCheckbox"} >
            <PythonControlledCheckbox model={"simConfig.timing"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.verbose" className={"netpyneCheckbox"} >
            <PythonControlledCheckbox model={"simConfig.verbose"} />
          </NetPyNEField>
        </div>
    }
    else if (this.state.sectionId == 'SaveConfiguration') {
      content =
        <div style={{ float: 'left', width: '100%' }}>
          <div style={{  float: 'left', width: '50%' }}>
            <NetPyNEField id="simConfig.simLabel" >
              <PythonControlledTextField model={"simConfig.simLabel"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveFolder" >
              <PythonControlledTextField model={"simConfig.saveFolder"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.filename" >
              <PythonControlledTextField model={"simConfig.filename"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveDataInclude" >
              <PythonControlledTextField model={"simConfig.saveDataInclude"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.timestampFilename" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.timestampFilename"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.backupCfgFile" >
              <PythonControlledTextField model={"simConfig.backupCfgFile"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveCellSecs" className={"netpyneCheckbox "}>
              <PythonControlledCheckbox model={"simConfig.saveCellSecs"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveCellConns" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveCellConns"} />
            </NetPyNEField>
          </div>
          <div style={{ float: 'right', width: '50%' }}>
            <NetPyNEField id="simConfig.savePickle" className={"netpyneCheckbox"}>
              <PythonControlledCheckbox model={"simConfig.savePickle"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveJson" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveJson"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveMat" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveMat"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveHDF5" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveHDF5"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveDpk" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveDpk"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveDat" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveDat"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveCSV" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveCSV"} />
            </NetPyNEField>
          </div>
        </div>
    }
    else if (this.state.sectionId == 'ErrorChecking') {
      content =
        <div>
          <NetPyNEField id="simConfig.checkErrors" className={"netpyneCheckbox"} >
            <PythonControlledCheckbox model={"simConfig.checkErrors"} />
          </NetPyNEField>
          <NetPyNEField id="simConfig.checkErrorsVerbose" className={"netpyneCheckbox"} >
            <PythonControlledCheckbox model={"simConfig.checkErrorsVerbose"} />
          </NetPyNEField>
        </div>
    }
    else if (this.state.sectionId == 'Others') {
      content =
        <div>
          <NetPyNEField id="simConfig.duration" >
            <PythonControlledTextField model={"simConfig.duration"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.dt" >
            <PythonControlledTextField model={"simConfig.dt"} />
          </NetPyNEField>
        </div >
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Configuration"
          subtitle="NetPyNE configuration"
          actAsExpander={true}
          showExpandableButton={true}
        />

        <CardText className={"tabContainer"} expandable={true} >
          <div>
            <BottomNavigation selectedIndex={this.state.selectedIndex}>
              <BottomNavigationItem key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => this.select(0, 'General')} />
              <BottomNavigationItem key={'SaveConfiguration'} label={'Save Configuration'} icon={<FontIcon className={"fa fa-floppy-o"} />} onClick={() => this.select(1, 'SaveConfiguration')} />
              <BottomNavigationItem key={'ErrorChecking'} label={'Error Checking'} icon={<FontIcon className={"fa fa-exclamation"} />} onClick={() => this.select(2, 'ErrorChecking')} />
              <BottomNavigationItem key={'Others'} label={'Others'} icon={<FontIcon className={"fa fa-list"} />} onClick={() => this.select(3, 'Others')} />
            </BottomNavigation>
            <br />
            {content}
          </div>
        </CardText >
      </Card >
    );
  }
}
