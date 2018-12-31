import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import TimeRange from '../TimeRange'
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('webapp/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);

export default class PlotLFP extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      plots: '',
    };
  };
    
  render() {
    var tag = "simConfig.analysis['plotLFP']"
    return <div>
      <NetPyNEField id="simConfig.analysis.plotLFP.electrodes" className="listStyle" >
        <PythonControlledListComponent model={tag + "['electrodes']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotLFP.plots">
        <PythonControlledSelectField model={tag+"['plots']"} multiple={true}/>
      </NetPyNEField>
              
      <NetPyNEField id="simConfig.analysis.plotLFP.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.NFFT" >
        <PythonControlledTextField model={tag + "['NFFT']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.noverlap" >
        <PythonControlledTextField model={tag + "['noverlap']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.maxFreq" >
        <PythonControlledTextField model={tag + "['maxFreq']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.nperseg" >
        <PythonControlledTextField model={tag + "['nperseg']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.smooth" >
        <PythonControlledTextField model={tag + "['smooth']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.separation" >
        <PythonControlledTextField model={tag + "['separation']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.includeAxon" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag+"['includeAxon']"} />
      </NetPyNEField>
    </div>
  };
};
