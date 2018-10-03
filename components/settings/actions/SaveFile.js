import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import { blue500 } from 'material-ui/styles/colors';
import Card, {CardHeader, CardText} from 'material-ui/Card';
import Utils from '../../../Utils';

const saveOptions = [
    {label: 'High level specs.', label2: 'netParams', state: 'netParams'},
    {label: 'High level specs.', label2: 'simConfig', state: 'simConfig'},
    {label: 'Cells', label2: 'Instanciated Network cells', state: 'netCells'},
    {label: 'Data', label2: 'Spikes, traces, etc.', state: 'simData'}
]

export default class SaveFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionExecuted: false,
            fileName: 'output',
            netParams: true,
            simConfig: true,
            simData: true,
            netCells: true
        }
        
    }

    componentDidMount () {
        Utils.sendPythonMessage('netpyne_geppetto.doIhaveInstOrSimData', [])
            .then(response => {
                this.setState({disableNetCells: !response['haveInstance'], disableSimData: !response['haveSimData'], netCells:response['haveInstance'], simData: response['haveSimData']})
            }
        )
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
        var action = 'netpyne_geppetto.exportModel'
        var message = GEPPETTO.Resources.EXPORTING_MODEL;
        this.props.performAction(action, message,  this.state)
        this.setState({actionExecuted: true})
    }

    render() {
        return (
            <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                <CardHeader title="High Level Specification" titleColor={blue500} subtitle="Python file" />
                <CardText style={{marginTop: -30}}>
                    <TextField className="netpyneField" floatingLabelText="File name" value={this.state.fileName} onChange={(event) => this.setState({ fileName: event.target.value })} />
                    <List >
                        {saveOptions.map((saveOption, index) => {return<ListItem  style={{height: 50, width:'49%', float:index%2==0?'left':'right'}}
                            key={index}
                            leftCheckbox= {<Checkbox disabled={index==2?this.state.disableNetCells:index==3?this.state.disableNetCells:false} onCheck={() => this.setState(({[saveOption.state]: oldState, ...others}) => {return {[saveOption.state]: !oldState}})} checked={this.state[saveOption.state]}/>}
                            primaryText={saveOption.label}
                            secondaryText={saveOption.label2}
                        />})}
                    </List>
                </CardText>
            </Card>
        )
    }
}