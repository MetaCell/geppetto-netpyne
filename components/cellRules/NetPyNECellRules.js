
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import NetPyNECellRuleThumbnail from './NetPyNECellRuleThumbnail';
import NetPyNECellRule from './NetPyNECellRule';
import NetPyNENewCellRule from './NetPyNENewCellRule';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import Utils from '../../Utils';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },

  tabContainer: {
    padding: 10,
    height: 500,
    overflow: 'auto'
  },
  card: {
    clear: 'both'
  },
  thumbnails: {
    width: '40%',
    height: 420,
    overflow: 'auto',
    float: 'left'
  },
  details: {
    float: 'left',
    marginLeft: 50,
    width: '50%'
  }
};

export default class NetPyNECellRules extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      model: props.model,
      selectedCellRule: undefined
    };

    this.handleNewCellRule = this.handleNewCellRule.bind(this);
    this.selectCellRule = this.selectCellRule.bind(this);
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  handleNewCellRule(defaultCellRules) {
    // Get Key and Value
    var key = Object.keys(defaultCellRules)[0];
    var value = defaultCellRules[key];
    var model = this.state.model;

    // Get New Available ID
    var cellRuleId = Utils.getAvailableKey(model, key);

    // Create Population Object
    var newCellRule = Object.assign({name: cellRuleId}, value);

    // Create Population Client side
    Utils.execPythonCommand('netpyne_geppetto.netParams.cellParams["' + cellRuleId + '"] = ' + JSON.stringify(value));

    // Update state
    model[cellRuleId] = newCellRule;
    this.setState({
      model: model,
      selectedCellRule: newCellRule
    });
  }

  selectCellRule(cellRule) {
    this.setState({ model: this.state.model, selectedCellRule: cellRule });
  }

  render() {

    var cellRules = [];
    for (var key in this.state.model) {
      cellRules.push(<NetPyNECellRuleThumbnail selected={this.state.selectedCellRule && key == this.state.selectedCellRule.name} model={this.state.model[key]} path={key} handleClick={this.selectCellRule} />);
    }
    var selectedCellRule = undefined;
    if (this.state.selectedCellRule) {
      selectedCellRule = <NetPyNECellRule requirement={this.props.requirement} model={this.state.selectedCellRule} path={this.state.selectedCellRule.name} />;
    }

    return (
      <Card style={styles.card}>
        <CardHeader
          title="Cell rules"
          subtitle="Define here the rules to generate the cells in your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <Paper style={styles.tabContainer} expandable={true}>
          <IconMenu style={{ float: 'left' }}
            iconButtonElement={
              <NetPyNENewCellRule handleClick={this.handleNewCellRule} />
            }
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
          </IconMenu>
          <div style={{ clear: 'both' }} />
          <div style={styles.thumbnails}>
            {cellRules}
          </div>
          <div style={styles.details}>
            {selectedCellRule}
          </div>
        </Paper>
      </Card>

    );
  }
}
