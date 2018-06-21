import React from 'react';
import Tree from '../../../../js/components/interface/tree/Tree'
import Utils from '../../Utils';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import { changeNodeAtPath, walk, addNodeUnderParent } from 'react-sortable-tree';
import Dialog from 'material-ui/Dialog';
require('./FileBrowser.less')

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

        Utils
            .sendPythonMessage('netpyne_geppetto.getDirList', [path])
            .then((dirList) => {
                if (treeData != [] && treeData.length > 0) {
                    rowInfo.node.children = dirList;
                    rowInfo.node.expanded = true;
                    rowInfo.node.load = true;
                    var newTreeData = changeNodeAtPath({ treeData: treeData, path: rowInfo.path, newNode: rowInfo.node, getNodeKey: ({ treeIndex }) => treeIndex });
                }
                else {
                    var newTreeData = dirList;
                }
                this.setState({ selection: undefined })
                this.refs.tree.updateTreeData(newTreeData);
            });
    }


    handleClickVisualize(event, rowInfo) {
        if (rowInfo.node.load == false) {
            this.getDirList(this.refs.tree.state.treeData, rowInfo);
        }
        else if (rowInfo.node.children == undefined && rowInfo.node.load == undefined) {
            this.setState({ selection: rowInfo.node })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.open == false && this.props.open) {
            this.getDirList([]);
        }
    }

    render() {
        const actions = [
            <FlatButton
                label={'CANCEL'}
                onTouchTap={(event) => this.props.onRequestClose()}
                style={{ marginRight: 16 }}
            />,
            <RaisedButton
                primary
                label={'SELECT'}
                onTouchTap={(event) => this.props.onRequestClose(this.state.selection)}
                disabled={!this.state.selection}
            />
        ];

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                bodyStyle={{ overflow: 'auto' }}
                actions={actions}
            >
                <div style={{marginBottom: '15px'}}>
                    These paths are relative to 
                    {window.isDocker ? " the folder you shared with docker (your mounted volume)" :
                        <span style={{border: "1px solid rgba(0, 0, 0, 0.1)", borderRadius: "3px", backgroundColor: "rgba(0, 0, 0, 0.05)", padding: "2px", margin: "4px"}}>{window.currentFolder}</span>}
                </div>
                < Tree
                    id="TreeContainerCutting"
                    style={{ width: "100%", height: "500px", float: 'left', marginTop: "-5px" }}
                    treeData={[]}
                    handleClick={this.handleClickVisualize}
                    rowHeight={30}
                    ref="tree"
                />
            </Dialog>
        )
    }
};




