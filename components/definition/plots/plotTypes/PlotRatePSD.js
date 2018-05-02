import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotRatePSD extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
  
  render() {
    var tag = "simConfig.analysis['plotRatePSD']"
    return <div>
      <NetPyNEField id="simConfig.analysis.plotRatePSD.include" className="listStyle" >
        <PythonControlledListComponent model={tag + "['include']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.timeRange" >
        <PythonControlledTextField model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.binSize" >
        <PythonControlledTextField model={tag + "['binSize']"}/>
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotRatePSD.maxFreq" >
        <PythonControlledTextField model={tag + "['maxFreq']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.NFFT" >
        <PythonControlledTextField model={tag + "['NFFT']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.noverlap" >
        <PythonControlledTextField model={tag + "['noverlap']"}/>
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotRatePSD.smooth" >
        <PythonControlledTextField model={tag + "['smooth']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.overlay" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag+"['overlay']"} />
      </NetPyNEField>
    </div>
  };
};
