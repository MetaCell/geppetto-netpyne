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
		
		//Customise layout
		$("#github").hide();
		$("#sim").css("background-color","#3e2723");
		
		//Create python console
		var pythonNotebookPath = "";
        GEPPETTO.ComponentFactory.addComponent('PYTHONCONSOLE', {pythonNotebookPath: pythonNotebookPath}, document.getElementById("pythonConsole"));
		
        //Remove idle time out warning
        GEPPETTO.G.setIdleTimeOut(-1);
        
        //Add geppetto jupyter connector
        require('components/jupyter/GeppettoJupyter');

	};
});