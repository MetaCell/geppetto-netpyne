import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ListComponent from '../../../general/List';
import PyCheckBox from '../../../general/PyCheckBox';
import NetPyNEField from '../../../general/NetPyNEField';
import PySelectField from '../../../general/PySelectField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
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
    var tags = "simConfig.analysis['plotRaster']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plotRaster.include" className="listStyle" >
          <PythonControlledListComponent model={tags + "['include']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotRaster.timeRange" >
          <PythonControlledTextField model={tags + "['timeRange']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotRaster.maxSpikes" >
          <PythonControlledTextField model={tags + "['maxSpikes']"}/>
        </NetPyNEField>
        
        <PySelectField 
          model={"simConfig.analysis['plotRaster']['orderBy']"}
          meta={"simConfig.analysis.plotRaster.orderBy"}
          items={["gid", "y", "ynorm"]}
        />
        
        <PySelectField 
          model={"simConfig.analysis['plotRaster']['popRates']"}
          meta={"simConfig.analysis.plotRaster.popRates"}
          items={["legend", "overlay"]}
        />
        
        <PySelectField 
          model={"simConfig.analysis['plotRaster']['spikeHist']"}
          meta={"simConfig.analysis.plotRaster.spikeHist"}
          items={["None", "overlay", "subplot"]}
        />
          
        <NetPyNEField id="simConfig.analysis.plotRaster.spikeHistBin" >
          <PythonControlledTextField model={tags + "['spikeHistBin']"}/>
        </NetPyNEField>
        
        <PyCheckBox 
          model={"simConfig.analysis['plotRaster']['orderInverse']"}
          meta={"simConfig.analysis.plotRaster.orderInverse"}
        />
                
        <PyCheckBox 
          model={"simConfig.analysis['plotRaster']['syncLines']"}
          meta={"simConfig.analysis.plotRaster.syncLines"}
        />
      </div>
    );
    return content;
  };
};
