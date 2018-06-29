define(function (require) {
    return function (GEPPETTO) {
        var ReactDOM = require('react-dom');
        var React = require('react');
        var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
        var NetPyNETabs = require('./NetPyNETabs').default;
        var injectTapEventPlugin = require('react-tap-event-plugin');
        var Utils = require('./Utils').default;
        injectTapEventPlugin();

        function App() {
            return (
                <div>
                    <MuiThemeProvider>
                        <NetPyNETabs></NetPyNETabs>
                    </MuiThemeProvider>

                    <div id="footer">
                        <div id="footerHeader">
                            <div id="consoleButtonContainer">
                                <ul className="btn nav nav-tabs" role="tablist" id="tabButton">
                                    <li role="presentation" className="active" id="consoleButton"><a href="#console" aria-controls="console" role="tab" data-toggle="tab"><i className="fa fa-terminal"></i> Console</a></li>
                                    <li role="presentation" id="pythonConsoleButton" style={{ display: 'none' }}><a href="#pythonConsole" aria-controls="pythonConsole" role="tab" data-toggle="tab"><i className="fa fa-terminal"></i> Python</a></li>
                                </ul>
                                <div className='netpyneversion'>NetPyNE UI Alpha version 0.3</div>
                                <div className="tab-content">
                                    <div role="tabpanel" className="tab-pane active" id="console">Console Loading...</div>
                                    <div role="tabpanel" id="pythonConsole" className="tab-pane  panel panel-default"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        ReactDOM.render(<App />, document.querySelector('#mainContainer'));

        GEPPETTO.ComponentFactory.addComponent('CONSOLE', {}, document.getElementById("console"));
        var pythonNotebookPath = "http://" + window.location.hostname + ":" + window.location.port + "/notebooks/notebook.ipynb";
        GEPPETTO.ComponentFactory.addComponent('PYTHONCONSOLE', { pythonNotebookPath: pythonNotebookPath }, document.getElementById("pythonConsole"));

        GEPPETTO.G.setIdleTimeOut(-1);
        GEPPETTO.Resources.COLORS.DEFAULT = "#008ea0";

        var visiblePython = false;
        $('#pythonConsoleButton').click(function (e) {
            if (!visiblePython) {
                $('#console').hide();
                $("#pythonConsole").show();
                $(this).tab('show');
                visiblePython = true;
                embeddedConsoleVisible = false;
            } else {
                $("#pythonConsole").hide();
                visiblePython = false;
            }
        });

        var embeddedConsoleVisible = false;
        $('#consoleButton').click(function (e) {
            if (!embeddedConsoleVisible) {
                $('#console').show();
                $("#pythonConsole").hide();
                $(this).tab('show');
                embeddedConsoleVisible = true;
                visiblePython = false;
            } else {
                $('#console').hide();
                embeddedConsoleVisible = false;
            }
        });

        $('.nav-tabs li.active').removeClass('active');

        require('./css/netpyne.less');
        require('./css/material.less');

        window.customJupyterModelLoad = function (module, model) {

            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Initialising NetPyNE");

            window.IPython.notebook.restart_kernel({ confirm: false }).then(function () {

                GEPPETTO.trigger('kernel:ready', "Kernel started");

                var kernel = IPython.notebook.kernel;
                kernel.execute('from netpyne_ui import geppetto_init');
                kernel.execute('from netpyne_ui import netpyneui_init');

                Utils.sendPythonMessage('netpyneui_init.netpyneui_init.init', [])
                .then(response => {
                    var parsedResponse = JSON.parse(response);
                    alert(parsedResponse);
                });

            });
        }

        // Add geppetto jupyter connector
        GEPPETTO.GeppettoJupyterModelSync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterModelSync');
        GEPPETTO.GeppettoJupyterGUISync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterGUISync');
        GEPPETTO.GeppettoJupyterWidgetSync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterWidgetSync');

        
    };


});
