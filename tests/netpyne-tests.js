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

	//load netpyne main landing page
	casper.start(urlBase+"geppetto", function () {
		this.echo("Load : " + urlBase);
		//wait for the loading spinner to go away, meaning netpyne has loaded
		this.waitWhileVisible('div[id="loading-spinner"]', function () {
			this.wait(5000,function(){ //test some expected HTML elements in landing page
				this.echo("I've waited for netpyne to load.");
				test.assertTitle("NetPyNE", "NetPyNE title is ok");
				test.assertExists('div[id="widgetContainer"]', "NetPyNE loads the initial widgetsContainer");
				test.assertExists('div[id="mainContainer"]', "NetPyNE loads the initial mainContainer");
				//test.assertExists('div[id="settingsIcon"]', "NetPyNE loads the initial settingsIcon");
			});
		},null,40000);
	});

	casper.then(function () { //test HTML elements in landing page
		casper.echo("######## Testing landping page contents and layout ######## ");
		testLandingPage(test);
	});

	casper.then(function () { //test initial state of consoles
		casper.echo("######## Test Consoles ######## ");
		testConsoles(test);
	});

	casper.then(function () { // test adding a population using UI
		casper.echo("######## Test Add Population ######## ");
		addPopulation(test);
	});

	casper.then(function () { // test adding a cell rusing using UI
		casper.echo("######## Test Add Cell Rule ######## ");
		addCellRule(test);
	});

	casper.then(function () { //test full netpyne loop using a demo project
		casper.echo("######## Running Demo ######## ");
		var demo = "from neuron_ui.tests.tut3 import netParams, simConfig \n" +
		"netpyne_geppetto.netParams=netParams \n" +
		"netpyne_geppetto.simConfig=simConfig";
		loadModelUsingPython(test,demo);
	});

	casper.then(function(){ //test explore network tab functionality
		casper.echo("######## Test Explore Network Functionality ######## ");
		exploreNetwork(test);
	});

	casper.then(function(){ //test simulate network tab functionality
		casper.echo("######## Test Simulate Network Functionality ######## ");
		simulateNetwork(test);
	});

	casper.run(function() {
		test.done();
	});
});

/**
 * Test existence of HTML elements expected when main landing page is reached
 */
function testLandingPage(test){
	casper.then(function () {		
		test.assertExists('div[id="Populations"]', 'Populations button exists.');
		test.assertExists('div[id="CellRules"]', "Cell rules button exists.");
		test.assertExists('div[id="Synapses"]', "Synapses button exists.");
		test.assertExists('div[id="Connections"]', "Connections button exists.");
		test.assertExists('div[id="SimulationSources"]', "Connections button exists.");
		test.assertExists('div[id="Configuration"]', "Configuration button exists.");
		test.assertExists('button[id="defineNetwork"]', 'Define network button exists.');
		test.assertExists('button[id="exploreNetwork"]', 'Explore network button exists.');
		test.assertExists('button[id="simulateNetwork"]', 'Simulate network button exists.');
	});
}

/**
 * Load consoles and test they toggle
 */
function testConsoles(test){
	casper.then(function () { //test existence and toggling of python console
		loadConsole(test, 'pythonConsoleButton', "pythonConsole");
	});
	casper.then(function () { //test existence and toggling of console
		loadConsole(test, 'consoleButton', "console");
	});
}

/**
 * Load console, and test it hides/shows fine
 */
function loadConsole(test, consoleButton, consoleContainer){
	casper.then(function () {
		casper.click('#'+consoleButton);
		casper.waitUntilVisible('div[id="'+consoleContainer+'"]', function() {
			this.echo(consoleContainer + ' loaded.');
			test.assertExists('div[id="'+consoleContainer+'"]', consoleContainer + " exists");
			casper.click('#consoleButton');
			casper.waitWhileVisible('div[id="'+consoleContainer+'"]', function() {
				this.echo(consoleContainer + ' hidden.');
				test.assertNotVisible('div[id="'+consoleContainer+'"]', consoleContainer + " no longer visible");
			},5000);
		},5000);
	});
}

/**
 * Adds a population using the add population button
 */
function addPopulation(test){
	casper.then(function () { //expand populations view and add a new population using the button
		casper.click('#Populations');
		casper.waitUntilVisible('button[id="newPopulationButton"]', function() {
			this.click('#newPopulationButton');
			casper.then(function(){
				testPopulation(test, "button#Population", "Population", "", "", null);
			});
		},5000);
	});
	casper.then(function () { //hide populations view
		casper.click('#Populations');
		casper.waitWhileVisible('button[id="newPopulationButton"]', function() {
			test.assertDoesntExist('button[id="newPopulationButton"]', "Populations view collapsed");
		},5000);
	});
}

/**
 * Adds a cell rule using the add cell rule button
 */
function addCellRule(test){
	casper.then(function () { //expand cell rules view and add a new one using the button
		casper.click('#CellRules');
		casper.waitUntilVisible('button[id="newCellRuleButton"]', function() {
			this.echo('Add Cell Rule button exists.');
			this.click('#newCellRuleButton');
			casper.then(function(){
				testCellRule(test, "button#CellRule", "CellRule", "", "");
			});
		},5000);
	});
	casper.then(function () { //hide the cell rules view
		casper.click('#CellRules');
		casper.waitWhileVisible('button[id="newCellRuleButton"]', function() {
			test.assertDoesntExist('button[id="newCellRuleButton"]', "Cell Rules view collapsed");
		},5000);
	});
}

/**
 * Tests adding a new population and its contents
 */
function testPopulation(test, buttonSelector, expectedName, expectedCellModel, expectedCellType, expectedDimensions){
	casper.then(function(){
		this.echo("------Testing population button "+ buttonSelector);
		casper.waitUntilVisible(buttonSelector, function() {
			test.assertExists(buttonSelector, "Population " + expectedName + " correctly created");
			casper.click('#'+expectedName);
			casper.then(function(){ //give it time so metadata gets loaded
				casper.wait(2000,function(){this.echo("I've waited a second for metadata to be populated")});
			});
			this.echo('Population metadata loaded.');
			casper.then(function () { //test metadata contents
				testElementValue(test, "#populationName", expectedName);
				testElementValue(test, "#popCellModel", expectedCellModel);
				testElementValue(test, "#popCellType", expectedCellType);
				testElementValue(test, "#dimensions", expectedDimensions);
			});
		},5000);
	});
}

/**
 * Test adding a new cell rule and its contents
 */
function testCellRule(test, buttonSelector, expectedName, expectedCellModel, expectedCellType){
	casper.then(function(){
		this.echo("------Testing cell rules button "+ buttonSelector);
		casper.waitUntilVisible(buttonSelector, function() {
			this.echo('Cell Rule button exists.');
			this.click('#'+expectedName);
			casper.then(function(){ //give it some time to allow metadata to load
				casper.wait(2000,function(){this.echo("I've waited a second for metadata to be populated")});
			});
			casper.then(function () { //test contents of metadata
				testElementValue(test, "#cellRuleName", expectedName);
				testElementValue(test, "#cellRuleCellModel", expectedCellModel);
				testElementValue(test, "#cellRuleCellType", expectedCellType);
			});
		},5000);
	});
}

function testElementValue(test, elementID, expectedName){
	casper.then(function () {
		var name = casper.evaluate(function(elementID) {
			return $(elementID).val();
		},elementID);
		test.assertEquals(name, expectedName, elementID + " field correctly populated");
	});
}

/**
 * Load demo model using python
 */
function loadModelUsingPython(test,demo){
	casper.then(function () {
		this.echo("------Loading demo for further testing ");
		casper.evaluate(function(demo) {
			var kernel = IPython.notebook.kernel;
			kernel.execute(demo);
		},demo);
	});

	casper.then(function () { //make populations view visible
		casper.click('#Populations');
		casper.waitUntilVisible('button[id="newPopulationButton"]', function() {
			this.echo("Population view loaded");
		},5000);
	});

	casper.then(function(){ //test first population exists after demo is loaded
		testPopulation(test, "button#S", "S", "HH", "PYR", "20");
	});

	casper.then(function(){//test second population exists after demo is loaded
		testPopulation(test, "button#M", "M", "HH", "PYR", "20");
	});

	casper.then(function () { //expand cell rules view
		casper.click('#CellRules');
		casper.waitUntilVisible('button[id="newCellRuleButton"]', function() {
			this.echo("Cell Rule view loaded");
		},5000);
	});

	casper.then(function(){//test a cell rule exists after demo is loaded
		testCellRule(test, "button#PYRrule", "PYRrule", "", "PYR");
	});
}

/**
 * Test functionality within the explore network view
 */
function exploreNetwork(test){
	casper.then(function(){
		this.echo("------Testing explore network");
		test.assertExists('button[id="exploreNetwork"]', "Explore network button exists");
		casper.click('#exploreNetwork');
		casper.waitUntilVisible('button[id="okInstantiateNetwork"]', function() {
			casper.then(function(){
				canvasComponentsTests(test);
			});
			casper.then(function(){ //switch to explore network tab
				casper.click('#okInstantiateNetwork');
				casper.waitWhileVisible('button[id="okInstantiateNetwork"]', function() {
					test.assertDoesntExist('button[id="okInstantiateNetwork"]', "Explore network dialog is gone");
					casper.waitWhileVisible('div[id="loading-spinner"]', function() {
						test.assertDoesntExist('button[id="okInstantiateNetwork"]', "Explore network's finished loading");
						this.echo("Testing meshes for network exist and are visible");
						testMeshVisibility(test,true, "network.S[0]");
						testMeshVisibility(test,true, "network.S[1]");
						testMeshVisibility(test,true, "network.S[2]");
						testMeshVisibility(test,true, "network.S[18]");
						testMeshVisibility(test,true, "network.S[19]");
					},5000);
				},5000);
			});

		},5000);
	});

	casper.then(function(){ //open up plot menu 
		casper.click('#PlotButton');
	});

	casper.then(function(){ //wait for plot menu to become visible
		casper.waitUntilVisible('div[role="menu"]', function() {
			test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");
			casper.then(function(){ // test 2d Net plot comes up
				testPlotButton(test, "2dNetPlot", "Popup1");
			});	
			casper.then(function(){ // test shape plot comes up
				//testPlotButton(test, "shapePlot", "Popup1");
			});	
			casper.then(function(){ // test connection plot comes up
				testPlotButton(test, "connectionPlot", "Popup1");
			});	

		},5000);
	});

	casper.then(function(){	// click on plot button again to close the menu	
		casper.evaluate(function() {
			$("#PlotButton").click();
		});
		casper.waitWhileVisible('div[role="menu"]', function() { //wait for menu to close
			test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");
		},5000);
	});

	casper.then(function(){ //open up control panel
		casper.click('#ControlPanelButton');
	});

	casper.then(function(){ //test initial load values in control panel
		testControlPanelValues(test,43);
	});

	casper.then(function(){ //close control panel
		casper.click('#ControlPanelButton');
	});
}

/**
 * Test functionality within the simulate network view
 */
function simulateNetwork(test){
	casper.then(function(){
		this.echo("------Testing explore network");
		test.assertExists('button[id="simulateNetwork"]', "Simulate network button exists");
		casper.click('#simulateNetwork');
		casper.waitUntilVisible('button[id="runSimulation"]', function() {
			casper.then(function(){
				casper.click('#runSimulation');
				casper.waitWhileVisible('button[id="runSimulation"]', function() {
					casper.echo("Dialog disappeared");
					casper.waitWhileVisible('div[id="loading-spinner"]', function() {
						casper.echo("Loading spinner disappeared");
						this.echo("Testing meshes for network exist and are visible");
						testMeshVisibility(test,true, "network.S[0]");
						testMeshVisibility(test,true, "network.S[1]");
						testMeshVisibility(test,true, "network.S[2]");
						testMeshVisibility(test,true, "network.S[18]");
						testMeshVisibility(test,true, "network.S[19]");
					},150000);
				},150000);
			});

		},15000);
	});

	casper.then(function(){
		casper.click('#PlotButton');
	});

	casper.then(function(){
		casper.waitUntilVisible('div[role="menu"]', function() {
			test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");

			casper.then(function(){
				testPlotButton(test, "rasterPlot", "Popup1");
			});	

			casper.then(function(){
				testPlotButton(test, "spikePlot", "Popup1");
			});	

			casper.then(function(){
				testPlotButton(test, "spikeStatsPlot", "Popup1");
			});	

			casper.then(function(){
				testPlotButton(test, "ratePSDPlot", "Popup1");
			});	

			casper.then(function(){
				testPlotButton(test, "tracesPlot", "Popup1");
			});	

			casper.then(function(){
				testPlotButton(test, "grangerPlot", "Popup1");
			});	
		},5000);
	});

	casper.then(function(){		
		casper.evaluate(function() {
			$("#PlotButton").click();
		});

		casper.waitWhileVisible('div[role="menu"]', function() {
			test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");

		},5000);
	});
}

function testMeshVisibility(test,visible,variableName){
	casper.then(function(){		
		var visibility = casper.evaluate(function(variableName) {
			var visibility = CanvasContainer.engine.getRealMeshesForInstancePath(variableName)[0].visible;
			return visibility;
		},variableName);
		test.assertEquals(visibility,visible, variableName +" visibility correct");
	});
}

function waitForPlotGraphElement(test, elementID){
	casper.waitUntilVisible('g[id="'+elementID+'"]', function() {
		test.assertExists('g[id="'+elementID+'"]', "Element " +elementID +" exists");
	},5000);
}

/**
 * Test canvas controllers and other HTML elements 
 */
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

/**
 * Tests the different plotting options using the plot button on the canvas
 */
function testPlotButton(test, plotButton, expectedPlot){
	casper.then(function(){
		test.assertExists('span[id="'+plotButton+'"]', "Menu option "+plotButton+"Exists");
		casper.evaluate(function(plotButton, expectedPlot){
			document.getElementById(plotButton).click(); //Click on plot option
		}, plotButton, expectedPlot);
		casper.then(function(){
			casper.waitUntilVisible('div[id="'+expectedPlot+'"]', function() {
				test.assertExists('div[id="'+expectedPlot+'"]', expectedPlot + " (" + plotButton + ") exists");
				casper.then(function(){ //test plot has certain elements that are render if plot succeeded
					waitForPlotGraphElement(test,"figure_1");
					waitForPlotGraphElement(test,"axes_1");
				});
				casper.then(function(){ //destroy the plot widget
					casper.evaluate(function(expectedPlot){
						window[expectedPlot].destroy();
					},expectedPlot);
					casper.waitWhileVisible('div[id="'+expectedPlot+'"]', function() {
						test.assertDoesntExist('div[id="'+expectedPlot+'"]', expectedPlot + " (" + plotButton + ") no longer exists");
					},5000);
				});
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
		}, true, "Open plot for action: " + plotButton);		
	});
}

/**
 * Tests control panel is loaded with right amount of elements
 */
function testControlPanelValues(test, values){
	casper.then(function(){
		casper.waitUntilVisible('div#controlpanel', function () {
			test.assertVisible('div#controlpanel', "The control panel is correctly open.");
			var rows = casper.evaluate(function() {
				return $(".standard-row").length;
			});
			test.assertEquals(rows, values, "The control panel opened with right amount of rows");
		});
	});	
	casper.then(function(){
		casper.evaluate(function() { $("#controlpanel").remove();});

		casper.waitWhileVisible('div#controlpanel', function() {
			test.assertDoesntExist('div#controlpanel', "Control Panel went away");
		},5000);
	});	
}