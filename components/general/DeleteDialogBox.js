/**
 * Tabbed Drawer resizable component
 * It uses the components DrawerButton and Rnd to create a resizable Tabbed Drawer.
 * 
 *  @author Dario Del Piano
 *  @author Adrian Quintana
 */

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FlatButton from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class DeleteDialogBox extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      open: props.open,
      response: false
    };
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.open != this.props.open) {
      this.setState({ open: this.props.open });
    }
  }
    
  render () {
    const actions = <React.Fragment>
      <FlatButton
        id="confirmCancel"
        color="primary"
        onClick={() => this.props.onDialogResponse(false)}
      >Cancel</FlatButton>
      <FlatButton
        id="confirmDeletion"
        color="primary"
        keyboardFocused={true}
        onClick={() => this.props.onDialogResponse(true)}
      >Confirm</FlatButton>
    </React.Fragment>;
    
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}>
          <DialogTitle id="alert-dialog-slide-title">{"Delete " + this.props.textForDialog}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {"Do you want to remove " + this.props.textForDialog + " ?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {actions}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
