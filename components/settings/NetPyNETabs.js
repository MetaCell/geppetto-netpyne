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
            tabLabel: 'Create network',
            transitionOptionsHovered: false
        }

        this.handleTransitionOptionsChange = this.handleTransitionOptionsChange.bind(this);
    }

    handleTransitionOptionsChange(e,v) {
        this.setState({tabLabel: v});
        this.props.handleTransitionOptionsChange(e,v)
    }
    render() {

        return <div style={{width: '100%', alignItems: 'center', display: 'flex'}}>
            <FlatButton onClick={()=>this.props.handleChange('define')} style={{flex: 1, borderRadius: 10}} backgroundColor={cyan500} hoverColor={cyan400} labelStyle={{color: this.state.value=='define'?'#ffffff':grey300}} label="Define your Network" />
            <FlatButton onClick={()=>this.props.handleChange('simulate')} style={{flex: 1, borderRadius: 10}} backgroundColor={this.state.transitionOptionsHovered?cyan400:cyan500} hoverColor={cyan400} labelStyle={{color: this.state.value=='simulate'?'#ffffff':grey300}} label={this.state.tabLabel} />
            <IconMenu
                value={this.state.tabLabel} 
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
