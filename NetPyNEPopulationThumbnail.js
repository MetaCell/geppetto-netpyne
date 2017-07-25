import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width:120,
    height:100,
    float:'left',
    cursor: 'pointer'
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
            </CardText>
        </Card>
        
    );
  }
}
