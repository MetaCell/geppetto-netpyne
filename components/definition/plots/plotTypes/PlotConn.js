import React, { Component } from 'react';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';
import PySelectField from '../../../general/PySelectField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class plotConn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
  
  render() {
    var tags = "simConfig.analysis['plotConn']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plotConn.include" className="listStyle" >
          <PythonControlledListComponent model={tags + "['include']"} />
        </NetPyNEField>
        
        <PySelectField 
          model={"simConfig.analysis['plotConn']['feature']"}
          meta={"simConfig.analysis.plotConn.feature"}
          items={["weight", "delay", "numConns", "probability", "strength", "convergency", "divergency"]}
        />
        
        <PySelectField 
          model={"simConfig.analysis['plotConn']['groupBy']"}
          meta={"simConfig.analysis.plotConn.groupBy"}
          items={["pop", "cell"]}
        />
        
        <PySelectField 
          model={"simConfig.analysis['plotConn']['orderBy']"}
          meta={"simConfig.analysis.plotConn.orderBy"}
          items={["gid", "y", "ynorm"]}
        />
      </div>
    );
    return content;
  };
};
