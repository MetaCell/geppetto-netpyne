import React from 'react';
import {Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { cyan500 } from 'material-ui/styles/colors';
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
import NetPyNETabs2 from './components/settings/NetPyNETabs';

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
			tabClicked: false,
			freezeInstance: false,
			freezeSimulation: false,
			fastForwardInstantiation: true,
			fastForwardSimulation: false
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

	restoreWidgetsFor = (value, rename=false) => {
		if (value != "define") {
			if (this.widgets[value]) {
				let widgets = this.widgets[value]
				for (var w in widgets) {
					if (rename && !widgets[w].getName().endsWith('(OLD)')) widgets[w].setName(widgets[w].getName()+' (OLD)')
					widgets[w].show();
				}
			}
		}
	}
	
	cancelTransition = () => { 
		this.setState(({prevValue: pv, value: v, ...others})=>{ 
			this.hideWidgetsFor(v);
			this.restoreWidgetsFor(pv);
			return {
				prevValue: v,
				value: pv
			}
		});
	}

  	handleChange = (tab) => {
		this.hideWidgetsFor(this.state.value);
		this.restoreWidgetsFor(tab, true);
		this.setState( ({value: pv, prevValue: xx, freezeInstance:fi, freezeSimulation:fs, tabClicked:tc, ...others}) => {
			return {
				value: tab,
				prevValue: pv, 
				freezeInstance: pv=='define'?false:fi,
				freezeSimulation: pv=='define'?false:fs,
				tabClicked: !tc,
			}
		})
	};

	handleTransitionOptionsChange = (e, v) => {
		var state = {fastForwardInstantiation: false, fastForwardSimulation: false}
		if (v=='Create and Simulate Network') {
			state = {fastForwardInstantiation: true, fastForwardSimulation: true}
		}
		else if (v=='Create Network') {
			state = {fastForwardInstantiation: true, fastForwardSimulation: false}
		}
		this.setState(state)
	}

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
				freezeInstance: args.freezeInstance!=undefined?args.freezeInstance:fi,
				freezeSimulation: args.freezeSimulation!=undefined?args.freezeSimulation:fs,
			}
		});
	}
	
	render() {
		if (this.state.model == null) {
			return <div></div>
		}
		else {
			if (this.state.value=='define'){
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
			}
			else {
				var content =  <NetPyNEInstantiated frozenInstance={this.state.freezeInstance} ref={"simulate"} model={this.state.model} page={"simulate"} />
			}
			
			return (
				<div style={{height: '100%', width:'100%'}} >
					<div style={{position: 'relative', zIndex: '100'}}>
						<Toolbar id="appBar" style={{backgroundColor: cyan500, width:'100%', boxShadow: '0 0px 4px 0 rgba(0, 0, 0, 0.2), 0 0px 8px 0 rgba(0, 0, 0, 0.19)', position: 'relative', top: '0px', left: '0px', zIndex: 100}}>
							<ToolbarGroup firstChild={true} style={{marginLeft: -12}} >
								<NetPyNEToolBar changeTab={this.handleTabChangedByToolBar} />
							</ToolbarGroup>						
        					<ToolbarGroup lastChild={true} style={{display: 'flex', flexFlow: 'rows', width:'100%', marginRight: -10}}>
								<NetPyNETabs2 handleChange={this.handleChange} handleTransitionOptionsChange={this.handleTransitionOptionsChange}/>
							</ToolbarGroup>
							
						</Toolbar>
					</div>
					
					<NewTransition 
						tab={this.state.value} 
						clickOnTab={this.state.tabClicked}
						handleDeactivateInstanceUpdate={this.handleDeactivateInstanceUpdate} 
						freezeInstance={this.state.freezeInstance} 
						handleDeactivateSimulationUpdate={this.handleDeactivateSimulationUpdate}
						freezeSimulation={this.state.freezeSimulation} 
						cancelTransition={this.cancelTransition}
						fastForwardInstantiation={this.state.fastForwardInstantiation}
						fastForwardSimulation={this.state.fastForwardSimulation}
					/>

					{content}
				</div>
			)
		}
  	}
}