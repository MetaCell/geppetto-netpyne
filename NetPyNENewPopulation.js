import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Card, { CardHeader, CardText } from 'material-ui/Card';


const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width:350,
    height:400,
    float:'left',
    borderStyle: 'dashed',
    borderColor: '#808080',
    color: '#808080',
    cursor: 'pointer'
  },
  plus: {
    fontSize: 170,
    textAlign: 'center',
    color: '#808080'
  }
};

export default class NetPyNENewPopulation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (

        <Card style={styles.populationCard}>zDepth={2}
          <CardHeader titleColor='#808080'
            title="Add a new population" 
          />
          <CardText style={styles.plus}>
          +
          </CardText>
        </Card>
        
    );
  }
}
