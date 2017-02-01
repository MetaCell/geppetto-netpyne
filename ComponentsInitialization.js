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
        GEPPETTO.ComponentFactory.addComponent('CONTROLPANEL', {}, document.getElementById("controlpanel"), function () {


            GEPPETTO.ControlPanel.setColumnMeta([
                { "columnName": "path", "order": 1, "locked": false, "displayName": "Path", "source": "$entity$.getPath()" },
                {
                    "columnName": "variablePath",
                    "order": 2,
                    "locked": false,
                    "displayName": "Variable",
                    "source": "$entity$.getName()"
                },
                {
                    "columnName": "controls",
                    "order": 4,
                    "locked": false,
                    "customComponent": GEPPETTO.ControlsComponent,
                    "displayName": "Controls",
                    "source": "",
                    "action": "GEPPETTO.ControlPanel.refresh();"
                }]);

            GEPPETTO.ControlPanel.setColumns(['variablePath', 'controls']);

            GEPPETTO.ControlPanel.setDataFilter(function () {
                var filteredData = []
                if (window.Instances && window.Instances.length > 0) {
                    filteredData = window.Instances.getInstance(GEPPETTO.ModelFactory.getAllPotentialInstancesOfMetaType(GEPPETTO.Resources.STATE_VARIABLE_TYPE));
                }
                return filteredData;
            });
            GEPPETTO.ControlPanel.setControlsConfig({
                "VisualCapability": {},
                "Common": {
                    "plot": {
                        "id": "plot",
                        "actions": ["G.addWidget(0).plotData($instance$).setSize(273.8,556.8).setPosition(130,35).setName($instance$.getPath());"],
                        "icon": "fa-area-chart",
                        "label": "Plot",
                        "tooltip": "Plot variable"
                    }
                }
            });
            GEPPETTO.ControlPanel.setControls({ "VisualCapability": [], "Common": ['plot'] });

            GEPPETTO.ControlPanel.addData(window.Instances);

            GEPPETTO.on(Events.Model_loaded, function () {
                GEPPETTO.ControlPanel.refresh();
            });


        });

        //Spotlight initialization
        GEPPETTO.ComponentFactory.addComponent('SPOTLIGHT', {}, document.getElementById("spotlight"));

        //Create python console
        var pythonNotebookPath = "http://localhost:8888/notebooks/libs/neuron-ui-demo.ipynb";
        GEPPETTO.ComponentFactory.addComponent('PYTHONCONSOLE', { pythonNotebookPath: pythonNotebookPath }, document.getElementById("pythonConsole"));

        //Experiments table initialization
        GEPPETTO.ComponentFactory.addComponent('EXPERIMENTSTABLE', {}, document.getElementById("experiments"));

        window.getRecordedMembranePotentials = function() {
            return Project.getActiveExperiment().getWatchedVariables(true, false);
            // var instances = Project.getActiveExperiment().getWatchedVariables(true, false);
            // var v = [];
            // for (var i = 0; i < instances.length; i++) {
            //     if (instances[i].getInstancePath().endsWith(".v")) {
            //         v.push(instances[i]);
            //     }
            // }
            // return v;
        };

        // window.addBrightnessFunction = function(){
        //     for(var membranePotentialsIndex in window.getRecordedMembranePotentials()){
        //         //modulation = statevariable
        //         //instance =geometry
        //             G.addBrightnessListener(instance, modulation, normalizationFunction)

        //             }
        // }

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
                height: "auto",
                width: 300
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
                    action: "G.addBrightnessFunctionBulkSimplified(window.getRecordedMembranePotentials(), function(x){return (x+0.07)/0.1;});"
                    
                },
                true: {
                    action: "G.removeBrightnessFunctionBulkSimplified(window.getRecordedMembranePotentials(),false);"
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
        GEPPETTO.ComponentFactory.addComponent('SIMULATIONCONTROLS', {}, document.getElementById("sim-toolbar"));

        //Camera controls initialization
		GEPPETTO.ComponentFactory.addComponent('CAMERACONTROLS', {}, document.getElementById("camera-controls"));

        //Foreground initialization
        GEPPETTO.ComponentFactory.addComponent('FOREGROUND', { dropDown: false }, document.getElementById("foreground-toolbar"));

        //Customise layout
        $("#github").hide();
        $("#sim").css("background-color", "#3e2723");


        //Remove idle time out warning
        GEPPETTO.G.setIdleTimeOut(-1);

        //Add geppetto jupyter connector
        require('components/geppetto-jupyter/GeppettoJupyterModelSync');
        require('components/geppetto-jupyter/GeppettoJupyterGUISync');
        require('components/geppetto-jupyter/GeppettoJupyterWidgetSync');


    };
});