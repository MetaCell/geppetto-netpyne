import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import Utils from '../../../Utils';
import NetPyNESynapse from './NetPyNESynapse';
import NetPyNEAddNew from '../../general/NetPyNEAddNew';
import NetPyNEThumbnail from '../../general/NetPyNEThumbnail';


export default class NetPyNESynapses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedSynapse: undefined,
      page: "main"
    };
    this.selectSynapse = this.selectSynapse.bind(this);
    this.handleNewSynapse = this.handleNewSynapse.bind(this);
    this.deleteSynapse = this.deleteSynapse.bind(this);
  };

  /* Method that handles button click */
  selectSynapse(Synapse) {
    this.setState({selectedSynapse: Synapse});
  };

  handleNewSynapse() {
    var defaultSynapses = {'Synapse': {'mod': ''}};
    var key = Object.keys(defaultSynapses)[0];
    var value = defaultSynapses[key];
    var model = this.state.value;
    var SynapseId = Utils.getAvailableKey(model, key);
    Utils.execPythonCommand('netpyne_geppetto.netParams.synMechParams["' + SynapseId + '"] = ' + JSON.stringify(value));
    this.setState({
      value: model,
      selectedSynapse: SynapseId
    });
  };

  hasSelectedSynapseBeenRenamed(prevState, currentState) {
    var currentModel = prevState.value;
    var model = currentState.value;
    //deal with rename
    if (currentModel != undefined && model != undefined) {
      var oldP = Object.keys(currentModel);
      var newP = Object.keys(model);
      if (oldP.length == newP.length) {
        //if it's the same lenght there could be a rename
        for (var i = 0; i < oldP.length; i++) {
          if (oldP[i] != newP[i]) {
            if (prevState.selectedSynapse != undefined) {
              if (oldP[i] == prevState.selectedSynapse) {
                return newP[i];
              };
            };
          };
        };
      };
    };
    return undefined;
  };

  componentDidUpdate(prevProps, prevState) {
    var newSynapseName = this.hasSelectedSynapseBeenRenamed(prevState, this.state);
    if (newSynapseName !== undefined) {
      this.setState({ selectedSynapse: newSynapseName });
    };
  };

  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedSynapseBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedSynapse != nextState.selectedSynapse;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (this.state.value != undefined) {
      newItemCreated = Object.keys(this.state.value).length != Object.keys(nextState.value).length;
    };
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged;
  };

  deleteSynapse(name) {
    Utils.sendPythonMessage('netpyne_geppetto.deleteParam', ["synMechParams['" + name + "']"]).then((response) =>{
      var model = this.state.value;
      delete model[name];
      this.setState({value: model, selectedSynapse: undefined});
    });
  }

  render() {
    var model = this.state.value;
    var Synapses = [];
    for (var c in model) {
      Synapses.push(<NetPyNEThumbnail
        id={"synThumb"+c.replace(" ", "")}
        name={c} 
        key={c} 
        selected={c == this.state.selectedSynapse}
        deleteMethod={this.deleteSynapse}
        handleClick={this.selectSynapse} />);
    };
    var selectedSynapse = undefined;
    if ((this.state.selectedSynapse != undefined) && Object.keys(model).indexOf(this.state.selectedSynapse) > -1) {
      selectedSynapse = <NetPyNESynapse name={this.state.selectedSynapse} />;
    };

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Synaptic mechanisms"
          subtitle="Define here the synaptic mechanisms available in your network"
          actAsExpander={true}
          showExpandableButton={true}
          id={"Synapses"}
        />
        <CardText className={"tabContainer"} expandable={true}>
          <div className={"details"}>
            {selectedSynapse}
          </div>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <IconMenu style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
                iconButtonElement={
                  <NetPyNEAddNew id={"newSynapseButton"} handleClick={this.handleNewSynapse} />
                }
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
              </IconMenu>
            </div>
            <div style={{ clear: "both" }}></div>
            {Synapses}
          </div>
        </CardText>
      </Card>
    );
  }
}
