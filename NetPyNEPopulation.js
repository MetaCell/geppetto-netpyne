import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
    };
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
                value={1}
                onChange={this.handleChange}
              >
                <MenuItem value={1} primaryText="Hodgkin-Huxkley" />
                <MenuItem value={2} primaryText="Izhikevich" />
                <MenuItem value={3} primaryText="Integrate and fire" />
              </SelectField>
              <br />
              <SelectField
                floatingLabelText="Cell Model"
                value={2}
                onChange={this.handleChange}
              >
                <MenuItem value={1} primaryText="Hodgkin-Huxkley" />
                <MenuItem value={2} primaryText="Izhikevich" />
                <MenuItem value={3} primaryText="Integrate and fire" />
              </SelectField>
            </CardText>
        </Card>
        
    );
  }
}
