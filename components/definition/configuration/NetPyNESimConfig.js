import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import ListComponent from '../../general/List';
import NetPyNEField from '../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class NetPyNESimConfig extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      selectedIndex: 0,
      sectionId: "General"
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      model: nextProps.model
    });
  };

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  render() {
    var content;
    if (this.state.sectionId == 'General') {
      content =
        <div style={{ float: 'left', width: '100%' }}>
          <div style={{ float: 'left', width: '45%' }}>

            <NetPyNEField id="simConfig.duration" >
              <PythonControlledTextField model={"simConfig.duration"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.dt" >
              <PythonControlledTextField model={"simConfig.dt"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.printRunTime"  >
              <PythonControlledTextField model={"simConfig.printRunTime"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.hParams" className="listStyle">
              <PythonControlledListComponent model={"simConfig.hParams"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.seeds" className="listStyle">
              <PythonControlledListComponent model={"simConfig.seeds"} />
            </NetPyNEField>


          </div>

          <div style={{ float: 'right', width: '45%', marginTop:10}}>
            <NetPyNEField id="simConfig.createNEURONObj" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.createNEURONObj"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.createPyStruct" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.createPyStruct"} />
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

            <NetPyNEField id="simConfig.compactConnFormat" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.compactConnFormat"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.connRandomSecFromList" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.connRandomSecFromList"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.printPopAvgRates" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.printPopAvgRates"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.printSynsAfterRule" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.printSynsAfterRule"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.gatherOnlySimData" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.gatherOnlySimData"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.cache_efficient" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.cache_efficient"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.cvode_active" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.cvode_active"} />
            </NetPyNEField>
          </div>
        </div>
    }
    else if (this.state.sectionId == 'SaveConfiguration') {
      content =
        <div style={{ float: 'left', width: '100%' }}>
          <div style={{ float: 'left', width: '45%' }}>
            <NetPyNEField id="simConfig.simLabel" >
              <PythonControlledTextField model={"simConfig.simLabel"} />
            </NetPyNEField>

            {
              !window.isDocker &&
              <NetPyNEField id="simConfig.saveFolder" >
                <PythonControlledTextField model={"simConfig.saveFolder"} />
              </NetPyNEField>
            }

            <NetPyNEField id="simConfig.filename" >
              <PythonControlledTextField model={"simConfig.filename"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveDataInclude" className="listStyle">
              <PythonControlledListComponent model={"simConfig.saveDataInclude"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.backupCfgFile" >
              <PythonControlledTextField model={"simConfig.backupCfgFile"} />
            </NetPyNEField>

          </div>

          <div style={{ float: 'right', width: '45%', marginTop:50, marginLeft:50}}>
          <NetPyNEField id="simConfig.saveJson" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveJson"} />
            </NetPyNEField>
            
            <NetPyNEField id="simConfig.savePickle" className={"netpyneCheckbox"}>
              <PythonControlledCheckbox model={"simConfig.savePickle"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveMat" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveMat"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveCellSecs" className={"netpyneCheckbox "}>
              <PythonControlledCheckbox model={"simConfig.saveCellSecs"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveCellConns" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveCellConns"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.timestampFilename" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.timestampFilename"} />
            </NetPyNEField>

            {/* <NetPyNEField id="simConfig.saveHDF5" className={"netpyneCheckbox"} >
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
            </NetPyNEField> */}

            <NetPyNEField id="simConfig.saveTiming" className={"netpyneCheckbox"} >
              <PythonControlledCheckbox model={"simConfig.saveTiming"} />
            </NetPyNEField>
          </div>
        </div>
    } else if (this.state.sectionId == 'Record') {
      content =
        <div style={{ float: 'left', width: '100%' }}>
          <div style={{ float: 'left', width: '45%' }}>
            <NetPyNEField id="simConfig.recordCells" className={"listStyle"} >
              <PythonControlledListComponent model={"simConfig.recordCells"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.recordLFP" className={"listStyle"}>
              <PythonControlledListComponent model={"simConfig.recordLFP"} />
            </NetPyNEField>
            
            <NetPyNEField id="simConfig.recordTraces" className={"listStyle"} >
              <PythonControlledListComponent model={"simConfig.recordTraces"}  />
            </NetPyNEField>
            
            <NetPyNEField id="simConfig.recordStep" >
              <PythonControlledTextField model={"simConfig.recordStep"} />
            </NetPyNEField>
            
          </div>

          <div style={{ float: 'right', width: '45%'}}>
            <NetPyNEField id="simConfig.saveLFPCells" className={"netpyneCheckbox"} style={{marginTop: 25}}>
              <PythonControlledCheckbox model={"simConfig.saveLFPCells"} />
            </NetPyNEField>
            
            <NetPyNEField id="simConfig.recordStim" className={"netpyneCheckbox"} style={{marginTop: 25}}>
              <PythonControlledCheckbox model={"simConfig.recordStim"} />
            </NetPyNEField>
          </div>
        </div >
    } else if (this.state.sectionId == 'ErrorChecking') {
      content =
      <div style={{ float: 'left', width: '100%' }}>
        <div style={{ float: 'left', width: '45%' }}>
          <NetPyNEField id="simConfig.checkErrors" className={"netpyneCheckbox"} >
            <PythonControlledCheckbox model={"simConfig.checkErrors"} />
          </NetPyNEField>
        </div >
        <div style={{ float: 'right', width: '45%'}}>
          <NetPyNEField id="simConfig.checkErrorsVerbose" className={"netpyneCheckbox"} >
            <PythonControlledCheckbox model={"simConfig.checkErrorsVerbose"} />
          </NetPyNEField>
        </div>
      </div >
    }
    else if (this.state.sectionId=='netParams') {
      var content =
        <div style={{ float: 'left', width: '100%' }}>
          <div style={{ float: 'left', width: '45%' }}>
            <NetPyNEField id="netParams.scale" >
              <PythonControlledTextField model={"netParams.scale"} />
            </NetPyNEField>

            <NetPyNEField id="netParams.defaultWeight" >
              <PythonControlledTextField model={"netParams.defaultWeight"} />
            </NetPyNEField>

            <NetPyNEField id="netParams.defaultDelay" >
              <PythonControlledTextField model={"netParams.defaultDelay"} />
            </NetPyNEField>

            <NetPyNEField id="netParams.scaleConnWeight" >
              <PythonControlledTextField model={"netParams.scaleConnWeight"} />
            </NetPyNEField>

            <NetPyNEField id="netParams.scaleConnWeightNetStims" >
              <PythonControlledTextField model={"netParams.scaleConnWeightNetStims"} />
            </NetPyNEField>

            <NetPyNEField id="netParams.scaleConnWeightModels" className={"listStyle"}>
              <PythonControlledListComponent model={"netParams.scaleConnWeightModels"} />
            </NetPyNEField>

        </div>

        <div style={{ float: 'right', width: '45%'}}>
          <NetPyNEField id="netParams.sizeX" >
            <PythonControlledTextField model={"netParams.sizeX"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.sizeY" >
            <PythonControlledTextField model={"netParams.sizeY"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.sizeZ" >
            <PythonControlledTextField model={"netParams.sizeZ"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.propVelocity" >
            <PythonControlledTextField model={"netParams.propVelocity"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.shape">
            <PythonControlledSelectField model={"netParams.shape"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.rotateCellsRandomly" >
            <PythonControlledTextField model={"netParams.rotateCellsRandomly"} />
          </NetPyNEField>

        </div>
      </div>
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Simulation configuration"
          subtitle="Define here the configuration options for the simulation"
          actAsExpander={true}
          showExpandableButton={true}
          id={"Configuration"}
        />

        <CardText className={"tabContainer"} expandable={true} >
          <div>
            <BottomNavigation selectedIndex={this.state.selectedIndex}>
              <BottomNavigationItem id={"configGeneral"} key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => this.select(0, 'General')} />
              <BottomNavigationItem id={"configRecord"} key={'Record'} label={'Record'} icon={<FontIcon className={"fa fa-circle"} />} onClick={() => this.select(1, 'Record')} />
              <BottomNavigationItem id={"configSaveConfiguration"} key={'SaveConfiguration'} label={'Save Configuration'} icon={<FontIcon className={"fa fa-floppy-o"} />} onClick={() => this.select(2, 'SaveConfiguration')} />
              <BottomNavigationItem id={"configErrorChecking"} key={'ErrorChecking'} label={'Error Checking'} icon={<FontIcon className={"fa fa-exclamation"} />} onClick={() => this.select(3, 'ErrorChecking')} />
              <BottomNavigationItem id={"confignetParams"} key={'netParams'} label={'Network Attributes'} icon={<FontIcon className={"fa fa-cog"} />} onClick={() => this.select(4, 'netParams')} />
            </BottomNavigation>
            <br />
            {content}
          </div>
        </CardText >
      </Card >
    );
  };
};
