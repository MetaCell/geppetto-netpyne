import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';
import PySelectField from '../../../general/PySelectField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotSpikeStats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
    
  render() {
    var tags = "simConfig.analysis['plotSpikeStats']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plotSpikeStats.include" className="listStyle" >
          <PythonControlledListComponent model={tags + "['include']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotSpikeStats.timeRange" >
          <PythonControlledTextField model={tags + "['timeRange']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotSpikeStats.popColors" >
          <PythonControlledTextField model={tags + "['popColors']"}/>
        </NetPyNEField>
        
        <PySelectField 
          model={"simConfig.analysis['plotSpikeStats']['graphType']"}
          meta={"simConfig.analysis.plotSpikeStats.graphType"}
          items={["boxplot"]}
        />
          
        <PySelectField 
          model={"simConfig.analysis['plotSpikeStats']['stats']"}
          meta={"simConfig.analysis.plotSpikeStats.stats"}
          items={["rate", "isicv", "pairsync", "sync"]}
        />        
      </div>
    );
    
    return content;
  };
};
