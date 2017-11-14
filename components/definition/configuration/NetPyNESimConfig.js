import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Card, { CardHeader, CardText } from 'material-ui/Card';

import NetPyNEField from '../../general/NetPyNEField';
var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);


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
            <NetPyNEField id="simConfig.duration" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.duration"}
              />
            </NetPyNEField><br />
            
            <NetPyNEField id="simConfig.dt" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.dt"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.seeds" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.seeds"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.addSynMechs" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.addSynMechs"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.includeParamsLabel" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.includeParamsLabel"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.timing" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.timing"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.verbose" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.verbose"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.simLabel" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.simLabel"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveFolder" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveFolder"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.filename" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.filename"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveDataInclude" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDataInclude"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.timestampFilename" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.timestampFilename"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.savePickle" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.savePickle"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveJson" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveJson"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveMat" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveMat"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveHDF5" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveHDF5"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveDpk" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDpk"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveDat" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveDat"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveCsv" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCsv"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveCellSecs" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCellSecs"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.saveCellConns" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.saveCellConns"}
              />
            </NetPyNEField><br />

            <NetPyNEField id="simConfig.checkError" style={styles.netpyneField}>
              <PythonControlledTextField
                requirement={this.props.requirement}
                model={"simConfig.checkError"}
              />
            </NetPyNEField><br />
          </div>
        </Paper>
       </Card>);
    }
    return content;
  }
}
