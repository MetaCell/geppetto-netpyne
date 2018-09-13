import React from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import SettingsDialog from './components/settings/Settings';
import NewTransition from './components/transition/NewTransition';
import NetPyNEPopulations from './components/definition/populations/NetPyNEPopulations';
import NetPyNECellRules from './components/definition/cellRules/NetPyNECellRules';
import NetPyNESynapses from './components/definition/synapses/NetPyNESynapses';
import NetPyNEConnectivityRules from './components/definition/connectivity/NetPyNEConnectivityRules';
import NetPyNEStimulationSources from './components/definition/stimulationSources/NetPyNEStimulationSources';
import NetPyNEStimulationTargets from './components/definition/stimulationTargets/NetPyNEStimulationTargets';
import NetPyNEPlots from './components/definition/plots/NetPyNEPlots';
import NetPyNESimConfig from './components/definition/configuration/NetPyNESimConfig';
import NetPyNEInstantiated from './components/instantiation/NetPyNEInstantiated';
import NetPyNEToolBar from './components/settings/NetPyNEToolBar';

var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledNetPyNEPopulations = PythonControlledCapability.createPythonControlledComponent(NetPyNEPopulations);
var PythonControlledNetPyNECellRules = PythonControlledCapability.createPythonControlledComponent(NetPyNECellRules);
var PythonControlledNetPyNESynapses = PythonControlledCapability.createPythonControlledComponent(NetPyNESynapses);
var PythonControlledNetPyNEConnectivity = PythonControlledCapability.createPythonControlledComponent(NetPyNEConnectivityRules);
var PythonControlledNetPyNEStimulationSources = PythonControlledCapability.createPythonControlledComponent(NetPyNEStimulationSources);
var PythonControlledNetPyNEStimulationTargets = PythonControlledCapability.createPythonControlledComponent(NetPyNEStimulationTargets);
var PythonControlledNetPyNEPlots = PythonControlledCapability.createPythonControlledComponent(NetPyNEPlots);


export default class NetPyNETabs extends React.Component {

    constructor(props) {
        super(props);

        this.widgets = {};
        this.state = {
            value: 'define',
            prevValue: 'define',
			model: null,
			freezeInstance: false,
			freezeSimulation: false,
			tabClicked: false,
			settings: {
				openSettings: false,
				fastForwardInstantiation: true,
				fastForwardSimulation: false
			},
			holdGui: false
		};
		this.handleDeactivateInstanceUpdate = this.handleDeactivateInstanceUpdate.bind(this);
		this.handleDeactivateSimulationUpdate = this.handleDeactivateSimulationUpdate.bind(this);
		this.handleTabChangedByToolBar = this.handleTabChangedByToolBar.bind(this)
		this.cancelTransition = this.cancelTransition.bind(this)
		
		GEPPETTO.on('OriginalModelLoaded', (model) => {
			var modelObject = JSON.parse(model);
			window.metadata = modelObject.metadata;
			window.requirement = modelObject.requirement;
			window.isDocker = modelObject.isDocker;
			window.currentFolder = modelObject.currentFolder;
			this.setState({ model: modelObject })
		});
  	}

  	hideWidgetsFor = (value) => {
		if (value != "define") {
			var page = this.refs[value];
			if (page) {
				var widgets = page.getOpenedWidgets();
				if (this.widgets[value]) {
					widgets = widgets.concat(this.widgets[value]);
				}
				for (var w in widgets) {
					if(!widgets[w].destroyed){
						widgets[w].hide();
					}
					else{
						delete widgets[w];
					}
				}
				this.widgets[value] = widgets;
			}
		}
  	}

	restoreWidgetsFor = (value) => {
		if (value != "define") {
			if (this.widgets[value]) {
				var widgets = this.widgets[value]
				for (var w in widgets) {
					widgets[w].show();
				}
			}
		}
	}
	// onMouseEnter={()=>{console.log("enter");this.setState({holdGui: true}) }} onMouseLeave={()=>{console.log("leave");this.setState({holdGui: false})}}
	cancelTransition = () => { //we don't know how much time passed between switching tabs and cancel, so better wait for the last setState
		this.setState(({prevValue: pv, value: v, ...others})=>{ 
			this.hideWidgetsFor(v);
			this.restoreWidgetsFor(pv);
			return {
				prevValue: v,
				value: pv,
				...others
			}
		});
	}

  	handleChange = (tab) => {
		this.hideWidgetsFor(this.state.value);
		this.restoreWidgetsFor(tab.props.value);
		this.setState( ({value: pv, prevValue: xx, freezeInstance:fi, freezeSimulation:fs, tabClicked:tc, ...others}) => {
			return {
				value: tab.props.value,
				prevValue: pv, 
				freezeInstance: pv=='define'?false:fi,
				freezeSimulation: pv=='define'?false:fs,
				tabClicked: !tc,
				...others	
			}
		})
	};

	handleDeactivateInstanceUpdate = (netInstanceWasUpdated) => {
		if (netInstanceWasUpdated) {
			if (!this.state.freezeInstance) {
				this.setState({freezeInstance: true})
			}
		}
	}

	handleDeactivateSimulationUpdate = (netSimulationWasUpdated) => {
		if (netSimulationWasUpdated) {
			if (!this.state.freezeSimulation) {
				this.setState({freezeSimulation: true, freezeInstance: true})
			}
		}
	}
	
	handleTabChangedByToolBar = (tab, args) => {
		this.setState(({value: x, prevValue: xx, freezeInstance: fi, freezeSimulation: fs, ...others})=>{ 
			return {
				value: tab,
				prevValue: tab, 
				freezeInstance: args.freezeInstance,
				freezeSimulation: args.freezeSimulation,
				...others
			}
		});
	}

	//!Object.keys(this.state.settings).map(el=>{return this.state.settings[el]!=nextState[el]}).some((el)=>{return el})
	
	render() {
		if (this.state.model == null) {
			return <div></div>
		}
		else {
			var bottomValue = this.state.value == "define" ? 35 : 0;
			var transitionDialog = <NewTransition 
				tab={this.state.value} 
				clickOnTab={this.state.tabClicked}
				handleDeactivateInstanceUpdate={this.handleDeactivateInstanceUpdate} 
				freezeInstance={this.state.freezeInstance} 
				handleDeactivateSimulationUpdate={this.handleDeactivateSimulationUpdate}
				freezeSimulation={this.state.freezeSimulation} 
				cancelTransition={this.cancelTransition}
				fastForwardInstantiation={this.state.settings.fastForwardInstantiation}
				fastForwardSimulation={this.state.settings.fastForwardSimulation}
			/>;

			switch(this.state.value) {
				case 'define':
					var content =  <div>
						<PythonControlledNetPyNEPopulations model={"netParams.popParams"} />
						<PythonControlledNetPyNECellRules model={"netParams.cellParams"} />
						<PythonControlledNetPyNESynapses model={"netParams.synMechParams"} />
						<PythonControlledNetPyNEConnectivity model={"netParams.connParams"} />
						<PythonControlledNetPyNEStimulationSources model={"netParams.stimSourceParams"} />
						<PythonControlledNetPyNEStimulationTargets model={"netParams.stimTargetParams"} />
						<NetPyNESimConfig model={this.state.model.simConfig} />
						<PythonControlledNetPyNEPlots model={"simConfig.analysis"} />
					</div>
					break;
				case 'simulate':
					var content =  <NetPyNEInstantiated frozenInstance={this.state.freezeInstance} ref={"simulate"} model={this.state.model} page={"simulate"} />
					break;
				default:
					var content =  <div></div>
			}
			
			return ( <div style={{height: '100%', width:'100%', display: 'flex', flexFlow: 'column'}}>
					<div>
						<AppBar
							id="appBar"
							style={{flexWrap: 'wrap', height: 40, width: '100%'}}
							title={
								<Tabs
									value={this.state.value}
									style={{ width: 'calc(100% - 48px)', float: 'left' , height:40}}
									tabTemplateStyle={{ height: '100%' }}
									inkBarStyle={{backgroundColor:"#00BCD4"}}
									contentContainerStyle={{ bottom: bottomValue, position: 'absolute', top: 48, left: 0, right: 0, overflow: 'auto' }}
								>
									<Tab onActive={this.handleChange} style={{height:40, marginTop: -4}} label="Define your network" value="define" id={"defineNetwork"}/>
									<Tab onActive={this.handleChange} style={{height:40, marginTop: -4}} label="Simulate and analyse" value="simulate" id={"simulateNetwork"}/>
								</Tabs>
							}
							iconElementRight={<IconButton id="setupNetwork"iconClassName="fa fa-cog"  style={{marginTop: -13}} onClick={()=>this.setState((settings, ...others) => {return {settings: {...settings, openSettings: true}}})} />}
							iconElementLeft={<NetPyNEToolBar changeTab={this.handleTabChangedByToolBar} />}
						/>
					</div>
					<div style={{flex: 1}}>
						{content}
						{transitionDialog}
						{<SettingsDialog settings={this.state.settings} updateSettings={(args)=>this.setState({settings: args})} />}
					</div>
				</div>
			)
		}
  	}
}
