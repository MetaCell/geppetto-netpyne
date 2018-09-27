import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import FontIcon from 'material-ui/FontIcon';
import { blue500, grey900 } from 'material-ui/styles/colors';
import LoadFile from './actions/LoadFile';
import SaveFile from './actions/SaveFile';
import DeleteWork from './actions/DeleteWork';
import ExportToDocker from './actions/ExportToDocker';
import ImportExportHLS from './actions/ImportExportHLS';
import ImportExportSonata from './actions/ImportExportSonata';
import ImportExportNeuroML from './actions/ImportExportNeuroML';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Divider from 'material-ui/Divider';
import NetPyNElogo from '../../components/general/NetPyNElogo.png'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MenuDrawer from './MenuDrawer'
import RequestHandler from './RequestHandler'

// couldn't find good icons for import/export in FontAwesome
const ExportIcon = (props) => (<SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M384 121.9c0-6.3-2.5-12.4-7-16.9L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1zM192 336v-32c0-8.84 7.16-16 16-16h176V160H248c-13.2 0-24-10.8-24-24V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V352H208c-8.84 0-16-7.16-16-16zm379.05-28.02l-95.7-96.43c-10.06-10.14-27.36-3.01-27.36 11.27V288H384v64h63.99v65.18c0 14.28 17.29 21.41 27.36 11.27l95.7-96.42c6.6-6.66 6.6-17.4 0-24.05z'></path></svg></SvgIcon>);
const ImportIcon = (props) => (<SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M16 288c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h112v-64H16zm336-152V0H152c-13.3 0-24 10.7-24 24v264h127.99v-65.18c0-14.28 17.29-21.41 27.36-11.27l95.7 96.43c6.6 6.65 6.6 17.39 0 24.04l-95.7 96.42c-10.06 10.14-27.36 3.01-27.36-11.27V352H128v136c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H376c-13.2 0-24-10.8-24-24zm153-31L407.1 7c-4.5-4.5-10.6-7-17-7H384v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z'></path></svg></SvgIcon>);
const DockerIcon = (props) => (<SvgIcon {...props}><svg viewBox="0 0 640 512"><path d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"></path></svg></SvgIcon>);


export default class NetPyNEToolBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestID: -1,
            openDialogBox: false,
            buttonLabel: '',
            title: '',
            open: false
        }
    }
    handleMenuItemClick = (id) => {
        var buttonLabel = ''
        var title = ''
        if (id==0) {
            buttonLabel = 'Load'
            title = 'Load file'
        }
        else if (id==1){
            buttonLabel = 'Save'
            title = 'Save file'
        }
        else if (id<5) {
            buttonLabel = 'Import'
            title = 'Import'
        }
        else if (id<8) {
            buttonLabel = 'Export'
            title = 'Export'
        }
        else if (id==8) {
            buttonLabel = 'Build'
            title = 'Container'
        }
        else if (id==9) {
            buttonLabel = 'Delete'
            title = 'Delete'
        }
        this.setState({requestID:id, openDialogBox:true, buttonLabel: buttonLabel, title: title, open: false})   
    }
    render() {
        switch (this.state.requestID) {
            case 0:
                var requestEl = <LoadFile />
                break
            case 1:
                var requestEl = <SaveFile />
                break
            case 2:
                var requestEl = <ImportExportHLS />
                break
            case 3:
                var requestEl = <ImportExportNeuroML />
                break
            case 4:
                var requestEl = <ImportExportSonata />
                break
            case 5:
                var requestEl = <ImportExportHLS />
                break
            case 6:
                var requestEl = <ImportExportNeuroML />
                break
            case 7:
                var requestEl = <ImportExportSonata />
                break
            case 8:
                var requestEl = <ExportToDocker />
                break
            case 9:
                var requestEl = <DeleteWork />
                break
            default:
                var requestEl = <div />
        }



        return <div>
            <IconButton
                tooltip={'File options'}
                style={{ width: 40, height: 40, borderRadius: 25, overflow: 'hidden', marginTop: -20 }} //controls the circle position
                iconStyle={{ color: '#ffffff', marginTop: -4, marginLeft: -4 }}//controls icon position inside the circle
                hoveredStyle={{ backgroundColor: '#26C6DA' }}
                onClick={() => this.setState({ open: !this.state.open })}
            >
                <NavigationMenu />
            </IconButton>
            <Drawer
                docked={false}
                width={280}
                open={this.state.open}
                onRequestChange={(open) => this.setState({ open })}
            >
                <img style={{ marginLeft: 10, marginTop: 5, marginBottom: 8 }} src={NetPyNElogo} />
                <Divider />
                <MenuItem primaryText="Open..." onClick={() => this.handleMenuItemClick(0)} leftIcon={<FontIcon className='fa fa-folder-open-o' />} />
                <MenuItem primaryText="Save..." onClick={() => this.handleMenuItemClick(1)} leftIcon={<FontIcon className='fa fa-download' />} />
                <MenuItem
                    primaryText="Import Model"
                    rightIcon={<ArrowDropRight />}
                    leftIcon={<ImportIcon />}
                    menuItems={[
                        <MenuItem onClick={() => this.handleMenuItemClick(2)} primaryText="High Level Specifications" />,
                        <MenuItem onClick={() => this.handleMenuItemClick(3)} primaryText="from NeuroML" />,
                        <MenuItem onClick={() => this.handleMenuItemClick(4)} primaryText="from Sonata" />,
                    ]}
                />
                <MenuItem
                    primaryText="Export Model"
                    rightIcon={<ArrowDropRight />}
                    leftIcon={<ExportIcon />}
                    menuItems={[
                        <MenuItem onClick={() => this.handleMenuItemClick(5)} primaryText="High Level Specifications" />,
                        <MenuItem onClick={() => this.handleMenuItemClick(6)} primaryText="to NeuroML" />,
                        <MenuItem onClick={() => this.handleMenuItemClick(7)} primaryText="to Sonata" />,
                    ]}
                />
                <MenuItem onClick={() => this.handleMenuItemClick(8)} leftIcon={<DockerIcon />} primaryText="Create Docker container" />
                <MenuItem onClick={() => this.handleMenuItemClick(9)} leftIcon={<FontIcon className='fa fa-trash-o' />} primaryText="Delete current work" />
            </Drawer>

            <RequestHandler
                open={this.state.openDialogBox}
                requestID={this.state.requestID}
                onRequestClose={() => this.setState({ openDialogBox: false })}
                buttonLabel={this.state.buttonLabel}
                title={this.state.title}
                changeTab={this.props.changeTab}
            >
                {requestEl}
            </RequestHandler>
        </div>
    }
}
