import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import NetPyNEInclude from '../NetPyNEInclude';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(SelectField);

export default class Plot2Dnet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
  
  render() {
    var tag = "simConfig.analysis['plot2Dnet']"
    return <div>
      <NetPyNEInclude
        id={"simConfig.analysis.plot2Dnet.include"}
        model={tag+"['include']"} 
        defaultOptions={['all', 'allCells', 'allNetStims']}
        initialValue={'all'}
      />
      
      <NetPyNEField id="simConfig.analysis.plot2Dnet.view" className="listStyle" >
        <PythonControlledSelectField model={tag+"['view']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plot2Dnet.showConns" className={"netpyneCheckbox"} >
          <PythonControlledCheckbox model={tag+"['showConns']"} />
      </NetPyNEField>
    </div>
  };
};
