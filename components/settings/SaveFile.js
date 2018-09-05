import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
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
        this.options = [
            {label: 'High level specs.', label2: 'netParams and simConfig', state: 'netParams'},
            {label: 'Configuration', label2: 'simConfig.py', state: 'simConfig'},
            {label: 'Data', label2: 'Spikes, traces, etc.', state: 'simData'},
            {label: 'Cells', label2: 'Instanciated Network cells', state: 'netCells'},
            {label: 'Pops', label2: 'Instanciated Network pops', state: 'netPops'},
            {label: 'All', label2: 'Load everything', state: 'loadAll'}
        ]
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
        if (this.props.requestID == 1) {
            var action = 'netpyne_geppetto.exportModel';
        }
        var message = GEPPETTO.Resources.EXPORTING_MODEL;
        this.props.performAction(action, message, this.state)
    }

    render() {
        switch(this.props.requestID) {
            case 1:
                var header =  <CardHeader title="High Level Specification" titleColor={blue500} subtitle="Python file" />
                var content = (
                    <CardText style={{marginTop: -30}}>
                        <TextField className="netpyneField" floatingLabelText="File name" value={this.state.scriptName} onChange={(event) => this.setState({ scriptName: event.target.value })} />
                        <List >
                            {this.options.map((el, index) => {return<ListItem  style={{height: 50, width:'49%', float:index%2==0?'left':'right'}}
                                key={index}
                                leftCheckbox= {<Checkbox onCheck={() => this.setState(({[el.state]: oldState, ...others}) => {return {[el.state]: !oldState}})} checked={this.state[el.state]} />}
                                primaryText={el.label}
                                secondaryText={el.label2}
                                />})
                            }
                        </List>
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