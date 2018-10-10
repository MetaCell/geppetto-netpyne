import React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import Card, { CardHeader, CardText } from 'material-ui/Card';

export default class ImportExportSonata extends React.Component {
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

    performAction() {
        this.setState({actionExecuted: true})
    }

    render() { 
        switch(this.props.requestID) { // maybe use it for import/export option
            case 4: 
                var header =  <CardHeader title="Import from Sonata" subtitle="Sonata file" titleColor={blue500}/>
                var content = <CardText style={{marginTop: -30}}><h3>Under construction...</h3></CardText>
                break
            case 7:
                var header = <CardHeader title="Export to Sonata" subtitle="Sonata file" titleColor={blue500} />
                var content = <CardText style={{marginTop: -30}}><h3>Under construction...</h3></CardText>
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