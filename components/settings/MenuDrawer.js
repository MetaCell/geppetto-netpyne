import React from 'react';
import { MenuItem }from 'material-ui/Menu'
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import MenuIcon  from 'material-ui/svg-icons/navigation/menu';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

export default class MenuDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            popOverHeight: 100,
            anyOnFocus: false,
            open: this._constructPopoverOpenStates(props.tree),    // {menu1: {open: false, access: 3, anchor: someElement}, menu2: {open: false, access:0, anchor: someOtherElement}, ...} "access" controls to whom a "MouseOver" event in the menuitem, can close Popovers. access 3 can close Popovers for menus with access 4, 5, 6  but not for 0, 1 or 2
            tree: this._giveUniqueIdsToTree(props.tree)
        };
        this.name = this.props.tree.map(el=> {return el.constructor.name=='Object'?Object.keys(el)[0]:el})
    }

    _giveUniqueIdsToTree = (tree) => {
        function renameProp(oldProp, newProp, { [oldProp]: old, ...others }) {return {[newProp]: old, ...others}}
        function changeName(tree) {
            tree.forEach((el, index) => {
                if (el.constructor.name==='Object'){
                    tree[index] = renameProp(Object.keys(el)[0], id, el)
                    id++
                    changeName(Object.values(el)[0])
                }
                else {
                    tree[index] = id
                    id++
                }
            })
        }
        var id = 0
        changeName(tree)
        return tree
    }
    _constructPopoverOpenStates = (tree) => {
        var id = 0
        var gid = 0
        var output = {}
        var color = this.props.baseColor

        function exploreTree(_array, lvl=0) {
            _array.forEach((el, index) => {
                switch(el.constructor.name) {
                    case 'Object':
                        output[id] = {label: Object.keys(el)[0], open: false, anchor: null, access: lvl, color: color}
                        id++
                        exploreTree(Object.values(el)[0], lvl+1)
                        break
                    case 'String': 
                        output[id] = {label: el, open: false, anchor: null, access: lvl, color: color, gid: gid}
                        id++
                        gid++
                        break
                    default:
                        break
                }}
            )
        }
        exploreTree(tree)
        return output
    }
    // the behavior of this two is to keep the state anyOnFocus equal to true as long as any of the popovers
    // is on focus. That way, if we click diferent popovers, a click in one popover won't close the other ones 
    _onBlur = () => {
        this._timeoutID = setTimeout(() => {
            if (this.state.anyOnFocus) this.setState({anyOnFocus: false});
          }, 0);
    }
    _onFocus = () => {
        clearTimeout(this._timeoutID);
        if (!this.state.anyOnFocus) this.setState({anyOnFocus: true});
    }
    handleMouseOverMenuItem = (name, preventDefault, target, skipFocus=false) => {
        preventDefault
        var clone = Object.assign({}, this.state.open)
        var access = clone[name].access
        Object.keys(clone).forEach((key) => {
            if (key==name) {
                clone[key].open = true
                clone[key].anchor = target
                if (access===0) clone[key].color = this.props.hoverColor
            }
            else {
                if (clone[key].access>=access) clone[key].open = false
                if (access===0) clone[key].color = this.props.baseColor
            }
        })
        if (!this.checkEqual(clone, this.state.open)) { this.setState({open: clone})}
        if (!skipFocus) this._onFocus()
    }
    checkEqual = (d1, d2) => {
        for (var k in d1) {if (d1[k].access!=d2.access || d1[k].open!=d2[k].open || d1[k].anchor!=d2[k].anchor || d1[k].color!=d2[k].color) {return false} }
        return true
    }
    createMenus = (elem, icon=false) => {
        if (elem.constructor.name==='Number') {
            var key = elem;
            var value = undefined;
        }
        else {
            var key = Object.keys(elem)[0];
            var value = Object.values(elem)[0];
        }
        return <div key={key+"div"}>
            <MenuItem key={key} value={key} primaryText={this.state.open[key].label}
                insetChildren={this.state.open[key].access==0?true:false}
                rightIcon={value!=undefined?<ArrowDropRight />:null}
                leftIcon={icon?icon:null}
                onMouseLeave={this._onBlur}
                onClick={value!=undefined?()=>{}:()=>{this.closeMenu(this.state.open[key].gid)}}
                onMouseEnter={(e) => this.handleMouseOverMenuItem(key, e.preventDefault(), e.currentTarget, value==undefined?true:false)}
            />
            {value==undefined?null:<Popover key={key+"Popover"} 
                useLayerForClickAway={false} open={this.state.open[key].open} anchorEl={this.state.open[key].anchor}
                anchorOrigin={{"horizontal":"right", "vertical":"top"}} targetOrigin={{"horizontal":"left", "vertical":"top"}}
            >
                {value.map(el=>{
                    switch(el.constructor.name) {
                        case 'Number':
                            return <MenuItem key={el} value={el} primaryText={this.state.open[el].label} onClick={()=>{this.closeMenu(this.state.open[el].gid)}}/>
                        case 'Array':
                            return el.map(el2=>{return <MenuItem key={el2} value={el2} primaryText={this.state.open[el2].label} onClick={()=>{this.closeMenu(this.state.open[el2].gid)}}/>})
                        default:
                            return this.createMenus(el) 
                    }})
                }
            </Popover>}
        </div>
    }
    closeMenu = (name) => {
        if (name!='main') this.props.onClick(name)
        if (!this.state.anyOnFocus) {
            var clone = Object.assign({}, this.state.open)
            for (var key in clone) clone[key].open = false
            this.setState({mainPopoverOpen: false, open: clone})
        }
        var dimmer = document.getElementById("dimmer")
        dimmer.style.opacity = 0.0;
  		dimmer.style.visibility = "hidden";
    }

    handleOpenAppBarMenu = (e) => {
        var dimmer = document.getElementById("dimmer")
        var ap = document.getElementById(this.props.confineBetweenElementIds[0]).getBoundingClientRect()
        var cm = document.getElementById(this.props.confineBetweenElementIds[1]).getBoundingClientRect()
        dimmer.style.opacity = 0.2;
        dimmer.style.visibility = "visible";
        dimmer.style.top = ap.bottom+"px"
        dimmer.style.height = (cm.bottom - ap.bottom) + "px"
        this.setState({mainPopoverOpen: true, mainAnchorEl: e.currentTarget, popOverHeight:cm.top})
    }
    
    render() {
        let icon = React.Children.map(this.props.icons, (ch, i)=>{return React.cloneElement(ch, {color: this.state.open[this.name[i]].color})})
        return <div>
            <IconButton 
                tooltip={this.props.tooltip} 
                onClick={this.handleOpenAppBarMenu}
                style={{marginTop: -12}}
            >
                <MenuIcon color={'#ffffff'}/>
            </IconButton>
            <Popover
                style={{height:this.state.popOverHeight, width:225}} // There should be a better way
                key={"mainPopover"}
                id={"appBarPopOver"}
                animated={false}
                canAutoPosition={false}
                useLayerForClickAway={false} 
                open={this.state.mainPopoverOpen} 
                anchorEl={document.getElementById('appBar')}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={()=>{this.closeMenu('main')}}
            >
                {this.state.tree.map((el, i)=>{return this.createMenus(el, icon[i])})}
            </Popover>
        </div>
    }
}