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
		        this.echo("I've waited for netpyne to load.");
		        test.assertTitle("geppetto", "geppetto title is ok");
		        test.assertExists('div[id="sim-toolbar"]', "geppetto loads the initial simulation controls");
		        test.assertExists('div[id="controls"]', "geppetto loads the initial camera controls");
		        test.assertExists('div[id="foreground-toolbar"]', "geppetto loads the initial foreground controls");
		    },null,10000);
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