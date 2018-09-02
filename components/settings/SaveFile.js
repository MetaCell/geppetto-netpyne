import React from 'react';
import TextField from 'material-ui/TextField';
import { blue500 } from 'material-ui/styles/colors';
import Card, {CardHeader, CardText} from 'material-ui/Card';

export default class SaveFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionExecuted: false,
            jsonModelFolder: "",
            scriptName: 'script_output',
        }
    }

    componentDidUpdate() {
        if (this.props.actionRequired && !this.state.actionExecuted) {
            this.performAction()
            this.setState({actionExecuted: true})
        } else if (!this.props.actionRequired && this.state.actionExecuted) {
            this.setState({actionExecuted: false})
        }
    }

    performAction() {
        if (this.props.requestID == 6) {
            var action = 'netpyne_geppetto.exportModel';
        }
        else if (this.props.requestID == 5) {
            var action = 'netpyne_geppetto.generateScript';
        }
        var message = GEPPETTO.Resources.EXPORTING_MODEL;
        this.props.performAction(action, message, this.state)
    }

    render() {
        switch(this.props.requestID) {
            case 5:
                var header =  <CardHeader title="High Level Specification" titleColor={blue500} subtitle="Python file" />
                var content = (
                    <CardText style={{marginTop: -30}}>
                        <TextField className="netpyneField" floatingLabelText="File name" value={this.state.scriptName} onChange={(event) => this.setState({ scriptName: event.target.value })} />
                        <span style={{ marginTop: 20, float: 'left' }}>* The file will be saved in the current working directory (where you initialized NetPyNE-UI)</span>
                    </CardText>
                )
                break;
            case 6:
                var header =  <CardHeader title="High Level Specification" titleColor={blue500} subtitle="JSON file" />
                var content = (
                    <CardText style={{marginTop: -30}}> 
                        <span style={{ marginTop: 20, float: 'left' }}>* Go to:  - Configuration Tab > Save Configuration -  to select data and formats to be saved.</span>
                    </CardText>
                )
                break;
            default:
                var content = <div></div>
        }
        
        return (
            <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                {header}
                {content}
            </Card>
        )
    }
}