import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import TimeRange from '../TimeRange'
import NetPyNEInclude from '../NetPyNEInclude';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);

export default class PlotTraces extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
    
  render() {
    var tag = "simConfig.analysis['plotTraces']"
    return <div>
      <NetPyNEInclude
        id={"simConfig.analysis.plotTraces.include"}
        model={tag+"['include']"} 
        defaultOptions={['all', 'allCells', 'allNetStims']}
        initialValue={'all'}
      />
      
      <NetPyNEField id="simConfig.analysis.plotTraces.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotTraces.oneFigPer" className="listStyle" >
        <PythonControlledSelectField model={tag+"['oneFigPer']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotTraces.overlay" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag+"['overlay']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotTraces.rerun" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag+"['rerun']"} />
      </NetPyNEField>
    </div>
  };
};
