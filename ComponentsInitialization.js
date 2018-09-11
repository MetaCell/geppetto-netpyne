define(function (require) {
    return function (GEPPETTO) {
        var ReactDOM = require('react-dom');
        var React = require('react');
        var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
        var NetPyNETabs = require('./NetPyNETabs').default;
        var injectTapEventPlugin = require('react-tap-event-plugin');

        var Utils = require('./Utils').default;
        var Console = require('../../js/components/interface/console/Console');
        var TabbedDrawer = require('../../js/components/interface/drawer/TabbedDrawer');
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
                            <TabbedDrawer labels={["Console", "Python"]} iconClass={["fa fa-terminal", "fa fa-flask"]} >
                                <Console />
                                <PythonConsole pythonNotebookPath={"http://" + window.location.hostname + ":" + window.location.port + "/notebooks/notebook.ipynb"} />
                            </TabbedDrawer>
                        </div>
                    </div>
                </div>
            );
        }
        ReactDOM.render(<App />, document.querySelector('#mainContainer'));

        GEPPETTO.G.setIdleTimeOut(-1);
        GEPPETTO.Resources.COLORS.DEFAULT = "#008ea0";

        $('.nav-tabs li.active').removeClass('active');

        require('./css/netpyne.less');
        require('./css/material.less');

        window.customJupyterModelLoad = function (module, model) {
            console.log("Loading custom Jupyter code...")

            // Can we delete this line?
            GEPPETTO.trigger('kernel:ready', "Kernel started");

            window.IPython.notebook.restart_kernel({ confirm: false }).then(function () {

                GEPPETTO.trigger('kernel:ready', "Kernel started");

                var kernel = IPython.notebook.kernel;
                kernel.execute('from netpyne_ui import geppetto_init');
                // kernel.execute('from netpyne_ui import netpyneui_init');
                // kernel.execute('netpyneui_init.netpyneui_init.init()');

                GEPPETTO.on(GEPPETTO.Events.PythonChannelReady,function(){
                    Utils.sendPythonMessage('attribute.init', [], {'moduleName': 'netpyne_ui.netpyneui_init', 'attribute': 'netpyneui_init'})
                    .then(response => {
                        console.log(JSON.parse(response));
                });
                });
                

            });
        }

        // Add geppetto jupyter connector
        GEPPETTO.GeppettoJupyterModelSync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterModelSync');
        GEPPETTO.GeppettoJupyterGUISync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterGUISync');
        GEPPETTO.GeppettoJupyterWidgetSync = require('./../../js/communication/geppettoJupyter/GeppettoJupyterWidgetSync');
    };
});
