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
            havePrevInstData: false,
            PrevDataAlreadyInstanciated: false,
            usePrevInst: false,
            havePrevSimData: false,
            PrevDataAlreadySimulated: false,
            usePrevSim: false,
            parallelSimulation: false
        };
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.trackClicksOnTab!=prevProps.trackClicksOnTab) {
            if (this.props.tab==prevProps.tab) {
                if (this.props.tab=='explore') {
                    if (!this.props.freezeInstance) {
                        this.setState({openDialog: true})
                    }
                }
                else if (this.props.tab=='simulate') {
                    if (!this.props.freezeSimulation) {
                        this.setState({openDialog: true})
                    }
                }
            }
            else {
                if (this.props.tab=='define' || this.props.tab=='explore' && !this.props.freezeInstance || this.props.tab=='simulate' && !this.props.freezeSimulation) {
                    Utils.sendPythonMessage('netpyne_geppetto.doIhaveInstOrSimData', [])
                        .then(response => {
                            if (response.constructor.name=='Array') { var reset
                                prevProps.tab=='define'?reset = {PrevDataAlreadyInstanciated: false, PrevDataAlreadySimulated:false, }:reset={}
                                this.setState({...reset, openDialog: true, havePrevInstData: response[0], havePrevSimData: response[1]})
                            }
                        })
                }
            }
        }
        
    }

    instantiate = () => {
        if (!(this.state.usePrevInst && (this.state.PrevDataAlreadyInstanciated || !this.state.havePrevInstData))) {
            this.setState({openDialog: false})
            GEPPETTO.CommandController.log("The NetPyNE model is getting instantiated...");
            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.INSTANTIATING_MODEL);
            Utils.sendPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [{usePrevInst: this.state.usePrevInst}])
                .then(response => {
                    var parsedResponse = JSON.parse(response);
                    if (!this.processError(parsedResponse)) {
                        !this.state.usePrevInst?this.props.handleDeactivateInstanceUpdate(true):this.setState({PrevDataAlreadyInstanciated: true})
                        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL); //keep this sequence has it is
                        this.setState({networkAlreadyInstantiated: true})
                        //this.refs.canvas.displayAllInstances();
                        GEPPETTO.Manager.loadModel(parsedResponse);
                        GEPPETTO.CommandController.log("The NetPyNE model instantiation was completed");
                        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                    }
            });
        }
        else {
            this.setState({openDialog: false})
        }
    }

    simulate = () => {
        if (!(this.state.usePrevSim && (this.state.PrevDataAlreadySimulated || !this.state.havePrevSimData))) {
            this.setState({openDialog: false})
            GEPPETTO.CommandController.log("The NetPyNE model is getting simulated...");
            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.RUNNING_SIMULATION);
            Utils.sendPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [{usePrevSim: this.state.usePrevSim, parallelSimulation: this.state.parallelSimulation, previousTab: this.props.freezeInstance?'explore':'define'}]) //simulate from the instance if it is updated, otherwise, simulate from HLS
                .then(response => {
                    var parsedResponse = JSON.parse(response)
                    if (!this.processError(parsedResponse)) {
                        !this.state.usePrevSim?this.props.handleDeactivateSimulationUpdate(true):this.setState({PrevDataAlreadySimulated: true})
                        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
                        //this.refs.canvas.displayAllInstances();
                        GEPPETTO.Manager.loadModel(parsedResponse);
                        GEPPETTO.CommandController.log("The NetPyNE model simulation was completed");
                        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
                }
            });    
        }
        else {
            this.setState({openDialog: false})
        }
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
        var refreshButton = <div></div>
        var cancelAction = <FlatButton label="CANCEL" primary={true} onClick={()=>{this.cancelTransition()}} key={"cancelActionBtn"} />;
        var actions = [cancelAction];
        var children = this.state.errorDetails?this.state.errorDetails:[]
        var title = this.state.errorMessage?this.state.errorMessage:"NetPyNE";
        
        if (this.state.openDialog && this.state.errorMessage==undefined) {
            if (this.props.tab=="define") {
                actions.push(<FlatButton label="Ok" onClick={()=>{this.closeTransition()}} key={"returnToDefinitionBtn"} primary={true} keyboardFocused={true} />);    
                children.push(<div key={"backToDefinitionDialog"}>"You are back to network definition, any changes will require to reinstantiate your network."</div>);
            }
            else if (this.props.tab=="explore") {
                children.push(<div key={"aboutToInstantiate"} >"We are about to instantiate your network, this could take some time."</div>)
                if (this.state.havePrevInstData) {
                    children.push(<Checkbox label="Use previews Instance" checked={this.state.usePrevInst} onCheck={() => this.setState((oldState=>{return {usePrevInst: !oldState.usePrevInst}}))} key={"havePrevInstData"} />)
                }
                actions.push(<FlatButton label="Instanciate" onClick={()=>this.instantiate()} id="okInstantiateNetwork" key={"explorationBtn"} primary={true} keyboardFocused={true} />)
                if (!this.props.freezeInstance) {
                    var refreshButton = <FloatingActionButton onClick={()=>this.instantiate()} key={"refreshInstanceButton"} iconStyle={{color:pink400}} backgroundColor="#ffffff" iconClassName="fa fa-refresh" style={{position: 'absolute', right: 34, top: 50}}/>
                }
            }
            else if (this.props.tab=="simulate") {
                children.push(<div key={"aboutToSimulate"} >We are about to simulate your network, this could take some time.</div>)
                if (this.state.havePrevInstData) {
                    children.push(<Checkbox label="Use previews Instance" checked={this.state.usePrevInst} onCheck={() => this.setState((oldState=>{return {usePrevInst: !oldState.usePrevInst}}))} key={"havePrevInstData"} />)
                }
                if (this.state.havePrevSimData) {
                    children.push(<Checkbox label="Use previews simulation data" checked={this.state.usePrevSim} onCheck={() => this.setState((oldState=>{return {usePrevSim: !oldState.usePrevSim}}))} key={"usePrevSimCheckBox"} />)
                }
                children.push(<Checkbox label="Run parallel simulation" checked={this.state.parallelSimulation} onCheck={() => this.setState((oldState) => {return {parallelSimulation: !oldState.parallelSimulation}})} style={{ marginTop: '35px' }} id="runParallelSimulation" key={"runParaSimCheckBox"} />)       
                children.push(<TextField floatingLabelText="Number of cores" onChange={(event) => this.setState({ cores: event.target.value })} className="netpyneRightField"  type="number"  key={"coreNumbers"} />)
                actions.push(<FlatButton label="Simulate" onClick={()=>this.simulate()} id={"okRunSimulation"} primary={true} keyboardFocused={true} key={"runSimulationButton"} />);
                if (!this.props.freezeSimulation) {
                    var refreshButton = <FloatingActionButton onClick={()=>this.simulate()} key={"refreshSimulationButton"} iconStyle={{color:pink400}} backgroundColor="#ffffff" iconClassName="fa fa-refresh" style={{position: 'absolute', right: 34, top: 50}}/>
                }
            }
        }
        if (this.props.openTransitionDialog) {
            return (
                <div>
                    {refreshButton}
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
        else {
            return null
        }
        
    }
}