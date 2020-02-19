import React from 'react';
import Tree from '../../../../js/components/interface/tree/Tree'
import Utils from '../../Utils';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import { changeNodeAtPath } from 'react-sortable-tree';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

export default class FileBrowser extends React.Component {

    constructor(props) {
        super(props);
        this.handleClickVisualize = this.handleClickVisualize.bind(this);

        this.state = {};
    }

    getDirList(treeData, rowInfo) {
        if (rowInfo != undefined) {
            var path = rowInfo.node.path;
        }
        else{
            var path = ""
        }

        Utils
            .evalPythonMessage('netpyne_geppetto.getDirList', [path, this.props.exploreOnlyDirs, this.props.filterFiles])
            .then((dirList) => {
                if (treeData != [] && treeData.length > 0) {
                    rowInfo.node.children = dirList;
                    rowInfo.node.expanded = true;
                    rowInfo.node.load = true;
                    var newTreeData = changeNodeAtPath({ 
                        treeData: treeData, 
                        path: rowInfo.path, 
                        newNode: rowInfo.node, 
                        getNodeKey: ({ treeIndex }) => treeIndex 
                    });
                }
                else {
                    var newTreeData = dirList;
                }
                if (!this.props.exploreOnlyDirs || rowInfo == undefined){
                    this.setState({ selection: undefined })
                }
                else{
                    this.setState({ selection: rowInfo.node })
                }
                this.refs.tree.updateTreeData(newTreeData);
            });
    }


    handleClickVisualize(event, rowInfo) {
        if (rowInfo.node.load == false) {
            this.getDirList(this.refs.tree.state.treeData, rowInfo);
        }
        else if (this.props.exploreOnlyDirs || (rowInfo.node.children == undefined && rowInfo.node.load == undefined)) {
            this.setState({ selection: rowInfo.node })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.open == false && this.props.open) {
            this.getDirList([]);
        }
    }

    handleMoveUp (reset=false) {
        var path = this.refs.tree.state.treeData[0].path.split("/").slice(0, -2).join('/') || '/'
        
        if (reset) {
            path = window.currentFolder
        }

        this.currentFolder = path
        this.getDirList([], { node: { path }});
    }

    render() {
        const actions = [
            <FlatButton
                label={'CANCEL'}
                onClick={(event) => this.props.onRequestClose()}
                style={{ marginRight: 16 }}
            />,
            <RaisedButton
                id="browserAccept"
                primary
                label={'SELECT'}
                onClick={(event) => { this.props.onRequestClose(this.state.selection)}}
                disabled={!this.state.selection}
            />
        ];
        
        var selectMessage=this.props.exploreOnlyDirs?"Select a folder. ":"Select a file. ";
        return (
            
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                bodyStyle={{ overflow: 'auto' }}
                actions={actions}
            >
                <div style={{marginBottom: '15px'}}>
                    <b>{selectMessage}</b>
                    These paths are relative to:<br/>
                    {
                        window.isDocker 
                            ? " the folder you shared with docker (your mounted volume)" 
                            : (
                                <div className="flex-row fx-center ">
                                    <span className="code-p w-80">{this.currentFolder || window.currentFolder}</span>
                                    <IconButton
                                        disableTouchRipple
                                        className='simple-icon mrg-2'
                                        onClick={() => {this.handleMoveUp()}} 
                                        tooltip='Enclosing Folder'
                                        tooltipPosition={'top-right'}
                                    >
                                        <FontIcon className={'fa fa-level-up listIcon'} />
                                    </IconButton>
                                    <IconButton
                                        disableTouchRipple
                                        className='simple-icon mrg-2'
                                        onClick={() => {this.handleMoveUp(true)}} 
                                        tooltip='Home folder'
                                        tooltipPosition={'top-right'}
                                    >
                                        <FontIcon className={'fa fa-home listIcon'} />
                                    </IconButton>
                                </div>
                            )
                    }
                </div>
                < Tree
                    id="TreeContainerCutting"
                    style={{ width: "100%", height: "400px", float: 'left'}}
                    treeData={[]}
                    handleClick={this.handleClickVisualize}
                    rowHeight={30}
                    activateParentsNodeOnClick={this.props.exploreOnlyDirs}
                    ref="tree"
                />
            </Dialog>
        )
    }
};

FileBrowser.defaultProps = {
    exploreOnlyDirs: false,
    filterFiles: false
};



