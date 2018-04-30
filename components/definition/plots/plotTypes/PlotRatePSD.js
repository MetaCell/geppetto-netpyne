import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ListComponent from '../../../general/List';
import PyCheckBox from '../../../general/PyCheckBox'
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotRatePSD extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
  
  render() {
    var tags = "simConfig.analysis['plotRatePSD']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plotRatePSD.include" className="listStyle" >
          <PythonControlledListComponent model={tags + "['include']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotRatePSD.timeRange" >
          <PythonControlledTextField model={tags + "['timeRange']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotRatePSD.binSize" >
          <PythonControlledTextField model={tags + "['binSize']"}/>
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRatePSD.maxFreq" >
          <PythonControlledTextField model={tags + "['maxFreq']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotRatePSD.NFFT" >
          <PythonControlledTextField model={tags + "['NFFT']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotRatePSD.noverlap" >
          <PythonControlledTextField model={tags + "['noverlap']"}/>
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRatePSD.smooth" >
          <PythonControlledTextField model={tags + "['smooth']"}/>
        </NetPyNEField>
        
        <PyCheckBox
          model={"simConfig.analysis['plotRatePSD']['overlay']"}
          meta={"simConfig.analysis.plotRatePSD.overlay"}
        />
      </div>
    );
    return content;
  };
};
