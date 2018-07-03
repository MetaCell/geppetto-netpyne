import React from 'react';
import TextField from 'material-ui/TextField';
import Utils from '../../../../../Utils';

var PythonControlledCapability = require('../../../../../../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

export default class NetPyNEMechanism extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      mechFields: ''
    };
  };
  
  componentWillReceiveProps(nextProps) {
    this.setState({ currentName: nextProps.name});
  };
  
  renderMechFields = () => {
    if (this.state.mechFields=='') {
      return <div key={"empty"}/>
    }
    else {
      var tag = "netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.section + "']['mechs']['" + this.state.currentName + "']"
      return this.state.mechFields.map((name, i) =>
        <PythonControlledTextField name={name} key={name} model={tag + "['"+name+"']"} floatingLabelText={name} realType={"float"} style={{width:'100%'}}/>
      )
    }
  };

  render() {
    var content = []
    if (this.state.currentName!=undefined && this.state.currentName!='') {
      Utils
        .sendPythonMessage("netpyne_geppetto.getMechParams", [this.state.currentName])
        .then((response) => {
          if (JSON.stringify(this.state.mechFields)!=JSON.stringify(response))
          this.setState({mechFields: response})
        })
      content.push(this.renderMechFields())
    };
    
    return (
      <div>
        <TextField
          key="netpyneField"
          value={this.state.currentName}
          floatingLabelText="Mechanism"
          className={"netpyneField"}
          disabled={true}
        />
        <br />
        {content}
      </div>
    );
  };
};
