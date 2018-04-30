import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ListComponent from '../../../general/List';
import PyCheckBox from '../../../general/PyCheckBox';
import NetPyNEField from '../../../general/NetPyNEField';
import PySelectField from '../../../general/PySelectField';

var PythonControlledCapability = require('../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotShape extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  };
    
  render() {
    var tags = "simConfig.analysis['plotShape']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.plotShape.includePre" className="listStyle" >
          <PythonControlledListComponent model={tags + "['includePre']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotShape.includePost" className="listStyle" >
          <PythonControlledListComponent model={tags + "['includePost']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotShape.synStyle" >
          <PythonControlledTextField model={tags + "['synStyle']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotShape.dist" >
          <PythonControlledTextField model={tags + "['dist']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotShape.synSize" >
          <PythonControlledTextField model={tags + "['synSize']"}/>
        </NetPyNEField>
        
        <PySelectField
         model={"simConfig.analysis['plotShape']['cvar']"}
         meta={"simConfig.analysis.plotShape.cvar"}
         items={["numSyns", "weightNorm"]}
        />
        
        <NetPyNEField id="simConfig.analysis.plotShape.cvals" className="listStyle" >
          <PythonControlledListComponent model={tags + "['cvals']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotShape.bkgColor" className="listStyle" >
          <PythonControlledListComponent model={tags + "['bkgColor']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.plotShape.ivprops" >
          <PythonControlledTextField model={tags + "['ivprops']"}/>
        </NetPyNEField>

        <PyCheckBox
          model={"simConfig.analysis['plotShape']['iv']"}
          meta={"simConfig.analysis.plotShape.iv"}
        />
        
        <PyCheckBox
          model={"simConfig.analysis['plotShape']['includeAxon']"}
          meta={"simConfig.analysis.plotShape.includeAxon"}
        />
        
        <PyCheckBox
          model={"simConfig.analysis['plotShape']['showSyns']"}
          meta={"simConfig.analysis.plotShape.showSyns"}
        />
        
        <PyCheckBox
          model={"simConfig.analysis['plotShape']['showElectrodes']"}
          meta={"simConfig.analysis.plotShape.showElectrodes"}
        />
      </div>
    );
    
    return content;
  };
};
