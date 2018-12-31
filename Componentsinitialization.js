
global.jQuery = require("jquery");
global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');

jQuery(function () {
        require('webapp/js/pages/geppetto/main');
				var React = require('react');	
				var ReactDOM = require('react-dom');
        
        var ReduxApp = require('./ReduxApp.js').default;
        var store = require('./MyRedux').store;
        var Provider = require('react-redux').Provider;
				
        var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
        var NetPyNE = require('./NetPyNE').default;
        var injectTapEventPlugin = require('react-tap-event-plugin');

        var Utils = require('./Utils').default;
        var Console = require('webapp/js/components/interface/console/Console');
        var TabbedDrawer = require('webapp/js/components/interface/drawer/TabbedDrawer');
        var PythonConsole = require('webapp/js/components/interface/pythonConsole/PythonConsole');
        
        require('./css/netpyne.less');
        require('./css/material.less');
        require('./css/traceback.less');

        injectTapEventPlugin();

        function App(data = {}) {
            return (
                <div>

                    <Provider store={store}>
                      <ReduxApp />
                    </Provider>
                    <MuiThemeProvider>
                        <NetPyNE {...data}></NetPyNE>
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
        GEPPETTO.G.debug(true); //Change this to true to see messages on the Geppetto console while loading
        GEPPETTO.Resources.COLORS.DEFAULT = "#008ea0";
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Initialising NetPyNE");


        GEPPETTO.on('jupyter_geppetto_extension_ready',  (data) => {
            Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
            Utils.evalPythonMessage('netpyne_geppetto.getData',[]).then((response) => {
                var data = Utils.convertToJSON(response)
                ReactDOM.render(<App data={data} />, document.querySelector('#mainContainer'));
                GEPPETTO.trigger("spinner:hide");
            })
        });
    });
