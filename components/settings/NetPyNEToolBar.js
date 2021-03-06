import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Divider from 'material-ui/Divider';
import LoadFile from './actions/LoadFile';
import SaveFile from './actions/SaveFile';
import NewModel from './actions/NewModel';
import ImportExportHLS from './actions/ImportExportHLS';
import ImportCellParams from './actions/ImportCellParams'
import NetPyNElogo from '../../components/general/NetPyNe_logo.png'

const ExportIcon = props => <SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M384 121.9c0-6.3-2.5-12.4-7-16.9L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1zM192 336v-32c0-8.84 7.16-16 16-16h176V160H248c-13.2 0-24-10.8-24-24V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V352H208c-8.84 0-16-7.16-16-16zm379.05-28.02l-95.7-96.43c-10.06-10.14-27.36-3.01-27.36 11.27V288H384v64h63.99v65.18c0 14.28 17.29 21.41 27.36 11.27l95.7-96.42c6.6-6.66 6.6-17.4 0-24.05z'></path></svg></SvgIcon>;
const ImportIcon = props => <SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M16 288c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h112v-64H16zm336-152V0H152c-13.3 0-24 10.7-24 24v264h127.99v-65.18c0-14.28 17.29-21.41 27.36-11.27l95.7 96.43c6.6 6.65 6.6 17.39 0 24.04l-95.7 96.42c-10.06 10.14-27.36 3.01-27.36-11.27V352H128v136c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H376c-13.2 0-24-10.8-24-24zm153-31L407.1 7c-4.5-4.5-10.6-7-17-7H384v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z'></path></svg></SvgIcon>;
const CellTemplateIcon = props => <SvgIcon {...props}><svg viewBox="0 0 448 512"><path d="M448 75.2v361.7c0 24.3-19 43.2-43.2 43.2H43.2C19.3 480 0 461.4 0 436.8V75.2C0 51.1 18.8 32 43.2 32h361.7c24 0 43.1 18.8 43.1 43.2zm-37.3 361.6V75.2c0-3-2.6-5.8-5.8-5.8h-9.3L285.3 144 224 94.1 162.8 144 52.5 69.3h-9.3c-3.2 0-5.8 2.8-5.8 5.8v361.7c0 3 2.6 5.8 5.8 5.8h361.7c3.2.1 5.8-2.7 5.8-5.8zM150.2 186v37H76.7v-37h73.5zm0 74.4v37.3H76.7v-37.3h73.5zm11.1-147.3l54-43.7H96.8l64.5 43.7zm210 72.9v37h-196v-37h196zm0 74.4v37.3h-196v-37.3h196zm-84.6-147.3l64.5-43.7H232.8l53.9 43.7zM371.3 335v37.3h-99.4V335h99.4z"></path></svg></SvgIcon>;

export default class NetPyNEToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialogBox: false,
      open: false,
      action: null
    }
  }

  handleMenuItemClick = (action) => {
    this.setState({action:action, openDialogBox:true, open: false})   
  }

  render() {

    if (this.state.openDialogBox){
      switch(this.state.action){
        case 'Load':
          var content = <LoadFile
              open={this.state.openDialogBox}
              onRequestClose={() => this.setState({ openDialogBox: false })}
              changeTab={this.props.changeTab}
          />
          break;
        case 'Save':
          var content = <SaveFile
              open={this.state.openDialogBox}    
              onRequestClose={() => this.setState({ openDialogBox: false })}
              changeTab={this.props.changeTab}
              />
          break;
        case 'ImportHLS':
          var content = <ImportExportHLS 
              open={this.state.openDialogBox}
              onRequestClose={() => this.setState({ openDialogBox: false })}
              changeTab={this.props.changeTab}
              mode ={"IMPORT"}/>
          break;
        case 'ExportHLS':
          var content = <ImportExportHLS 
              open={this.state.openDialogBox}
              onRequestClose={() => this.setState({ openDialogBox: false })}
              changeTab={this.props.changeTab}
              mode ={"EXPORT"}
          />
          break;
        case 'ImportCellTemplate':
          var content = <ImportCellParams
              open={this.state.openDialogBox}
              onRequestClose={() => this.setState({ openDialogBox: false })}
          />
          break;
        case 'NewModel':
          var content = <NewModel
              open={this.state.openDialogBox}
              onRequestClose={() => this.setState({ openDialogBox: false })}
              changeTab={this.props.changeTab}
          />
          break;
      }
    }
        
    return <div>
      <IconButton
        id="appBar"
        tooltip={'File options'}
        style={{ width: 40, height: 40, borderRadius: 25, overflow: 'hidden' }}
        iconStyle={{ color: '#ffffff', marginTop: -4, marginLeft: -4 }}
        hoveredStyle={{ backgroundColor: '#634587' }}
        onClick={() => this.setState({ open: !this.state.open })}
      >
        <NavigationMenu />
      </IconButton>
      <Drawer
        docked={false}
        width={265}
        open={this.state.open}
        onRequestChange={(open) => this.setState({ open })}
      >
        <div id="logoBackground">
          <img style={{ marginLeft: 25, marginTop: 5, marginBottom: 0, width: 190 }} src={NetPyNElogo} />
          <p style={{ fontSize:10, textAlign:"right", marginRight: 3, marginTop: -10, marginBottom: 0, color:"#543a73"}}>GUI Version 0.5.2</p>
        </div>
        <Divider />
        <MenuItem id="appBarNew" primaryText="New" onClick={() => this.handleMenuItemClick('NewModel')} leftIcon={<FontIcon color={'#543a73'} className='fa fa-plus' />} />
        <MenuItem id="appBarOpen" primaryText="Open..." onClick={() => this.handleMenuItemClick('Load')} leftIcon={<FontIcon color={'#543a73'} className='fa fa-folder-open-o' />} />
        <MenuItem id="appBarSave" primaryText="Save As..." onClick={() => this.handleMenuItemClick('Save')} leftIcon={<FontIcon color={'#543a73'} className='fa fa-download' />} />
        <MenuItem id="appBarImportHLS" primaryText="Import..." onClick={() => this.handleMenuItemClick('ImportHLS')} leftIcon={<ImportIcon color={'#543a73'} />} />
        <MenuItem id="appBarExportHLS" primaryText="Export..." onClick={() => this.handleMenuItemClick('ExportHLS')} leftIcon={<ExportIcon color={'#543a73'} />} />
        <MenuItem id="appBarImportCellTemplate" primaryText="Import Cell Template..." onClick={() => this.handleMenuItemClick('ImportCellTemplate')} leftIcon={<CellTemplateIcon color={'#543a73'} />} />
      </Drawer>
      {content}
    </div>
    }
}
