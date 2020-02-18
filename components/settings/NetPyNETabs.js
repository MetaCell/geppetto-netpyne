import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import FlatButton from '@material-ui/core/Button';
import NavigationExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default class NetPyNETabs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      simulateTabLabel: 'Create network',
      label: 'define',
      transitionOptionsHovered: false,
      anchorEl: null
    }

    this.handleTransitionOptionsChange = this.handleTransitionOptionsChange.bind(this);
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.label != prevProps.label) {
      this.setState({ label:this.props.label });
    }
  }

  handleTransitionOptionsChange (e, v) {
    this.setState({ simulateTabLabel: v });
    this.props.handleTransitionOptionsChange(e, v)
  }

  getLabelStyle (label) {
    var style = { color: 'white', fontWeight: 400 }
    if (label == this.state.label) {
      style['fontWeight'] = 600;
    }
    return style;
  }

  getBackgroundStyle (label) {
    var color = '#543a73';
    if (label == this.state.label || (label == 'simulate' && this.state.transitionOptionsHovered)) {
      color = '#634587';
    }
    return color;
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render () {

    return <div style={{ width: '100%', alignItems: 'center', display: 'flex' }}>
      <FlatButton id={"defineNetwork"} onClick={() => this.props.handleChange('define')} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }} backgroundColor={this.getBackgroundStyle('define')} hoverColor={'#5e4081'} labelStyle={this.getLabelStyle('define')} label="Define your Network" />
      <FlatButton id={"simulateNetwork"} onClick={() => this.props.handleChange('simulate')} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }} backgroundColor={this.getBackgroundStyle('simulate')} hoverColor={'#5e4081'} labelStyle={this.getLabelStyle('simulate')} label={this.state.simulateTabLabel} />
      <IconButton onClick={this.handleClick} 
        onMouseEnter={() => this.setState({ transitionOptionsHovered: true })} 
        onMouseLeave={() => this.setState({ transitionOptionsHovered: false })}
        style={{ color: '#ffffff' }}
      >
        <NavigationExpandMoreIcon />
      </IconButton>
      
      <Menu
        id="transit"
        value={this.state.simulateTabLabel}
        open={Boolean(this.state.anchorEl)}
        style={{ position: 'absolute', top: '6px', right: '28px' }}
        onChange={this.handleTransitionOptionsChange}
        onClose={this.handleClose}
      >
        <MenuItem id="transitCreate" primaryText="Create Network" value="Create Network" />
        <MenuItem id="transitSimulate" primaryText="Create and Simulate Network" value="Create and Simulate Network" />
        <MenuItem id="transitExplore" primaryText="Explore Existing Network" value="Explore Existing Network" />
      </Menu>
    </div>
  }
}
