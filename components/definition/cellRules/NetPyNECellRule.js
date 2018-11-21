import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import NetPyNECoordsRange from '../../general/NetPyNECoordsRange';
import Dialog from 'material-ui/Dialog/Dialog';

var PythonControlledCapability = require('../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

export default class NetPyNECellRule extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      errorMessage: undefined,
      errorDetails: undefined
    };
  };

  handleRenameChange = (event) => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "CellRule");

    if(triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey('netParams.cellParams', storedValue, newValue, (response, newValue) => { this.renaming = false; });
        this.renaming = true;
      });
    }
  }

  triggerUpdate(updateMethod) {
    //common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name });
  }

  postProcessMenuItems(pythonData, selected) {
    return pythonData.map((name) => (
      <MenuItem
        id={name+"MenuItem"}
        key={name}
        insetChildren={true}
        checked={selected.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
    ));
  };

  render() {
    var actions = [
      <RaisedButton
        primary
        label={"BACK"}
        onTouchTap={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
      />
    ];
    var title = this.state.errorMessage;
    var children = this.state.errorDetails;
    var dialogPop = (this.state.errorMessage != undefined ? <Dialog
          title={title}
          open={true}
          actions={actions}
          bodyStyle={{ overflow: 'auto' }}
          style={{ whiteSpace: "pre-wrap" }}>
          {children}
        </Dialog> 
      : undefined
    )
    return (
      <div>
        <div>

          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            floatingLabelText="The name of the cell rule"
            className={"netpyneField"}
            id={"cellRuleName"}
          />

          <div style={{ float: 'left', marginTop: '20px' }}>
            <b>Conditions:</b>
          </div>

          <NetPyNEField id={"netParams.cellParams.conds.cellType"} >
            <PythonMethodControlledSelectField
              model={"netParams.cellParams['" + this.state.currentName + "']['conds']['cellType']"}
              method={"netpyne_geppetto.getAvailableCellTypes"}
              postProcessItems={this.postProcessMenuItems}
              multiple={true}
            />
          </NetPyNEField>
          
          <NetPyNEField id={"netParams.cellParams.conds.cellModel"} >
            <PythonMethodControlledSelectField
              model={"netParams.cellParams['" + this.state.currentName + "']['conds']['cellModel']"}
              method={"netpyne_geppetto.getAvailableCellModels"}
              postProcessItems={this.postProcessMenuItems}
              multiple={true}
            />
          </NetPyNEField>

          <NetPyNEField id={"netParams.cellParams.conds.pop"} >
            <PythonMethodControlledSelectField
              model={"netParams.cellParams['" + this.state.currentName + "']['conds']['pop']"}
              method={"netpyne_geppetto.getAvailablePops"}
              postProcessItems={this.postProcessMenuItems}
              multiple={true}
            />
          </NetPyNEField>

          <NetPyNECoordsRange
            id="xRangeCellParams"
            name={this.state.currentName}
            model={'netParams.cellParams'}
            conds={'conds'}
            items={[
              { value: 'x', label: 'Absolute' },
              { value: 'xnorm', label: 'Normalized' }
            ]}
          />

          <NetPyNECoordsRange
            id="yRangeCellParams"
            name={this.state.currentName}
            model={'netParams.cellParams'}
            conds={'conds'}
            items={[
              { value: 'y', label: 'Absolute' },
              { value: 'ynorm', label: 'Normalized' }
            ]}
          />

          <NetPyNECoordsRange
            id="zRangeCellParams"
            name={this.state.currentName}
            model={'netParams.cellParams'}
            conds={'conds'}
            items={[
              { value: 'z', label: 'Absolute' },
              { value: 'znorm', label: 'Normalized' }
            ]}
          />

        </div>
        {dialogPop}
      </div>
    );
  };
};
