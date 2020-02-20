import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { orange500 , grey400, grey500 } from 'material-ui/styles/colors';

import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import FileBrowser from '../../general/FileBrowser';

const styles = {
    input: {
        outline: 'none',
        border: 'none',
        boxShadow: 'none',
        '&:focus': {
            outline: 'none',
            border: 'none',
            boxShadow: 'none',
        }
    }
}
export default class UploadDownloadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...this.initialState() }
        this.message = ''
    }
    
    initialState () {
        return {
            open: true,
            openSnackBar: false,
            filePath: '',
            explorerDialogOpen: false
        }
    }

    async uploadFiles () {
        const { files } = this.state
        const formData = new FormData()
        var data = {}
        
        this.setState({ open: false })
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'UPLOADING FILES');

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('file', files.item(i))
            }

            try {
                const response = await fetch('/uploads', { method: "POST", body: formData })
                if (response.status === 200) {
                    this.message = response.statusText
                }
                else {
                    this.message = "No file uploaded."
                    console.warn(`Response error uploading files. Status code ${response.status}. Message ${response.statusText}`)
                }
            }
            catch (error) {
                this.message = "Server error. Please try again."
                console.warn(error)
            }
            finally {
                GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                this.props.openSnackBar(this.message)
                this.props.onRequestClose()
            }
        }
    }


    async downloadAsCSV () {
        this.props.onRequestClose()
        try {
            const response = await fetch(`/downloads?uri=${this.state.filePath}`)
          
            if (response.status === 200) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `download.tar.gz`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                this.message = "Files downloaded."
            }
            else if (response.status === 400) {
                this.message = response.statusText
            }
            else {
                this.message = "Error downloading files."
                console.log("Error code")
            }
        }
        catch (error) {
            this.message = "Error downloading files."
            console.error(error)
        }
        finally {
            this.props.openSnackBar(this.message)
            this.props.onRequestClose()
        }
    }

    maxSelectFile () {
        return true
    }
    checkMimeType (files) {
        return true
    }
    checkFileSize () {
        return true
    }

    onChangeHandler = event => {
        var files = event.target.files
        if(this.maxSelectFile(files) && this.checkMimeType(files) && this.checkFileSize(files)){ 
            for (let i = 0; i < files.length; i++) {
                console.log(files.item(i))
            }
            this.setState({ files })
        }
    }

    onPathChange (filePath) {
        this.setState({ filePath })
    }

    closeExplorerDialog(fieldValue) {
        this.setState({ explorerDialogOpen: false, filePath: fieldValue.path })
    }

    showExplorerDialog(filterFiles='') {
        this.setState({ explorerDialogOpen: true, filterFiles })
    }

    render() {
        
        switch(this.props.mode) {
            case 'UPLOAD':
                var content = 
                    <div>
                        <div className="flex-row">
                            <div >
                                <input 
                                    multiple
                                    type="file" 
                                    style={{ ...styles.input }}
                                    className="form-control" 
                                    onChange={this.onChangeHandler}
                                />
                            </div> 
                        </div>
                        
                        
                    </div>
                var command = 'netpyne_geppetto.upload_files';
                var message = 'UPLOADING FILES';
                var buttonLabel = 'Upload'
                var title = 'Upload files'
                break;
            case 'DOWNLOAD':
                var content = 
                    <div>
                        <div className="flex-row">
                            <IconButton
                                className='flex-row-icon'
                                onClick={() => this.showExplorerDialog('.py')} 
                                tooltip='File explorer'
                                tooltipPosition={'top-right'}
                            >
                                <FontIcon className={'fa fa-folder-o listIcon'} />
                            </IconButton>
                            <TextField 
                                className="netpyneFieldNoWidth fx-11 no-z-index"
                                value={this.state.filePath}
                                onChange={(event) => this.onPathChange(event.target.value)}
                                floatingLabelText="Files:"
                                underlineStyle={{borderWidth:'1px'}}
                                errorText={"Select files to download"}
                                errorStyle={{ color: grey400 }}
                                floatingLabelStyle={{color: grey500}}
                            />
                            
                        </div>
                        <FileBrowser 
                            open={this.state.explorerDialogOpen}
                            exploreOnlyDirs={false}
                            filterFiles={this.state.filterFiles}
                            onRequestClose={(selection) => this.closeExplorerDialog(selection)}
                        />
                    </div>
                    
                var command = 'netpyne_geppetto.download_files';
                var message = 'DOWNLOADING FILES';
                var buttonLabel = 'DOWNLOAD'
                var title = 'Download files'
                break
        }

        var actions = [
            <FlatButton 
                primary
                label="CANCEL"
                onClick={() => { this.props.onRequestClose()}}
                style={{marginRight: 10}}
            />,
            <RaisedButton
                primary
                id="appBarPerformActionButton"
                label={buttonLabel}
                disabled={this.props.mode === 'UPLOAD' ? !this.state.files : !this.state.filePath}
                onClick={() => this.props.mode === 'UPLOAD' ? this.uploadFiles() : this.downloadAsCSV()}
            />
        ];

        return (
            <div>
                <Dialog
                    title={title}
                    modal={true}
                    actions={actions}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ whiteSpace: "pre-wrap" }}
                    {...this.props}
                    open={this.props.open && this.state.open}
                    >
                    {content}
                </Dialog>
            </div>
            
        )
    }
}