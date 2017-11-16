import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Card, { CardHeader, CardText } from 'material-ui/Card';

import NetPyNEField from '../../general/NetPyNEField';
var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledComponent(Checkbox);

export default class NetPyNESimConfig extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      page: 'main'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      model: nextProps.model
    });
  }

  render() {
    var content;

    if (this.state.page == 'main') {
      content = (
        <Card style={{clear: 'both'}}>
          <CardHeader
            title="Configuration"
            subtitle="General configuration"
            actAsExpander={true}
            showExpandableButton={true}
          />

          <CardText className={"tabContainer"} expandable={true} >
            <div>
              <NetPyNEField id="simConfig.duration" >
                <PythonControlledTextField
                  model={"simConfig.duration"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.dt" >
                <PythonControlledTextField
                  model={"simConfig.dt"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.seeds" >
                <PythonControlledTextField
                  model={"simConfig.seeds"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.addSynMechs" >
                <PythonControlledTextField
                  model={"simConfig.addSynMechs"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.includeParamsLabel" >
                <PythonControlledTextField
                  model={"simConfig.includeParamsLabel"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.timing" >
                <PythonControlledTextField
                  model={"simConfig.timing"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.verbose" >
                <PythonControlledTextField
                  model={"simConfig.verbose"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.simLabel" >
                <PythonControlledTextField
                  model={"simConfig.simLabel"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveFolder" >
                <PythonControlledTextField
                  model={"simConfig.saveFolder"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.filename" >
                <PythonControlledTextField
                  model={"simConfig.filename"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveDataInclude" >
                <PythonControlledTextField
                  model={"simConfig.saveDataInclude"}
                />

              </NetPyNEField>

              <NetPyNEField id="simConfig.timestampFilename" >
                <PythonControlledTextField
                  model={"simConfig.timestampFilename"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.savePickle" className={"netpyneCheckbox"}>
                <PythonControlledCheckbox
                  className={"netpyneCheckbox"}
                  model={"simConfig.savePickle"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveJson" >
                <PythonControlledTextField
                  model={"simConfig.saveJson"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveMat" >
                <PythonControlledTextField
                  model={"simConfig.saveMat"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveHDF5" >
                <PythonControlledTextField
                  model={"simConfig.saveHDF5"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveDpk" >
                <PythonControlledTextField
                  model={"simConfig.saveDpk"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveDat" >
                <PythonControlledTextField
                  model={"simConfig.saveDat"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveCsv" >
                <PythonControlledTextField
                  model={"simConfig.saveCsv"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveCellSecs" className={"netpyneCheckbox"}>
                <PythonControlledCheckbox
                  className={"netpyneCheckbox"}
                  model={"simConfig.saveCellSecs"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.saveCellConns" >
                <PythonControlledTextField
                  model={"simConfig.saveCellConns"}
                />
              </NetPyNEField>

              <NetPyNEField id="simConfig.checkError" >
                <PythonControlledTextField
                  model={"simConfig.checkError"}
                />
              </NetPyNEField>
            </div>
          </CardText>
        </Card>);
    }
    return content;
  }
}
