import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import TimeRange from '../TimeRange'
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotSpikeStats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
    
  render() {
    var tag = "simConfig.analysis['plotSpikeStats']"
    return <div>
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.include" className="listStyle" >
        <PythonControlledListComponent model={tag + "['include']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.popColors" >
        <PythonControlledTextField model={tag + "['popColors']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.graphType" className="listStyle" >
        <PythonControlledSelectField model={tag + "['graphType']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.stats" className="listStyle" >
        <PythonControlledSelectField model={tag + "['stats']"} />
      </NetPyNEField>      
    </div>
  };
};
