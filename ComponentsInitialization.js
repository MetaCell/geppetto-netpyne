define(function (require) {
    return function (GEPPETTO) {

        //Inject css stylesheet
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = "geppetto/extensions/geppetto-neuron/css/material.css";
        document.getElementsByTagName("head")[0].appendChild(link);


        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = "geppetto/extensions/geppetto-neuron/css/neuron.css";
        document.getElementsByTagName("head")[0].appendChild(link);

        //Logo initialization
        GEPPETTO.ComponentFactory.addComponent('LOGO', { logo: 'gpt-gpt_logo' }, document.getElementById("geppettologo"));

        //Control panel initialization
        GEPPETTO.ComponentFactory.addComponent('CONTROLPANEL', {
                useBuiltInFilters: true,
                listenToInstanceCreationEvents: false,
                enablePagination:true,
                resultsPerPage: 10
            }, document.getElementById("controlpanel"),
            function () {
                // whatever gets passed we keep
                var passThroughDataFilter = function (entities) {
                    return entities;
                };

                // set data filter
                GEPPETTO.ControlPanel.setDataFilter(passThroughDataFilter);
            });

        GEPPETTO.on(Events.Model_loaded, function () {
            GEPPETTO.ControlPanel.refresh();
        });


        //Spotlight initialization
        GEPPETTO.ComponentFactory.addComponent('SPOTLIGHT', {}, document.getElementById("spotlight"));

        //Create python console
        var pythonNotebookPath = "http://"+window.location.hostname+":"+window.location.port+"/notebooks/neuron-ui-demo.ipynb";
        GEPPETTO.ComponentFactory.addComponent('PYTHONCONSOLE', { pythonNotebookPath: pythonNotebookPath }, document.getElementById("pythonConsole"));

        //Experiments table initialization
        GEPPETTO.ComponentFactory.addComponent('EXPERIMENTSTABLE', {}, document.getElementById("experiments"));

        window.getAllWatchedVariable = function(){
            return Project.getActiveExperiment().getWatchedVariables(true, false);
        };

        window.removeAllPanels = function(){
            $(".fa-close").parent().click();
        };

        window.removeBrightnessFunction = function(){
            G.removeBrightnessFunctionBulkSimplified(getAllWatchedVariable(),false);
        };

        window.addBrightnessFunction = function(){
            var watchedVariables = getAllWatchedVariable();
            for(var membranePotentialsIndex in watchedVariables){
                var membranePotential = watchedVariables[membranePotentialsIndex]
                var geometries = membranePotential.getVariable().getWrappedObj().geometries;
                for (var geometryIndex in geometries){
                    G.addBrightnessListener(geometries[geometryIndex], membranePotential, function(x){return ((x/1000)+0.07)/0.1;});
                }
            }
            G.brightnessFunctionSet = true;
        };

        window.plotAllRecordedVariables = function() {
            Project.getActiveExperiment().playAll();
            var plt = G.addWidget(0).setName('Recorded Variables');
            $.each(Project.getActiveExperiment().getWatchedVariables(true, false),
                function(index, value) {
                    plt.plotData(value)
                });
        };

        window.customJupyterModelLoad = function(module,model){

            // Close any previous panel
            window.removeAllPanels();

            GEPPETTO.trigger(window.Events.Show_spinner, "Initialising NEURON");

            window.IPython.notebook.restart_kernel({confirm: false}).then(function() {

                // IPython.notebook.execute_all_cells();

                // Load Neuron Basic GUI
                // FIXME This is NEURON specific and should move elsewhere
                var kernel = IPython.notebook.kernel;
                kernel.execute('from neuron_ui import neuron_geppetto');
                kernel.execute('neuron_geppetto.init()');

                // kernel.execute('from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync');
                kernel.execute('from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync');
                // Load Model
                if (module != undefined && module != "" && model != undefined  && model != ""){
                    kernel.execute('import importlib');
                    kernel.execute('python_module = importlib.import_module("neuron_ui.models.' + module +'")');
                    kernel.execute('GeppettoJupyterModelSync.current_python_model = getattr( python_module, "' + model + '")()');
                    kernel.execute('GeppettoJupyterModelSync.events_controller.triggerEvent("spinner:hide")');
                }
                else{
                    kernel.execute('GeppettoJupyterModelSync.events_controller.triggerEvent("spinner:hide")');
                }
            });
        }

        var configuration = {
            id: "controlsMenuButton",
            openByDefault: false,
            closeOnClick: false,
            label: ' Results',
            iconOn: 'fa fa-caret-square-o-up',
            iconOff: 'fa fa-caret-square-o-down',
            menuPosition: {
                top: 40,
                right: 550
            },
            menuSize: {
                height: "auto"
            },
            menuItems: [{
                label: "Plot all recorded variables",
                action: "window.plotAllRecordedVariables();",
                value: "plot_recorded_variables"
            }, {
                label: "Play step by step",
                action: "Project.getActiveExperiment().play({step:1});",
                value: "play_speed_1"
            }, {
                label: "Play step by step (10x)",
                action: "Project.getActiveExperiment().play({step:10});",
                value: "play_speed_10"
            }, {
                label: "Play step by step (100x)",
                action: "Project.getActiveExperiment().play({step:100});",
                value: "play_speed_100"
            }, {
                label: "Apply voltage colouring to morphologies",
                condition: "GEPPETTO.G.isBrightnessFunctionSet()",
                value: "apply_voltage",
                false: {
                    // action: "G.addBrightnessFunctionBulkSimplified(window.getRecordedMembranePotentials(), function(x){return (x+0.07)/0.1;});"
                    action: "window.addBrightnessFunction()"
                },
                true: {
                    //action: "G.removeBrightnessFunctionBulkSimplified(window.getRecordedMembranePotentials(),false);"
                    action: "window.removeBrightnessFunction()"
                }
            }, {
                label: "Show simulation time",
                action: "G.addWidget(5).setName('Simulation time').setVariable(time);",
                value: "simulation_time"
            }]
        };



        //Home button initialization
         GEPPETTO.ComponentFactory.addComponent('CONTROLSMENUBUTTON', {
                configuration: configuration
        }, document.getElementById("ControlsMenuButton"), function(comp){window.controlsMenuButton = comp;});

        //Simulation controls initialization
        GEPPETTO.ComponentFactory.addComponent('SIMULATIONCONTROLS', { hideRun: true }, document.getElementById("sim-toolbar"));

        //Camera controls initialization
		GEPPETTO.ComponentFactory.addComponent('CAMERACONTROLS', {}, document.getElementById("camera-controls"));

        //Foreground initialization
        GEPPETTO.ComponentFactory.addComponent('FOREGROUND', { dropDown: false }, document.getElementById("foreground-toolbar"));

        //Customise layout
        $("#github").hide();


        //Remove idle time out warning
        GEPPETTO.G.setIdleTimeOut(-1);
        GEPPETTO.SceneController.setLinesThreshold(20000);

        //Add geppetto jupyter connector
        require('components/geppetto-jupyter/GeppettoJupyterModelSync');
        require('components/geppetto-jupyter/GeppettoJupyterGUISync');
        require('components/geppetto-jupyter/GeppettoJupyterWidgetSync');


    };
});
