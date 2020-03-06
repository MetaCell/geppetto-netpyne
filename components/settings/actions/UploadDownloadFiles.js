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
            downloadPaths: [],
            downloadPathsDisplayText: '',
            explorerDialogOpen: false,
            uploadFiles: ''
        }
    }

    async uploadFiles () {
        const { uploadFiles } = this.state
        const formData = new FormData()
        var data = {}
        
        this.setState({ open: false })
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'UPLOADING FILES');

        if (uploadFiles.length > 0) {
            for (let i = 0; i < uploadFiles.length; i++) {
                formData.append('file', uploadFiles.item(i))
            }

            try {
                const response = await fetch('uploads', { method: "POST", body: formData })
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

    generateUrl () {
        const { downloadPaths, downloadPathsDisplayText } = this.state

        var url = "downloads"
        var downloadFileName = "download.tar.gz"

        if (downloadPaths.length > 0) {
            downloadPaths.forEach((path, index) => url += `${index === 0 ? '?' : '&'}uri=${path}`)
            if (downloadPaths.length === 1) {
                downloadFileName = downloadPaths[0].split('/').pop()
            }
        }
        else if (downloadPathsDisplayText) {
            url += `?uri=${downloadPathsDisplayText}`
        }
        else {
            url = ''
            downloadFileName = ''
        }
        return { url, downloadFileName }
    }

    downloadBlob(blob, fileName) {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }


    async downloadFiles () {
        const { url, downloadFileName } = this.generateUrl()

        if (!url) {
            this.props.onRequestClose()
            return
        }
        
        try {
            const response = await fetch(url)
          
            if (response.status === 200) {
                const blob = await response.blob()
                this.downloadBlob(blob, downloadFileName)
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

    maxSelectFile (files) {
        return true
    }
    checkMimeType (files) {
        return true
    }
    checkFileSize (files) {
        return true
    }

    onUploadFileArrayChange = event => {
        var files = event.target.files
        if(this.maxSelectFile(files) && this.checkMimeType(files) && this.checkFileSize(files)){ 
            this.setState({ uploadFiles: files })
        }
    }

    closeExplorerDialog(selectedNodes) {
        const state = { explorerDialogOpen: false }
        if (selectedNodes) {
            state.downloadPaths = Object.values(selectedNodes).map(s => s.path)
            state.downloadPathsDisplayText = Object.values(selectedNodes).map(s => s.path.split('/').pop()).join(' - ')
        } 
        this.setState({ ...state })
    }

    showExplorerDialog(filterFiles='') {
        this.setState({ explorerDialogOpen: true, filterFiles })
    }

    changeDownloadFilePathsDisplayText(text) {
        this.setState({
            downloadPaths: [text],
            downloadPathsDisplayText: text

        })
    }
    

    render() {
        const { mode } = this.props
        
        switch(mode) {
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
                                    onChange={this.onUploadFileArrayChange}
                                />
                                
                            </div> 
                        </div>
                        <p className="mt-2">Accept: .py .zip .gz .tar.gz .pdf .txt .xls .png .jpeg</p>
                    </div>

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
                                value={this.state.downloadPathsDisplayText}
                                onChange={event => this.changeDownloadFilePathsDisplayText(event.target.value)}
                                floatingLabelText="Files:"
                                underlineStyle={{borderWidth:'1px'}}
                                errorText={"Select files to download"}
                                errorStyle={{ color: grey400 }}
                                floatingLabelStyle={{color: grey500}}
                            />
                            
                        </div>
                    </div>
                    
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
                disabled={mode === 'UPLOAD' ? !this.state.uploadFiles : this.state.downloadPaths.lenght === 0 || !this.state.downloadPathsDisplayText}
                onClick={() => mode === 'UPLOAD' ? this.uploadFiles() : this.downloadFiles()}
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
                <FileBrowser 
                    open={this.state.explorerDialogOpen}
                    exploreOnlyDirs={false}
                    filterFiles={this.state.filterFiles}
                    toggleMode
                    onRequestClose={(multiSelection) => this.closeExplorerDialog(multiSelection)}
                />
            </div>
            
        )
    }
}