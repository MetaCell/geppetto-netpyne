import React from 'react';
import Dialog from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {pink400} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Utils from '../../Utils';

export default class NewTransition extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
            haveInstData: false,
            parallelSimulation: false
        };
    }

    componentDidUpdate (prevProps, prevState) {
        console.log(1)
        if (this.props.clickOnTab!=prevProps.clickOnTab) {
            console.log(2)
            if (this.props.tab!=prevProps.tab && this.props.tab=='simulate') {
                console.log(3)
                if (!this.state.haveInstData) {
                    console.log(4)
                    Utils.sendPythonMessage('netpyne_geppetto.doIhaveInstOrSimData', [])
                        .then(response => {if (response.constructor.name=='Array') this.instantiate({usePrevInst: response[0]})})
                }
                else {
                    console.log(5)
                    console.log("Using prev Instance")
                    this.instantiate({usePrevInst: true})
                }
            }
        }
    }

    instantiate = (args) => {
        console.log(1)
        GEPPETTO.CommandController.log("The NetPyNE model is getting instantiated...");
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.INSTANTIATING_MODEL);
        console.log(2)
        Utils.sendPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [args])
            .then(response => {
                console.log(3)
                var parsedResponse = JSON.parse(response);
                if (!this.processError(parsedResponse)) {
                    console.log(4)
                    if (!args.usePrevInst) this.props.handleDeactivateInstanceUpdate(true)
                    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL); //keep this sequence has it is
                    console.log(6)
                    this.setState({haveInstData: true})
                    //this.refs.canvas.displayAllInstances();
                    GEPPETTO.Manager.loadModel(parsedResponse);
                    GEPPETTO.CommandController.log("The NetPyNE model instantiation was completed");
                    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                    console.log(7)
                }
        });
    }

    simulate = () => {
        this.setState({openDialog: false})
        GEPPETTO.CommandController.log("The NetPyNE model is getting simulated...");
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.RUNNING_SIMULATION);
        Utils.sendPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [{usePrevInst: this.props.freezeInstance, parallelSimulation: this.state.parallelSimulation, cores:this.state.cores}])
            .then(response => {
                var parsedResponse = JSON.parse(response)
                if (!this.processError(parsedResponse)) {
                    this.props.handleDeactivateSimulationUpdate(true)
                    if (!this.props.freezeInstance) this.props.handleDeactivateInstanceUpdate(true)
                    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
                    //this.refs.canvas.displayAllInstances();
                    GEPPETTO.Manager.loadModel(parsedResponse);
                    GEPPETTO.CommandController.log("The NetPyNE model simulation was completed");
                    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            }
        });    
    }

    processError(parsedResponse) {
        if (parsedResponse.hasOwnProperty("type") && parsedResponse['type'] == 'ERROR') {
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            this.setState({ openDialog: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] })
            return true;
        }
        return false;
    }

    cancelTransition = () => {
        this.closeTransition();
        if (this.props.cancelTransition) {
            this.props.cancelTransition();
        }
    }
    
    closeTransition = () => {
        this.setState({ openDialog: false });
    }
    
    render () {
        var children = this.state.errorDetails
        var title = this.state.errorMessage?this.state.errorMessage:"NetPyNE";
        
        if (this.state.openDialog) {
            if (this.state.errorMessage==undefined) {
                children = (
                    <div>
                        <div>"We are about to instantiate and simulate your network, this could take some time."</div>)
                        <Checkbox label="Run parallel simulation" checked={this.state.parallelSimulation} onCheck={() => this.setState((oldState) => {return {parallelSimulation: !oldState.parallelSimulation}})} style={{ marginTop: '35px' }} id="runParallelSimulation" />
                        <TextField floatingLabelText="Number of cores" onChange={(event) => this.setState({ cores: event.target.value })} className="netpyneRightField"  type="number"/>
                    </div>
                )
                var actions = [<FlatButton label="CANCEL" onClick={()=>{this.cancelTransition()}} primary={true} key={"cancelActionBtn"} />, <FlatButton label="Simulate" onClick={()=>this.simulate()} id={"okRunSimulation"} primary={true} keyboardFocused={true} key={"runSimulationButton"} />];
            }
            else var actions = <FlatButton label="CANCEL" onClick={()=>{this.cancelTransition()}} key={"cancelActionBtn"} primary={true} />
        }

        if (this.props.tab=='simulate' && this.state.haveInstData) {
            if (!this.props.freezeInstance) {var refreshInstanceButton = <FloatingActionButton onClick={()=>this.instantiate({usePrevInst: false})} key={"refreshInstanceButton"} iconStyle={{color:pink400}} backgroundColor="#ffffff" iconClassName="fa fa-refresh" style={{position: 'absolute', right: 34, top: 50}}/>} else var refreshInstanceButton = <div></div>
            if (!this.props.freezeSimulation) {var refreshSimulationButton = <FloatingActionButton onClick={()=>this.setState({openDialog: true})} key={"refreshSimulationButton"} iconStyle={{color:pink400}} backgroundColor="#ffffff" iconClassName="fa fa-refresh" style={{position: 'absolute', right: 34, top: this.props.freezeInstance?50:150}}/>} else var refreshSimulationButton = <div></div>    
        }
        
        return (
            <div>
                {refreshInstanceButton}
                {refreshSimulationButton}
                <Dialog
                    title={title}
                    actions={actions}
                    modal={true}
                    open={this.state.openDialog}
                    onRequestClose={this.closeTransition}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    {children}
                </Dialog>
            </div>
        )
    }
}