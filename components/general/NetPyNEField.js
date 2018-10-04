import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
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

    setErrorMessage(value) {
        return new Promise((resolve, reject) => {
            if (this.realType == 'func') {
                if (value != "" && value != undefined) {
                    Utils.sendPythonMessage('netpyne_geppetto.validateFunction', [value]).then((response) => {
                        if (!response) {
                            resolve({ errorMsg: 'Not a valid function' })
                        }
                        else {
                            resolve({ errorMsg: '' })
                        }
                    });
                }
                else {
                    resolve({ errorMsg: '' })
                }
            }
            else if (this.realType == 'float') {
                if (isNaN(value)) {
                    resolve({ errorMsg: 'Only float allowed' })
                }
                else {
                    resolve({ errorMsg: '' })
                }
            }
        }
        );
    };

    prePythonSyncProcessing(value){
        if (value == '') {
            if (this.default != undefined) {
                return this.default;
            }
            else if (!this.model.split(".")[0].startsWith('simConfig') || this.model.split(".")[1].startsWith('analysis')) {
                Utils.sendPythonMessage('del netpyne_geppetto.' + this.model)
            }
        }
        return value;
    }

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
            
            if (child.type.name != "SelectField" && child.type.name != 'PythonControlledControlWithPythonDataFetch') {
                extraProps['validate'] = this.setErrorMessage;
                extraProps['prePythonSyncProcessing'] = this.prePythonSyncProcessing;

                var dataSource = Utils.getMetadataField(this.props.id, "suggestions");
                if (dataSource != '') {
                    extraProps['dataSource'] = dataSource;
                }
            }
            
            var floatingLabelText = Utils.getMetadataField(this.props.id, "label");
            extraProps['label'] = floatingLabelText;

            if (child.type.name != "Checkbox") {
                extraProps['floatingLabelText'] = floatingLabelText;
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

            var default_value = Utils.getMetadataField(this.props.id, "default");
            if (default_value != '') {
                extraProps['default'] = default_value;
            }

            var options = Utils.getMetadataField(this.props.id, "options");
            if (options) {
                extraProps['children'] = options.map((name) => (
                    <MenuItem
                        id={name}
                        key={name}
                        value={name}
                        primaryText={name}
                    />
                ));
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
