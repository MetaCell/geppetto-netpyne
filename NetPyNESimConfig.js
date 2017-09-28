import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Card, { CardHeader, CardText } from 'material-ui/Card';

var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);

const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width: 350,
    height: 350,
    float: 'left'
  },
  cardContent: {
  }
};

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
        <Card style={styles.card}>
          <CardHeader
            title="Configuration"
            subtitle="General configuration"
            actAsExpander={true}
            showExpandableButton={true}
          />

            <Paper style={styles.tabContainer} expandable={true} >
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.duration"}
                  floatingLabelText="Duration"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.dt"}
                  floatingLabelText="Dt"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.seeds"}
                  floatingLabelText="Seeds"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.addSynMechs"}
                  floatingLabelText="Add Syn Mechs"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.includeParamsLabel"}
                  floatingLabelText="Include Params Label"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.timing"}
                  floatingLabelText="Timing"
                /><br />
              </div>
              <div>
                <PythonControlledTextField
                  requirement={this.props.requirement}
                  model={"simConfig.verbose"}
                  floatingLabelText="Verbose"
                /><br />
              </div>

            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.simLabel"}
                floatingLabelText="Sim Label"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveFolder"}
                floatingLabelText="Save Folder"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.filename"}
                floatingLabelText="File Name"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDataInclude"}
                floatingLabelText="Save Data Include"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.timestampFilename"}
                floatingLabelText="Timestamp File Name"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.savePickle"}
                floatingLabelText="Save Pickle"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveJson"}
                floatingLabelText="Save Json"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveMat"}
                floatingLabelText="Save Mat"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveHDF5"}
                floatingLabelText="Save HDF5"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDpk"}
                floatingLabelText="Save Dpk"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDat"}
                floatingLabelText="Save Dat"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCsv"}
                floatingLabelText="Save Csv"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCellSecs"}
                floatingLabelText="Save Cell Secs"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCellConns"}
                floatingLabelText="Save Cell Conns"
              /><br />
            </div>

            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.checkError"}
                floatingLabelText="Check Errors"
              /><br />
            </div>
            <div>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.checkError"}
                floatingLabelText="Check Errors"
              /><br />
            </div>
          </Paper>

       </Card>);

    }
    return content;
  }
}
