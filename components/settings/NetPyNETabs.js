import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import { cyan500, cyan400 } from 'material-ui/styles/colors';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';



export default class NetPyNETabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            simulateTabLabel: 'Create network',
            label: 'define',
            transitionOptionsHovered: false
        }

        this.handleTransitionOptionsChange = this.handleTransitionOptionsChange.bind(this);

    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.label!=prevProps.label) {
            this.setState({label:this.props.label});
        }
    }

    handleTransitionOptionsChange(e, v) {
        this.setState({ simulateTabLabel: v });
        this.props.handleTransitionOptionsChange(e, v)
    }

    getLabelStyle(label) {
        var style = { color: 'white', fontWeight: 400 }
        if (label == this.state.label) {
            style['fontWeight'] = 600;
        }
        return style;
    }

    getBackgroundStyle(label) {
        var color = cyan500;
        if (label == this.state.label || (label == 'simulate' && this.state.transitionOptionsHovered)) {
            color = cyan400;
        }
        return color;
    }

    render() {

        return <div style={{ width: '100%', alignItems: 'center', display: 'flex' }}>
            <FlatButton id={"defineNetwork"} onClick={() => this.props.handleChange('define')} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }} backgroundColor={this.getBackgroundStyle('define')} hoverColor={cyan400} labelStyle={this.getLabelStyle('define')} label="Define your Network" />
            <FlatButton id={"simulateNetwork"} onClick={() => this.props.handleChange('simulate')} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }} backgroundColor={this.getBackgroundStyle('simulate')} hoverColor={cyan400} labelStyle={this.getLabelStyle('simulate')} label={this.state.simulateTabLabel} />
            <IconMenu
								id="transit"
                value={this.state.simulateTabLabel}
                iconStyle={{ color: '#ffffff' }}
                style={{ position: 'absolute', top: '6px', right: '28px' }}
                iconButtonElement={<IconButton onMouseEnter={() => this.setState({ transitionOptionsHovered: true })} onMouseLeave={() => this.setState({ transitionOptionsHovered: false })}><NavigationExpandMoreIcon /></IconButton>}
                onChange={this.handleTransitionOptionsChange}
                useLayerForClickAway={true}
                targetOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem id="transit_not" primaryText="Create Network" value="Create Network" />
                <MenuItem id="transit_sim" primaryText="Create and Simulate Network" value="Create and Simulate Network" />
                <MenuItem id="transit_exp" primaryText="Explore Existing Network" value="Explore Existing Network" />
            </IconMenu>
        </div>
    }
}
