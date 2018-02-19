define(function (require) {
    return function (GEPPETTO) {
        var ReactDOM = require('react-dom');
        var React = require('react');
        var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
        var NetPyNETabs = require('./NetPyNETabs').default;
        var injectTapEventPlugin = require('react-tap-event-plugin');
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
                                <div className='netpyneversion'>NetPyNE UI Alpha version 0.1</div>
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
        var pythonNotebookPath = "http://" + window.location.hostname + ":" + window.location.port + "/notebooks/neuron-ui-demo.ipynb";
        GEPPETTO.ComponentFactory.addComponent('PYTHONCONSOLE', { pythonNotebookPath: pythonNotebookPath }, document.getElementById("pythonConsole"));

        GEPPETTO.G.setIdleTimeOut(-1);


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

        require('./css/neuron.less');
        require('./css/material.less');

        document.title = "NetPyNE";
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'https://d30y9cdsu7xlg0.cloudfront.net/png/38902-200.png';
        document.getElementsByTagName('head')[0].appendChild(link);

        window.customJupyterModelLoad = function (module, model) {

            // Close any previous panel
            // window.removeAllPanels();

            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Initialising NEURON");



            window.IPython.notebook.restart_kernel({ confirm: false }).then(function () {

                GEPPETTO.trigger('kernel:ready', "Kernel started");
                // IPython.notebook.execute_all_cells();

                // Load Neuron Basic GUI
                // FIXME This is NEURON specific and should move elsewhere
                var kernel = IPython.notebook.kernel;
                kernel.execute('from neuron_ui import netpyne_geppetto');

                kernel.execute('from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync');
                kernel.execute('GeppettoJupyterModelSync.events_controller.triggerEvent("spinner:hide")');
            });
        }

        // Add geppetto jupyter connector
        GEPPETTO.GeppettoJupyterModelSync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterModelSync');
        GEPPETTO.GeppettoJupyterGUISync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterGUISync');
        GEPPETTO.GeppettoJupyterWidgetSync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterWidgetSync');

        
    };


});
