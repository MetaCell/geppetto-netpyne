import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';

import Utils from '../../../Utils';
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

export default class NetPyNECellRule extends React.Component {

  constructor(props) {
    super(props);

    var _this = this;
    this.state = {
      model: props.model,
      page: 'main'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  render() {
    var that = this;
    var content = (<div>
      <TextField
        value={this.state.model.name}
        style={styles.netpyneField}
        onChange={(event) => Utils.renameKey('netParams.cellParams', this.state.model.name, event.target.value, function (response, newValue) {
          var model = this.state.model;
          model.name = newValue;
          this.setState({ model: model });
        })}
        floatingLabelText="The name of the cell rule"
      /><br />

      <NetPyNEField id="netParams.cellParams.conds.cellType" style={styles.netpyneField}>
        <PythonControlledTextField
          model={"netParams.cellParams['" + this.state.model.name + "']['conds']['cellType']"}
        />
      </NetPyNEField>

      <NetPyNEField id="netParams.cellParams.conds.cellModel" style={styles.netpyneField}>
        <PythonControlledTextField
          model={"netParams.cellParams['" + this.state.model.name + "']['conds']['cellModel']"}
        />
      </NetPyNEField>
      <br /><br />

      <RaisedButton
        label="Sections"
        labelPosition="before"
        primary={true}
        onClick={() => that.props.selectPage("sections")}
      />
    </div>);

    return (
      <div>
        {content}
      </div>
    );
  }
}
