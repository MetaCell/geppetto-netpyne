import React, { Component } from 'react';
var Utils = require('../../Utils');

export default class NetPyNEField extends Component {
    constructor(props) {
        super(props);

    }

    showHelp(help) {
        alert(help)
    }

    render() {
        var help = Utils.getMetadataField(this.props.id, "help");
        if (help != undefined) {
            // var helpComponent = <div>{help}</div>
            var helpComponent = <div style={{ marginTop: '40px', float: 'left', fontSize: '16px' }} onClick={() => this.showHelp(help)}><i className="fa fa-question" aria-hidden="true"></i></div>
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