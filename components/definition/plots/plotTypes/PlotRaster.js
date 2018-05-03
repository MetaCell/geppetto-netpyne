import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotRaster extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.handleCheckChange = this.handleCheckChange.bind(this);
  };
  
  handleCheckChange = (event, isCheck) => {
    this.setState({Checked: isCheck})
  };
  
  render() {
    var tag = "simConfig.analysis['plotRaster']"
    return <div>
      <NetPyNEField id="simConfig.analysis.plotRaster.include" className="listStyle" >
        <PythonControlledListComponent model={tag + "['include']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRaster.timeRange" >
        <PythonControlledTextField model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRaster.maxSpikes" >
        <PythonControlledTextField model={tag + "['maxSpikes']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRaster.orderBy" className="listStyle" >
        <PythonControlledSelectField model={tag+"['orderBy']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRaster.popRates" className="listStyle" >
        <PythonControlledSelectField model={tag+"['popRates']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRaster.spikeHist" className="listStyle" >
        <PythonControlledSelectField model={tag+"['spikeHist']"} />
      </NetPyNEField>
        
      <NetPyNEField id="simConfig.analysis.plotRaster.spikeHistBin" >
        <PythonControlledTextField model={tag + "['spikeHistBin']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRaster.orderInverse" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag+"['orderInverse']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRaster.syncLines" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag+"['syncLines']"} />
      </NetPyNEField>
    </div>
  };
};
