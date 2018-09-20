import React from 'react';
import Dialog from 'material-ui/Dialog';
import SvgIcon from 'material-ui/SvgIcon';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {pink400} from 'material-ui/styles/colors';
import Utils from '../../Utils';

const RocketIcon = (props) => (<SvgIcon {...props}><svg viewBox="0 0 512 512"><path d="M505.1 19.1C503.8 13 499 8.2 492.9 6.9 460.7 0 435.5 0 410.4 0 307.2 0 245.3 55.2 199.1 128H94.9c-18.2 0-34.8 10.3-42.9 26.5L2.6 253.3c-8 16 3.6 34.7 21.5 34.7h95.1c-5.9 12.8-11.9 25.5-18 37.7-3.1 6.2-1.9 13.6 3 18.5l63.6 63.6c4.9 4.9 12.3 6.1 18.5 3 12.2-6.1 24.9-12 37.7-17.9V488c0 17.8 18.8 29.4 34.7 21.5l98.7-49.4c16.3-8.1 26.5-24.8 26.5-42.9V312.8c72.6-46.3 128-108.4 128-211.1.1-25.2.1-50.4-6.8-82.6zM400 160c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"></path></svg></SvgIcon>);

export default class NewTransition extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
            haveInstData: false,
            parallelSimulation: false,
            instantiateButtonHovered: false,
            simulateButtonHovered: false
        };
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.clickOnTab!=prevProps.clickOnTab) {
            if (this.props.tab!=prevProps.tab && this.props.tab=='simulate') {
                if (!this.state.haveInstData) {
                    Utils.sendPythonMessage('netpyne_geppetto.doIhaveInstOrSimData', [])
                        .then(response => {if (response.constructor.name=='Array') this.instantiate({usePrevInst: this.props.fastForwardInstantiation?false:response[0]})}) 
                }
                else {
                    if (this.props.fastForwardSimulation) {
                        this.simulate({ffs: true})
                    }
                    else if (this.props.fastForwardInstantiation) {
                        this.instantiate({usePrevInst: false})    
                    }
                    else {
                        this.instantiate({usePrevInst: true})
                    }
                }
            }
        }
    }

    instantiate = (args) => {
        GEPPETTO.CommandController.log("The NetPyNE model is getting instantiated...");
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "INSTANTATING MODEL");
        Utils.sendPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [args])
            .then(response => {
                var parsedResponse = JSON.parse(response);
                if (!this.processError(parsedResponse)) {
                    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "PARSING MODEL"); //keep this sequence has it is
                    if (!args.usePrevInst) this.props.handleDeactivateInstanceUpdate(true)
                    GEPPETTO.Manager.loadModel(parsedResponse);
                    GEPPETTO.CommandController.log("The NetPyNE model instantiation was completed");
                    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                    this.setState({haveInstData: true})
                }
        });
    }

    simulate = (args) => {
        this.setState({openDialog: false})
        GEPPETTO.CommandController.log("The NetPyNE model is getting simulated...");
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.RUNNING_SIMULATION);
        Utils.sendPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [{usePrevInst: args.ffs?false:this.props.freezeInstance, parallelSimulation: this.state.parallelSimulation, cores:this.state.cores}])
            .then(response => {
                var parsedResponse = JSON.parse(response)
                if (!this.processError(parsedResponse)) {
                    this.props.handleDeactivateSimulationUpdate(true)
                    if (!this.props.freezeInstance) this.props.handleDeactivateInstanceUpdate(true)
                    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
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
    
    closeTransition = () => {
        this.setState({ openDialog: false });
    }
    
    render () {
        var children = this.state.errorDetails?this.state.errorDetails:null
        var title = this.state.errorMessage?this.state.errorMessage:"NetPyNE";
        
        if (this.state.openDialog) {
            if (this.state.errorMessage==undefined) {
                children = (
                    <div>
                        <div>"We are about to instantiate and simulate your network, this could take some time."</div>
                        <Checkbox label="Run parallel simulation" checked={this.state.parallelSimulation} onCheck={() => this.setState((oldState) => {return {parallelSimulation: !oldState.parallelSimulation}})} style={{ marginTop: '35px' }} id="runParallelSimulation" />
                        <TextField floatingLabelText="Number of cores" onChange={(event) => this.setState({ cores: event.target.value })} className="netpyneRightField"  type="number"/>
                    </div>
                )
                var actions = [<FlatButton label="CANCEL" onClick={()=>{this.closeTransition()}} primary={true} key={"cancelActionBtn"} />, <FlatButton label="Simulate" onClick={()=>this.simulate({ffs:false})} id={"okRunSimulation"} primary={true} keyboardFocused={true} key={"runSimulationButton"} />];
            }
            else var actions = <FlatButton label="CANCEL" onClick={()=>{this.closeTransition()}} key={"cancelActionBtn"} primary={true} />
        }

        if (this.props.tab=='simulate' && this.state.haveInstData) {
            var refreshInstanceButton = (
                <IconButton iconStyle={{color: pink400}} key={"refreshInstanceButton"} onClick={()=>this.instantiate({usePrevInst: false})} style={{position: 'absolute', right: 30, top: 50, width:'24px', height:'24px'}} tooltip={this.props.freezeInstance?"Your network is in sync":"Synchronise network"} tooltipPosition="center-left" disabled={this.props.freezeInstance} tooltipStyles={{marginRight:'15px', marginTop:'-8px'}}>
                    <FontIcon className="fa fa-refresh"/>
                </IconButton>
            )
            var refreshSimulationButton = (
                <IconButton iconStyle={{color: pink400}} key={"refreshSimulationButton"} onClick={()=>this.setState({openDialog: true})} style={{position: 'absolute', right: 30, top: 100, width:'24px', height:'24px'}} tooltip={this.props.freezeSimulation?"You have already simulated your network":"simulate"} tooltipPosition="center-left" disabled={this.props.freezeSimulation} tooltipStyles={{marginRight:'15px', marginTop:'-10px'}}>
                    <RocketIcon />
                </IconButton>    
            )
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