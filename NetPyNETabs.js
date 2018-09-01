import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import SvgIcon from 'material-ui/SvgIcon';
import Tabs, { Tab } from 'material-ui/Tabs';
import NetPyNEPopulations from './components/definition/populations/NetPyNEPopulations';
import NetPyNECellRules from './components/definition/cellRules/NetPyNECellRules';
import NetPyNESynapses from './components/definition/synapses/NetPyNESynapses';
import NetPyNEConnectivityRules from './components/definition/connectivity/NetPyNEConnectivityRules';
import NetPyNEStimulationSources from './components/definition/stimulationSources/NetPyNEStimulationSources';
import NetPyNEStimulationTargets from './components/definition/stimulationTargets/NetPyNEStimulationTargets';
import NetPyNEPlots from './components/definition/plots/NetPyNEPlots';
import NetPyNESimConfig from './components/definition/configuration/NetPyNESimConfig';
import NetPyNEInstantiated from './components/instantiation/NetPyNEInstantiated';
import IconButton from 'material-ui/IconButton';
import SettingsDialog from './components/settings/Settings';
import TransitionDialog from './components/transition/Transition';
import FontIcon from 'material-ui/FontIcon';
import NetPyNEToolBar from './components/settings/NetPyNEToolBar'


var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledNetPyNEPopulations = PythonControlledCapability.createPythonControlledComponent(NetPyNEPopulations);
var PythonControlledNetPyNECellRules = PythonControlledCapability.createPythonControlledComponent(NetPyNECellRules);
var PythonControlledNetPyNESynapses = PythonControlledCapability.createPythonControlledComponent(NetPyNESynapses);
var PythonControlledNetPyNEConnectivity = PythonControlledCapability.createPythonControlledComponent(NetPyNEConnectivityRules);
var PythonControlledNetPyNEStimulationSources = PythonControlledCapability.createPythonControlledComponent(NetPyNEStimulationSources);
var PythonControlledNetPyNEStimulationTargets = PythonControlledCapability.createPythonControlledComponent(NetPyNEStimulationTargets);
var PythonControlledNetPyNEPlots = PythonControlledCapability.createPythonControlledComponent(NetPyNEPlots);

const GitHubIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </SvgIcon>
);


export default class NetPyNETabs extends React.Component {

    constructor(props) {
        super(props);

        this.widgets = {};
        this.state = {
            value: 'define',
            prevValue: 'define',
      		model: null,
      		settingsOpen: false
		};

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
			var widgets = this.widgets[value];
			if (widgets) {
				for (var w in widgets) {
					widgets[w].show();
				}
			}
		}
  	}

  	handleChange = (value) => {
		this.hideWidgetsFor(this.state.value);
		this.restoreWidgetsFor(value);

		this.setState({
			prevValue: this.state.value,
			value: value,
			transitionDialog: true
		});
	};

	openSettings = () => {
		this.setState({ settingsOpen: true });
	}

	cancelTransition=()=>{
		this.hideWidgetsFor(this.state.value);
		this.restoreWidgetsFor(this.state.prevValue);

		this.setState({
			prevValue: this.state.value,
			value: this.state.prevValue,
			transitionDialog: false
		});
	}

	closeSettings = () => {
		this.setState({ settingsOpen: false });
	}

	render() {
		if (this.state.model == null) {
			return (<div></div>)
		}
		else {
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
					var content =  <NetPyNEInstantiated ref={"explore"} model={this.state.model} page={"explore"} />
					break;
				case 'simulate':
					var content =  <NetPyNEInstantiated ref={"simulate"} model={this.state.model} page={"simulate"} />
					break;
				default:
					var content =  <div></div>
			}
			 
			var bottomValue = this.state.value == "define" ? 35 : 0;
			var transitionDialog = this.state.transitionDialog ? (<TransitionDialog tab={this.state.value} cancelTransition={this.cancelTransition}/>):(<div></div>);
			
			return (
				<div >
					<AppBar 
						id="appBar"
						style={{flexWrap: 'wrap', height: 40}}
						title={
							<Tabs
								value={this.state.value}
								style={{ width: 'calc(100% - 48px)', float: 'left' , height:40}}
								tabTemplateStyle={{ height: '100%' }}
								inkBarStyle={{backgroundColor:"#00BCD4"}}
								contentContainerStyle={{ bottom: bottomValue, position: 'absolute', top: 48, left: 0, right: 0, overflow: 'auto' }}
								onChange={this.handleChange}
							>
								<Tab style={{height:40, marginTop: -4}} label="Define your network" value="define" id={"defineNetwork"}/>
								<Tab style={{height:40, marginTop: -4}} label="Explore your network" value="explore" id={"exploreNetwork"}/>
								<Tab style={{height:40, marginTop: -4}} label="Simulate and analyse" value="simulate" id={"simulateNetwork"}/>
							</Tabs>
						}
						iconElementRight={
							<IconButton href="https://github.com/MetaCell/NetPyNE-UI" style={{marginTop: -10}}>
								<GitHubIcon color="#ffffff"/>
							</IconButton>
						}
						iconElementLeft={<NetPyNEToolBar/>}
					/>
					{content}
					<div id="settingsIcon" style={{ float: 'left', width: '48px', backgroundColor: 'rgb(0, 188, 212)' }}>
						<IconButton id="setupNetwork"onClick={this.openSettings}>
							<FontIcon className={"fa fa-cog"} />
						</IconButton>
					</div>
					<SettingsDialog open={this.state.settingsOpen} onRequestClose={this.closeSettings} />
					{transitionDialog}
				</div>
			)
		}
  	}
}
