import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import { cyan500, cyan400, grey300 } from 'material-ui/styles/colors';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';



export default class NetPyNETabs2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            simulateTabLabel: 'Create network',
            label: 'define',
            transitionOptionsHovered: false
        }

        this.handleTransitionOptionsChange = this.handleTransitionOptionsChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
    }

    handleChange(value){
        this.setState({label: value});
        this.props.handleChange(value)
    }

    handleTransitionOptionsChange(e,v) {
        this.setState({simulateTabLabel: v});
        this.props.handleTransitionOptionsChange(e,v)
    }

    render() {

        return <div style={{width: '100%', alignItems: 'center', display: 'flex'}}>
            <FlatButton onClick={()=>this.handleChange('define')} style={{flex: 1, borderRadius: 10}} backgroundColor={cyan500} hoverColor={cyan400} labelStyle={{color: this.state.label=='define'?'#ffffff':grey300}} label="Define your Network" />
            <FlatButton onClick={()=>this.handleChange('simulate')} style={{flex: 1, borderRadius: 10}} backgroundColor={this.state.transitionOptionsHovered?cyan400:cyan500} hoverColor={cyan400} labelStyle={{color: this.state.label=='simulate'?'#ffffff':grey300}} label={this.state.simulateTabLabel} />
            <IconMenu
                value={this.state.simulateTabLabel} 
                iconStyle={{color: '#ffffff'}} 
                style={{position: 'absolute', top:'6px', right: '28px'}} 
                iconButtonElement={<IconButton onMouseEnter={()=>this.setState({transitionOptionsHovered: true})} onMouseLeave={()=>this.setState({transitionOptionsHovered: false})}><NavigationExpandMoreIcon /></IconButton>} 
                onChange={this.handleTransitionOptionsChange} 
                useLayerForClickAway={true} 
                targetOrigin={{horizontal: "right", vertical: "top"}}
                anchorOrigin={{horizontal:"right", vertical: "bottom"}} 
            >
                <MenuItem primaryText="Create Network" value="Create Network" />
                <MenuItem primaryText="Create and Simulate Network" value="Create and Simulate Network"/>
                <MenuItem primaryText="Explore Existing Network" value="Explore Existing Network"/>
            </IconMenu>
        </div>
    }
}
