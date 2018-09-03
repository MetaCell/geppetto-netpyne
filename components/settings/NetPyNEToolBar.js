import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import {blue500, grey900} from 'material-ui/styles/colors';
import OpenFile from './OpenFile';
import SaveFile from './SaveFile';
import MenuDrawer from './MenuDrawer'
import RequestHandler from './RequestHandler'

const LoadIcon = (props) => (<SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M527.943 224H480v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h400a48.001 48.001 0 0 0 40.704-22.56l79.942-128c19.948-31.917-3.038-73.44-40.703-73.44zM54 112h134.118l64 64H426a6 6 0 0 1 6 6v42H152a48 48 0 0 0-41.098 23.202L48 351.449V117.993A5.993 5.993 0 0 1 54 112zm394 288H72l77.234-128H528l-80 128z'></path></svg></SvgIcon>);
const ExportIcon = (props) => (<SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M384 121.9c0-6.3-2.5-12.4-7-16.9L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1zM192 336v-32c0-8.84 7.16-16 16-16h176V160H248c-13.2 0-24-10.8-24-24V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V352H208c-8.84 0-16-7.16-16-16zm379.05-28.02l-95.7-96.43c-10.06-10.14-27.36-3.01-27.36 11.27V288H384v64h63.99v65.18c0 14.28 17.29 21.41 27.36 11.27l95.7-96.42c6.6-6.66 6.6-17.4 0-24.05z'></path></svg></SvgIcon>);
const ImportIcon = (props) => (<SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M16 288c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h112v-64H16zm336-152V0H152c-13.3 0-24 10.7-24 24v264h127.99v-65.18c0-14.28 17.29-21.41 27.36-11.27l95.7 96.43c6.6 6.65 6.6 17.39 0 24.04l-95.7 96.42c-10.06 10.14-27.36 3.01-27.36-11.27V352H128v136c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H376c-13.2 0-24-10.8-24-24zm153-31L407.1 7c-4.5-4.5-10.6-7-17-7H384v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z'></path></svg></SvgIcon>);
const SaveIcon = (props) => (<SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z'></path></svg></SvgIcon>);
const DeleteIcon = (props) => (<SvgIcon {...props}><svg viewBox='0 0 750 750'><path d='M192 188v216c0 6.627-5.373 12-12 12h-24c-6.627 0-12-5.373-12-12V188c0-6.627 5.373-12 12-12h24c6.627 0 12 5.373 12 12zm100-12h-24c-6.627 0-12 5.373-12 12v216c0 6.627 5.373 12 12 12h24c6.627 0 12-5.373 12-12V188c0-6.627-5.373-12-12-12zm132-96c13.255 0 24 10.745 24 24v12c0 6.627-5.373 12-12 12h-20v336c0 26.51-21.49 48-48 48H80c-26.51 0-48-21.49-48-48V128H12c-6.627 0-12-5.373-12-12v-12c0-13.255 10.745-24 24-24h74.411l34.018-56.696A48 48 0 0 1 173.589 0h100.823a48 48 0 0 1 41.16 23.304L349.589 80H424zm-269.611 0h139.223L276.16 50.913A6 6 0 0 0 271.015 48h-94.028a6 6 0 0 0-5.145 2.913L154.389 80zM368 128H80v330a6 6 0 0 0 6 6h276a6 6 0 0 0 6-6V128z'></path></svg></SvgIcon>);

export default class NetPyNEToolBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestID: -1,
            openDialogBox: false,
            buttonLabel: '',
            title: ''
        }
    }
    handleMenuItemClick = (menuItemSelected) => {
        console.log(menuItemSelected)
        var buttonLabel = ''
        var title = ''
        switch (menuItemSelected) {
            case 0:
                buttonLabel = 'Load'
                title = 'Load HLS'
                break;
            case 1:
                buttonLabel = 'Load'
                title = 'Load HLS'
                break;
            case 2:
                buttonLabel = 'Load'
                title = 'Load Model'
                break;
            case 3:
                buttonLabel = 'Load'
                title = 'Load Model'
                break;
            case 4:                
                buttonLabel = 'Save'
                title = 'Save HLS'
                break;
            case 5:
                buttonLabel = 'Save'
                title = 'Save HLS'
                break;
            case 6:                
                buttonLabel = 'Save'
                title = 'Save Model'
                break;
            case 7:                
                buttonLabel = 'Save'
                title = 'Save Model'
                break;
            default:
                break
        }
        this.setState({requestID:menuItemSelected, openDialogBox:true, buttonLabel: buttonLabel, title: title})

    }
    render() {
        if (this.state.requestID==-1){
            var requestEl = <div/>
        }
        else if(this.state.requestID<4){
            var requestEl = <OpenFile/>
        }
        else if(this.state.requestID<8){
            var requestEl = <SaveFile/>
        }
        return  <div>
            <MenuDrawer 
                tooltip={'File options'} 
                baseColor={grey900}
                hoverColor={blue500}
                confineBetweenElementIds={['appBar', 'tabButton']}
                onClick={this.handleMenuItemClick}
                icons={[<LoadIcon/>, <SaveIcon/>, <ImportIcon/>, <ExportIcon/>, <DeleteIcon/>]}
                tree={[
                    {Open: [{'High Level Specification': ['from .py', 'from .json']}, {'Instanciated Network': ['from .json', 'from .pkl']}, {'All': ['from .json']}]}, 
                    {Save: [{'High Level Specification': ['as .py', 'as .json']}, {'Instanciated Network': ['as .json', 'as .pkl']}, {'All': ['as .json', 'as .pkl']}] },
                    {Import: ['from NeuroML', 'from Sonata']},
                    {Export: ['to NeuroML', 'to Sonata']},
                    'Clear'
                ]}
            />
            <RequestHandler 
                open={this.state.openDialogBox} 
                requestID={this.state.requestID}
                onRequestClose={()=>this.setState({openDialogBox: false})}
                buttonLabel={this.state.buttonLabel}
                title = {this.state.title}
            >
                {requestEl}
            </RequestHandler>
        </div>
    }
}
