define(function (require) {
	return function (GEPPETTO) {

		//Inject css stylesheet
	    var link = document.createElement("link");
	    link.type = "text/css";
	    link.rel = "stylesheet";
	    link.href = "geppetto/extensions/geppetto-neuron/css/material.css";
	    document.getElementsByTagName("head")[0].appendChild(link);
	    
		//Logo initialization 
		GEPPETTO.ComponentFactory.addComponent('LOGO', {logo: 'gpt-gpt_logo'}, document.getElementById("geppettologo"));

		//Control panel initialization
		GEPPETTO.ComponentFactory.addComponent('CONTROLPANEL', {}, document.getElementById("controlpanel"));

		//Spotlight initialization
		GEPPETTO.ComponentFactory.addComponent('SPOTLIGHT', {}, document.getElementById("spotlight"));

		//Create python console
		var pythonNotebookPath = "http://localhost:8888/notebooks/libs/neuron-ui-demo.ipynb";
        GEPPETTO.ComponentFactory.addComponent('PYTHONCONSOLE', {pythonNotebookPath: pythonNotebookPath}, document.getElementById("pythonConsole"));

		//Experiments table initialization
		GEPPETTO.ComponentFactory.addComponent('EXPERIMENTSTABLE', {}, document.getElementById("experiments"));

		//Simulation controls initialization
		GEPPETTO.ComponentFactory.addComponent('SIMULATIONCONTROLS', {}, document.getElementById("sim-toolbar"));

		//Foreground initialization
		GEPPETTO.ComponentFactory.addComponent('FOREGROUND', {dropDown : false}, document.getElementById("foreground-toolbar"));

		//Customise layout
		$("#github").hide();
		$("#sim").css("background-color","#3e2723");
		

        //Remove idle time out warning
        GEPPETTO.G.setIdleTimeOut(-1);
        
        //Add geppetto jupyter connector
        require('components/jupyter/GeppettoJupyter');

	};
});