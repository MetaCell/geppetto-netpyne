define(function (require) {
    return function (GEPPETTO) {
        var ReactDOM = require('react-dom');
        var React = require('react');
        var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
        var NetPyNETabs = require('./NetPyNETabs').default;
        var injectTapEventPlugin = require('react-tap-event-plugin');
        var Console = require('../../js/components/interface/console/Console');
		var PythonConsole = require('../../js/components/interface/pythonConsole/PythonConsole');
        injectTapEventPlugin();

        function App() {
            return (
                <div>
                    <MuiThemeProvider>
                        <NetPyNETabs></NetPyNETabs>
                    </MuiThemeProvider>

                    <div id="footer">
                        <div id="footerHeader">
                        </div>
                    </div>
                </div>
            );
        }
        ReactDOM.render(<App />, document.querySelector('#mainContainer'));

        var pythonNotebookPath = "http://" + window.location.hostname + ":" + window.location.port + "/notebooks/notebook.ipynb";
        GEPPETTO.ComponentFactory.addComponent('DRAWER', {children: [Console, PythonConsole], childrenProp: [null, { pythonNotebookPath: pythonNotebookPath }], labels: ["Console", "Python"], iconClass: ["fa fa-terminal", "fa fa-flask"]}, document.getElementById("footerHeader"));

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
                kernel.execute('from netpyne_ui import netpyne_geppetto');
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
