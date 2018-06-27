/**
 * Tabbed Drawer resizable component
 * It uses the components DrawerButton and Rnd to create a resizable Tabbed Drawer.
 * 
 *  @author Dario Del Piano
 *  @author Adrian Quintana
 */

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


export default class DeleteDialogBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
            response: false
        };

        this.handleCloseNo = this.handleCloseNo.bind(this);
        this.handleCloseOk = this.handleCloseOk.bind(this);
    };

    componentDidUpdate(prevProps, prevState) {
      if(prevProps.open != this.props.open) {
        this.setState({open: this.props.open});
      }
    }
    
    handleCloseOk() {
        this.props.onDialogResponse(true);
        this.setState({open: false});

    };

    handleCloseNo() {
        this.props.onDialogResponse(false);
        this.setState({open: false});
    };
    
    render() {
        const actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={this.handleCloseNo}
          />,
          <FlatButton
            label="Confirm"
            primary={true}
            keyboardFocused={true}
            onClick={this.handleCloseOk}
          />,
        ];
    
        return (
          <div>
            <Dialog
              title={"Delete "+this.props.textForDialog}
              actions={actions}
              modal={true}
              open={this.state.open}
              onRequestClose={this.handleClose}>
              {"Do you want to remove "+this.props.textForDialog+" ?"}
            </Dialog>
          </div>
        );
    };
}
