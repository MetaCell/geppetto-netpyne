import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import TimeRange from '../TimeRange'
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotSpikeHist extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
    
  render() {
    var tag = "simConfig.analysis['plotSpikeHist']"
    return <div >
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.include" className="listStyle" >
        <PythonControlledListComponent model={tag + "['include']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.binSize" >
        <PythonControlledTextField model={tag + "['binSize']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.graphType" className="listStyle" >
        <PythonControlledSelectField model={tag + "['graphType']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.yaxis" className="listStyle" >
        <PythonControlledSelectField model={tag + "['yaxis']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.overlay" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag + "['overlay']"} />
      </NetPyNEField>
    </div>
  };
};
