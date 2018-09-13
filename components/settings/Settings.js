import React from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Card from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';

const SettingsDialog = React.createClass({


    getInitialState() {

        return  {
            openSettings: this.props.settings.openSettings,
            fastForwardInstantiation: this.props.settings.fastForwardInstantiation,
            fastForwardSimulation: this.props.settings.fastForwardSimulation
        }
    },

    componentDidUpdate(prevProps) {
        if (this.props.settings.openSettings != prevProps.settings.openSettings && this.props.settings.openSettings) {
            this.setState({
                openSettings: true
            });
        }
    },

    performAction(){
        this.setState({openSettings: false})
        this.props.updateSettings({
            openSettings: false, 
            fastForwardInstantiation: this.state.fastForwardInstantiation,
            fastForwardSimulation: this.state.fastForwardSimulation
        })
        
    },

    render() {
        return (
            <Dialog
                title={"Settings"}
                open={this.state.openSettings}
                actions={<RaisedButton primary label={'OK'} onTouchTap={this.performAction} />}
            >
                <Tabs style={{ paddingTop: 10 }} value={this.state.currentTab} onChange={(value) => this.setState({ currentTab: value })} tabTemplateStyle={{ float: 'left', height: '100%' }} >
                    <Tab value="General" label={'General'}>
                        <Card style={{ padding: 10, float: 'left', width: '100%' }}>
                            <Checkbox className="netpyneCheckbox" label="Fast-forward Instantiation" disabled={this.state.fastForwardSimulation} checked={this.state.fastForwardInstantiation} onCheck={() => this.setState((oldState) => {return {fastForwardInstantiation: !oldState.fastForwardInstantiation}})}/>
                            <Checkbox className="netpyneCheckbox" label="Fast-forward Simulation" checked={this.state.fastForwardSimulation} onCheck={() => this.setState((oldState) => {return {fastForwardSimulation: !oldState.fastForwardSimulation, fastForwardInstantiation: !oldState.fastForwardSimulation?true:oldState.fastForwardInstantiation}})}/>
                        </Card>
                    </Tab>
                </Tabs>
            </Dialog>
        );
    },
})
export default SettingsDialog;