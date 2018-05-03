import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class plotConn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
  
  render() {
    var tag = "simConfig.analysis['plotConn']"
    return <div>
        <NetPyNEField id="simConfig.analysis.plotConn.include" className="listStyle" >
          <PythonControlledListComponent model={tag + "['include']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotConn.feature" className="listStyle" >
          <PythonControlledSelectField model={tag+"['feature']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotConn.groupBy" className="listStyle" >
          <PythonControlledSelectField model={tag+"['groupBy']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotConn.orderBy" className="listStyle" >
          <PythonControlledSelectField model={tag+"['orderBy']"} />
        </NetPyNEField>
      </div>
  };
};
