
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import NetPyNEPopulationThumbnail from './NetPyNEPopulationThumbnail';
import NetPyNEPopulation from './NetPyNEPopulation';
import NetPyNENewPopulation from './NetPyNENewPopulation';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },

  tabContainer: {
    padding: 10,
    height: 450,
    overflow: 'auto'
  },
  card: {
    clear: 'both'
  },
  thumbnails:{
    width:600,
    height: 430,
    overflow: 'auto',
    float: 'left'
  },
  details:{
    float:'left',
    marginLeft: '50'
  }
};

export default class NetPyNEPopulations extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });


  render() {
    return (
      <Card style={styles.card}>
        <CardHeader
          title="Populations"
          subtitle="Define here the populations of your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <Paper style={styles.tabContainer} expandable={true}>
          <div style={styles.thumbnails}>
            <NetPyNENewPopulation />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
            <NetPyNEPopulationThumbnail />
          </div>
          <div style={styles.details}>
            <NetPyNEPopulation />
          </div>
        </Paper>
      </Card>



    );
  }
}
