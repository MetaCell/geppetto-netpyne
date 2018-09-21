import React from 'react';
import AppBar from 'material-ui/AppBar';
import { MenuItem } from 'material-ui/Menu';
import { cyan500, cyan400, grey300 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import Tabs, { Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import {Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
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
			tabLabel: 'Create network',
			defBGC: '#00BCD4',
			simBGC: '#00BCD4',
			transitionOptionsHovered: false
		};
		this.handleTransitionOptionsChange = this.handleTransitionOptionsChange.bind(this);
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
	
	cancelTransition = () => { //we don't know how much time passed between switching tabs and cancel, so better wait for the last setState
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
		this.restoreWidgetsFor(tab.props.value);
		this.setState( ({value: pv, prevValue: xx, freezeInstance:fi, freezeSimulation:fs, tabClicked:tc, ...others}) => {
			return {
				value: tab.props.value,
				prevValue: pv, 
				freezeInstance: pv=='define'?false:fi,
				freezeSimulation: pv=='define'?false:fs,
				tabClicked: !tc,
			}
		})
	};
	handleTransitionOptionsChange = (e, v) => {
		this.setState({tabLabel: v})
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
				<div style={{height: '100%', width:'100%', display: 'flex', flexFlow: 'column'}}>
					<div id="dimmer" style={{zIndex:'5 !important', position: 'absolute', backgroundColor: '#000000', 'width': '100%', 'height': '100px', visibility: 'hidden', top: '0px', left: '0px'}} />
					<div>
						<Toolbar style={{backgroundColor: cyan500, width:'100%'}}>
							<ToolbarGroup firstChild={true} style={{marginLeft: -12}}>
								<NetPyNEToolBar changeTab={this.handleTabChangedByToolBar} />
							</ToolbarGroup>						
        					<ToolbarGroup lastChild={true} style={{display: 'flex', flexFlow: 'rows', width:'100%'}}>
								<FlatButton style={{flex: 1}} backgroundColor={cyan500} hoverColor={cyan400} labelStyle={{color: this.state.value=='define'?'#ffffff':grey300}} label="Define your Network" />
								<FlatButton style={{flex: 1}} backgroundColor={this.state.transitionOptionsHovered?cyan400:cyan500} hoverColor={cyan400} labelStyle={{color: this.state.value=='simulate'?'#ffffff':grey300}} label={this.state.tabLabel} />
							</ToolbarGroup>
							<IconMenu 
								value={this.state.tabLabel} 
								iconStyle={{color: '#ffffff'}} 
								style={{position: 'absolute', top:'4px', right: '28px'}} 
								iconButtonElement={<IconButton onMouseEnter={()=>this.setState({transitionOptionsHovered: true})} onMouseLeave={()=>this.setState({transitionOptionsHovered: false})}><NavigationExpandMoreIcon /></IconButton>} 
								onChange={this.handleTransitionOptionsChange} 
								useLayerForClickAway={true} 
								anchorOrigin={{horizontal:"left", vertical: "bottom"}} 
								targetOrigin={{horizontal: "right", vertical: "top"}}
							>
								<MenuItem primaryText="Create network" value="Create network" />
								<MenuItem primaryText="Create and Simulate network" value="Create and Simulate network"/>
								<MenuItem primaryText="Explore existing network" value="Explore existing network"/>
							</IconMenu>
						</Toolbar>
						<AppBar
							id="appBar"
							style={{flexWrap: 'wrap', height: 48, width: '100%', cursor: 'pointer'}}
							title={<div style={{display: 'flex', flexFlow: 'rows'}}>
								<Tabs
									key={'mainOptions'}
									value={this.state.value}
									style={{flex: 4}}
									inkBarStyle={{backgroundColor:"#00BCD4"}}
								>
									<Tab onActive={this.handleChange} style={{backgroundColor: this.state.defBGC}} onMouseEnter={()=>this.setState({defBGC: '#26C6DA'})} onMouseLeave={()=>this.setState({defBGC: '#00BCD4'})} label="Define your network" value="define" id={"defineNetwork"}/>
									<Tab onActive={this.handleChange} style={{backgroundColor: this.state.simBGC}} onMouseEnter={()=>this.setState({simBGC: '#26C6DA'})} onMouseLeave={()=>this.setState({simBGC: '#00BCD4'})} label="Simulate and analyse" value="simulate" id={"simulateNetwork"}/>
								</Tabs></div>
							}
							iconElementRight={<IconButton id="setupNetwork" iconClassName="fa fa-cog" style={{width:40, height:40, borderRadius:25, overflow: 'hidden', marginTop:-5}} iconStyle={{color: '#ffffff', marginLeft: -2, marginTop: -4}} hoveredStyle={{backgroundColor: '#26C6DA', position:'relative'}} onClick={()=>this.setState((settings, ...others) => {return {settings: {...settings, openSettings: true}}})} />}
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