import React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import Card, { CardHeader, CardText } from 'material-ui/Card';

export default class DeleteWork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionExecuted: false,
        }
    }

    componentDidUpdate() {
        if (this.props.actionRequired && !this.state.actionExecuted) {
            this.performAction()
        }
        else if (!this.props.actionRequired && this.state.actionExecuted) {
            this.setState({actionExecuted: false})
        }
    }

    performAction() { // send here the message
        var action = 'netpyne_geppetto.deleteModel';
        var message = "DELETING MODEL";
        this.props.performAction(action, message, {tab:'define', ...this.state})
        this.setState({actionExecuted: true})
    }

    render() { 
        switch(this.props.requestID) { // maybe use it for import/export option
            case 8: 
                var header =  <CardHeader title="Clear" subtitle="Delete model" titleColor={blue500}/>
                var content = <CardText style={{marginTop: -30}}><h4>The model will be deleted</h4></CardText>
                break
            default:
                var header = <CardHeader title="" subtitle="" titleColor={blue500} />
                var content = <CardText style={{marginTop: -30}}></CardText>
        }
        return (
            <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                {header}
                {content}
            </Card>
        )
    }
}