import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ListComponent from '../../../general/List';
import PyCheckBox from '../../../general/PyCheckBox';
import NetPyNEField from '../../../general/NetPyNEField';
import PySelectField from '../../../general/PySelectField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotSpikeHist extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
    
  render() {
    var tags = "simConfig.analysis['plotSpikeHist']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plotSpikeHist.include" className="listStyle" >
          <PythonControlledListComponent model={tags + "['include']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotSpikeHist.timeRange" >
          <PythonControlledTextField model={tags + "['timeRange']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotSpikeHist.binSize" >
          <PythonControlledTextField model={tags + "['binSize']"}/>
        </NetPyNEField>
        
        <PySelectField 
          model={"simConfig.analysis['plotSpikeHist']['graphType']"}
          meta={"simConfig.analysis.plotSpikeHist.graphType"}
          items={["line", "bar"]}
        />
        
        <PySelectField 
          model={"simConfig.analysis['plotSpikeHist']['yaxis']"}
          meta={"simConfig.analysis.plotSpikeHist.yaxis"}
          items={["rate", "count"]}
        />

        <PyCheckBox 
          model={"simConfig.analysis['plotSpikeHist']['overlay']"}
          meta={"simConfig.analysis.plotSpikeHist.overlay"}
        />
    </div>
    );
    
    return content;
  };
};
