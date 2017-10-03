import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
var Utils = require('../../Utils');

export default class NetPyNEField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openHelp:false
        };

    }

    handleOpenHelp = (help) => {
        this.setState({ openHelp: true, helpText: help });
    };

    handleCloseHelp = () => {
        this.setState({ openHelp: false });
    };



    render() {
        var help = Utils.getMetadataField(this.props.id, "help");
        if (help != undefined) {
            // var helpComponent = <div>{help}</div>
            var helpComponent = <div className="helpIcon" onClick={() => this.handleOpenHelp(help)}><i className="fa fa-question" aria-hidden="true"></i>
                <Dialog
                    title="NetPyNE Help"
                    actions={<FlatButton
                        label="Got it"
                        primary={true}
                        keyboardFocused={true}
                        onClick={this.handleCloseHelp}
                    />}
                    modal={true}
                    open={this.state.openHelp}
                    onRequestClose={this.handleCloseHelp}
                >
                    {this.state.helpText}
                </Dialog>
            </div>
        }

        return (
            <div style={this.props.style}>
                <div style={{ float: 'left' }}>
                    {this.props.children}
                </div>
                {helpComponent}
                <div style={{ clear: "both" }}></div>
            </div>
        );
    }
}