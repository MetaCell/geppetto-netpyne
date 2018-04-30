import React, { Component } from 'react';
import ListComponent from '../../../general/List';
import PyCheckBox from '../../../general/PyCheckBox';
import NetPyNEField from '../../../general/NetPyNEField';
import PySelectField from '../../../general/PySelectField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class Plot2Dnet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
  
  render() {
    var tags = "simConfig.analysis['plot2Dnet']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plot2Dnet.include" className="listStyle" >
          <PythonControlledListComponent model={tags + "['include']"} />
        </NetPyNEField>
        
        <PySelectField
          model={"simConfig.analysis['plot2Dnet']['view']"}
          meta={"simConfig.analysis.plot2Dnet.view"}
          items={["xy", "xz"]}
        />
        
        <PyCheckBox
          model={"simConfig.analysis['plot2Dnet']['showConns']"}
          meta={"simConfig.analysis.plot2Dnet.showConns"}
        />
      </div>
    );
    return content;
  };
};
