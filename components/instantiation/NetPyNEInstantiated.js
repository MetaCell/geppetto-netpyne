
import React, { Component } from 'react';
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
    }
};

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

    plotFigure(plotName, plotMethod, flavour=false) {
        Utils.sendPythonMessage('netpyne_geppetto.getPlot', [plotMethod, flavour])
            .then(response => {
                //TODO Fix this, use just JSON
                if(typeof response === 'string'){
                    if (response.startsWith("{") && response.endsWith("}")) {
                        var parsedResponse = JSON.parse(response);
                        if (parsedResponse.hasOwnProperty("type") && parsedResponse['type'] == 'ERROR') {
                            this.setState({
                                dialogMessage: "NetPyNE returned an error plotting " + plotName,
                                openDialog: true
                            });
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
                    this.setState({
                        dialogMessage: "NetPyNE returned an error plotting " + plotName,
                        openDialog: true
                    });
                }
                else {
                    this.newPlotWidget(plotName, response, response, 0, 0);
                }
            });
    }

    getOpenedWidgets() {
        return this.widgets;
    }

    componentDidMount() {
        this.refs.canvas.engine.setLinesThreshold(10000);
        this.refs.canvas.displayAllInstances();
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
        if (this.props.page == 'explore') {
            controls = (
                <Menu>
                    <MenuItem id={"connectionPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Connectivity" onClick={() => { this.plotFigure('Connections Plot', 'plotConn') }} />
                    <MenuItem id={"2dNetPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="2D network" onClick={() => { this.plotFigure('2D Net Plot', 'plot2Dnet') }} />
                    <MenuItem id={"shapePlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Cell shape" onClick={() => { this.plotFigure('Shape Plot', 'plotShape') }} />
                </Menu>
            );

        }
        else if (this.props.page == 'simulate') {
            controls = (
                <Menu>
                    <MenuItem id={"tracesPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Cell traces" onClick={() => { this.plotFigure('Traces Plot', 'plotTraces') }} />
                    <MenuItem id={"rasterPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Raster plot" onClick={() => { this.plotFigure('Raster Plot', 'plotRaster') }} />
                    <MenuItem id={"spikePlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Spike histogram" onClick={() => { this.plotFigure('Spike Hist Plot', 'plotSpikeHist') }} />
                    <MenuItem id={"spikeStatsPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Spike stats" onClick={() => { this.plotFigure('Spike Stats Plot', 'plotSpikeStats') }} />
                    <MenuItem id={"ratePSDPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Rate PSD" onClick={() => { this.plotFigure('Rate PSD Plot', 'plotRatePSD') }} />
                    <MenuItem id={"LFPTimeSeriesPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="LFP time-series" onClick={() => { this.plotFigure('LFP Time Series Plot', 'plotLFP', 'timeSeries') }} />
                    <MenuItem id={"LFPPSDPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="LFP PSD" onClick={() => { this.plotFigure('LFP PSD Plot', 'plotLFP', 'PSD') }} />
                    <MenuItem id={"LFPSpectrogramPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="LFP spectrogram" onClick={() => { this.plotFigure('LFP Spectrogram Plot', 'plotLFP', 'spectrogram') }} />
                    <MenuItem id={"LFPLocationsPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="LFP locations" onClick={() => { this.plotFigure('LFP Locations Plot', 'plotLFP', 'locations') }} />
                    <MenuItem id={"grangerPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Granger causality plot" onClick={() => { this.plotFigure('Granger Plot', 'granger') }} />
                    <MenuItem id={"rxdConcentrationPlot"} style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="RxD concentration plot" onClick={() => { this.plotFigure('RxD concentration plot', 'plotRxDConcentration') }} />
                </Menu>
            );
        }

        return (
            <div id="instantiatedContainer" style={{ height: '100%', width: '100%' }}>
                <Canvas
                    id="CanvasContainer"
                    name={"Canvas"}
                    componentType={'Canvas'}
                    ref={"canvas"}
                    style={{ height: '100%', width: '100%' }}
                />
                <div id="controlpanel" style={{ top: 0 }}>
                    <ControlPanel
                        icon={"styles.Modal"}
                        useBuiltInFilters={false}
                    >
                    </ControlPanel>
                </div>
                <IconButton style={{ position: 'absolute', left: 35, top: 10 }}
                    onClick={() => { $('#controlpanel').show(); }}
                    icon={"fa-list"}
                    id={"ControlPanelButton"} />
                <div>
                    <IconButton
                        onClick={this.handleClick}
                        style={{ position: 'absolute', left: 35, top: 318 }}
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
                    title="NetPyNE"
                    modal={true}
                    actions={<FlatButton
                        label="Ok"
                        primary={true}
                        keyboardFocused={true}
                        onClick={this.handleCloseDialog}
                        id="netPyneDialog"
                    />}
                    open={this.state.openDialog}
                    onRequestClose={this.handleCloseDialog}
                >
                    {this.state.dialogMessage}
                </Dialog>
            </div>

        );
    }
}
