var urlBase = casper.cli.get('host');
if(urlBase==null || urlBase==undefined){
	urlBase = "http://localhost:8888/";
}

casper.test.begin('NetPyNE projects tests', function suite(test) {
	casper.options.viewportSize = {
			width: 1340,
			height: 768
	};

	casper.on("page.error", function(msg, trace) {
		this.echo("Error: " + msg, "ERROR");
	});

	// show page level errors
	casper.on('resource.received', function (resource) {
		var status = resource.status;
		if (status >= 400) {
			this.echo('URL: ' + resource.url + ' Status: ' + resource.status);
		}
	});

	casper.start(urlBase+"geppetto", function () {
		this.echo("Load : " + urlBase);
		this.waitWhileVisible('div[id="loading-spinner"]', function () {
			this.wait(2000,function(){
				this.echo("I've waited for netpyne to load.");
				test.assertTitle("NetPyNE", "NetPyNE title is ok");
				test.assertExists('div[id="widgetContainer"]', "NetPyNE loads the initial widgetsContainer");
				test.assertExists('div[id="mainContainer"]', "NetPyNE loads the initial mainContainer");
				test.assertExists('div[id="settingsIcon"]', "NetPyNE loads the initial settingsIcon");
			});
		},null,40000);
	});

	casper.then(function () {
		casper.echo("Testing landping page contents and layout");
		testLandingPage(test);
	});

	casper.then(function () {
		loadConsoles(test);
	});

//	casper.then(function () {
//	addPopulation(test);
//	});

	casper.then(function () {
		addCellRule(test);
	});

	casper.then(function () {
		var demo = "from neuron_ui.tests.tut3 import netParams, simConfig \n" +
		"netpyne_geppetto.netParams=netParams \n" +
		"netpyne_geppetto.simConfig=simConfig";
		loadModelUsingPython(test,demo);
	});

	casper.then(function(){
		exploreNetwork(test);
	});

	casper.then(function(){
		simulateNetwork(test);
	});

	casper.run(function() {
		test.done();
	});
});

function testLandingPage(test){
	casper.then(function () {		
		test.assertExists('div[id="Populations"]', 'Populations button exists.');
		test.assertExists('div[id="CellRules"]', "Cell rules button exists.");
		test.assertExists('div[id="Synapses"]', "Synapses button exists.");
		casper.waitForText('Connections', function(){this.echo("Connections button exists.")});
		test.assertExists('div[id="Configuration"]', "Configuration button exists.");
		test.assertExists('button[id="defineNetwork"]', 'Define network button exists.');
		test.assertExists('button[id="exploreNetwork"]', 'Explore network button exists.');
		test.assertExists('button[id="simulateNetwork"]', 'Simulate network button exists.');
	});
}

function addPopulation(test){
	casper.then(function () {
		casper.click('#Populations');
		casper.waitUntilVisible('button[id="newPopulationButton"]', function() {
			this.click('#newPopulationButton');
			casper.then(function(){
				testPopulation(test, "Population", "", "", null);
			});
		},5000);
	});
}

function addCellRule(test){
	casper.then(function () {
		casper.click('#CellRules');
		casper.waitUntilVisible('button[id="newCellRuleButton"]', function() {
			this.echo('Add Cell Rule button exists.');
			this.click('#newCellRuleButton');
			casper.waitUntilVisible('button[id="CellRule"]', function() {
				this.echo('Cell Rule button exists.');
				this.click('#CellRule');
				casper.click('#CellRules');
			},5000);
		},5000);
	});
}

function loadConsoles(test){
	casper.then(function () {
		casper.click('#pythonConsoleButton');
		casper.waitUntilVisible('div[id="pythonConsole"]', function() {
			this.echo('Python console loaded.');
			test.assertExists('div[id="pythonConsole"]', "Python console exists");
			casper.click('#pythonConsoleButton');
			casper.waitWhileVisible('div[id="pythonConsole"]', function() {
				this.echo('Python console hidden.');
				test.assertNotVisible('div[id="pythonConsole"]', "Python console no longer visible");
			},5000);
		},5000);
	});

	casper.then(function () {
		casper.click('#consoleButton');
		casper.waitUntilVisible('div[id="console"]', function() {
			this.echo('Console loaded.');
			test.assertExists('div[id="console"]', "Console exists");
			casper.click('#consoleButton');
			casper.waitWhileVisible('div[id="console"]', function() {
				this.echo('Console hidden.');
				test.assertNotVisible('div[id="console"]', "Console no longer visible");
			},5000);
		},5000);
	});
}

function loadModelUsingPython(test,demo){
	casper.then(function () {
		casper.evaluate(function(demo) {
			var kernel = IPython.notebook.kernel;
			kernel.execute(demo);
		},demo);
	});

	casper.then(function () {
		casper.click('#Populations');
	});

	casper.then(function(){
		testPopulation(test, "button#S", "S", "HH", "PYR", "20");
	});

	casper.then(function(){
		testPopulation(test, "button#M", "M", "HH", "PYR", "20");
	});
}

function testPopulation(test, buttonSelector, expectedName, expectedCellModel, expectedCellType, expectedDimensions){
	casper.then(function(){
		this.echo("Testing population button "+ buttonSelector);
		casper.waitUntilVisible(buttonSelector, function() {
			test.assertExists(buttonSelector, "Population " + expectedName + " correctly created");
			casper.click('#'+expectedName);
			casper.then(function(){
				casper.wait(1000,function(){this.echo("I've waited a second for metadata to be populated")});
			});
			casper.echo("Click "+expectedName);
			this.echo('Population metadata loaded.');
			casper.then(function () {
				var populationName = casper.evaluate(function() {
					return $("#populationName").val();
				});
				test.assertEquals(populationName, expectedName, "Population name field correctly populated");

				var cellModel = casper.evaluate(function() {
					return $("#cellModel").val();
				});
				test.assertEquals(cellModel, expectedCellModel, "Cell Model field correctly populated");

				var cellType = casper.evaluate(function() {
					return $("#cellType").val();
				});
				test.assertEquals(cellType, expectedCellType, "Cell Type field correctly populated");

				var dimensions = casper.evaluate(function() {
					return $("#dimensions").val();
				});
				test.assertEquals(dimensions, expectedDimensions, "Dimensions name field correctly populated");
			});
		},5000);
	});
}

function canvasComponentsTests(test){
	casper.then(function(){
		this.echo("Testing existence of few simulation controls")
		test.assertExists('button[id="panLeftBtn"]', "Pan left button present");
		test.assertExists('button[id="panUpBtn"]', "Pan up button present");
		test.assertExists('button[id="panRightBtn"]', "Pan right button present");
		test.assertExists('button[id="panHomeBtn"]', "Pan home button present");
		test.assertExists('button[id="zoomOutBtn"]', "Zoom out button present");
		test.assertExists('button[id="zoomInBtn"]', "Zoom in button present");
		test.assertExists('button[id="PlotButton"]', "Plot button present");
		test.assertExists('button[id="ControlPanelButton"]', "Control panel ");
	});
}
function exploreNetwork(test){
	casper.then(function(){
		test.assertExists('button[id="exploreNetwork"]', "Explore network button exists");
		casper.click('#exploreNetwork');
		casper.waitUntilVisible('button[id="confirmModal"]', function() {
			casper.then(function(){
				canvasComponentsTests(test);
			});
			casper.then(function(){
				casper.click('#confirmModal');
				casper.waitWhileVisible('button[id="confirmModal"]', function() {
					casper.echo("Dialog disappeared");
					casper.waitWhileVisible('div[id="loading-spinner"]', function() {
						casper.echo("Loading spinner disappeared");
						this.echo("Testing meshes for network exists and are visible");
						for(var i=0; i<15; i++){
							testMeshVisibility(test,true, "network.S["+i+"]");
						}
					},5000);
				},5000);
			});

		},5000);
	});

	casper.then(function(){
		//test.assertExists('div[id="PlotButton"]', "Plot Button Exists");
		casper.click('#PlotButton');
	});

	casper.then(function(){
		casper.waitUntilVisible('div[role="menu"]', function() {
			test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");

			casper.then(function(){
				testPlotButton(test, "2dNetPlot", "Popup1");
			});	

			casper.then(function(){
				testPlotButton(test, "shapePlot", "Popup1");
			});	

			casper.then(function(){
				testPlotButton(test, "connectionPlot", "Popup1");
			});	
			
			casper.then(function(){		
				casper.evaluate(function() {
					$("#PlotButton").click();
				});
				
				casper.waitWhileVisible('div[role="menu"]', function() {
					test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");

				},5000);
			});

		},5000);
	});
	


	casper.then(function(){
		casper.click('#ControlPanelButton');
	});

	casper.then(function(){
		testControlPanelValues(test,43);
	});
	
	casper.then(function(){
		casper.click('#ControlPanelButton');
	});
}

function simulateNetwork(test){
	casper.then(function(){
		test.assertExists('button[id="simulateNetwork"]', "Simulate network button exists");
		casper.click('#simulateNetwork');
		casper.waitUntilVisible('button[id="confirmModal"]', function() {
			casper.then(function(){
				casper.click('#confirmModal');
				casper.waitWhileVisible('button[id="confirmModal"]', function() {
					casper.echo("Dialog disappeared");
					casper.waitWhileVisible('div[id="loading-spinner"]', function() {
						casper.echo("Loading spinner disappeared");
					},150000);
				},150000);
			});

		},15000);
	});
}

function testMeshVisibility(test,visible,variableName){
	var visibility = casper.evaluate(function(variableName) {
		var visibility = CanvasContainer.engine.getRealMeshesForInstancePath(variableName)[0].visible;
		return visibility;
	},variableName);

	test.assertEquals(visibility,visible, variableName +" visibility correct");
}

function testPlotButton(test, plotButton, expectedPlot){
	casper.then(function(){
		test.assertExists('span[id="'+plotButton+'"]', "Menu option "+plotButton+"Exists");
		casper.evaluate(function(plotButton, expectedPlot){
			document.getElementById(plotButton).click();
		}, plotButton, expectedPlot);
		casper.then(function(){
			casper.waitUntilVisible('div[id="'+expectedPlot+'"]', function() {
				test.assertExists('div[id="'+expectedPlot+'"]', expectedPlot + " (" + plotButton + ") exists");
				casper.evaluate(function(expectedPlot){
					window[expectedPlot].destroy();
				},expectedPlot);
				casper.waitWhileVisible('div[id="'+expectedPlot+'"]', function() {
					test.assertDoesntExist('div[id="'+expectedPlot+'"]', expectedPlot + " (" + plotButton + ") no longer exists");
				},5000);
			},5000);
		});
	});

	casper.then(function(){
		var plotError = test.assertEvalEquals(function(){
			var error = document.getElementById("netPyneDialog")==undefined;
			if(!error){
				document.getElementById("netPyneDialog").click();
			}
			return error;
		}, true, "Failed to open plot for action: " + plotButton);		
	});
}

function testControlPanelValues(test, values){
	casper.then(function(){
		casper.waitUntilVisible('div#controlpanel', function () {
			test.assertVisible('div#controlpanel', "The control panel is correctly open.");
			var rows = casper.evaluate(function() {
				var rows = $(".standard-row").length;
				return rows;
			});
			test.assertEquals(rows, values, "The control panel opened with right amount of rows");


		});
	});	


	casper.then(function(){
		casper.evaluate(function() {
			$("#controlpanel").remove();
		});

		casper.waitWhileVisible('div#controlpanel', function() {
			test.assertDoesntExist('div#controlpanel', "Control Panel went away");
		},5000);
	});	
}