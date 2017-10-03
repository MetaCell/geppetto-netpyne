import React, { Component } from 'react';
import Slider from 'material-ui/Slider';

/**
 * The slider bar can have a set minimum and maximum, and the value can be
 * obtained through the value parameter fired on an onChange event.
 */
export default class NetPyNESlider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0.5
        };
    }

    handleSlider = (event, value) => {
        this.setState({ value: value });

        this.props.onChange(event, null, value);
    };



    render() {
        return (
            <div>
                <p>
                    <span>{this.props.preText}</span>
                    <span>{this.state.value}</span>
                    <span>{this.props.proText}</span>
                </p>
                <Slider
                    {...this.props}
                    value={this.state.value}
                    onChange={this.handleSlider}
                />
                
            </div>
        );
    }
}