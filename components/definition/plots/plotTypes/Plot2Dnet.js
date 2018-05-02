import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class Plot2Dnet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
  
  render() {
    var tag = "simConfig.analysis['plot2Dnet']"
    return <div>
      <NetPyNEField id="simConfig.analysis.plot2Dnet.include" className="listStyle" >
        <PythonControlledListComponent model={tag+"['include']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plot2Dnet.view" className="listStyle" >
        <PythonControlledSelectField model={tag+"['view']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plot2Dnet.showConns" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag+"['showConns']"} />
      </NetPyNEField>
    </div>
  };
};
