import React from 'react';
import Tree from 'geppetto-client/js/components/interface/tree/Tree'
import Utils from '../../Utils';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FontIcon from '@material-ui/core/Icon';
import { walk, changeNodeAtPath } from 'react-sortable-tree';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class FileBrowser extends React.Component {

  constructor (props) {
    super(props);
    this.handleClickVisualize = this.handleClickVisualize.bind(this);

    this.state = {};
  }

  getDirList (treeData, rowInfo) {
    if (rowInfo != undefined) {
      var path = rowInfo.node.path;
    } else {
      var path = ""
    }

    Utils
      .evalPythonMessage('netpyne_geppetto.getDirList', [path, this.props.exploreOnlyDirs, this.props.filterFiles])
      .then(dirList => {
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
        } else {
          var newTreeData = dirList;
        }
        if (!this.props.exploreOnlyDirs || rowInfo == undefined){
          this.setState({ selection: undefined })
        } else {
          this.setState({ selection: rowInfo.node })
        }
        this.refs.tree.updateTreeData(newTreeData);
      });
  }


  handleClickVisualize (event, rowInfo) {
    if (rowInfo.node.load == false) {
      this.getDirList(this.refs.tree.state.treeData, rowInfo);
    } else if (this.props.exploreOnlyDirs || (rowInfo.node.children == undefined && rowInfo.node.load == undefined)) {
      this.setState({ selection: rowInfo.node })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.open == false && this.props.open) {
      this.getDirList([]);
    }
  }
  getSelectedFiles () {
    const nodes = {}
    if (!this.refs.tree) {
      return nodes
    }
    walk({
      treeData: this.refs.tree.state.treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: true,
      callback: rowInfoIter => {
        if (rowInfoIter.node.active) {
          nodes[rowInfoIter.treeIndex] = rowInfoIter.node
        }
      }
    });

    return nodes
  }


  handleMoveUp (reset = false) {
    var path = this.refs.tree.state.treeData[0].path.split("/").slice(0, -2).join('/') || '/'

    if (reset) {
      path = window.currentFolder
    }

    this.currentFolder = path
    this.getDirList([], { node: { path } });
  }

  disableSelectButton () {
    if (this.props.toggleMode) {
      if (Object.keys(this.getSelectedFiles()).length > 0) {
        return false
      }
    }
    if (this.state.selection) {
      return !this.state.selection.active
    }
    return true
  }

  onCancelFileBrowser () {
    this.currentFolder = window.currentFolder
    this.props.onRequestClose()
  }

  render () {
    const actions = [
      <Button
        label={'CANCEL'}
        key="CANCEL"
        onClick={event => this.props.onClose()}
        style={{ marginRight: 16 }}
      />,
      <Button
        id="browserAccept"
        variant="contained"
        key="SELECT"
        color="primary"
        label={'SELECT'}
        onClick={event => this.props.onClose(this.state.selection)}
        disabled={!this.state.selection}
      />
    ];

    var selectMessage = this.props.exploreOnlyDirs ? "Select a folder. " : "Select a file. ";
    return (
            
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
      >


        <DialogTitle id="alert-dialog-title">{selectMessage}</DialogTitle>
        <DialogContent style={{ overflow: 'auto' }}>

          <DialogContentText id="alert-dialog-description">
            <div style={{ marginBottom: '15px' }}>
              <b>{selectMessage}</b>
      These paths are relative to:<br/>
              <div className="flex-row fx-center ">
                <span className="code-p w-80">{this.currentFolder || window.currentFolder}</span>
                <IconButton
                  id="file-browser-level-up"
                  disableTouchRipple
                  className='simple-icon mrg-2'
                  onClick={() => {
                    this.handleMoveUp()
                  }}
                  tooltip='Enclosing Folder'
                  tooltipPosition={'top-right'}
                >
                  <FontIcon className={'fa fa-level-up listIcon'} />
                </IconButton>
                <IconButton
                  disableTouchRipple
                  className='simple-icon mrg-2'
                  onClick={() => {
                    this.handleMoveUp(true)
                  }}
                  tooltip='Home folder'
                  tooltipPosition={'top-right'}
                >
                  <FontIcon className={'fa fa-home listIcon'} />
                </IconButton>
              </div>
            </div>
          </DialogContentText>
          < Tree
            id="TreeContainerCutting"
            style={{ width: "100%", height: "400px", float: 'left' }}
            treeData={[]}
            handleClick={this.handleClickVisualize}
            rowHeight={30}
            toggleMode={!!this.props.toggleMode}
            activateParentsNodeOnClick={this.props.exploreOnlyDirs}
            ref="tree"
          />
        </DialogContent>
        <DialogActions>
          { actions }
        </DialogActions>


      </Dialog>
    )
  }
}

FileBrowser.defaultProps = {
  exploreOnlyDirs: false,
  filterFiles: false
};


