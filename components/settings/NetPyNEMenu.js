import React from 'react';
import { MenuItem }from 'material-ui/Menu'
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import MenuIcon  from 'material-ui/svg-icons/navigation/menu';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

export default class NetPyNEMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            popOverHeight: 100,
            anyOnFocus: false,
            open: this._constructPopoverOpenStates(props.tree),    // {menu1: {open: false, access: 3, anchor: someElement}, menu2: {open: false, access:0, anchor: someOtherElement}, ...} "access" controls to whom a "MouseOver" event in the menuitem, can close Popovers. access 3 can close Popovers for menus with access 4, 5, 6  but not for 0, 1 or 2
        };
        this.name = this.props.tree.map(el=> {return el.constructor.name=='Object'?Object.keys(el)[0]:el})
    }

    _constructPopoverOpenStates = (_array, output={}, lvl=0) => {
        _array.forEach(el => {
            switch(el.constructor.name) {
                case 'Object':
                    output[Object.keys(el)[0]] = {open: false, anchor: null, access: lvl, color: this.props.baseColor}
                    this._constructPopoverOpenStates(Object.values(el)[0], output, lvl+1)
                    break
                case 'String': 
                    output[el] = {open: false, anchor: null, access: lvl, color: this.props.baseColor}
                    break
                default:
                    break
            }})
        return output
    }
    // the behavior of this two is to keep the state anyOnFocus equal to true as long as any of the popovers
    // is on focus. That way, if we click diferent popovers, a click in one popover won't close the other ones 
    _onBlur = () => {
        this._timeoutID = setTimeout(() => {
            if (this.state.anyOnFocus) {
              this.setState({
                anyOnFocus: false,
              });
            }
          }, 0);
    }

    _onFocus = () => {
        clearTimeout(this._timeoutID);
        if (!this.state.anyOnFocus) {
            this.setState({
                anyOnFocus: true,
            });
        }
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

    createMenus = (elem, count, icon=false) => {
        count++
        if (elem.constructor.name==='String') {
            var key = elem;
            var value = undefined;
        }
        else {
            var key = Object.keys(elem)[0];
            var value = Object.values(elem)[0];
        }
        return <div key={key+count+"div"}>
            <MenuItem key={key+count} value={key} primaryText={key}
                insetChildren={this.state.open[key].access==0?true:false}
                rightIcon={value!=undefined?<ArrowDropRight />:null}
                leftIcon={icon?icon:null}
                onMouseLeave={this._onBlur}
                onClick={value!=undefined?()=>{}:()=>{this.closeMenu(key)}}
                onMouseEnter={(e) => this.handleMouseOverMenuItem(key, e.preventDefault(), e.currentTarget, value==undefined?true:false)}
            />
            {value==undefined?null:<Popover key={key+count+"Popover"} 
                useLayerForClickAway={false} open={this.state.open[key].open} anchorEl={this.state.open[key].anchor}
                anchorOrigin={{"horizontal":"right", "vertical":"top"}} targetOrigin={{"horizontal":"left", "vertical":"top"}}
            >
                {value.map(el=>{
                    switch(el.constructor.name) {
                        case 'String':
                            return <MenuItem key={el+count} value={el} primaryText={el} onClick={()=>{this.closeMenu(el)}}/>
                        case 'Array':
                            return el.map(el2=>{return <MenuItem key={el2+count} value={el2} primaryText={el2} onClick={()=>{this.closeMenu(el2)}}/>})
                        default:
                            return this.createMenus(el, count) 
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
    }

    handleOpenAppBarMenu = (e) => {
        var topLimit = document.getElementById(this.props.confineBetweenElementIds[1]).getBoundingClientRect().top
        var bottomLimit = document.getElementById(this.props.confineBetweenElementIds[0]).getBoundingClientRect().bottom
        console.log(topLimit-bottomLimit)
        this.setState({mainPopoverOpen: true, mainAnchorEl: e.currentTarget, popOverHeight:topLimit-bottomLimit})
    }

    render() {
        let icon = React.Children.map(this.props.icons, (ch, i)=>{return React.cloneElement(ch, {color: this.state.open[this.name[i]].color})})
        return <div>
            <IconButton 
                tooltip={this.props.tooltip} 
                onClick={this.handleOpenAppBarMenu}
                style={{marginTop: -10}}
            >
                <MenuIcon color={'#ffffff'}/>
            </IconButton>
            <Popover
                style={{height:this.state.popOverHeight, width:225}} // There should be a better way
                key={"mainPopover"}
                useLayerForClickAway={false} 
                open={this.state.mainPopoverOpen} 
                anchorEl={document.getElementById('appBar')}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={()=>{this.closeMenu('main')}}
            >
                {this.props.tree.map((el, i)=>{return this.createMenus(el, 0, icon[i])})}
            </Popover>
        </div>
    }
}
