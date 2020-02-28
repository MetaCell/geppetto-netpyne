import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { orange500 , grey400, grey500 } from 'material-ui/styles/colors';
import FileBrowser from '../../general/FileBrowser';
import ActionDialog from './ActionDialog';

export default class ImportExportHLS extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...this.initialState() }

        this.isFormValid = this.isFormValid.bind(this);
    }

    initialState () {
        return {
            fileName: "output",
            netParamsPath: "",
            netParamsModuleName: "",
            netParamsVariable: "netParams",
            simConfigPath: "",
            simConfigModuleName: "",
            simConfigVariable: "simConfig",
            modFolder: "",
            loadMod: '',
            compileMod: false,
            explorerDialogOpen: false,
            explorerParameter: "",
            exploreOnlyDirs: false,
            filterFiles: false,
            netParamsHovered: 'hidden',
            netParamsFullPath: '',
            simConfigFullPath: ''
        }
    }

    isFormValid(){
        if (this.props.mode == 'IMPORT'){
            // FIXME: Set to undefine to show error text. No particularly elegant
            if (this.state.loadMod === ''){
                this.setState({loadMod: undefined})
            }
            return this.state.loadMod !== undefined && this.state.loadMod !== ''
        }
        else{
            return true;
        }
    }

    showExplorerDialog(explorerParameter, exploreOnlyDirs, filterFiles) {
        this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs, filterFiles: filterFiles })
    }

    closeExplorerDialog(fieldValue) {
        var newState = { explorerDialogOpen: false };
        if (fieldValue) {
            // var fileName = fieldValue.path.replace(/^.*[\\\/]/, '');
            // var fileNameNoExtension = fileName.replace(/\.[^/.]+$/, "");
            // var path = fieldValue.path.split(fileName).slice(0, -1).join('');
            const { dirPath, moduleName } = this.getDirAndModuleFromPath(fieldValue.path)
            switch (this.state.explorerParameter) {
                case "netParamsPath":
                    newState["netParamsPath"] = dirPath;
                    newState["simConfigPath"] = dirPath;
                    newState["netParamsModuleName"] = moduleName;
                    newState["simConfigModuleName"] = moduleName;
                    newState['netParamsFullPath'] = fieldValue.path
                    newState['simConfigFullPath'] = fieldValue.path
                    break;
                case "simConfigPath":
                    newState["simConfigPath"] = dirPath;
                    newState["simConfigModuleName"] = moduleName;
                    newState['simConfigFullPath'] = fieldValue.path
                    break;
                case "modFolder":
                    newState["modFolder"] = fieldValue.path;
                    break;
                default:
                    throw ("Not a valid parameter!");
            }
        }
        this.setState({ ...newState });
    }

    getDirAndModuleFromPath (fullpath) {
        const fileName = fullpath.replace(/^.*[\\\/]/, '');
        const moduleName = fileName.replace(/\.[^/.]+$/, "");
        const dirPath = fullpath.split(fileName).slice(0, -1).join('');

        return { dirPath, moduleName }
    }

    onNetParamsPathChange(fullpath) {
        const { dirPath, moduleName } = this.getDirAndModuleFromPath(fullpath)
        const newState = { };
        newState["netParamsPath"] = newState["simConfigPath"] = dirPath
        newState["netParamsModuleName"] = newState["simConfigModuleName"] = moduleName;
        newState["netParamsFullPath"] = fullpath;
        newState["simConfigFullPath"] = fullpath;

        this.setState({ ...newState })
    }

    onSimConfigPathChange(fullpath) {
        const { dirPath, moduleName } = this.getDirAndModuleFromPath(fullpath)
        const newState = { };
        newState["simConfigPath"] = dirPath
        newState["simConfigModuleName"] = moduleName;
        newState["simConfigFullPath"] = fullpath;
        this.setState({ ...newState })
    }

    onModFolderPathChange(fullpath) {
        this.setState({ modFolder: fullpath })
    }

    render() {
        const disableLoadMod = this.state.loadMod === '' ? true : !this.state.loadMod
        switch(this.props.mode) {
            case 'IMPORT':
                var content = 
                    <div>
                        <div className="flex-row">
                            <IconButton
                                id="appBarImportFileName"
                                className='flex-row-icon'
                                onClick={() => this.showExplorerDialog('netParamsPath', false, '.py')} 
                                tooltip='File explorer'
                                tooltipPosition={'top-right'}
                            >
                                <FontIcon className={'fa fa-folder-o listIcon'} />
                            </IconButton>
                            <TextField 
                                className="netpyneFieldNoWidth fx-11 no-z-index"
                                value={this.state.netParamsFullPath}
                                onChange={(event) => this.onNetParamsPathChange(event.target.value)}
                                floatingLabelText="NetParams file:"
                                underlineStyle={{borderWidth:'1px'}}
                                errorText={"Only .py files"}
                                errorStyle={{ color: grey400 }}
                                floatingLabelStyle={{color: grey500}}
                            />
                            
                        </div>
                        
                        <div className="flex-row">
                            <IconButton
                                className='flex-row-icon'
                                onClick={() => this.showExplorerDialog('simConfigPath', false, '.py')} 
                                tooltip='File explorer'
                                tooltipPosition={'top-right'}
                            >
                                <FontIcon className={'fa fa-folder-o listIcon'} />
                            </IconButton>
                            <TextField 
                                className="netpyneFieldNoWidth fx-11 no-z-index" 
                                value={this.state.simConfigFullPath} 
                                onChange={(event) => this.onSimConfigPathChange(event.target.value)} 
                                floatingLabelText="SimConfig file:"
                                underlineStyle={{ borderWidth:'1px' }}
                                errorText={"Only .py files"}
                                errorStyle={{color: grey400}}
                                floatingLabelStyle={{color: grey500}}
                            />
                            
                        </div>

                        <div className="flex-row">
                                <IconButton
                                    className='flex-row-icon'
                                    onClick={() => this.showExplorerDialog('modFolder', true, false)} 
                                    tooltip='File explorer'
                                    tooltipPosition={'top-right'}
                                    disabled={disableLoadMod} 
                                >
                                    <FontIcon className={`fa fa-folder-o ${!disableLoadMod && "listIcon"}`} />
                                </IconButton>

                                <TextField 
                                    className="netpyneFieldNoWidth fx-11 no-z-index"
                                    floatingLabelText="Path to mod files"
                                    disabled={disableLoadMod} 
                                    value={this.state.modFolder} 
                                    onClick={event => this.onModFolderPathChange(event.target.value)} 
                                    errorText={"Only mod folders"}
                                    errorStyle={{color: grey400}}
                                />

                        </div>

                        <div className="flex-row">
                            <TextField className="netpyneRightField fx-6 mr-2" floatingLabelText="NetParams variable" value={this.state.netParamsVariable} onChange={(event) => this.setState({ netParamsVariable: event.target.value })} />
                            <TextField className="netpyneRightField fx-6" floatingLabelText="SimConfig variable" value={this.state.simConfigVariable} onChange={(event) => this.setState({ simConfigVariable: event.target.value })} />
                        </div>
                        
                        <SelectField
                            id="appBarImportRequiresMod"
                            className="netpyneField"
                            errorText={ this.state.loadMod === undefined ? "This field is required." : false }
                            errorStyle={{ color: orange500 }}
                            floatingLabelText="Are custom mod files required for this model?"
                            value={this.state.loadMod}
                            onChange={(event, index, value) => this.setState({loadMod: value})}
                        >
                            <MenuItem value={true} primaryText="Yes, this model requires custom mod files" />
                            <MenuItem id="appBarImportRequiresModNo" value={false} primaryText="No, this model only requires NEURON built-in mod files" />
                        </SelectField>

                        <Checkbox
                            disabled={disableLoadMod}
                            className="netpyneCheckbox pt-4"
                            label="Compile mod files"
                            checked={this.state.compileMod}
                            onCheck={() => this.setState((oldState) => ({ compileMod: !oldState.compileMod }) )}
                        />
                        
                        <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} filterFiles={this.state.filterFiles} onRequestClose={(selection) => this.closeExplorerDialog(selection)} />
                        
                    </div>
                    var command = 'netpyne_geppetto.importModel';
                    var message = 'IMPORTING MODEL';
                    var buttonLabel = 'Import'
                    var title = 'Import from Python scripts'
                break;
            case 'EXPORT':
                var content = 
                    <TextField
                        className="netpyneField"
                        hintText="File name"
                        floatingLabelText="File name"
                        value={this.state.fileName}
                        onChange={(e, v) => {this.setState({fileName: v})}}
                    />
                var command = 'netpyne_geppetto.exportHLS';
                var message = 'EXPORTING MODEL';
                var buttonLabel = 'Export'
                var title = 'Export as Python script'
                break
        }
        return (
            <ActionDialog
                command ={command}
                message = {message}
                buttonLabel={buttonLabel}
                args={this.state}
                title={title}
                isFormValid={this.isFormValid}
                {...this.props}
              >
                {content}
            </ActionDialog>
        )
    }
}