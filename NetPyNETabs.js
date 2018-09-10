import React from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import TransitionDialog from './components/transition/Transition';
import NetPyNEPopulations from './components/definition/populations/NetPyNEPopulations';
import NetPyNECellRules from './components/definition/cellRules/NetPyNECellRules';
import NetPyNESynapses from './components/definition/synapses/NetPyNESynapses';
import NetPyNEConnectivityRules from './components/definition/connectivity/NetPyNEConnectivityRules';
import NetPyNEStimulationSources from './components/definition/stimulationSources/NetPyNEStimulationSources';
import NetPyNEStimulationTargets from './components/definition/stimulationTargets/NetPyNEStimulationTargets';
import NetPyNEPlots from './components/definition/plots/NetPyNEPlots';
import NetPyNESimConfig from './components/definition/configuration/NetPyNESimConfig';
import NetPyNEInstantiated from './components/instantiation/NetPyNEInstantiated';

import NetPyNEToolBar from './components/settings/NetPyNEToolBar'

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
			usePrevData: {usePrevInst: false, usePrevSim: false}
		};

		GEPPETTO.on('OriginalModelLoaded', (model) => {
			var modelObject = JSON.parse(model);
			window.metadata = modelObject.metadata;
			window.requirement = modelObject.requirement;
			window.isDocker = modelObject.isDocker;
			window.currentFolder = modelObject.currentFolder;
			this.setState({ model: modelObject })
		});
		this.handleRefreshButtonVisibility = this.handleRefreshButtonVisibility.bind(this)

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

  	handleChange = (tab) => {
		this.hideWidgetsFor(this.state.value);
		this.restoreWidgetsFor(tab.props['value']);

		this.setState({
			prevValue: this.state.value,
			value: tab.props['value'],
			transitionDialog: true
		});
	};

	cancelTransition = () => {
		this.hideWidgetsFor(this.state.value);
		this.restoreWidgetsFor(this.state.prevValue);

		this.setState({
			prevValue: this.state.value,
			value: this.state.prevValue,
			transitionDialog: false
		});
	}
	handleRefreshButtonVisibility = (usePrevData) => {
		if (usePrevData.usePrevInst!=this.state.usePrevData.usePrevInst || usePrevData.usePrevSim!=this.state.usePrevData.usePrevSim) {
			this.setState({usePrevData: usePrevData})
		}
	}
	
	render() {
		if (this.state.model == null) {
			return (<div></div>)
		}
		else {
			var bottomValue = this.state.value == "define" ? 35 : 0;
			var transitionDialog = this.state.transitionDialog ? (<TransitionDialog tab={this.state.value} handleRefreshButtonVisibility={this.handleRefreshButtonVisibility} cancelTransition={this.cancelTransition}/>):(<div></div>);
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
				case 'explore':
					var content =  <NetPyNEInstantiated key={"exploringNetwork"} usePrevData={this.state.usePrevData} ref={"explore"} model={this.state.model} page={"explore"} />
					break;
				case 'simulate':
					var content =  <NetPyNEInstantiated key={"simulatingNetwork"} usePrevData={this.state.usePrevData} ref={"simulate"} model={this.state.model} page={"simulate"} />
					break;
				default:
					var content =  <div></div>
			}
			
			return (
				<div style={{height: '100%', width:'100%', display: 'flex', flexFlow: 'column'}}>
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
									<Tab onActive={this.handleChange} style={{height:40, marginTop: -4}} label="Explore your network" value="explore" id={"exploreNetwork"}/>
									<Tab onActive={this.handleChange} style={{height:40, marginTop: -4}} label="Simulate and analyse" value="simulate" id={"simulateNetwork"}/>
								</Tabs>
							}
							iconElementRight={<IconButton iconClassName="fa fa-github" href="https://github.com/MetaCell/NetPyNE-UI" style={{marginTop: -10}}/>}
							iconElementLeft={<NetPyNEToolBar changeTab={(v)=>this.setState({value: v})}/>}
						/>
					</div>
					<div style={{flex: 1}}>
						{content}
						{transitionDialog}
					</div>
				</div>
			)
		}
  	}
}
