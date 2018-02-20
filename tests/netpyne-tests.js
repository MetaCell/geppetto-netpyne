var urlBase = casper.cli.get('host');
if(urlBase==null || urlBase==undefined){
    urlBase = "http://localhost:8888/";
}

casper.test.begin('Geppetto default projects tests', function suite(test) {
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

	casper.start(urlBase, function () {
		this.echo("Load : " + urlBase);
		 this.waitWhileVisible('div[id="loading-spinner"]', function () {
		        this.echo("I've waited for netpyne to load.");
		        test.assertTitle("NetPyNE", "NetPyNE title is ok");
		        test.assertExists('div[id="widgetContainer"]', "NetPyNE loads the initial widgetsContainer");
		        test.assertExists('div[id="mainContainer"]', "NetPyNE loads the initial mainContainer");
		        test.assertExists('div[id="settingsIcon"]', "NetPyNE loads the initial settingsIcon");
		    },null,timeAllowed);
	});

	casper.then(function () {
		casper.echo("Testing landping page contents and layout");
		testLandingPage(test);
	});
	
	casper.run(function() {
		test.done();
	});
});

function testLandingPage(test){
	casper.then(function () {
		casper.waitForText("Populations", function() {
			this.echo('Populations button exists.');
		},5000);

		casper.waitForText("Cell rules", function() {
			this.echo('Cell rules button exists.');
		},5000);
		
		casper.waitForText("Synapses", function() {
			this.echo('Synapses button exists.');
		},5000);
		
		casper.waitForText("Connectivity rules", function() {
			this.echo('Connectivity rules button exists.');
		},5000);
		
		casper.waitForText("Stimulation sources", function() {
			this.echo('Stimulation sources button exists.');
		},5000);
		
		casper.waitForText("Synapses", function() {
			this.echo('Synapses button exists.');
		},5000);
		
		casper.waitForText("Stimulation targets", function() {
			this.echo('Stimulation targets button exists.');
		},5000);
		
		casper.waitForText("Configuration", function() {
			this.echo('Configuration button exists.');
		},5000);
	});
}