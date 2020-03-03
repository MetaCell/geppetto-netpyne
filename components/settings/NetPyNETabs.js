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
    this.setState({ simulateTabLabel: v, anchorEl: null });
    this.props.handleTransitionOptionsChange(e, v)
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render () {

    return <div style={{ width: '100%', alignItems: 'center', display: 'flex' }}>
      <FlatButton variant="contained" disableElevation color="primary" id={"defineNetwork"} onClick={() => this.props.handleChange('define')} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }} >
      Define your Network
      </FlatButton>
      <FlatButton variant="contained" disableElevation color="primary" id={"simulateNetwork"} onClick={() => this.props.handleChange('simulate')} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }} >
        { this.state.simulateTabLabel }

      </FlatButton>
      <IconButton onClick={this.handleClick} 
        onMouseEnter={() => this.setState({ transitionOptionsHovered: true })} 
        onMouseLeave={() => this.setState({ transitionOptionsHovered: false })}
      >
        <NavigationExpandMoreIcon style={{ color: "white" }} />
      </IconButton>
      
      <Menu
        id="transit"
        value={this.state.simulateTabLabel}
        anchorEl={this.state.anchorEl}
        open={Boolean(this.state.anchorEl)}
        style={{ position: 'absolute', top: '6px', right: '28px' }}
        
        onClose={this.handleClose}
      >
        <MenuItem id="transitCreate" onClick={e => this.handleTransitionOptionsChange(e, "Create Network")} >Create Network</MenuItem>
        <MenuItem id="transitSimulate" onClick={e => this.handleTransitionOptionsChange(e, "Create and Simulate Network")} >Create and Simulate Network</MenuItem>
        <MenuItem id="transitExplore" onClick={e => this.handleTransitionOptionsChange(e, "Explore Existing Network")}>Explore Existing Network</MenuItem>
      </Menu>
    </div>
  }
}
