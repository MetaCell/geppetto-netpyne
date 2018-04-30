import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ListComponent from '../../../general/List';
import PyCheckBox from '../../../general/PyCheckBox';
import NetPyNEField from '../../../general/NetPyNEField';
import PySelectField from '../../../general/PySelectField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotTraces extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
    
  render() {
    var tags = "simConfig.analysis['plotTraces']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plotTraces.include" className="listStyle" >
          <PythonControlledListComponent model={tags + "['include']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotTraces.timeRange" >
          <PythonControlledTextField model={tags + "['timeRange']"} />
        </NetPyNEField>
        
        <PySelectField 
          model="simConfig.analysis['plotTraces']['oneFigPer']"
          meta="simConfig.analysis.plotTraces.oneFigPer"
          items={["cell", "traces"]}
        />
        
        <PyCheckBox 
          model="simConfig.analysis['plotTraces']['overlay']"
          meta="simConfig.analysis.plotTraces.overlay"
        />
        
        <PyCheckBox 
          model="simConfig.analysis['plotTraces']['rerun']"
          meta="simConfig.analysis.plotTraces.rerun"
        />
      </div>
    );
    
    return content;
  };
};
