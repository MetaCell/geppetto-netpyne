const CELL = '#TreeContainerCutting_component > div > div:nth-child(1) > div > div > div:nth-child(10) > div.rst__nodeContent';
const XCELL = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[10]/div[4]';
const TESTS = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[6]/div[3]/div/div[1]/button';
const TUT3 = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[9]/div[4]/div/div/div/div/div[1]/span';
const TUT3JSON = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[10]/div[2]/div/div/div/div/div[1]/span';
const TUT3ALT = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[10]/div[2]/div/div/div/div/div[1]/span';
const NETPYNE_UI = '//*[@id="TreeContainerCutting_component"]/div/div[1]/div/div/div[5]/div[2]/div/div[1]/button';

const x = path => ({type: 'xpath', path: path})

// ----------------------------------------------------------------------------------- //

function importHLS(casper, test, toolbox, tut3=true) {
	casper.then(function () {
		this.waitUntilVisible('button[id="appbar"]', function(){
			this.click('button[id="appbar"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible('span[id="appBarImport"]', function(){
			this.click('span[id="appBarImport"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible('input[id="appbarImportFileName"]', function(){
			this.click('input[id="appbarImportFileName"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible(x(tut3 ? NETPYNE_UI : TUT3ALT), function() {
			this.click(x(tut3 ? NETPYNE_UI : TUT3ALT))
		})
	})
	casper.then(function(){
		if (!tut3) {
			this.bypass(3)
		}
	})
	casper.then(function() {
		this.waitUntilVisible(x(TESTS), function() {
			this.click(x(TESTS))
		})
	})
	casper.then(function() {
		this.waitUntilVisible(x(XCELL), function() {
			this.evaluate(function(selector) {
				$(selector)['0'].scrollIntoView()
			}, CELL);
		})
	})
	casper.then(function(){
		this.click(x(TUT3))
	})
	casper.then(function(){
		this.wait(1000, function() {
			this.click('button[id="browserAccept"]')
		})
	})
	
	casper.then(function(){
		this.wait(1000, function() {
			this.click('button[id="appbarPerformActionButton"]')
		})
	})
	casper.then(function() {
		this.wait(1000)
	})
	casper.then(function(){
		test.assertExist('input[id="appbarImportFileName"]', "specify if mod files required before importing HLS OK")
	})

	casper.then(function() {
		toolbox.click(this, 'appbarImportRequiresMod')
	})

	casper.then(function(){
		toolbox.click(this, 'appbarImportRequiresModNo', 'span')
	})
	casper.then(function(){
		toolbox.click(this, "appbarPerformActionButton", "button")
	})
	casper.then(function() {
		this.waitWhileVisible('input[id="appbarImportFileName"]')
    this.waitWhileVisible('div[id="loading-spinner"]', function() {
      test.assert(true, "Completed HLS import")
    }, 40000)
  })
}

// ----------------------------------------------------------------------------------- //

function instantiateNetwork(casper, test, toolbox) {
	casper.then(function() {
		this.waitUntilVisible('button[id="simulateNetwork"]', function() {
			this.click('button[id="simulateNetwork"]')
		})
	})
  casper.then(function() {
    this.waitWhileVisible('div[id="loading-spinner"]', function() {
      test.assert(this.evaluate(function() {
				return CanvasContainer.engine.getRealMeshesForInstancePath("network.S[10]")[0].visible
			}), "Instance created with 40 cells")
    }, 40000)
	})
}

// ----------------------------------------------------------------------------------- //

function simulateNetwork(casper, test, toolbox) {
	casper.thenClick('#PlotButton');

	casper.then(function() {
    this.waitUntilVisible('span[id="rasterPlot"]');
  })
  casper.thenEvaluate(function() {
    document.getElementById('rasterPlot').click();
	});
	casper.then(function() {
		this.wait(2000, function(){
			test.assertDoesntExist('div[id="rasterPlot"]', "Network has not been simulated")
		})
	})

	casper.then(function() {
    var info = this.getElementInfo('button[id="launchSimulationButton"]');
    this.mouse.click(info.x - 4, info.y - 4); //move a bit away from corner
	})
	
  casper.then(function(){
    this.wait(1000)
  })
  casper.then(function() {
    this.waitWhileVisible('div[role="menu"]', function() { //wait for menu to close
      test.assertDoesntExist('div[role="menu"]', "Plot Menu is gone");
    });
	})
	
	casper.then(function(){
		this.waitUntilVisible('button[id="launchSimulationButton"]', function(){
			this.click('button[id="launchSimulationButton"]')
		})
	})
  casper.then(function(){
		this.waitUntilVisible('button[id="okRunSimulation"]', function(){
			this.click('button[id="okRunSimulation"]')
		})
	})
	casper.then(function(){
		this.waitWhileVisible('div[id="loading-spinner"', function(){
			this.click('#PlotButton')
		})
	})

	casper.then(function() {
    this.waitUntilVisible('span[id="rasterPlot"]');
  })
  casper.thenEvaluate(function() {
    document.getElementById('rasterPlot').click();
  });
  
  casper.then(function() {
    this.waitUntilVisible('div[id="Popup1"]', function() {
			this.waitUntilVisible('g[id="figure_1"]')
			this.waitUntilVisible('g[id="axes_1"]')
		})
  })
	
	casper.then(function() {
    toolbox.click(this, "launchSimulationButton", "button"); //move a bit away from corner
	})
	
  
  casper.then(function() {
    this.waitWhileVisible('div[role="menu"]', function() { //wait for menu to close
      test.assertDoesntExist('div[role="menu"]', "Plot Menu is gone");
    });
	})
}

// ----------------------------------------------------------------------------------- //

function saveNetwork(casper, test, toolbox) {
	casper.then(function () {
		this.waitUntilVisible('button[id="appbar"]', function(){
			this.click('button[id="appbar"]')
		})
	})
	casper.then(function(){
		this.wait(2000)
	})
	casper.then(function() {
		this.waitUntilVisible('span[id="appBarSave"]', function(){
			this.click('span[id="appBarSave"]')
		})
	})
	casper.then(function(){
		this.waitUntilVisible('button[id="appbarPerformActionButton"]', function(){
			this.click('button[id="appbarPerformActionButton"]')
		})
	})
	casper.then(function() {
		this.waitWhileVisible('button[id="appbarPerformActionButton"]', function(){
			this.echo("Saved model in json format")
		})
	})
}

// ----------------------------------------------------------------------------------- //

function openNetwork(casper, test, toolbox) {
	casper.then(function () {
		this.waitUntilVisible('button[id="appbar"]', function() {
			this.click('button[id="appbar"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible('span[id="appBarOpen"]', function() {
			this.click('span[id="appBarOpen"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible('input[id="loadJsonFile"]', function() {
			this.click('input[id="loadJsonFile"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible(x(TUT3JSON), function() {
			this.click(x(TUT3JSON))
		})
	})

	casper.then(function(){
		this.wait(1000, function() {
			this.click('button[id="browserAccept"]')
		})
	})
	
	casper.then(function(){
		this.wait(1000, function() {
			this.click('button[id="appbarPerformActionButton"]')
		})
	})
	casper.then(function() {
		this.waitWhileVisible('input[id="loadJsonFile"]', function() {
			test.assert(false, 'Trying to loaded a model without specifying if mod files are required')
		}, function (){
			this.echo("Check if mod files are required OK")
		}, 1000)
	})

	casper.then(function() {
		toolbox.click(this, 'appbarLoadRequiresMod')
	})

	casper.then(function(){
		toolbox.click(this, 'appbarLoadRequiresModNo', 'span')
	})
	casper.then(function(){
		toolbox.click(this, "appbarPerformActionButton", "button")
	})
	casper.then(function() {
		this.waitWhileVisible('input[id="loadJsonFile"]')
		this.waitWhileVisible('div[id="loading-spinner"]', function() {
      test.assert(true, "Completed Model load")
    }, 40000)
	})
}

// ----------------------------------------------------------------------------------- //

function exploreOpenedModel(casper, test, toolbox) {
	casper.then(function() {
    this.waitWhileVisible('div[id="loading-spinner"]')
	})
	casper.then( function(){
		test.assert(this.evaluate(function() {
			return document.getElementById("launchSimulationButton").textContent == "You have already simulated your network"
		}) , "Launch simulation button is lock ")
	})
	casper.then(function(){
		test.assert(this.evaluate(function() {
			return document.getElementById("refreshInstanciatedNetworkButton").textContent == "Your network is in sync"
		}) , "Sync instance button is lock ")
	})

	casper.thenClick('#PlotButton')
	casper.then(function() {
		toolbox.testPlotButton(casper, test, "rasterPlot")
	})
	
	casper.then(function() {
		toolbox.testPlotButton(casper, test, "connectionPlot")
	})

	casper.then(function() {
    toolbox.click(this, "launchSimulationButton", "button"); //move a bit away from corner
	})

	casper.then(function(){
		this.wait(2000)
	})
}

// ----------------------------------------------------------------------------------- //

function saveHLS(casper, test, toolbox) {
	casper.then(function () {
		this.waitUntilVisible('button[id="appbar"]', function(){
			this.click('button[id="appbar"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible('span[id="appBarExport"]', function(){
			this.click('span[id="appBarExport"]')
		})
	})
	casper.then(function(){
		this.waitUntilVisible('button[id="appbarPerformActionButton"]', function(){
			this.click('button[id="appbarPerformActionButton"]')
		})
	})
	casper.then(function(){
		this.waitWhileVisible('button[id="appbarPerformActionButton"]')
	})
	casper.then(function(){
		this.waitWhileVisible('div[id="loading-spinner', function(){
			this.echo("HLS were saved")
		})
	})
}

// ----------------------------------------------------------------------------------- //

function clearModel(casper, test, toolbox) {
	casper.then(function () {
		this.waitUntilVisible('button[id="appbar"]', function(){
			this.click('button[id="appbar"]')
		})
	})
	casper.then(function() {
		this.waitUntilVisible('span[id="appBarDelete"]', function(){
			this.click('span[id="appBarDelete"]')
		})
	})
	casper.then(function(){
		this.waitUntilVisible('button[id="appbarPerformActionButton"]', function(){
			this.evaluate(function() {
				document.getElementById("appbarPerformActionButton").click()
			})
		})
	})

	casper.then(function(){
		this.waitWhileVisible('button[id="appbarPerformActionButton"]')
	})

	casper.then(function() {
		this.waitUntilVisible('div[id="Populations"]', function(){
			this.click('div[id="Populations"]')
		})
	})
	casper.then(function(){
		this.wait(1000)
	})
	casper.then(function(){
		test.assertDoesntExist('input[id="populationName"]', "Model deleted")
	})
}
module.exports = {  
	importHLS: importHLS,
	instantiateNetwork: instantiateNetwork,
	simulateNetwork: simulateNetwork,
	saveNetwork: saveNetwork,
	openNetwork: openNetwork,
	exploreOpenedModel: exploreOpenedModel,
	saveHLS: saveHLS,
	clearModel: clearModel
}