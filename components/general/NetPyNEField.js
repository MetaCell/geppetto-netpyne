import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Utils from '../../Utils';

export default class NetPyNEField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openHelp: false
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
        if (help != undefined && help != '') {
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

        const childWithProp = React.Children.map(this.props.children, (child) => {
            var floatingLabelText = Utils.getMetadataField(this.props.id, "label");
            var dataSource = Utils.getMetadataField(this.props.id, "suggestions");
            var type = Utils.getHTMLType(this.props.id);
            var hintText=Utils.getMetadataField(this.props.id, "hintText");
            return React.cloneElement(child, { label: floatingLabelText, floatingLabelText: floatingLabelText, dataSource: dataSource, type: type, hintText:hintText });
        });

        return (
            <div style={this.props.style} className={"netpyneField " + this.props.className}>
                <div style={{ float: 'left' }}>
                    {childWithProp}
                </div>
                {helpComponent}
                <div style={{ clear: "both" }}></div>
            </div>
        );
    }
}