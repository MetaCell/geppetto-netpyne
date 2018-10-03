import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Canvas from '../../../../js/components/interface/3dCanvas/Canvas';
import ControlPanel from '../../../../js/components/interface/controlPanel/controlpanel';
import IconButton from '../../../../js/components/controls/iconButton/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Utils from '../../Utils';

const styles = {
    modal: {
        position: 'absolute !important',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: '999',
        height: '100%',
        width: '100%',
        top: 0
    },

    menuItemDiv: {
        fontSize: '12px',
        lineHeight: '28px'
    },

    menuItem: {
        lineHeight: '28px',
        minHeight: '28px'
    },
    instantiatedContainer: {
        height: '100%', 
        width: '100%', 
        position: 'fixed'
    },
    controlpanelBtn: {
        position: 'absolute', 
        left: 34, 
        top: 16 
    },
    plotBtn: {
        position: 'absolute', 
        left: 34, 
        top: 317 
    }
        
};
const plots = [
    {id: 'connectionPlot',      primaryText: 'Connectivity',            plotName: 'Connections Plot',       plotMethod: 'plotConn',             plotType: false},
    {id: '2dNetPlot',           primaryText: '2D network',              plotName: '2D Net Plot',            plotMethod: 'plot2Dnet',            plotType: false},
    {id: 'shapePlot',           primaryText: 'Cell shape',              plotName: 'Shape Plot',             plotMethod: 'plotShape',            plotType: false},
    {id: 'tracesPlot',          primaryText: 'Cell traces',             plotName: 'Traces Plot',            plotMethod: 'plotTraces',           plotType: false},
    {id: 'rasterPlot',          primaryText: 'Raster plot',             plotName: 'Raster Plot',            plotMethod: 'plotRaster',           plotType: false},
    {id: 'spikePlot',           primaryText: 'Spike histogram',         plotName: 'Spike Hist Plot',        plotMethod: 'plotSpikeHist',        plotType: false},
    {id: 'spikeStatsPlot',      primaryText: 'Spike stats',             plotName: 'Spike Stats Plot',       plotMethod: 'plotSpikeStats',       plotType: false},
    {id: 'ratePSDPlot',         primaryText: 'Rate PSD"',               plotName: 'Rate PSD Plot',          plotMethod: 'plotRatePSD',          plotType: false},
    {id: 'LFPTimeSeriesPlot',   primaryText: 'LFP time-series',         plotName: 'LFP Time Series Plot',   plotMethod: 'plotLFP',              plotType: 'timeSeries'},
    {id: 'LFPLocationsPlot',    primaryText: 'LFP PSD',                 plotName: 'LFP PSD Plot',           plotMethod: 'plotLFP',              plotType: 'PSD'},
    {id: 'LFPSpectrogramPlot',  primaryText: 'LFP spectrogram',         plotName: 'LFP Spectrogram Plot',   plotMethod: 'plotLFP',              plotType: 'spectrogram'},
    {id: 'LFPLocationsPlot',    primaryText: 'LFP locations',           plotName: 'LFP Locations Plot',     plotMethod: 'plotLFP',              plotType: 'locations'},
    {id: 'grangerPlot',         primaryText: 'Granger causality plot',  plotName: 'Granger Plot',           plotMethod: 'granger',              plotType: false},
    {id: 'rxdConcentrationPlot',primaryText: 'RxD concentration plot',  plotName: 'RxD concentration plot', plotMethod: 'plotRxDConcentration', plotType: false}
];

export default class NetPyNEInstantiated extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: props.model,
            controlPanelHidden: true,
            plotButtonOpen: false,
            openDialog: false
        };
        
        this.widgets = [];
        this.plotFigure = this.plotFigure.bind(this);
        this.newPlotWidget = this.newPlotWidget.bind(this);
        this.getOpenedWidgets = this.getOpenedWidgets.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    remove() {
        var that = this.refs.canvas
        GEPPETTO.on(GEPPETTO.Events.Instance_deleted, function (instance) {
            that.remove([instance]);
        });
    }
    
    display() {
        this.refs.canvas.engine.setLinesThreshold(10000);
        this.refs.canvas.displayAllInstances();
    }
    
    componentDidMount() {
        this.display;
    }

    componentWillUnmount(){
        this.remove();
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.frozenInstance!=nextProps.frozenInstance) {
            this.remove();
        }
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.frozenInstance!=prevProps.frozenInstance) {
            this.display()
        }
    }

    handleCloseDialog = () => {
        this.setState({ openDialog: false });
    };

    newPlotWidget(name, svgResponse, data, i, total) {
        var s = svgResponse;
        var that = this;
        G.addWidget(1).then(w => {
            if (total == 0) {
                w.setName(name);
            }
            else {
                w.setName(name + " " + i);
            }
            w.$el.append(s);
            var svg = $(w.$el).find("svg")[0];
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '98%');
            that.widgets.push(w);
            if (i < total) {
                that.newPlotWidget(name, data[i++], data, i++, total)
            }
            w.showHistoryIcon(false);
            w.showHelpIcon(false);
        });
    }

    processError(response, plotName) {
        var parsedResponse = JSON.parse(response);
        if (parsedResponse.hasOwnProperty("type") && parsedResponse['type'] == 'ERROR') {
            this.setState({
                dialogTitle: "NetPyNE returned an error plotting " + plotName,
                dialogMessage: parsedResponse['message'] + "\n " + parsedResponse['details'],
                openDialog: true
            });
            return true;
        }
        return false;
    }

    plotFigure(plotName, plotMethod, plotType=false) {
        Utils.sendPythonMessage('netpyne_geppetto.getPlot', [plotMethod, plotType])
            .then(response => {
                //TODO Fix this, use just JSON
                if(typeof response === 'string'){
                    if (response.startsWith("{") && response.endsWith("}")) {
                        if (this.processError(response, plotName)){
                            return;
                        }
                    }
                    if (response.startsWith("[") && response.endsWith("]")) {
                        response = eval(response);
                    }
                }
                if ($.isArray(response)) {
                    this.newPlotWidget(plotName, response[0], response, 0, response.length - 1);
                }
                else if (response == -1) {
                    this.processError(response, plotName)
                }
                else {
                    this.newPlotWidget(plotName, response, response, 0, 0);
                }
            });
    }

    getOpenedWidgets() {
        return this.widgets;
    }

    handleClick(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            plotButtonOpen: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose() {
        this.setState({
            plotButtonOpen: false,
        });
    }

    render() {
        var controls;
        if (this.props.page == 'simulate') {
            controls = (
                <Menu>
                    {plots.map((plot, index) => {return <MenuItem id={plot.id} key={index} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText={plot.primaryText} onClick={() => { this.plotFigure(plot.plotName, plot.plotMethod, plot.plotType)}} />})}
                </Menu>
            );
        }

        return (
            <div id="instantiatedContainer" style={styles.instantiatedContainer}>
                <Canvas
                    key={this.props.frozenInstance?"FronzenCanvas":"aliveCanvas"}
                    id="CanvasContainer"
                    name={"Canvas"}
                    componentType={'Canvas'}
                    ref={"canvas"}
                    style={{ height: '100%', width: '100%' }}
                />
                <div id="controlpanel" style={{top: 10 }}>
                    <ControlPanel
                        icon={"styles.Modal"}
                        useBuiltInFilters={false}
                    >
                    </ControlPanel>
                </div>
                <IconButton style={styles.controlpanelBtn}
                    onClick={() => { $('#controlpanel').show(); }}
                    icon={"fa-list"}
                    id={"ControlPanelButton"} />
                <div>
                    <IconButton
                        onClick={this.handleClick}
                        style={styles.plotBtn}
                        label="Plot"
                        icon={"fa-bar-chart"}
                        id="PlotButton"
                    />
                    <Popover
                        open={this.state.plotButtonOpen}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                        onRequestClose={this.handleRequestClose}
                    >
                        {controls}
                    </Popover>
                </div>
                <Dialog
                    title={this.state.dialogTitle}
                    modal={true}
                    actions={<FlatButton
                        id="netPyneDialog"
                        label="Ok"
                        primary={true}
                        keyboardFocused={true}
                        onClick={this.handleCloseDialog}
                        />}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ whiteSpace: "pre-wrap" }}
                    open={this.state.openDialog}
                    onRequestClose={this.handleCloseDialog}
                >
                    {this.state.dialogMessage}
                </Dialog>
            </div>

        );
    }
}