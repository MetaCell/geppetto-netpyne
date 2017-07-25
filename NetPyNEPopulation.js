import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

var TextField = require('../../js/components/controls/TextField');

const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width:350,
    height:400,
    float:'left'
  },
  cardContent:{
  }
};

export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props); 
    this.state = {
      model: props.model
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    console.log('handling change');
  }

  render() {
    return (

        <Card style={styles.populationCard}>zDepth={2}
          <CardHeader
            title="L5_Pyr"
          />
          <CardText style={styles.cardContent}>
              <SelectField
                floatingLabelText="Cell Type"
                value={this.state.model.cellType}
                onChange={this.handleChange}
              >
                <MenuItem value={1} primaryText="Hodgkin-Huxkley" />
                <MenuItem value={2} primaryText="Izhikevich" />
                <MenuItem value={3} primaryText="Integrate and fire" />
                <MenuItem value="PYR" primaryText="PYR" />
              </SelectField>
              <br />
              <SelectField
                floatingLabelText="Cell Model"
                value={this.state.model.cellModel}
                onChange={this.handleChange}
              >
                <MenuItem value="HH" primaryText="Hodgkin-Huxkley" />
                <MenuItem value={2} primaryText="Izhikevich" />
                <MenuItem value={3} primaryText="Integrate and fire" />
              </SelectField>

              <TextField sync_value="aa" path="probando" value= {"netParams.popParams['" + this.props.path + "']['cellModel']"}/>
            </CardText>
        </Card>
        
    );
  }
}
