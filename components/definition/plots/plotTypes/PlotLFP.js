import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ListComponent from '../../../general/List';
import PyCheckBox from '../../../general/PyCheckBox';
import NetPyNEField from '../../../general/NetPyNEField';
import PySelectField from '../../../general/PySelectField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotLFP extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      plots: '',
    };
  };
    
  render() {
    var tags = "simConfig.analysis['plotLFP']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plotLFP.electrodes" className="listStyle" >
          <PythonControlledListComponent model={tags + "['electrodes']"} />
        </NetPyNEField>
        
        <PySelectField 
          model="simConfig.analysis['plotLFP']['plots']"
          meta="simConfig.analysis.plotLFP.plots"
          items={["timeSeries", "PSD", "timeFreq", "location"]}
        />
        
        <NetPyNEField id="simConfig.analysis.plotLFP.timeRange" >
          <PythonControlledTextField model={tags + "['timeRange']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotLFP.NFFT" >
          <PythonControlledTextField model={tags + "['NFFT']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotLFP.noverlap" >
          <PythonControlledTextField model={tags + "['noverlap']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotLFP.maxFreq" >
          <PythonControlledTextField model={tags + "['maxFreq']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotLFP.nperseg" >
          <PythonControlledTextField model={tags + "['nperseg']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotLFP.smooth" >
          <PythonControlledTextField model={tags + "['smooth']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotLFP.separation" >
          <PythonControlledTextField model={tags + "['separation']"}/>
        </NetPyNEField>
        
        <PyCheckBox
          model="simConfig.analysis['plotLFP']['includeAxon']"
          meta="simConfig.analysis.plotLFP.includeAxon"
        />     
      </div>
    );
    return content;
  };
};
