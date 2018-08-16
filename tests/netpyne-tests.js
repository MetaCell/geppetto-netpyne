var tb = require('./toolbox');
var urlBase = casper.cli.get('host');
if (urlBase == null || urlBase == undefined) {
  urlBase = "http://localhost:8888/";
}
tb.active = { // keeps track of current location (to refresh field if its value is not correct)
  cardID: "Populations",
  buttonID: "newPopulationButton",
  tabID: false
}

casper.test.begin('NetPyNE projects tests', function suite(test) {
  casper.options.viewportSize = {
    width: 1340,
    height: 768
  };
  casper.options.waitTimeout = 10000

  casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
  });

  // show page level errors
  casper.on('resource.received', function(resource) {
    var status = resource.status;
    if (status >= 400) {
      this.echo('URL: ' + resource.url + ' Status: ' + resource.status);
    }
  });

  //load netpyne main landing page
  casper.start(urlBase + "geppetto", function() {
    this.echo("Load : " + urlBase);
    //wait for the loading spinner to go away, meaning netpyne has loaded
    this.waitWhileVisible('div[id="loading-spinner"]', function() {
      this.wait(5000, function() { //test some expected HTML elements in landing page
        this.echo("I've waited for netpyne to load.");
        test.assertTitle("NetPyNE", "NetPyNE title is ok");
        test.assertExists('div[id="widgetContainer"]', "NetPyNE loads the initial widgetsContainer");
        test.assertExists('div[id="mainContainer"]', "NetPyNE loads the initial mainContainer");
        //test.assertExists('div[id="settingsIcon"]', "NetPyNE loads the initial settingsIcon");
      });
    }, null, 40000);
  });

  casper.then(function() { //test HTML elements in landing page
    this.echo("######## Testing landping page contents and layout ######## ", "INFO");
    testLandingPage(test);
  });

  casper.then(function() { //test initial state of consoles
    this.echo("######## Test Consoles ######## ", "INFO");
    testConsoles(test);
  });

  casper.then(function() { // test adding a population using UI  
    this.echo("######## Test Add Population ######## ", "INFO");
    addPopulation(test);
  });
  
  casper.then(function() { // test adding a cell rule using UI
    this.echo("######## Test Add Cell Rule ######## ", "INFO");
    addCellRule(test);
  });
  
  casper.then(function() { // test adding a synapse rule using UI
    this.echo("######## Test Add Synapse ######## ", "INFO");
    addSynapse(test);
  });
  
  casper.then(function() { // test adding a connection using UI
    this.echo("######## Test Add Connection Rule ######## ", "INFO");
    addConnection(test);
  });
  
  casper.then(function() { // test adding a stimulus  source using UI
    this.echo("######## Test Add stim Source Rule ######## ", "INFO");
    addStimSource(test);
  });
  
  casper.then(function() { // test adding a stimulus target using UI
    this.echo("######## Test Add stimTarget Rule ######## ", "INFO");
    addStimTarget(test);
  });
  
  casper.then(function() { // test config 
    this.echo("######## Test default simConfig ######## ", "INFO");
    checkSimConfigParams(test);
  });
  
  casper.then(function() {
    this.reload(function() {
      this.echo("reloading webpage", "INFO")
    })
  })
  casper.then(function() {
    this.waitWhileVisible('div[id="loading-spinner"]', function() {
      this.wait(5000, function() { //test some expected HTML elements in landing page
        this.echo("I've waited for netpyne to load.");
        test.assertTitle("NetPyNE", "NetPyNE title is ok");
        test.assertExists('div[id="widgetContainer"]', "NetPyNE loads the initial widgetsContainer");
        test.assertExists('div[id="mainContainer"]', "NetPyNE loads the initial mainContainer");
      });
    }, null, 40000);
  })

  casper.then(function() { //test full netpyne loop using a demo project
    this.echo("######## Running Demo ######## ", "INFO");
    var demo = "from netpyne_ui.tests.tut3 import netParams, simConfig \n" +
      "netpyne_geppetto.netParams=netParams \n" +
      "netpyne_geppetto.simConfig=simConfig";
    loadModelUsingPython(test, demo);
  });

  casper.then(function() { //test explore network tab functionality
    this.echo("######## Test Explore Network Functionality ######## ", "INFO");
    exploreNetwork(test);
  });

  casper.then(function() { //test simulate network tab functionality
    this.echo("######## Test Simulate Network Functionality ######## ", "INFO");
    simulateNetwork(test);
  });

  casper.run(function() {
    test.done();
  });
});

/**
 * Test existence of HTML elements expected when main landing page is reached
 */
function testLandingPage(test) {
  casper.then(function() {
    tb.assertExist(this, test, "Populations", "div")
    tb.assertExist(this, test, "CellRules", "div")
    tb.assertExist(this, test, "Synapses", "div")
    tb.assertExist(this, test, "Connections", "div")
    tb.assertExist(this, test, "StimulationSources", "div")
    tb.assertExist(this, test, "Configuration", "div")
    tb.assertExist(this, test, "defineNetwork", "button")
    tb.assertExist(this, test, "exploreNetwork", "button")
    tb.assertExist(this, test, "simulateNetwork", "button")
    tb.assertExist(this, test, "setupNetwork", "button")
  });
}

/**
 * Load consoles and test they toggle
 */
function testConsoles(test) {
  casper.then(function() { //test existence and toggling of console
    loadConsole(test, 'pythonConsoleButton', "pythonConsole");
  });
  casper.then(function() { //test existence and toggling of console
    loadConsole(test, 'consoleButton', "console");
  });
}

/**
 * Load console, and test it hides/shows fine
 */
function loadConsole(test, consoleButton, consoleContainer) {
  casper.thenClick('li[id="'+consoleButton+'"]', function(){
    this.waitUntilVisible('div[id="' + consoleContainer + '"]', function() {
      this.echo(consoleContainer + ' loaded.');
      test.assertExists('div[id="' + consoleContainer + '"]', consoleContainer + " exists");
    })
  });
  casper.thenClick('li[id="'+consoleButton+'"]', function() {
    this.waitWhileVisible('div[id="' + consoleContainer + '"]', function() {
      this.echo(consoleContainer + ' hidden.');
      test.assertNotVisible('div[id="' + consoleContainer + '"]', consoleContainer + " no longer visible");
    });
  })
  casper.then(function(){
    this.wait(1000)
  })
}

/*****************************************************
 * Create  population  rule  using  the  add  button *
 *****************************************************/
function addPopulation(test) {
  tb.message(casper, "create")
  casper.then(function() { // create 2 rules
    tb.create2rules(this, test, "Populations", "newPopulationButton", "Population")
  })

  tb.message(casper, "populate")
  casper.then(function() { //populate rule 1
    populatePopParams(test)
  })

  tb.message(casper, "check")
  casper.then(function() { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    tb.selectThumbRule(this, test, "Population 2", "populationName")
  })
  casper.then(function() { // check rule 2 is empty
    checkPopParamsValues(test, "Population 2", true)
  })

  casper.then(function() { //focus on rule 1
    this.echo("moved to first rule -> should be populated")
    tb.selectThumbRule(this, test, "Population", "populationName")
  })

  casper.then(function() { // check rule 1 is populated
    checkPopParamsValues(test, "Population")
  })

  tb.message(casper, "rename")
  casper.then(function() { // delete rule 2
    tb.delThumbnail(this, test, "Population 2")
  })

  casper.then(function() { //focus on rule 1
    tb.selectThumbRule(this, test, "Population", "populationName")
  })

  casper.then(function() { //rename rule 1
    tb.renameRule(this, test, "populationName", "newPop")
  })

  casper.then(function() { // check rule 1 is populated
    checkPopParamsValues(test, "newPop")
  })

  casper.then(function() { // add rules to test other cards
    addTestPops(test)
  })

  tb.message(casper, "leave")
  casper.thenClick('#Populations', function() {
    tb.assertDoesntExist(this, test, "newPopulationButton", "button", "collapse card")
  });
}

/***********************************************
 * Create  cell  rule  using  the  add  button *
 ***********************************************/
function addCellRule(test) {
  tb.message(casper, "create")
  casper.then(function() { // create 2 rules
    tb.create2rules(this, test, "CellRules", "newCellRuleButton", "CellRule")
  })

  tb.message(casper, "populate")
  casper.then(function() { //populate rule 1
    populateCellRule(test)
  })

  tb.message(casper, "check")
  casper.then(function() { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    tb.selectThumbRule(this, test, "CellRule 2", "cellRuleName")
  })

  casper.then(function() { // check fields are not copy to rule 2
    checkCellParamsValues(test, "CellRule 2", "", "", "", true)
  })

  casper.then(function() { //focus on rule 1
    this.echo("moved to first rule -> should be populated")
    tb.selectThumbRule(this, test, "CellRule", "cellRuleName")
  })

  casper.then(function() { // check fields remain the same
    checkCellParamsValues(test, "CellRule", "PYR", "HH", "newPop")
  })

  // only applies to cellParams rule
  casper.then(function() {
    testSectionAndMechanisms(test)
  })
  //-------------------------------

  tb.message(casper, "rename")
  casper.then(function() { // delete rule 2
    tb.delThumbnail(this, test, "CellRule 2")
  })

  casper.then(function() { //focus on rule 1
    tb.selectThumbRule(this, test, "CellRule", "cellRuleName")
  })

  casper.then(function() { //rename rule 1
    tb.renameRule(this, test, "cellRuleName", "newCellRule")
  })

  casper.then(function() {
    exploreCellRuleAfterRenaming(test) // re-explore whole rule
  })

  tb.message(casper, "leave")
  casper.thenClick('#CellRules', function() {
    tb.assertDoesntExist(this, test, "newCellRuleButton", "collapse card")
  });
}

/**************************************************
 * Create  Synapse  rule  using  the  add  button *
 **************************************************/
function addSynapse(test) {
  tb.message(casper, "create")
  casper.then(function() { // create 2 rules
    tb.create2rules(this, test, "Synapses", "newSynapseButton", "Synapse")
  })

  tb.message(casper, "populate")
  casper.then(function() { //populate rule 1
    populateSynMech(test)
  })

  tb.message(casper, "check")
  casper.then(function() { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    tb.selectThumbRule(this, test, "Synapse 2", "synapseName")
  })

  casper.then(function() { // check rule 2 is empty
    checkSynMechEmpty(test, "Synapse 2")
  })

  casper.then(function() { //focus on rule 1
    this.echo("moved to first rule -> should be populated")
    tb.selectThumbRule(this, test, "Synapse", "synapseName")
  })

  casper.then(function() { // check rule 1 is populated
    checkSynMechValues(test, "Synapse")
  })

  tb.message(casper, "rename")
  casper.then(function() { // delete rule 2
    tb.delThumbnail(this, test, "Synapse 2")
  })

  casper.then(function() { //focus on rule 1
    tb.selectThumbRule(this, test, "Synapse", "synapseName")
  })

  casper.then(function() { //rename rule 1
    tb.renameRule(this, test, "synapseName", "newSyn")
  })

  casper.then(function() { // check rule 1 is populated
    checkSynMechValues(test, "newSyn")
  })

  casper.then(function() { //add rules to test other cards
    addTestSynMech(test)
  })


  tb.message(casper, "leave")
  casper.thenClick('#Synapses', function() {
    tb.assertDoesntExist(this, test, "newSynapseButton", "collapse card")
  });
}

/*******************************************************
 * Create  connectivity  rule  using  the  add  button *
 *******************************************************/
function addConnection(test) {
  tb.message(casper, "create")
  casper.then(function() { // create 2 rules
    tb.create2rules(this, test, "Connections", "newConnectivityRuleButton", "ConnectivityRule")
  })

  tb.message(casper, "populate")
  casper.then(function() { //populate rule 1
    populateConnRule(test)
  })

  tb.message(casper, "check")
  casper.then(function() { //focus on rule 2
    this.echo("moved to second rule -> should be empty")
    tb.selectThumbRule(this, test, "ConnectivityRule 2", "ConnectivityName")
  })

  casper.then(function() { // check rule 2 is empty
    checkConnRuleValues(test, "ConnectivityRule 2", true)
  })

  casper.then(function() { //focus on rule 1
    this.echo("moved to first rule -> should be populated")
    tb.selectThumbRule(this, test, "ConnectivityRule", "ConnectivityName")
  })

  casper.then(function() { // check rule 1 is populated
    checkConnRuleValues(test, "ConnectivityRule")
  })

  tb.message(casper, "rename")
  casper.then(function() { // delete rule 2
    tb.delThumbnail(this, test, "ConnectivityRule 2")
  })

  casper.then(function() { //focus on rule 1
    tb.selectThumbRule(this, test, "ConnectivityRule", "ConnectivityName")
  })

  casper.then(function() { //rename rule 1
    tb.renameRule(this, test, "ConnectivityName", "newRule")
  })

  casper.then(function() { // check rule 1 is populated
    checkConnRuleValues(test, "newRule")
  })
  tb.message(casper, "leave")
  casper.thenClick('#Connections', function() {
    tb.assertDoesntExist(this, test, "newConnectivityRuleButton", "colapse card")
  });
}
/*****************************************************
 * Create  StimSource  rule  using  the  add  button *
 *****************************************************/
function addStimSource(test) {
  tb.message(casper, "create")
  casper.then(function() { // create 2 rules
    tb.create2rules(this, test, "StimulationSources", "newStimulationSourceButton", "stim_source")
  })

  tb.message(casper, "populate")
  casper.then(function() { // populate rule 1
    populateStimSourceRule(test)
  })

  tb.message(casper, "check")
  casper.then(function() { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    tb.selectThumbRule(this, test, "stim_source 2", "sourceName")
  })

  casper.then(function() { // check rule 2 is empty
    checkStimSourceEmpty(test, "stim_source 2")
  })

  casper.then(function() { //focus on rule 1
    this.echo("moved to first rule -> should be populated")
    tb.selectThumbRule(this, test, "stim_source", "sourceName")
  })

  casper.then(function() { // check rule 1 is populated
    checkStimSourceValues(test, "stim_source")
  })

  tb.message(casper, "rename")
  casper.then(function() { // delete rule 2
    tb.delThumbnail(this, test, "stim_source 2")
  })

  casper.then(function() { //focus on rule 1
    tb.selectThumbRule(this, test, "stim_source", "sourceName")
  })

  casper.then(function() { //rename rule 1
    tb.renameRule(this, test, "sourceName", "newStimSource")
  })
  casper.then(function() { // delete delete delete delete 
    this.wait(2000)
  })

  casper.then(function() { // check rule 1 is populated
    checkStimSourceValues(test, "newStimSource")
  })

  tb.message(casper, "leave")
  casper.thenClick('#StimulationSources', function() {
    tb.assertDoesntExist(this, test, "newStimulationSourceButton", "collapse card")
  });
}
/*****************************************************
 * Create  StimTarget  rule  using  the  add  button *
 *****************************************************/
function addStimTarget(test) {
  tb.message(casper, "create")
  casper.then(function() { // create 2 rules
    tb.create2rules(this, test, "StimulationTargets", "newStimulationTargetButton", "stim_target")
  })

  tb.message(casper, "populate")
  casper.then(function() { // populate rule 1
    populateStimTargetRule(test)
  })

  tb.message(casper, "check")
  casper.then(function() { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    tb.selectThumbRule(this, test, "stim_target 2", "targetName")
  })

  casper.then(function() { // check rule 2 is empty
    checkStimTargetValues(test, "stim_target 2", true)
  })

  casper.then(function() { //focus on rule 1
    this.echo("moved to first rule -> should be populated")
    tb.selectThumbRule(this, test, "stim_target", "targetName")
  })

  casper.then(function() { // check rule 1 is populated
    checkStimTargetValues(test, "stim_target")
  })

  tb.message(casper, "rename")
  casper.then(function() { // delete rule 2
    tb.delThumbnail(this, test, "stim_target 2")
  })

  casper.then(function() { //focus on rule 1
    tb.selectThumbRule(this, test, "stim_target", "targetName")
  })

  casper.then(function() { //rename rule 1
    tb.renameRule(this, test, "targetName", "newStimTarget")
  })

  casper.then(function() { // check rule 1 is populated
    checkStimTargetValues(test, "newStimTarget")
  })

  tb.message(casper, "leave")
  casper.thenClick('#StimulationTargets', function() {
    tb.assertDoesntExist(this, test, "newStimulationTargetButton", "collapse card")
  });
}


/*************************************
 * Check  simConfig  initial  state  *
 *************************************/
function checkSimConfigParams(test) {
  casper.then(function() {
    setSimConfigParams(test)
  })
  casper.then(function() {
    this.wait(2500)
  })
  casper.then(function() {
    getSimConfigParams(test)
  })
}

//----------------------------------------------------------------------------//
function setSimConfigParams(test) {
  casper.then(function() {
    this.waitUntilVisible('div[id="Configuration"]', function() {
      tb.active = {
        cardID: "Configuration",
        buttonID: "configGeneral",
        tabID: false
      }
    })
  })
  casper.thenClick('#Configuration')

  casper.then(function() {
    tb.setInputValue(this, test, "simConfig.duration", "999");
    tb.setInputValue(this, test, "simConfig.dt", "0.0249");
    tb.getInputValue(this, test, "simConfig.printRunTime", "false");
    tb.getInputValue(this, test, "simConfig.hParams0", "clamp_resist : 0.001");
    tb.getInputValue(this, test, "simConfig.hParams1", "celsius : 6.3");
    tb.deleteListItem(this, test, "simConfig.hParams2", "v_init : -65");
    tb.addListItem(this, test, "simConfig.hParams", "fake: 123456")
    tb.getInputValue(this, test, "simConfig.seeds0", "loc : 1");
    tb.getInputValue(this, test, "simConfig.seeds1", "stim : 1");
    tb.deleteListItem(this, test, "simConfig.seeds2", "conn : 1");
    tb.addListItem(this, test, "simConfig.seeds", "fakeII: 654321")

  })
  casper.then(function() {
    this.wait(500)
  })
  casper.then(function() {
    tb.clickCheckBox(this, test, "simConfig.createNEURONObj");
    tb.clickCheckBox(this, test, "simConfig.createPyStruct");
    tb.clickCheckBox(this, test, "simConfig.addSynMechs");
    tb.clickCheckBox(this, test, "simConfig.includeParamsLabel");
    tb.clickCheckBox(this, test, "simConfig.timing");
    tb.clickCheckBox(this, test, "simConfig.verbose");
    tb.clickCheckBox(this, test, "simConfig.compactConnFormat");
    tb.clickCheckBox(this, test, "simConfig.connRandomSecFromList");
    tb.clickCheckBox(this, test, "simConfig.printPopAvgRates");
    tb.clickCheckBox(this, test, "simConfig.printSynsAfterRule");
    tb.clickCheckBox(this, test, "simConfig.gatherOnlySimData");
    tb.clickCheckBox(this, test, "simConfig.cache_efficient");
    tb.clickCheckBox(this, test, "simConfig.cvode_active");
  })

  casper.then(function() {
    this.wait(2500)
  })
  casper.thenClick("#configRecord", function() { //go to record tab
    this.wait(2500); //let python populate fields
    tb.active.tabID = "configRecord"
  });
  casper.then(function() {
    tb.addListItem(this, test, "simConfig.recordCells", "22")
    tb.addListItem(this, test, "simConfig.recordLFP", "1,2,3")
    tb.addListItem(this, test, "simConfig.recordTraces", "Vsoma: {sec: soma, loc: 0.5, var: v}")
    tb.setInputValue(this, test, "simConfig.recordStep", "10");
    tb.clickCheckBox(this, test, "simConfig.saveLFPCells");
    tb.clickCheckBox(this, test, "simConfig.recordStim");
  })

  casper.then(function() {
    this.wait(2500)
  })

  casper.thenClick("#configSaveConfiguration", function() { //go to saveConfig tab
    this.wait(2500) //let python populate fields
    tb.active.tabID = "configSaveConfiguration"
  });
  casper.then(function() {
    tb.assertExist(this, test, "simConfig.simLabel")
    tb.assertExist(this, test, "simConfig.saveDataInclude")
    tb.assertExist(this, test, "simConfig.backupCfgFile")
    tb.getInputValue(this, test, "simConfig.filename", "model_output");
    tb.getInputValue(this, test, "simConfig.saveDataInclude0", "netParams");
    tb.getInputValue(this, test, "simConfig.saveDataInclude1", "netCells");
    tb.getInputValue(this, test, "simConfig.saveDataInclude2", "netPops");
    tb.getInputValue(this, test, "simConfig.saveDataInclude3", "simConfig");
    tb.getInputValue(this, test, "simConfig.saveDataInclude4", "simData");
  })
  casper.then(function() {
    tb.clickCheckBox(this, test, "simConfig.saveCellSecs");
    tb.clickCheckBox(this, test, "simConfig.saveCellConns");
    tb.clickCheckBox(this, test, "simConfig.timestampFilename");
    tb.clickCheckBox(this, test, "simConfig.savePickle");
    tb.clickCheckBox(this, test, "simConfig.saveJson");
    tb.clickCheckBox(this, test, "simConfig.saveMat");
    tb.clickCheckBox(this, test, "simConfig.saveHDF5");
    tb.clickCheckBox(this, test, "simConfig.saveDpk");
    tb.clickCheckBox(this, test, "simConfig.saveDat");
    tb.clickCheckBox(this, test, "simConfig.saveCSV");
    tb.clickCheckBox(this, test, "simConfig.saveTiming");
  })

  casper.then(function() {
    this.wait(2500)
  })

  casper.thenClick("#configErrorChecking", function() { //go to checkError tab
    this.wait(2500) //let python populate fields
    tb.active.tabID = "configErrorChecking"
  });
  casper.then(function() {
    tb.clickCheckBox(this, test, "simConfig.checkErrors");
    tb.clickCheckBox(this, test, "simConfig.checkErrorsVerbose");
  })
  casper.then(function() {
    this.wait(2500)
  })

  casper.thenClick("#confignetParams", function() { //go to network configuration tab
    this.wait(2500) //let python populate fields
    tb.active.tabID = "confignetParams"
  });
  casper.then(function() {
    tb.assertExist(this, test, "netParams.scaleConnWeightModels")
    tb.setInputValue(this, test, "netParams.scale", "2");
    tb.setInputValue(this, test, "netParams.defaultWeight", "3");
    tb.setInputValue(this, test, "netParams.defaultDelay", "4");
    tb.setInputValue(this, test, "netParams.scaleConnWeight", "5");
    tb.setInputValue(this, test, "netParams.scaleConnWeightNetStims", "6");
    tb.setInputValue(this, test, "netParams.sizeX", "200");
    tb.setInputValue(this, test, "netParams.sizeY", "300");
    tb.setInputValue(this, test, "netParams.sizeZ", "400");
    tb.setInputValue(this, test, "netParams.propVelocity", "1000");
    tb.getInputValue(this, test, "netParams.rotateCellsRandomly", "false");
    tb.getSelectFieldValue(this, test, "netParams.shape", "cuboid")
    tb.addListItem(this, test, "netParams.scaleConnWeightModels", "0: 0.001")
  })
  casper.then(function() {
    this.wait(2500)
  })
}

//----------------------------------------------------------------------------//
function getSimConfigParams(test) {
  casper.thenClick("#configGeneral", function() { //go to network configuration tab
    this.wait(2500) //let python populate fields
    tb.active.tabID = "configGeneral"
  });
  casper.then(function() {
    tb.getInputValue(this, test, "simConfig.duration", "999");
    tb.getInputValue(this, test, "simConfig.dt", "0.0249");
    tb.getListItemValue(this, test, "simConfig.hParams2", "fake : 123456")
    tb.getListItemValue(this, test, "simConfig.seeds2", "fakeII : 654321")
    tb.testCheckBoxValue(this, test, "simConfig.createNEURONObj", false);
    tb.testCheckBoxValue(this, test, "simConfig.createPyStruct", false);
    tb.testCheckBoxValue(this, test, "simConfig.addSynMechs", false);
    tb.testCheckBoxValue(this, test, "simConfig.includeParamsLabel", false);
    tb.testCheckBoxValue(this, test, "simConfig.timing", false);
    tb.testCheckBoxValue(this, test, "simConfig.verbose", true);
    tb.testCheckBoxValue(this, test, "simConfig.compactConnFormat", true);
    tb.testCheckBoxValue(this, test, "simConfig.connRandomSecFromList", false);
    tb.testCheckBoxValue(this, test, "simConfig.printPopAvgRates", true);
    tb.testCheckBoxValue(this, test, "simConfig.printSynsAfterRule", true);
    tb.testCheckBoxValue(this, test, "simConfig.gatherOnlySimData", true);
    tb.testCheckBoxValue(this, test, "simConfig.cache_efficient", true);
    tb.testCheckBoxValue(this, test, "simConfig.cvode_active", true);
  })

  casper.thenClick("#configRecord", function() { //go to record tab
    this.wait(3500); //let python populate fields
    tb.active.tabID = "configRecord"
  });
  casper.then(function() {
    tb.getListItemValue(this, test, "simConfig.recordCells0", "22")
    tb.getListItemValue(this, test, "simConfig.recordLFP0", "[1,2,3]")
    tb.getListItemValue(this, test, "simConfig.recordTraces0", "Vsoma:   {var: v, loc: 0.5, sec: soma}")
    tb.getInputValue(this, test, "simConfig.recordStep", "10");
    tb.testCheckBoxValue(this, test, "simConfig.saveLFPCells", true);
    tb.testCheckBoxValue(this, test, "simConfig.recordStim", true);
  })

  casper.thenClick("#configSaveConfiguration", function() { //go to saveConfig tab
    this.wait(2500) //let python populate fields
    tb.active.tabID = "configSaveConfiguration"
  });
  casper.then(function() {
    tb.testCheckBoxValue(this, test, "simConfig.saveCellSecs", false);
    tb.testCheckBoxValue(this, test, "simConfig.saveCellConns", false);
    tb.testCheckBoxValue(this, test, "simConfig.timestampFilename", true);
    tb.testCheckBoxValue(this, test, "simConfig.savePickle", true);
    tb.testCheckBoxValue(this, test, "simConfig.saveJson", true);
    tb.testCheckBoxValue(this, test, "simConfig.saveMat", true);
    tb.testCheckBoxValue(this, test, "simConfig.saveHDF5", true);
    tb.testCheckBoxValue(this, test, "simConfig.saveDpk", true);
    tb.testCheckBoxValue(this, test, "simConfig.saveDat", true);
    tb.testCheckBoxValue(this, test, "simConfig.saveCSV", true);
    tb.testCheckBoxValue(this, test, "simConfig.saveTiming", true);
  })

  casper.thenClick("#configErrorChecking", function() { //go to checkError tab
    this.wait(2500) //let python populate fields
    tb.active.tabID = "configErrorChecking"
  });
  casper.then(function() {
    tb.testCheckBoxValue(this, test, "simConfig.checkErrors", true);
    tb.testCheckBoxValue(this, test, "simConfig.checkErrorsVerbose", true);
  })

  casper.thenClick("#confignetParams", function() { //go to network configuration tab
    this.wait(2500) //let python populate fields
    tb.active.tabID = "confignetParams"
  });
  casper.then(function() {
    tb.getInputValue(this, test, "netParams.scale", "2");
    tb.getInputValue(this, test, "netParams.defaultWeight", "3");
    tb.getInputValue(this, test, "netParams.defaultDelay", "4");
    tb.getInputValue(this, test, "netParams.scaleConnWeight", "5");
    tb.getInputValue(this, test, "netParams.scaleConnWeightNetStims", "6");
    tb.getInputValue(this, test, "netParams.sizeX", "200");
    tb.getInputValue(this, test, "netParams.sizeY", "300");
    tb.getInputValue(this, test, "netParams.sizeZ", "400");
    tb.getInputValue(this, test, "netParams.propVelocity", "1000");
    tb.getListItemValue(this, test, "netParams.scaleConnWeightModels0", "0 : 0.001")
  })
}

/**************************************************
 * Tests adding a new population and its contents *
 **************************************************/
function testPopulation(test, buttonSelector, expectedName, expectedCellModel, expectedCellType, expectedDimensions) {
  casper.then(function() {
    tb.active = {
      cardID: "Populations",
      buttonID: "newPopulationButton",
      tabID: false
    }
    this.echo("------Testing population button " + buttonSelector);
    this.waitUntilVisible(buttonSelector, function() {
      test.assertExists(buttonSelector, "Population " + expectedName + " correctly created");
    })
  })
  casper.thenClick('#' + expectedName); // click pop thumbnail
  casper.then(function() { //let python populate fields
    this.wait(2000, function() {
      this.echo("I've waited a second for metadata to be populated")
    });
  });
  casper.then(function() { //test metadata contents
    tb.getInputValue(this, test, "populationName", expectedName);
    tb.getInputValue(this, test, "netParams.popParams[\'" + expectedName + "\'][\'cellModel\']", expectedCellModel);
    tb.getInputValue(this, test, "netParams.popParams[\'" + expectedName + "\'][\'cellType\']", expectedCellType);
    tb.getInputValue(this, test, "popParamsDimensions", expectedDimensions);
  });
}
/*******************************************************************************
 *               Test adding a new cell rule and its contents                  *
 *******************************************************************************/
function testCellRule(test, buttonSelector, expectedName, expectedCellModelId, expectedCellTypeId) {
  casper.then(function() {
    tb.active = {
      cardID: "CellRules",
      buttonID: "newCellRuleButton",
      tabID: false
    }
    this.echo("------Testing cell rules button " + buttonSelector);
    this.waitUntilVisible(buttonSelector, function() {
      this.echo('Cell Rule button exists.');
      this.click('#' + expectedName);
    })
  })
  casper.then(function() { //give it some time to allow metadata to load
    this.wait(1000, function() {
      this.echo("I've waited a second for metadata to be populated")
    });
  });
  casper.then(function() { //test contents of metadata
    tb.getInputValue(this, test, "cellRuleName", expectedName);
    test.assertExists(expectedCellModelId, "cellRullCellModel exists");
    test.assertExists(expectedCellTypeId, "cellRullCellType exists");
  });
}
/********************************
 * Load demo model using python *
 ********************************/
function loadModelUsingPython(test, demo) {
  casper.then(function() {
    this.echo("------Loading demo for further testing ", "INFO");
    this.evaluate(function(demo) {
      var kernel = IPython.notebook.kernel;
      kernel.execute(demo);
    }, demo);
  });
  casper.then(function() {
    this.waitUntilVisible('#Populations')
  })

  casper.thenClick('#Populations', function() {
    this.waitUntilVisible('button[id="newPopulationButton"]', function() {
      this.echo("Population view loaded");
    });
  });

  casper.then(function() { //test first population exists after demo is loaded
    testPopulation(test, "button#S", "S", "HH", "PYR", "20");
  });

  casper.then(function() { //test second population exists after demo is loaded
    testPopulation(test, "button#M", "M", "HH", "PYR", "20");
  });

  casper.thenClick('#CellRules', function() {
    this.waitUntilVisible('button[id="newCellRuleButton"]', function() {
      this.echo("Cell Rule view loaded");
    });
  })

  casper.then(function() { //test a cell rule exists after demo is loaded
    testCellRule(test, "button#PYRrule", "PYRrule", 'div[id="netParams.cellParams[\'PYRrule\'][\'conds\'][\'cellType\']"]', 'div[id="netParams.cellParams[\'PYRrule\'][\'conds\'][\'cellModel\']"]');
  });
}

/******************************************************
 * Test functionality within the explore network view *
 ******************************************************/
function exploreNetwork(test) {
  casper.then(function() {
    this.echo("------Testing explore network");
    test.assertExists('button[id="exploreNetwork"]', "Explore network button exists");
  })
  casper.thenClick('#exploreNetwork', function() {
    this.waitUntilVisible('button[id="okInstantiateNetwork"]', function() {
      canvasComponentsTests(test);
    })
  });
  casper.thenClick('#okInstantiateNetwork', function() {
    this.waitWhileVisible('button[id="okInstantiateNetwork"]', function() {
      test.assertDoesntExist('button[id="okInstantiateNetwork"]', "Explore network dialog is gone");
    })
  })
  casper.then(function() {
    this.waitWhileVisible('div[id="loading-spinner"]', function() {
      test.assertDoesntExist('button[id="okInstantiateNetwork"]', "Explore network's finished loading");
    })
  })
  casper.then(function() {
    this.echo("Testing meshes for network exist and are visible");
    testMeshVisibility(test, true, "network.S[0]");
    testMeshVisibility(test, true, "network.S[1]");
    testMeshVisibility(test, true, "network.S[2]");
    testMeshVisibility(test, true, "network.S[18]");
    testMeshVisibility(test, true, "network.S[19]");
  })
  casper.thenClick('#PlotButton');

  casper.then(function() { //wait for plot menu to become visible
    this.waitUntilVisible('div[role="menu"]', function() {
      test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");
    })
  })
  casper.then(function() { // test connection plot comes up
    testPlotButton(test, "connectionPlot", "Popup1");
  });
  
  casper.then(function() {
    testPlotButton(test, "2dNetPlot", "Popup1");
  })
  
  casper.then(function(){ // test shape plot comes up
    testPlotButton(test, "shapePlot", "Popup1");
  });
  
  casper.then(function() {
    var info = this.getElementInfo('button[id="PlotButton"]');
    this.mouse.click(info.x + 4, info.y + 4); //move a bit away from corner
  })
  
  casper.then(function(){
    this.wait(1000)
  })

  casper.then(function() {
    this.waitWhileVisible('div[role="menu"]', function() { //wait for menu to close
      test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");
    });
  })

  casper.thenClick('#ControlPanelButton');

  casper.then(function() { //test initial load values in control panel
    testControlPanelValues(test, 43);
  });

  casper.thenClick('#ControlPanelButton');
}
/*******************************************************
 * Test functionality within the simulate network view *
 *******************************************************/
function simulateNetwork(test) {
  casper.then(function() {
    this.echo("------Testing explore network");
    test.assertExists('button[id="simulateNetwork"]', "Simulate network button exists");
  })
  casper.thenClick('#simulateNetwork', function(){
    this.waitUntilVisible('button[id="runSimulation"]')
  });
  
  casper.thenClick('#runSimulation', function() {
    this.waitWhileVisible('button[id="runSimulation"]', function() {
      this.echo("Dialog disappeared");
    })
  });
  casper.then(function() {
    this.waitWhileVisible('div[id="loading-spinner"]', function() {
      this.echo("Loading spinner disappeared");
      this.echo("Testing meshes for network exist and are visible");
      testMeshVisibility(test, true, "network.S[0]");
      testMeshVisibility(test, true, "network.S[1]");
      testMeshVisibility(test, true, "network.S[2]");
      testMeshVisibility(test, true, "network.S[18]");
      testMeshVisibility(test, true, "network.S[19]");
    }, 150000);
  })

  casper.thenClick('#PlotButton');

  casper.then(function() {
    this.waitUntilVisible('div[role="menu"]', function() {
      test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");
    })
  })
  casper.then(function() {
    testPlotButton(test, "rasterPlot", "Popup1");
  });

  casper.then(function() {
    testPlotButton(test, "spikePlot", "Popup1");
  });

  casper.then(function(){
    testPlotButton(test, "spikeStatsPlot", "Popup1");
  });

  casper.then(function() {
    testPlotButton(test, "ratePSDPlot", "Popup1");
  });

  casper.then(function() {
    testPlotButton(test, "tracesPlot", "Popup1");
  });

  casper.then(function() {
    testPlotButton(test, "grangerPlot", "Popup1");
  });

  casper.then(function() {
    var info = this.getElementInfo('button[id="PlotButton"]');
    this.mouse.click(info.x + 4, info.y + 4); //move a bit away from corner
  })
  
  casper.then(function(){
    this.wait(1000)
  })

  casper.then(function() {
    this.waitWhileVisible('div[role="menu"]', function() {
      test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");
    })
  })
}

function testMeshVisibility(test, visible, variableName) {
  casper.then(function() {
    var visibility = this.evaluate(function(variableName) {
      var visibility = CanvasContainer.engine.getRealMeshesForInstancePath(variableName)[0].visible;
      return visibility;
    }, variableName);
    test.assertEquals(visibility, visible, variableName + " visibility correct");
  });
}

function waitForPlotGraphElement(test, elementID) {
  casper.then(function() {
    this.waitUntilVisible('g[id="' + elementID + '"]', function() {
      test.assertExists('g[id="' + elementID + '"]', "Element " + elementID + " exists");
    });
  })
}
/****************************************************
 * Test canvas controllers and other HTML elements  *
 ****************************************************/
function canvasComponentsTests(test) {
  casper.then(function() {
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
/*****************************************************************************
 * Tests the different plotting options using the plot button on the canvas  *
 *****************************************************************************/
function testPlotButton(test, plotButton, expectedPlot) {
  casper.then(function() {
    test.assertExists('span[id="' + plotButton + '"]', "Menu option " + plotButton + "Exists");
  })
  casper.thenEvaluate(function(plotButton, expectedPlot) {
    document.getElementById(plotButton).click(); //Click on plot option
  }, plotButton, expectedPlot);
  
  casper.then(function() {
    this.waitUntilVisible('div[id="' + expectedPlot + '"]', function() {
      test.assertExists('div[id="' + expectedPlot + '"]', expectedPlot + " (" + plotButton + ") exists");
    })
  })
  casper.then(function() { //test plot has certain elements that are render if plot succeeded
    waitForPlotGraphElement(test, "figure_1");
    waitForPlotGraphElement(test, "axes_1");
  });
  casper.thenEvaluate(function(expectedPlot) {
    window[expectedPlot].destroy();
  }, expectedPlot);
  
  casper.then(function(){
    this.waitWhileVisible('div[id="' + expectedPlot + '"]', function() {
      test.assertDoesntExist('div[id="' + expectedPlot + '"]', expectedPlot + " (" + plotButton + ") no longer exists");
    });
  })  
  
  casper.then(function() {
    var plotError = test.assertEvalEquals(function() {
      var error = document.getElementById("netPyneDialog") == undefined;
      if (!error) {
        document.getElementById("netPyneDialog").click();
      }
      return error;
    }, true, "Open plot for action: " + plotButton);
  });
}
/****************************************************************
 * Tests control panel is loaded with right amount of elements  *
 ****************************************************************/
function testControlPanelValues(test, values) {
  casper.then(function() {
    this.waitUntilVisible('div#controlpanel', function() {
      test.assertVisible('div#controlpanel', "The control panel is correctly open.");
      var rows = casper.evaluate(function() {
        return $(".standard-row").length;
      });
      test.assertEquals(rows, values, "The control panel opened with right amount of rows");
    });
  });
  casper.thenEvaluate(function() {
    $("#controlpanel").remove();
  });
  casper.then(function(){
    this.waitWhileVisible('div#controlpanel', function() {
      test.assertDoesntExist('div#controlpanel', "Control Panel went away");
    });
  })
}

/*******************************************************************************
 *--------------------------------POP-PARAMS----------------------------------  *
 *******************************************************************************/
function populatePopParams(test) {
  casper.then(function() {
    tb.active = {
      cardID: "Populations",
      buttonID: "newPopulationButton",
      tabID: false
    }
  })
  casper.then(function() { //populate fields
    test.assertExists("#populationName", "Pop name Exists");
    tb.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellType\']", "PYR")
    tb.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellModel\']", "HH")
  })
  casper.then(function() { // populate dimension component
    populatePopDimension(test)
  })
  casper.then(function() {
    this.wait(2500) //let python receive data
    tb.active.tabID = "spatialDistPopTab"
  })
  casper.thenClick('#spatialDistPopTab', function() { //go to second tab (spatial distribution)
    this.echo("changed tab")
    populateRangeComponent(test, "PopParams") // populate RangeComponent
  })
}

//----------------------------------------------------------------------------//

function checkPopParamsValues(test, ruleName, empty = false) {
  casper.then(function() {
    tb.active.tabID = false
  })

  casper.then(function() { // check fields remained the same after renaiming and closing card
    tb.getInputValue(this, test, "populationName", ruleName);
    tb.getInputValue(this, test, "netParams.popParams[\'" + ruleName + "\'][\'cellType\']", !empty ? "PYR" : "");
    tb.getInputValue(this, test, "netParams.popParams[\'" + ruleName + "\'][\'cellModel\']", !empty ? "HH" : "");
  })

  casper.then(function() { //check dimension
    if (empty) {
      tb.assertDoesntExist(this, test, "popParamsDimensions");
    } else {
      tb.getInputValue(this, test, "popParamsDimensions", "20");
    }
  })

  casper.thenClick('#spatialDistPopTab', function() { //go to second tab (spatial distribution)
    this.wait(2500) // wait for python to populate fields
    tb.active.tabID = "spatialDistPopTab"
  })

  casper.then(function() {
    if (empty) {
      checkRangeComponentIsEmpty(test, "PopParams")
    } else {
      testRangeComponent(test, "PopParams") // check data remained the same
    }
  })
}

//----------------------------------------------------------------------------//
function populatePopDimension(test) {
  casper.then(function() {
    tb.click(this, "popParamsDimensionsSelect", "div"); //click dimension SelectList
  })
  casper.then(function() { // check all menuItems exist
    tb.assertExist(this, test, "popParamSnumCells", "span");
    tb.assertExist(this, test, "popParamSdensity", "span");
    tb.assertExist(this, test, "popParamSgridSpacing", "span");
  });

  casper.thenClick("#popParamSnumCells", function() { //check 1st menuItem displays input field
    tb.setInputValue(this, test, "popParamsDimensions", "20")
  })
  casper.then(function() { // let python receive changes
    casper.wait(2500)
  })
}


//----------------------------------------------------------------------------//
function addTestPops(test) {
  casper.then(function() {
    tb.active.tabID = false
  })

  tb.message(casper, "extra pops to test other cards")
  casper.thenClick('button[id="newPopulationButton"]', function() { //add new population
    this.waitUntilVisible('input[id="populationName"]', function() {
      test.assertExists('input[id="populationName"]', "rule added");
    })
  })
  casper.then(function() { //populate fields
    tb.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellType\']", "GC")
    tb.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellModel\']", "IF")
  })
  casper.then(function() {
    this.wait(2500)
  })
  casper.thenClick('button[id="newPopulationButton"]', function() { //add new population
    this.waitUntilVisible('button[id="Population 2"]', function() {
      test.assertExists('button[id="Population 2"]', "rule added");
    })
  })
  casper.then(function() { //populate fields
    tb.setInputValue(this, test, "netParams.popParams[\'Population 2\'][\'cellType\']", "BC")
    tb.setInputValue(this, test, "netParams.popParams[\'Population 2\'][\'cellModel\']", "Izi")
  })
  casper.then(function() {
    this.wait(2500)
  })
}

/*******************************************************************************
 * ------------------------------- CELL-PARAMS -------------------------------- *
 ********************************************************************************/
function populateCellRule(test) {
  casper.then(function() {
    tb.active = {
      cardID: "CellRules",
      buttonID: "newCellRuleButton",
      tabID: false
    }
  })

  casper.then(function() { // populate cellRule
    tb.assertExist(this, test, "cellRuleName")
    tb.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellType\']", "PYRMenuItem")
    tb.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellModel\']", "HHMenuItem")
    tb.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'pop\']", "newPopMenuItem")
  })
  casper.then(function() {
    this.wait(2500)
  })
  casper.then(function() {
    populateRangeComponent(test, "CellParams") // populate RangeComponent
  })
}

//----------------------------------------------------------------------------//
function checkCellParamsValues(test, name, cellType, cellModel, pop, rangeEmpty = false) {
  casper.then(function() {
    tb.getInputValue(this, test, "cellRuleName", name)
    tb.getSelectFieldValue(this, test, "netParams.cellParams[\'" + name + "\'][\'conds\'][\'cellType\']", cellType)
    tb.getSelectFieldValue(this, test, "netParams.cellParams[\'" + name + "\'][\'conds\'][\'cellModel\']", cellModel)
    tb.getSelectFieldValue(this, test, "netParams.cellParams[\'" + name + "\'][\'conds\'][\'pop\']", pop)
  })
  casper.then(function() {
    if (rangeEmpty) {
      checkRangeComponentIsEmpty(test, "CellParams")
    } else {
      testRangeComponent(test, "CellParams")
    }
  })
}

//----------- going to section page ----------
function testSectionAndMechanisms(test) {
  tb.message(casper, "going to section page")
  casper.thenClick('button[id="cellParamsGoSectionButton"]', function() { //go to "section" page
    test.assertExist('button[id="newCellRuleSectionButton"]', "landed in section page")
  })
  casper.thenClick('#newCellRuleSectionButton', function() { //create section 1
    this.echo("creating 2 sections")
    tb.getInputValue(this, test, "cellParamsSectionName", "Section")
  });
  casper.thenClick('#newCellRuleSectionButton', function() { //create section 2
    tb.getInputValue(this, test, "cellParamsSectionName", "Section 2")
  });
  casper.thenClick('button[id="Section"]') //focus on section 1

  //----------- going to "Geometry" tab in "section" page ----------
  casper.then(function() {
    tb.active.buttonID = "newCellRuleSectionButton"
    tb.active.tabID = "sectionGeomTab"
  })

  casper.thenClick("#sectionGeomTab", function() { //go to "geometry" tab in "section" page
    this.echo("going to Geometry tab")
  })
  casper.then(function() { // polulate geometry
    populateSectionGeomTab(test)
  })

  casper.then(function() { // go to general tab and come back to geometry tab
    tb.leaveReEnterTab(this, test, "sectionGeomTab", "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "sectionGeneralTab", "cellParamsSectionName")
  })

  casper.then(function() { // check values remain the same
    checkSectionGeomTabValues(test, "CellRule", "Section")
  })
  casper.then(function() { // try to delete an item from pt3d component
    tb.deleteListItem(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']1")
  })

  casper.thenClick('button[id="Section 2"]', function() { // change to rule 2
    this.echo("go to section 2 -> values must be empty")
    this.wait(2500) // let python populate fields  
  })

  casper.then(function() { // check values must be empty
    checkSectionGeomTabValues(test, "CellRule", "Section 2", "", "", "", "", "", "")
  })

  casper.thenClick('button[id="Section"]', function() { // back to section 1
    this.echo("go to section 1 -> values must be populated")
    this.wait(2500) //let pyhton populate fields
  })
  casper.then(function() { // check values must be populated (except 1 listItem that was deleted)
    checkSectionGeomTabValues(test, "CellRule", "Section", "")
  })

  //----------- going to "Topology" tab in "section" page ----------
  casper.thenClick("#sectionTopoTab", function() { // go to "Topology" tab in "section" page
    this.wait(2500) //let python populate fields
    tb.active.tabID = "sectionTopoTab"
  })
  casper.then(function() { // populate "topology" tab in "section" page
    populateSectionTopoTab(test)
  })

  casper.then(function() { // move to another tab and comeback
    tb.leaveReEnterTab(this, test, "sectionTopoTab", "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "sectionGeneralTab", "cellParamsSectionName", "div")
  })

  casper.then(function() { // check fields remain the same
    checkSectionTopoTabValues(test, "CellRule", "Section", "Section", "1", "0")
  })

  casper.thenClick('button[id="Section 2"]', function() { // change to rule 2
    this.echo("go to section 2 -> values must be empty")
    this.wait(2500) // let python populate fields  
  })

  casper.then(function() { // check values must be empty
    checkSectionTopoTabValues(test, "CellRule", "Section 2", "", "", "")
  })

  casper.thenClick('button[id="Section"]', function() { // back to section 1
    this.echo("go to section 1 -> values must be populated")
    this.wait(2500) //let pyhton populate fields
  })
  casper.then(function() { // check values must be populated (except 1 listItem that was deleted)
    checkSectionTopoTabValues(test, "CellRule", "Section", "Section", "1", "0")
  })

  //----------- going to "Mechanism" page ----------
  casper.thenClick("#sectionGeneralTab", function() { //Go to Mechs page
    this.waitUntilVisible('button[id="cellParamsGoMechsButton"]', function() {
      tb.message(this, "going to mechanisms page...")
    })
  })
  casper.thenClick("#cellParamsGoMechsButton", function() { // check landing in Mech page
    test.assertExist("#addNewMechButton", "landed in Mechanisms page");
  })

  casper.then(function() {
    tb.active.buttonID = "addNewMechButton"
    tb.active.tabID = false
  })

  casper.then(function() { //fill mech values
    populateMechs(test)
  })

  casper.then(function() { //check values are correct while moving between mechs
    checkMechs(test)
  })

  casper.thenClick('#fromMech2SectionButton', function() { // leave Mech page and go to Section page
    this.click("#cellParamsGoMechsButton")
  })
  casper.then(function() { //go back to Mechs page
    this.waitUntilVisible('button[id="mechThumbhh"]', function() {
      test.assertExist('button[id="mechThumbhh"]', "landed back to Mech page")
    })
  })

  casper.then(function() { // check mechs fields remain the same
    checkMechs(test)
  })

  casper.then(function() {
    this.echo("delete mechanisms:")
  })
  casper.then(function() { // del pas mech
    tb.delThumbnail(this, test, "mechThumbpas")
  })
  casper.then(function() { // del fastpas mech
    tb.delThumbnail(this, test, "mechThumbfastpas")
  })

  casper.thenClick('button[id="fromMech2SectionButton"]', function() { // go back to --sections--
    this.waitWhileVisible('button[id="addNewMechButton"]', function() {
      test.assertDoesntExist('button[id="addNewMechButton"]', "landed in Section page")
    })
  });

  casper.then(function() { //delete section 2 
    this.echo("delete section 2:")
    tb.delThumbnail(this, test, "Section 2")
  })

  casper.thenClick('button[id="Section"]', function() {
    tb.renameRule(this, test, "cellParamsSectionName", "newSec") // rename section 
  })

  casper.thenClick('button[id="fromSection2CellRuleButton"]', function() { // go back to cellRule
    this.echo("going back to cellParams page...")
    this.waitWhileVisible('button[id="newCellRuleSectionButton"]', function() {
      test.assertDoesntExist('button[id="newCellRuleSectionButton"]', "landed in cellParams page")
    })
  })
}

/*******************************************************************************
 * ---------------------------- CELL-PARAMS -- SECTION ------------------------ *
 ********************************************************************************/
function populateSectionGeomTab(test) {
  casper.then(function() {
    tb.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "20")
    tb.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'L\']", "30")
    tb.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'Ra\']", "100")
    tb.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'cm\']", "1")
    tb.addListItem(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']", "10,0,0")
    tb.addListItem(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']", "20,0,0")
  })
  casper.then(function() {
    casper.wait(2500) //let python receive values
  })
}

//----------------------------------------------------------------------------//

function checkSectionGeomTabValues(test, ruleName, sectionName, p2 = "[20,0,0]", p1 = "[10,0,0]", d = "20", l = "30", r = "100", c = "1") {
  casper.then(function() {
    tb.getInputValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'diam\']", d)
    tb.getInputValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'L\']", l)
    tb.getInputValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'Ra\']", r)
    tb.getInputValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'cm\']", c)
  })
  casper.then(function() {
    if (p2) {
      tb.getListItemValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'pt3d\']1", p2)
    }
  })
  casper.then(function() {
    if (p1) {
      tb.getListItemValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'pt3d\']0", p1)
    }
  })
}

//----------------------------------------------------------------------------//

function populateSectionTopoTab(test) {
  casper.then(function() { //populate "topology" tab in "section" page
    tb.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "SectionMenuItem")
    tb.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentX\']", "1")
    tb.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'childX\']", "0")
  })
  casper.then(function() {
    casper.wait(2500) //let python receive values
  })
}

//----------------------------------------------------------------------------//

function checkSectionTopoTabValues(test, cellRuleName, sectionName, parentSec, pX, cX) {
  casper.then(function() {
    tb.getSelectFieldValue(this, test, "netParams.cellParams[\'" + cellRuleName + "\'][\'secs\'][\'" + sectionName + "\'][\'topol\'][\'parentSec\']", parentSec)
    tb.getInputValue(this, test, "netParams.cellParams[\'" + cellRuleName + "\'][\'secs\'][\'" + sectionName + "\'][\'topol\'][\'parentX\']", pX)
    tb.getInputValue(this, test, "netParams.cellParams[\'" + cellRuleName + "\'][\'secs\'][\'" + sectionName + "\'][\'topol\'][\'childX\']", cX)
  })
}

/*******************************************************************************
 * ---------------------------- CELL-PARAMS -- MECHS -------------------------- *
 ********************************************************************************/

function populateMechs(test) {
  casper.then(function() { // add HH mechanism and populate fields
    this.echo("add HH mech")
    populateMech(test, "hh", {
      n: "mechNamegnabar",
      v: "0.1"
    }, {
      n: "mechNamegkbar",
      v: "0.2"
    }, {
      n: "mechNamegl",
      v: "0.3"
    }, {
      n: "mechNameel",
      v: "0.4"
    })
  })

  casper.then(function() { // add PAS mechanism and populate fields
    this.echo("add PAS mech")
    populateMech(test, "pas", {
      n: "mechNameg",
      v: "0.5"
    }, {
      n: "mechNamee",
      v: "0.6"
    }, {
      n: "",
      v: ""
    }, {
      n: "",
      v: ""
    })
  })

  casper.then(function() { // add FASTPAS mechanism and populate fields
    this.echo("add FASTPAS mech")
    populateMech(test, "fastpas", {
      n: "mechNameg",
      v: "0.7"
    }, {
      n: "mechNamee",
      v: "0.8"
    }, {
      n: "",
      v: ""
    }, {
      n: "",
      v: ""
    })
  })
}

//----------------------------------------------------------------------------//

function checkMechs(test) {
  casper.then(function() { // check values after coming back to HH mech
    this.echo("check HH fields")
    checkMechValues(test, "mechThumbhh", "hh", {
      n: "mechNamegnabar",
      v: "0.1"
    }, {
      n: "mechNamegkbar",
      v: "0.2"
    }, {
      n: "mechNamegl",
      v: "0.3"
    }, {
      n: "mechNameel",
      v: "0.4"
    })
  })
  casper.then(function() { // check values after coming back to PAS mech
    this.echo("check PAS fields")
    checkMechValues(test, "mechThumbpas", "pas", {
      n: "mechNameg",
      v: "0.5"
    }, {
      n: "mechNamee",
      v: "0.6"
    }, {
      n: "",
      v: ""
    }, {
      n: "",
      v: ""
    })
  })
  casper.then(function() { // check values after coming back to HH mech
    this.echo("check FASTPAS fields")
    checkMechValues(test, "mechThumbfastpas", "fastpas", {
      n: "mechNameg",
      v: "0.7"
    }, {
      n: "mechNamee",
      v: "0.8"
    }, {
      n: "",
      v: ""
    }, {
      n: "",
      v: ""
    })
  })
}

//----------------------------------------------------------------------------//

function populateMech(test, mechName, v1, v2, v3, v4) {
  casper.thenClick('#addNewMechButton', function() { // click SelectField and check MenuItem exist
    this.waitUntilVisible('span[id="' + mechName + '"]')
  })
  casper.thenClick("#" + mechName, function() { // click add mech and populate fields
    tb.getInputValue(this, test, "singleMechName", mechName)
    tb.setInputValue(this, test, v1.n, v1.v);
    tb.setInputValue(this, test, v2.n, v2.v);
    v3.v ? tb.setInputValue(this, test, v3.n, v3.v) : {};
    v4.v ? tb.setInputValue(this, test, v4.n, v4.v) : {};
  })
  casper.then(function() {
    casper.wait(2500) // for python to receive data
  })
}

//----------------------------------------------------------------------------//

function checkMechValues(test, mechThumb, mech, v1, v2, v3, v4) {
  casper.thenClick('button[id="' + mechThumb + '"]')
  casper.then(function() {
    casper.wait(2500) // for python to populate fields
  })
  casper.then(function() { // check Fields
    tb.getInputValue(this, test, "singleMechName", mech)
    tb.getInputValue(this, test, v1.n, v1.v);
    tb.getInputValue(this, test, v2.n, v2.v);
    v3.v ? tb.getInputValue(this, test, v3.n, v3.v) : {};
    v4.v ? tb.getInputValue(this, test, v4.n, v4.v) : {};
  });
}

/*******************************************************************************
 * ----------------------- CELL-PARAMS -- Full check -------------------------- *
 ********************************************************************************/
function exploreCellRuleAfterRenaming(test) {
  casper.then(function() {
    tb.active.buttonID = "newCellRuleButton"
    tb.active.tabID = false
  })
  casper.then(function() {
    checkCellParamsValues(test, "newCellRule", "PYR", "HH", "newPop")
  })

  casper.thenClick('button[id="cellParamsGoSectionButton"]', function() { //go to "sections"
    test.assertExist('button[id="newCellRuleSectionButton"]', "landed in section")
  })
  casper.then(function() {
    this.wait(2500)
  })
  casper.then(function() {
    this.waitUntilVisible('button[id="newSec"]', function() {
      this.click('button[id="newSec"]')
    })
  })
  casper.then(function() {
    this.wait(2500) //wait  for python to populate fields
    tb.active.buttonID = "newCellRuleSectionButton"
  })

  casper.then(function() { // check section name
    tb.getInputValue(this, test, "cellParamsSectionName", "newSec")
  })

  casper.thenClick("#sectionGeomTab", function() { // go to Geometry tab 
    this.wait(2500) //wait  for python to populate fields
    tb.active.tabID = "sectionGeomTab"
  })
  casper.then(function() {
    checkSectionGeomTabValues(test, "newCellRule", "newSec", "")
  })

  casper.thenClick("#sectionTopoTab", function() { // go to Topology tab
    casper.wait(2500) //wait  for python to populate fields
    tb.active.tabID = "sectionTopoTab"
  })

  casper.then(function() {
    checkSectionTopoTabValues(test, "newCellRule", "newSec", "", "1", "0")
  })

  casper.thenClick("#sectionGeneralTab", function() { //go to "general tab" in "section" page
    this.waitUntilVisible('button[id="cellParamsGoMechsButton"]')
  })
  casper.then(function() { // go to mechs page 
    tb.click(this, "cellParamsGoMechsButton", "button")
  })
  casper.then(function() { // wait for button to appear
    this.waitUntilVisible('button[id="mechThumbhh"]')
  })
  casper.then(function() { // select HH thumbnail
    this.click('button[id="mechThumbhh"]')
    tb.active.buttonID = "addNewMechButton"
    tb.active.tabID = false
  })
  casper.then(function() { // check values
    checkMechValues(test, "mechThumbhh", "hh", {
      n: "mechNamegnabar",
      v: "0.1"
    }, {
      n: "mechNamegkbar",
      v: "0.2"
    }, {
      n: "mechNamegl",
      v: "0.3"
    }, {
      n: "mechNameel",
      v: "0.4"
    })
  })

  casper.then(function() { // check pas and fastpas Thumbnails don't exist
    tb.assertDoesntExist(this, test, "mechThumbpas", "button")
    tb.assertDoesntExist(this, test, "mechThumbpasfast", "button")
  })
}


/*******************************************************************************
 * ----------------------------- SYNMECH-PARAMS ------------------------------- *
 ********************************************************************************/
function populateSynMech(test) {
  casper.then(function() { //check rule name exist
    tb.active = {
      cardID: "Synapses",
      buttonID: "newSynapseButton",
      tabID: false
    }
    this.waitUntilVisible('input[id="synapseName"]', function() {
      test.assertExist('input[id="synapseName"]', "synapse Name exist");
    })
  })

  casper.then(function() {
    tb.setSelectFieldValue(this, test, "synapseModSelect", "Exp2Syn")
  })

  casper.then(function() {
    tb.setInputValue(this, test, "netParams.synMechParams[\'Synapse\'][\'tau1\']", "0.1");
    tb.setInputValue(this, test, "netParams.synMechParams[\'Synapse\'][\'tau2\']", "10");
    tb.setInputValue(this, test, "netParams.synMechParams[\'Synapse\'][\'e\']", "-70");
  })
  casper.then(function() {
    this.wait(2500) // for python to receive data
  })
}

//----------------------------------------------------------------------------//

function checkSynMechValues(test, name = "Synapse", mod = "Exp2Syn", tau2 = "10", tau1 = "0.1", e = "-70") {
  casper.then(function() {
    tb.getInputValue(this, test, "synapseName", name)
    tb.getSelectFieldValue(this, test, "synapseModSelect", mod)
    tb.getInputValue(this, test, "netParams.synMechParams[\'" + name + "\'][\'e\']", e)
    tb.getInputValue(this, test, "netParams.synMechParams[\'" + name + "\'][\'tau1\']", tau1)
    tb.getInputValue(this, test, "netParams.synMechParams[\'" + name + "\'][\'tau2\']", tau2)
  })
}

//----------------------------------------------------------------------------//

function checkSynMechEmpty(test, name) {
  casper.then(function() { //assert new Synapse rule does not displays params before selectiong a "mod"
    this.waitUntilVisible("#synapseName", function() {
      tb.getSelectFieldValue(this, test, "synapseModSelect", "")
      tb.assertDoesntExist(this, test, "netParams.synMechParams[\'" + name + "\'][\'e\']");
      tb.assertDoesntExist(this, test, "netParams.synMechParams[\'" + name + "\'][\'tau1\']");
      tb.assertDoesntExist(this, test, "netParams.synMechParams[\'" + name + "\'][\'tau2\']");
    })
  })
}
//----------------------------------------------------------------------------//
function addTestSynMech(test) {
  tb.message(casper, "extra synMech to test other cards")
  casper.thenClick('button[id="newSynapseButton"]', function() { //add new population
    this.waitUntilVisible('input[id="synapseName"]', function() {
      test.assertExists('input[id="synapseName"]', "rule added");
    })
  })
  casper.thenClick('button[id="newSynapseButton"]', function() { //add new population
    this.waitUntilVisible('input[id="synapseName"]', function() {
      test.assertExists('input[id="synapseName"]', "rule added");
    })
  })
}
/*******************************************************************************
 * ------------------------------- CONN-PARAMS -------------------------------- *
 ********************************************************************************/
function populateConnRule(test) {
  casper.then(function() {
    tb.active = {
      cardID: "Connections",
      buttonID: "newConnectivityRuleButton",
      tabID: false
    }
    tb.assertExist(this, test, "ConnectivityName", "input", "conn name exist")
  })
  casper.then(function() {
    this.wait(2500)
  })
  casper.then(function() { // check all fields exist
    tb.addListItem(this, test, "netParams.connParams[\'ConnectivityRule\'][\'sec\']", "soma")
    tb.addListItem(this, test, "netParams.connParams[\'ConnectivityRule\'][\'loc\']", "0.5")
    tb.addListItem(this, test, "netParams.connParams[\'ConnectivityRule\'][\'sec\']", "dend")
    tb.addListItem(this, test, "netParams.connParams[\'ConnectivityRule\'][\'loc\']", "1")
    tb.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'delay\']", "5")
    tb.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'weight\']", "0.03")
    tb.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'plasticity\']", "0.0001")
    tb.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'convergence\']", "1")
    tb.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'divergence\']", "2")
    tb.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'probability\']", "3")
    tb.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'synsPerConn\']", "4")
    tb.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'synMech\']", "SynapseMenuItem")

  })
  casper.then(function() {
    this.wait(2500)
  })
  casper.then(function() {
    tb.moveToTab(this, test, "preCondsConnTab", "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'pop\']", "div")
  })

  casper.then(function() {
    tb.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'pop\']", "PopulationMenuItem")
    tb.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'cellModel\']", "IFMenuItem")
    tb.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'cellType\']", "GCMenuItem")
    populateRangeComponent(test, "PreConn")
  })
  casper.then(function() {
    tb.moveToTab(this, test, "postCondsConnTab", "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'pop\']", "div")
  })

  casper.then(function() {
    tb.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'pop\']", "Population 2MenuItem")
    tb.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'cellModel\']", "IziMenuItem")
    tb.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'cellType\']", "BCMenuItem")
  })
  casper.then(function() {
    this.wait(2500) //let python receive values
  })
  casper.then(function() {
    tb.moveToTab(this, test, "generalConnTab", "ConnectivityName", "input")
  })
}
//----------------------------------------------------------------------------//
function checkConnRuleValues(test, name = "ConnectivityRule", empty = false) {
  tb.active = {
    cardID: "Connections",
    buttonID: "newConnectivityRuleButton",
    tabID: false
  }
  casper.then(function() { // check all fields exist
    if (empty) {
      test.assertDoesntExist('input[id="netParams.connParams[\'"' + name + '"\'][\'sec\']0"]', "sec list is empty")
      test.assertDoesntExist('input[id="netParams.connParams[\'"' + name + '"\'][\'loc\']0"]', "loc list is empty")
    } else {
      tb.getListItemValue(this, test, "netParams.connParams[\'" + name + "\'][\'sec\']0", "soma")
      tb.getListItemValue(this, test, "netParams.connParams[\'" + name + "\'][\'sec\']1", "dend")
      tb.getListItemValue(this, test, "netParams.connParams[\'" + name + "\'][\'loc\']0", "0.5")
      tb.getListItemValue(this, test, "netParams.connParams[\'" + name + "\'][\'loc\']1", "1")
    }
    tb.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'delay\']", !empty ? "5" : "")
    tb.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'weight\']", !empty ? "0.03" : "")
    tb.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'plasticity\']", !empty ? "0.0001" : "")
    tb.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'convergence\']", !empty ? "1" : "")
    tb.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'divergence\']", !empty ? "2" : "")
    tb.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'probability\']", !empty ? "3" : "")
    tb.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'synsPerConn\']", !empty ? "4" : "")
    tb.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'synMech\']", !empty ? "Synapse" : "")
  })
  casper.then(function() {
    tb.moveToTab(this, test, "preCondsConnTab", "netParams.connParams[\'" + name + "\'][\'preConds\'][\'pop\']", "div")
  })

  casper.then(function() {
    tb.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'preConds\'][\'pop\']", !empty ? "Population" : "")
    tb.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'preConds\'][\'cellModel\']", !empty ? "IF" : "")
    tb.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'preConds\'][\'cellType\']", !empty ? "GC" : "")
    if (empty) {
      checkRangeComponentIsEmpty(test, "PreConn")
    } else {
      testRangeComponent(test, "PreConn")
    }
  })
  casper.then(function() {
    tb.moveToTab(this, test, "postCondsConnTab", "netParams.connParams[\'" + name + "\'][\'postConds\'][\'pop\']", "div")
  })

  casper.then(function() {
    tb.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'postConds\'][\'pop\']", !empty ? "Population 2" : "")
    tb.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'postConds\'][\'cellModel\']", !empty ? "Izi" : "")
    tb.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'postConds\'][\'cellType\']", !empty ? "BC" : "")
    checkRangeComponentIsEmpty(test, "PostConn")
  })
  casper.then(function() {
    tb.moveToTab(this, test, "generalConnTab", "ConnectivityName", "input")
  })
}

/*******************************************************************************
 * --------------------------- STIM-SOURCE-PARAMS ----------------------------- *
 ********************************************************************************/
function populateStimSourceRule(test) {
  casper.then(function() {
    tb.active = {
      cardID: "StimulationSources",
      buttonID: "newStimulationSourceButton",
      tabID: false
    }
  })
  casper.then(function() {
    this.wait(2500)
  })
  casper.then(function() { //check name and source type
    tb.getInputValue(this, test, "sourceName", "stim_source")
    tb.getSelectFieldValue(this, test, "stimSourceSelect", "")
  })

  casper.then(function() {
    this.echo("VClamp")
    this.wait(500)
  })

  casper.then(function() {
    tb.setSelectFieldValue(this, test, "stimSourceSelect", "VClampMenuItem")
  })

  casper.then(function() { // select VClamp source
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'tau1\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'tau2\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'gain\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'rstim\']", "")
    tb.assertDoesntExist(this, test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']0")
    tb.assertDoesntExist(this, test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']0")
  })

  casper.then(function() {
    this.echo("NetStim")
    this.wait(500)
  })
  casper.then(function() {
    tb.setSelectFieldValue(this, test, "stimSourceSelect", "NetStimMenuItem")
  })

  casper.then(function() { // select NetStim source and check correct params
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'rate\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'interval\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'number\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'start\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'noise\']", "")
  })

  casper.then(function() {
    this.echo("Alpha Synapse")
    casper.wait(500)
  })
  casper.then(function() {
    tb.setSelectFieldValue(this, test, "stimSourceSelect", "AlphaSynapseMenuItem")
  })

  casper.then(function() { // select AlphaSynapseMenuItem source and check correct params
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'onset\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'tau\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'gmax\']", "")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'e\']", "")
  })

  casper.then(function() {
    this.echo("IClamp")
    casper.wait(500)
  })

  casper.then(function() {
    tb.setSelectFieldValue(this, test, "stimSourceSelect", "IClampMenuItem")
  })

  casper.then(function() { // select ICLamp source and check correct params
    tb.setInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'del\']", "1")
    tb.setInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']", "2")
    tb.setInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']", "3")
  })

  casper.then(function() {
    this.wait(2000)
  })
}

//----------------------------------------------------------------------------//
function checkStimSourceEmpty(test, name) {
  casper.then(function() { //check name and source type
    tb.getInputValue(this, test, "sourceName", name)
    tb.getSelectFieldValue(this, test, "stimSourceSelect", "")
  })
}

//----------------------------------------------------------------------------//
function checkStimSourceValues(test, name) {
  casper.then(function() {
    tb.getInputValue(this, test, "sourceName", name)
    tb.getSelectFieldValue(this, test, "stimSourceSelect", "IClamp")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'" + name + "\'][\'del\']", "1")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'" + name + "\'][\'dur\']", "2")
    tb.getInputValue(this, test, "netParams.stimSourceParams[\'" + name + "\'][\'amp\']", "3")
  })
}
/*******************************************************************************
 * --------------------------- STIM-TARGET-PARAMS ----------------------------- *
 ********************************************************************************/
function populateStimTargetRule(test) {
  casper.then(function() {
    tb.active = {
      cardID: "StimulationTargets",
      buttonID: "newStimulationTargetButton",
      tabID: false
    }
  })
  casper.then(function() {
    this.wait(2500)
  })
  casper.then(function() {
    tb.getInputValue(this, test, "targetName", "stim_target")
    tb.setSelectFieldValue(this, test, "netParams.stimTargetParams[\'stim_target\'][\'source\']", "newStimSourceMenuItem")
    tb.setInputValue(this, test, "netParams.stimTargetParams['stim_target']['sec']", "soma")
    tb.setInputValue(this, test, "netParams.stimTargetParams['stim_target']['loc']", "0.5")
  })
  casper.then(function() {
    this.wait(2500) //for python to receive data
  })

  casper.then(function() {
    tb.moveToTab(this, test, "stimTargetCondsTab", "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "input")
  })

  casper.then(function() {
    tb.setSelectFieldValue(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'pop\']", "PopulationMenuItem")
    tb.setSelectFieldValue(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellModel\']", "IFMenuItem")
    tb.setSelectFieldValue(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellType\']", "GCMenuItem")
  })
  casper.then(function() { // test range component
    populateRangeComponent(test, "StimTarget");
  });
  casper.then(function() {
    tb.addListItem(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "0")
    tb.addListItem(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "3")
  })
  casper.then(function() {
    this.wait(2500) //for python to receibe data
  })
}

//----------------------------------------------------------------------------//
function checkStimTargetValues(test, name, empty = false) {
  casper.then(function() {
    tb.active.tabID = false
  })
  casper.then(function() { //
    tb.getInputValue(this, test, "targetName", name)
    tb.getSelectFieldValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'source\']", !empty ? "newStimSource" : "")
    tb.getInputValue(this, test, "netParams.stimTargetParams['" + name + "']['sec']", !empty ? "soma" : "")
    tb.getInputValue(this, test, "netParams.stimTargetParams['" + name + "']['loc']", !empty ? "0.5" : "")
  })

  casper.then(function() {
    tb.moveToTab(this, test, "stimTargetCondsTab", "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellList\']", "input")
  })

  casper.then(function() {
    tb.getSelectFieldValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'pop\']", !empty ? "Population" : "")
    tb.getSelectFieldValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellModel\']", !empty ? "IF" : "")
    tb.getSelectFieldValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellType\']", !empty ? "GC" : "")
  })
  casper.then(function() {
    if (empty) {
      checkRangeComponentIsEmpty(test, "StimTarget")
    } else {
      testRangeComponent(test, "StimTarget") // check data remained the same
    }
  })
  casper.then(function() {
    if (empty) {
      tb.assertDoesntExist(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellList\']0")
    } else {
      tb.getListItemValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellList\']0", "0")
      tb.getListItemValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellList\']1", "3")
    }
  })
}
/*******************************************************************************
 *                                 RangeComponent                              *
 *******************************************************************************/
function populateRangeComponent(test, model) {
  casper.then(function() {
    this.echo("explore range component")
    exploreRangeComponent(test, model)
  })
  casper.then(function() { // populate fields with correct and wrong values
    this.echo("set values on range component")
    tb.setInputValue(this, test, "xRange" + model + "MinRange", "0.1")
    tb.setInputValue(this, test, "xRange" + model + "MaxRange", "0.9")
    tb.setInputValue(this, test, "yRange" + model + "MinRange", "100")
    tb.setInputValue(this, test, "yRange" + model + "MaxRange", "900")
    tb.setInputValue(this, test, "zRange" + model + "MinRange", "0.2")
    tb.setInputValue(this, test, "zRange" + model + "MaxRange", "A")
  })
  casper.then(function() { //let python receive data
    this.wait(2000)
  })
}

//----------------------------------------------------------------------------//

function exploreRangeComponent(test, model) {
  casper.then(function() {
    exploreRangeAxis(test, model, "x", "Normalized");
    exploreRangeAxis(test, model, "y", "Absolute");
    exploreRangeAxis(test, model, "z", "Normalized");
  })
}

//----------------------------------------------------------------------------//

function exploreRangeAxis(test, model, axis, norm) {
  var elementID = axis + "Range" + model + "Select"
  var secondElementID = axis + "Range" + model + norm + "MenuItem"
  casper.then(function() {
    tb.click(this, elementID)
  })
  casper.then(function() {
    this.waitUntilVisible('span[id="' + secondElementID + '"]') //wait for dropDownMenu animation
  })
  casper.then(function() {
    tb.click(this, secondElementID, "span")
  })
  casper.then(function() {
    this.waitWhileVisible('span[id="' + secondElementID + '"]')
  })
  casper.then(function() {
    tb.assertExist(this, test, elementID.replace("Select", "") + "MinRange", "input", "min limit in range " + axis + " Exist")
    tb.assertExist(this, test, elementID.replace("Select", "") + "MaxRange", "input", "max limit in range " + axis + " Exist")
  })
}

//----------------------------------------------------------------------------//

function testRangeComponent(test, model) {
  casper.then(function() {
    this.wait(1500, function() { // let pyhton populate fields
      tb.getInputValue(this, test, "xRange" + model + "MinRange", "0.1");
      tb.getInputValue(this, test, "xRange" + model + "MaxRange", "0.9");
      tb.getInputValue(this, test, "yRange" + model + "MinRange", "100");
      tb.getInputValue(this, test, "yRange" + model + "MaxRange", "900");
      tb.assertDoesntExist(this, test, "zRange" + model + "MaxRange")
      tb.assertDoesntExist(this, test, "zRange" + model + "MaxRange")
    })
  })
}

//----------------------------------------------------------------------------//

function checkRangeComponentIsEmpty(test, model) {
  casper.wait(1000, function() { //wait for python to populate fields
    tb.assertDoesntExist(this, test, "xRange" + model + "MinRange");
    tb.assertDoesntExist(this, test, "xRange" + model + "MaxRange");
    tb.assertDoesntExist(this, test, "yRange" + model + "MinRange");
    tb.assertDoesntExist(this, test, "yRange" + model + "MaxRange");
    tb.assertDoesntExist(this, test, "zRange" + model + "MaxRange")
    tb.assertDoesntExist(this, test, "zRange" + model + "MaxRange")
  })
}
