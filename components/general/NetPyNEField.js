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
            var extraProps = {}

            var floatingLabelText = Utils.getMetadataField(this.props.id, "label");
            extraProps['label'] = floatingLabelText;
            extraProps['floatingLabelText'] = floatingLabelText;

            var dataSource = Utils.getMetadataField(this.props.id, "suggestions");
            if (dataSource != '') {
                extraProps['dataSource'] = dataSource;
            }

            var type = Utils.getHTMLType(this.props.id);
            if (type != '') {
                extraProps['type'] = type;
            }

            if (child.type.name == "PythonControlledControl") {
                var realType = Utils.getMetadataField(this.props.id, "type");
                extraProps['realType'] = realType;
            }

            var hintText = Utils.getMetadataField(this.props.id, "hintText");
            if (hintText != '') {
                extraProps['hintText'] = hintText;
            }

            return React.cloneElement(child, extraProps);
        });

        var classes = [];
        if (!this.props.noStyle) {
            classes.push("netpyneField");
        }
        if (this.props.className) {
            classes.push(this.props.className);
        }
        if (classes.length > 0) {
            var className = { className: classes.join(" ") }
        }

        return (
            <div style={this.props.style} {...className}>
                <div style={{ float: 'left' }}>
                    {childWithProp}
                </div>
                {helpComponent}
                <div style={{ clear: "both" }}></div>
            </div>
        );
    }
}