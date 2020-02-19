import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { orange500 , grey400, grey500 } from 'material-ui/styles/colors';

import ActionDialog from './ActionDialog';

export default class UploadDownloadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...this.initialState() }
    }

    initialState () {
        return {
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
            // this.setState({
            //     selectedFile: files,
            //     loaded:0
            // })
        }
    }

    render() {
        
        switch(this.props.mode) {
            case 'UPLOAD':
                var content = 
                    <div>
                        <div className="flex-row">
                            <div class="form-group files">
                                <label>Upload Your File </label>
                                <input 
                                    type="file" 
                                    class="form-control" 
                                    multiple
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
                    <TextField
                        className="netpyneField"
                        hintText="File name"
                        floatingLabelText="Something"
                        value={"more to come"}
                        onChange={(e, v) => {}}
                    />
                var command = 'netpyne_geppetto.download_files';
                var message = 'DOWNLOADING FILES';
                var buttonLabel = 'DOWNLOAD'
                var title = 'Download files'
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