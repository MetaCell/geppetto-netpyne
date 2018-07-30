var urlBase = casper.cli.get('host');
if (urlBase == null || urlBase == undefined) {
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

  // casper.then(function() { //test HTML elements in landing page
  //   casper.echo("######## Testing landping page contents and layout ######## ");
  //   testLandingPage(test);
  // });
  // 
  // casper.then(function() { //test initial state of consoles
  //   casper.echo("######## Test Consoles ######## ");
  //   testConsoles(test);
  // });

  casper.then(function() { // test adding a population using UI
    casper.echo("######## Test Add Population ######## ");
    addPopulation(test);
  });
  // 
  // casper.then(function() { // test adding a cell rule using UI
  //   casper.echo("######## Test Add Cell Rule ######## ");
  //   addCellRule(test);
  // });
  
  // casper.then(function() { // test adding a synapse rule using UI
  //   casper.echo("######## Test Add Synapse ######## ");
  //   addSynapse(test);
  // });
  // 
  // casper.then(function() { // test adding a connection using UI
  //   casper.echo("######## Test Add Connection Rule ######## ");
  //   addConnection(test);
  // });
   
  casper.then(function() { // test adding a stimulus  source using UI
    casper.echo("######## Test Add stim Source Rule ######## ");
    addStimSource(test);
  });
  
  casper.then(function() { // test adding a stimulus target using UI
    casper.echo("######## Test Add stimTarget Rule ######## ");
    addStimTarget(test);
  });
  // 
  // casper.then(function() { // test config 
  //   casper.echo("######## Test default simConfig ######## ");
  //   checkSimConfigParams(test);
  // });
  // 
  // casper.then(function() { //test full netpyne loop using a demo project
  //   casper.echo("######## Running Demo ######## ");
  //   var demo = "from netpyne_ui.tests.tut3 import netParams, simConfig \n" +
  //     "netpyne_geppetto.netParams=netParams \n" +
  //     "netpyne_geppetto.simConfig=simConfig";
  //   loadModelUsingPython(test, demo);
  // });
  // 
  // casper.then(function() { //test explore network tab functionality
  //   casper.echo("######## Test Explore Network Functionality ######## ");
  //   exploreNetwork(test);
  // });
  // 
  // casper.then(function() { //test simulate network tab functionality
  //   casper.echo("######## Test Simulate Network Functionality ######## ");
  //   simulateNetwork(test);
  // });

  casper.run(function() {
    test.done();
  });
});

/**
 * Test existence of HTML elements expected when main landing page is reached
 */
function testLandingPage(test) {
  casper.then(function() {
    assertExist(test, "Populations", "div")
    assertExist(test, "CellRules", "div")
    assertExist(test, "Synapses", "div")
    assertExist(test, "Connections", "div")
    assertExist(test, "SimulationSources", "div")
    assertExist(test, "Configuration", "div")
    assertExist(test, "defineNetwork", "button")
    assertExist(test, "exploreNetwork", "button")
    assertExist(test, "simulateNetwork", "button")
    assertExist(test, "setupNetwork", "button")
  });
}

/**
 * Load consoles and test they toggle
 */
function testConsoles(test) {
  casper.then(function() { //test existence and toggling of python console
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
  casper.then(function() {
    casper.click('#' + consoleButton);
    casper.waitUntilVisible('div[id="' + consoleContainer + '"]', function() {
      this.echo(consoleContainer + ' loaded.');
      test.assertExists('div[id="' + consoleContainer + '"]', consoleContainer + " exists");
      casper.click('#consoleButton');
      casper.waitWhileVisible('div[id="' + consoleContainer + '"]', function() {
        this.echo(consoleContainer + ' hidden.');
        test.assertNotVisible('div[id="' + consoleContainer + '"]', consoleContainer + " no longer visible");
      }, 5000);
    }, 5000);
  });
}

/*****************************************************
 * Create  population  rule  using  the  add  button *
 *****************************************************/
function addPopulation(test) {
  message("create")
  casper.then(function() { // create 2 rules
    create2rules(test, "Populations", "newPopulationButton", "Population")
  })
  
  // message("populate")
  // casper.then(function() { //populate rule 1
  //   populatePopParams(test)
  // })
  // 
  // message("check")
  // casper.then(function() { // focus on rule 2
  //   this.echo("moved to second rule -> should be empty")
  //   selectThumbRule(test, "Population 2", "populationName")
  // })
  // casper.then(function() { // check rule 2 is empty
  //   checkPopParamsValues(test, "Population 2", true)
  // })
  // 
  // casper.then(function() { //focus on rule 1
  //   this.echo("moved to first rule -> should be populated")
  //   selectThumbRule(test, "Population", "populationName")
  // })
  // 
  // casper.then(function() { // check rule 1 is populated
  //   checkPopParamsValues(test, "Population")
  // })
  // 
  message("rename")
  casper.then(function() { // delete rule 2
    delThumbnail(test, "Population 2")
  })
  
  casper.then(function() { //focus on rule 1
    selectThumbRule(test, "Population", "populationName")
  })
  
  casper.then(function() { //rename rule 1
    renameRule(test, "populationName", "newPop")
  })
  // 
  // casper.then(function() { // check rule 1 is populated
  //   checkPopParamsValues(test, "newPop")
  // })
  
  casper.then(function(){ // add rules to test other cards
    addTestPops(test)
  })
  
  message("leave")
  casper.thenClick('#Populations', function() {
    assertDoesntExist(test, "newPopulationButton", "button", "collapse card")
  });
}

/***********************************************
 * Create  cell  rule  using  the  add  button *
 ***********************************************/
function addCellRule(test) {
  message("expanding cellParams card")
  casper.waitForSelector('#CellRules', function(){
    casper.click('#CellRules', function() { // expand cellParams card
      test.assertExist('button[id="newCellRuleButton"]', "card open")
    })
  })
  casper.thenClick('button[id="newCellRuleButton"]', function() { //add cellRule
    this.waitUntilVisible('button[id="CellRule"]', function(){
      this.echo("cellRule created")
    })
  })
  casper.thenClick('button[id="newCellRuleButton"]', function() { //add 2nd cellRule
    this.waitUntilVisible('button[id="CellRule 2"]', function(){
      this.echo("cellRule2 created")
    })
  })
  casper.thenClick('button[id="CellRule"]', function(){ //focus on first cellRule
    this.waitUntilVisible('input[id="cellRuleName"]', function(){
      this.echo("first cellRule active")
    })
  })
  
  casper.then(function(){//populate cellParams general tab
    populateCellRule(test)
  })
  
  casper.thenClick('button[id="CellRule 2"]', function(){// leave current rule
    this.echo("go to cellrule 2 -> fields must be empty")
    this.wait(2000)
  })
  
  casper.then(function(){// check fields are not copy to rule 2
    checkCellParamsValues(test, "CellRule 2", "", "", "", true) 
  })
  
  casper.thenClick('button[id="CellRule"]', function(){// come back to rule 1
    this.echo("come back to cellRule 1 -> fields must be populated")
    this.wait(2000)
  })
  
  casper.then(function(){// check fields remain the same
    checkCellParamsValues(test, "CellRule", "PYR", "HH", "newPop1") 
  })
  casper.then(function(){//move to another rule and come back
    leaveReEnterRule(test, "CellRule", "CellRule 2", "cellRuleName")
  })
  
  //----------- going to section page ----------
  
  message("going to section page")
  casper.thenClick('button[id="cellParamsGoSectionButton"]', function() { //go to "section" page
    test.assertExist('button[id="newCellRuleSectionButton"]', "landed in section page")
  })
  casper.thenClick('#newCellRuleSectionButton', function() { //create section 1
    this.echo("creating 2 sections")
    getInputValue(test, "cellParamsSectionName", "Section")
  });
  casper.thenClick('#newCellRuleSectionButton', function() { //create section 2
    getInputValue(test, "cellParamsSectionName", "Section 2")
  });
  casper.thenClick('button[id="Section"]') //focus on section 1
  
  //----------- going to "Geometry" tab in "section" page ----------
  
  casper.thenClick("#sectionGeomTab", function() { //go to "geometry" tab in "section" page
    this.echo("going to Geometry tab")
  })
  casper.then(function(){// polulate geometry
    populateSectionGeomTab(test)
  })
  
  casper.then(function(){// go to general tab and come back to geometry tab
    leaveReEnterTab(test, "sectionGeomTab", "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "sectionGeneralTab", "cellParamsSectionName")
  })
  
  casper.then(function(){// check values remain the same
    checkSectionGeomTabValues(test, "CellRule", "Section") 
  })
  casper.then(function(){// try to delete an item from pt3d component
    deleteListItem(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']1")
  })
  
  casper.thenClick('button[id="Section 2"]', function(){// change to rule 2
    this.echo("go to section 2 -> values must be empty")
    this.wait(10000) // let python populate fields  
  })
  
  casper.then(function(){// check values must be empty
    checkSectionGeomTabValues(test, "CellRule", "Section 2", "", "", "", "", "", "") 
  })
  
  casper.thenClick('button[id="Section"]', function(){// back to section 1
    this.echo("go to section 1 -> values must be populated")
    this.wait(2000)//let pyhton populate fields
  })
  casper.then(function(){// check values must be populated (except 1 listItem that was deleted)
    checkSectionGeomTabValues(test, "CellRule", "Section", "") 
  })
  
  //----------- going to "Topology" tab in "section" page ----------
  
  casper.thenClick("#sectionTopoTab", function() { // go to "Topology" tab in "section" page
    this.wait(2000)//let python populate fields
  })
  casper.then(function(){// populate "topology" tab in "section" page
    populateSectionTopoTab(test)
  })
  
  casper.then(function(){ // move to another tab and comeback
    leaveReEnterTab(test, "sectionTopoTab", "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "sectionGeneralTab", "cellParamsSectionName", "div")
  })
  
  casper.then(function(){// check fields remain the same
    checkSectionTopoTabValues(test, "CellRule", "Section", "Section", "1", "0") 
  })
  
  casper.thenClick('button[id="Section 2"]', function(){// change to rule 2
    this.echo("go to section 2 -> values must be empty")
    this.wait(2000) // let python populate fields  
  })
  
  casper.then(function(){// check values must be empty
    checkSectionTopoTabValues(test, "CellRule", "Section 2", "", "", "") 
  })
  
  casper.thenClick('button[id="Section"]', function(){// back to section 1
    this.echo("go to section 1 -> values must be populated")
    this.wait(2000)//let pyhton populate fields
  })
  casper.then(function(){// check values must be populated (except 1 listItem that was deleted)
    checkSectionTopoTabValues(test, "CellRule", "Section", "Section", "1", "0") 
  })
  
  //----------- going to "Mechanism" page ----------
  
  casper.thenClick("#sectionGeneralTab", function() { //Go to Mechs page
    casper.waitUntilVisible('button[id="cellParamsGoMechsButton"]', function() {
      message("going to mechanisms page...")
    })
  })
  casper.thenClick("#cellParamsGoMechsButton", function() { // check landing in Mech page
    test.assertExist("#addNewMechButton", "landed in Mechanisms page");
  })
  
  casper.then(function(){//fill mech values
    populateMechs(test)
  })
  
  casper.then(function(){ //check values are correct while moving between mechs
    checkMechs(test)
  })

  casper.thenClick('#fromMech2SectionButton', function() { // leave Mech page and go to Section page
    message("leaving Mech page and coming back...")
    casper.click("#cellParamsGoMechsButton")
  })
  casper.then(function() { //go back to Mechs page
    casper.waitUntilVisible('button[id="mechThumbhh"]', function() {
      test.assertExist('button[id="mechThumbhh"]', "landed back to Mech page")
    })
  })
  
  casper.then(function(){ // check mechs fields remain the same
    checkMechs(test)
  })
  
  casper.then(function(){ 
    this.echo("delete mechanisms:")
  })
  casper.then(function() { // del pas mech
    delThumbnail(test, "mechThumbpas")
  })
  casper.then(function() { // del fastpas mech
    delThumbnail(test, "mechThumbfastpas")
  })
  
  casper.thenClick('button[id="fromMech2SectionButton"]', function() { // go back to --sections--
    message("going to Section page")
    this.waitWhileVisible('button[id="addNewMechButton"]', function(){
      test.assertDoesntExist('button[id="addNewMechButton"]', "landed in Section page")
    })
  });
  
  casper.then(function() { //delete section 2 
    this.echo("delete section 2:")
    delThumbnail(test, "Section 2")
  })
  
  casper.then(function(){
    message("renaming cellRule and section")
  })
  casper.thenClick('button[id="Section"]', function(){
    renameRule(test, "cellParamsSectionName", "newSec1")// rename section 
  })
   
  casper.thenClick('button[id="fromSection2CellRuleButton"]', function() { // go back to cellRule
    this.echo("going back to cellParams page...")
    this.waitWhileVisible('button[id="newCellRuleSectionButton"]', function(){
      test.assertDoesntExist('button[id="newCellRuleSectionButton"]', "landed in cellParams page")
    })
  })
  
  casper.then(function() {// delete cellParams Rule
    delThumbnail(test, "CellRule 2")
  })
  
  casper.thenClick('button[id="CellRule"]', function(){
    renameRule(test, "cellRuleName", "newCell1")// rename cellParams Rule 
  })
  
  casper.then(function(){
    message("check cellRule values after renaming")
  })
  
  casper.then(function(){
    exploreCellRuleAfterRenaming(test) // re-explore whole rule after renaming
  })
  
  message("colapse cellParams rule") // colapse cellParams card
  casper.thenClick('#CellRules', function() {
    assertDoesntExist(test, "newCellRuleButton", "button")
  });
}

/**************************************************
 * Create  Synapse  rule  using  the  add  button *
 **************************************************/
function addSynapse(test) {
  message("create")
  casper.then(function() { // create 2 rules
    create2rules(test, "Synapses", "newSynapseButton", "Synapse")
  })
  
  message("populate")
  casper.then(function() { //populate rule 1
    populateSynMech(test)
  })
  
  message("check")
  casper.then(function() { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    selectThumbRule(test, "Synapse 2", "synapseName")
  })
  
  casper.then(function() { // check rule 2 is empty
    checkSynMechEmpty(test, "Synapse 2")
  })
  
  casper.then(function() { //focus on rule 1
    this.echo("moved to first rule -> should be populated")
    selectThumbRule(test, "Synapse", "synapseName")
  })  
  
  casper.then(function() { // check rule 1 is populated
    checkSynMechValues(test, "Synapse")
  })
  
  message("rename")
  casper.then(function() { // delete rule 2
    delThumbnail(test, "Synapse 2")
  })
  
  casper.then(function() { //focus on rule 1
    selectThumbRule(test, "Synapse", "synapseName")
  })
  
  casper.then(function() { //rename rule 1
    renameRule(test, "synapseName", "newSyn")
  })
  
  casper.then(function() { // check rule 1 is populated
    checkSynMechValues(test, "newSyn")
  })
  
  casper.then(function(){//add rules to test other cards
    addTestSynMech(test)
  })
  
  
  message("leave")
  casper.thenClick('#Synapses', function() {
    assertDoesntExist(test, "newSynapseButton", "collapse card")
  });
}

/*******************************************************
 * Create  connectivity  rule  using  the  add  button *
 *******************************************************/
function addConnection(test) {
  message("create")
  casper.then(function(){// create 2 rules
    create2rules(test, "Connections", "newConnectivityRuleButton", "ConnectivityRule")
  })
  
  message("populate")
  casper.then(function(){//populate rule 1
    populateConnRule(test)
  })
  
  message("check")
  casper.then(function(){//focus on rule 2
    this.echo("moved to second rule -> should be empty")
    selectThumbRule(test, "ConnectivityRule 2", "ConnectivityName")
  })
  
  casper.then(function(){// check rule 2 is empty
    checkConnRuleValues(test, "ConnectivityRule 2", true)
  })
  
  casper.then(function(){//focus on rule 1
    this.echo("moved to first rule -> should be populated")
    selectThumbRule(test, "ConnectivityRule", "ConnectivityName")
  })
    
  casper.then(function(){// check rule 1 is populated
    checkConnRuleValues(test, "ConnectivityRule")
  })
  
  message("rename")
  casper.then(function() { // delete rule 2
    delThumbnail(test, "ConnectivityRule 2")
  })
  
  casper.then(function(){//focus on rule 1
    selectThumbRule(test, "ConnectivityRule", "ConnectivityName")
  })
  
  casper.then(function(){ //rename rule 1
    renameRule(test, "ConnectivityName", "newRule")
  })
  
  casper.then(function(){// check rule 1 is populated
    checkConnRuleValues(test, "newRule")
  })
  message("leave")
  casper.thenClick('#Connections', function() {
    assertDoesntExist(test, "newConnectivityRuleButton", "colapse card")
  });
}
/*****************************************************
 * Create  StimSource  rule  using  the  add  button *
 *****************************************************/
function addStimSource(test) {
  message("create")
  casper.then(function() { // create 2 rules
    create2rules(test, "StimulationSources", "newStimulationSourceButton", "stim_source")
  })
  
  // message("populate")
  // casper.then(function() { // populate rule 1
  //   populateStimSourceRule(test)
  // })
  // 
  // message("check")
  // casper.then(function() { // focus on rule 2
  //   this.echo("moved to second rule -> should be empty")
  //   selectThumbRule(test, "stim_source 2", "sourceName")
  // })
  // 
  // casper.then(function() { // check rule 2 is empty
  //   checkStimSourceEmpty(test, "stim_source 2")
  // })
  // 
  // casper.then(function() { //focus on rule 1
  //   this.echo("moved to first rule -> should be populated")
  //   selectThumbRule(test, "stim_source", "sourceName")
  // })
  // 
  // casper.then(function() { // check rule 1 is populated
  //   checkStimSourceValues(test, "stim_source")
  // })
  // 
  message("rename")
  casper.then(function() { // delete rule 2
    delThumbnail(test, "stim_source 2")
  })
  
  casper.then(function() { //focus on rule 1
    selectThumbRule(test, "stim_source", "sourceName")
  })
  
  casper.then(function() { //rename rule 1
    renameRule(test, "sourceName", "newStimSource")
  })
  casper.then(function(){// delete delete delete delete 
    this.wait(2000)
  })
  
  // casper.then(function() { // check rule 1 is populated
  //   checkStimSourceValues(test, "newStimSource")
  // })
  
  message("leave")
  casper.thenClick('#StimulationSources', function() {
    assertDoesntExist(test, "newStimulationSourceButton", "collapse card")
  });
}
/*****************************************************
 * Create  StimTarget  rule  using  the  add  button *
 *****************************************************/
function addStimTarget(test) {
  message("create")
  casper.then(function() { // create 2 rules
    create2rules(test, "StimulationTargets", "newStimulationTargetButton", "stim_target")
  })
  
  message("populate")
  casper.then(function() { // populate rule 1
    populateStimTargetRule(test)
  })
  
  message("check")
  casper.then(function() { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    selectThumbRule(test, "stim_target 2", "targetName")
  })
  
  casper.then(function() { // check rule 2 is empty
    checkStimTargetValues(test, "stim_target 2", true)
  })
  
  casper.then(function() { //focus on rule 1
    this.echo("moved to first rule -> should be populated")
    selectThumbRule(test, "stim_target", "targetName")
  })
  
  casper.then(function() { // check rule 1 is populated
    checkStimTargetValues(test, "stim_target")
  })
  
  message("rename")
  casper.then(function() { // delete rule 2
    delThumbnail(test, "stim_target 2")
  })
  
  casper.then(function() { //focus on rule 1
    selectThumbRule(test, "stim_target", "targetName")
  })
  
  casper.then(function() { //rename rule 1
    renameRule(test, "targetName", "newStimTarget")
  })
  
  casper.then(function() { // check rule 1 is populated
    checkStimTargetValues(test, "newStimTarget")
  })
  
  message("leave")
  casper.thenClick('#StimulationTargets', function() {
    assertDoesntExist(test, "newStimulationTargetButton", "collapse card")
  });
}


/*************************************
 * Check  simConfig  initial  state  *
 *************************************/
function checkSimConfigParams(test) {
  casper.thenClick('#Configuration', function() { // expand configuration Card
    casper.wait(1500)//let python populate fields
  });
  assertExist(test, "simConfig.hParams")
  assertExist(test, "simConfig.hParams")
  getInputValue(test, "simConfig.duration", "1000");
  getInputValue(test, "simConfig.dt", "0.025");
  getInputValue(test, "simConfig.printRunTime", "false");
  getInputValue(test, "simConfig.hParams0", "clamp_resist : 0.001");
  getInputValue(test, "simConfig.hParams1", "celsius : 6.3");
  getInputValue(test, "simConfig.hParams2", "v_init : -65");
  getInputValue(test, "simConfig.seeds0", "loc : 1");
  getInputValue(test, "simConfig.seeds1", "stim : 1");
  getInputValue(test, "simConfig.seeds2", "conn : 1");
  testCheckBoxValue(test, "simConfig.createNEURONObj", true);
  testCheckBoxValue(test, "simConfig.createPyStruct", true);
  testCheckBoxValue(test, "simConfig.addSynMechs", true);
  testCheckBoxValue(test, "simConfig.includeParamsLabel", true);
  testCheckBoxValue(test, "simConfig.timing", true);
  testCheckBoxValue(test, "simConfig.verbose", false);
  testCheckBoxValue(test, "simConfig.compactConnFormat", false);
  testCheckBoxValue(test, "simConfig.connRandomSecFromList", true);
  testCheckBoxValue(test, "simConfig.printPopAvgRates", false);
  testCheckBoxValue(test, "simConfig.printSynsAfterRule", false);

  casper.thenClick("#configRecord", function() { //go to record tab
    casper.wait(1500);//let python populate fields
  });
  assertExist(test, "simConfig.recordLFP")
  assertExist(test, "simConfig.recordCells")
  assertExist(test, "simConfig.recordTraces")
  getInputValue(test, "simConfig.recordStep", "0.1");
  testCheckBoxValue(test, "simConfig.saveLFPCells", false);
  testCheckBoxValue(test, "simConfig.recordStim", false);

  casper.thenClick("#configSaveConfiguration", function() { //go to saveConfig tab
    casper.wait(1500)//let python populate fields
  });
  assertExist(test, "simConfig.simLabel")
  assertExist(test, "simConfig.saveFolder")
  assertExist(test, "simConfig.saveDataInclude")
  assertExist(test, "simConfig.backupCfgFile")
  getInputValue(test, "simConfig.filename", "model_output");
  getInputValue(test, "simConfig.saveDataInclude0", "netParams");
  getInputValue(test, "simConfig.saveDataInclude1", "netCells");
  getInputValue(test, "simConfig.saveDataInclude2", "netPops");
  getInputValue(test, "simConfig.saveDataInclude3", "simConfig");
  getInputValue(test, "simConfig.saveDataInclude4", "simData");
  testCheckBoxValue(test, "simConfig.saveCellSecs", true);
  testCheckBoxValue(test, "simConfig.saveCellConns", true);
  testCheckBoxValue(test, "simConfig.timestampFilename", false);
  testCheckBoxValue(test, "simConfig.savePickle", false);
  testCheckBoxValue(test, "simConfig.saveJson", false);
  testCheckBoxValue(test, "simConfig.saveMat", false);
  testCheckBoxValue(test, "simConfig.saveHDF5", false);
  testCheckBoxValue(test, "simConfig.saveDpk", false);
  testCheckBoxValue(test, "simConfig.saveDat", false);
  testCheckBoxValue(test, "simConfig.saveCSV", false);
  testCheckBoxValue(test, "simConfig.saveTiming", false);

  casper.thenClick("#configErrorChecking", function() { //go to checkError tab
    casper.wait(1500)//let python populate fields
  });
  testCheckBoxValue(test, "simConfig.checkErrors", false);
  testCheckBoxValue(test, "simConfig.checkErrorsVerbose", false);

  casper.thenClick("#confignetParams", function() { //go to network configuration tab
    casper.wait(1500)//let python populate fields
  });
  assertExist(test, "netParams.scaleConnWeightModels")
  getInputValue(test, "netParams.scale", "1");
  getInputValue(test, "netParams.defaultWeight", "1");
  getInputValue(test, "netParams.defaultDelay", "1");
  getInputValue(test, "netParams.scaleConnWeight", "1");
  getInputValue(test, "netParams.scaleConnWeightNetStims", "1");
  getInputValue(test, "netParams.sizeX", "100");
  getInputValue(test, "netParams.sizeY", "100");
  getInputValue(test, "netParams.sizeZ", "100");
  getInputValue(test, "netParams.propVelocity", "500");
  getInputValue(test, "netParams.rotateCellsRandomly", "false");
  getSelectFieldValue(test, "netParams.shape", "cuboid")
}


/************************************
 *    Tests    list    component    *
 ************************************/
function addListItem(test, elementID, value){
  casper.then(function(){
    setInputValue(test, elementID, value)
  })
  casper.then(function(){
    click(elementID+"AddButton", "button")  
  })
}
function deleteListItem(test, rule){
  casper.then(function(){
    this.waitUntilVisible('button[id="'+rule+'RemoveButton"]')
  })
  casper.then(function(){
    this.click('button[id="'+rule+'RemoveButton"]')
  })
  casper.then(function(){
    this.waitWhileVisible('input[id="'+rule+'"]')
  })
  casper.then(function(){
    this.echo("item removed from list: "+ rule)
  })
  casper.then(function(){
    this.wait(2000)
  })
}
/**************************************************
 * Tests adding a new population and its contents *
 **************************************************/
function testPopulation(test, buttonSelector, expectedName, expectedCellModel, expectedCellType, expectedDimensions) {
  casper.then(function() {
    this.echo("------Testing population button " + buttonSelector);
    casper.waitUntilVisible(buttonSelector, function() {
      test.assertExists(buttonSelector, "Population " + expectedName + " correctly created");
    })
  })
  casper.thenClick('#' + expectedName);// click pop thumbnail
  casper.then(function() { //let python populate fields
    casper.wait(2000, function() {
      this.echo("I've waited a second for metadata to be populated")
    });
  });
  casper.then(function() { //test metadata contents
    getInputValue(test, "populationName", expectedName);
    getInputValue(test, "netParams.popParams[\'" + expectedName + "\'][\'cellModel\']", expectedCellModel);
    getInputValue(test, "netParams.popParams[\'" + expectedName + "\'][\'cellType\']", expectedCellType);
    getInputValue(test, "popParamsDimensions", expectedDimensions);
  });
}
/*******************************************************************************
 *                                 RangeComponent                              *
 *******************************************************************************/
function populateRangeComponent(test, model) {
  casper.then(function(){
    this.echo("explore range component")
    exploreRangeComponent(test, model)
  })
  casper.then(function(){ // populate fields with correct and wrong values
    this.echo("set values on range component")
    setInputValue(test, "xRange"+model+"MinRange", "0.1")
    setInputValue(test, "xRange"+model+"MaxRange", "0.9")
    setInputValue(test, "yRange"+model+"MinRange", "100")
    setInputValue(test, "yRange"+model+"MaxRange", "900")
    setInputValue(test, "zRange"+model+"MinRange", "0.2")
    setInputValue(test, "zRange"+model+"MaxRange", "A")
  })
  casper.then(function(){//let python receive data
    this.wait(2000) 
  })
}

//----------------------------------------------------------------------------//

function exploreRangeComponent(test, model){
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
  casper.then(function(){
    click(elementID)
  })
  casper.then(function(){
    this.waitUntilVisible('span[id="'+secondElementID+'"]')//wait for dropDownMenu animation
  })
  casper.then(function(){
    click(secondElementID, "span")
  })
  casper.then(function(){
    this.waitWhileVisible('span[id="'+secondElementID+'"]')
  })
  casper.then(function(){
    assertExist(test, elementID.replace("Select", "") + "MinRange", "input", "min limit in range " + axis + " Exist" )
    assertExist(test, elementID.replace("Select", "") + "MaxRange", "input", "max limit in range " + axis + " Exist" )
  })
}

//----------------------------------------------------------------------------//

function testRangeComponent(test, model){
  casper.then(function(){ 
    casper.wait(1500, function(){// let pyhton populate fields
      getInputValue(test, "xRange"+model+"MinRange", "0.1");
      getInputValue(test, "xRange"+model+"MaxRange", "0.9");
      getInputValue(test, "yRange"+model+"MinRange", "100");
      getInputValue(test, "yRange"+model+"MaxRange", "900");
      assertDoesntExist(test, "zRange"+model+"MaxRange")
      assertDoesntExist(test, "zRange"+model+"MaxRange")
    })
  })
}

//----------------------------------------------------------------------------//

function checkRangeComponentIsEmpty(test, model){
  casper.wait(1000, function(){//wait for python to populate fields
    assertDoesntExist(test, "xRange"+model+"MinRange");
    assertDoesntExist(test, "xRange"+model+"MaxRange");
    assertDoesntExist(test, "yRange"+model+"MinRange");
    assertDoesntExist(test, "yRange"+model+"MaxRange");
    assertDoesntExist(test, "zRange"+model+"MaxRange")
    assertDoesntExist(test, "zRange"+model+"MaxRange")
  })
}
/*******************************************************************************
 *               Test adding a new cell rule and its contents                  *
 *******************************************************************************/
function testCellRule(test, buttonSelector, expectedName, expectedCellModelId, expectedCellTypeId) {
  casper.then(function() {
    this.echo("------Testing cell rules button " + buttonSelector);
    casper.waitUntilVisible(buttonSelector, function() {
      this.echo('Cell Rule button exists.');
      this.click('#' + expectedName);
      casper.then(function() { //give it some time to allow metadata to load
        casper.wait(500, function() {
          this.echo("I've waited a second for metadata to be populated")
        });
      });
      casper.then(function() { //test contents of metadata
        getInputValue(test, "cellRuleName", expectedName);
        test.assertExists(expectedCellModelId, "cellRullCellModel exists");
        test.assertExists(expectedCellTypeId, "cellRullCellType exists");
      });
    }, 5000);
  });
}
/********************************
 * Load demo model using python *
 ********************************/
function loadModelUsingPython(test, demo) {
  casper.then(function() {
    this.echo("------Loading demo for further testing ");
    casper.evaluate(function(demo) {
      var kernel = IPython.notebook.kernel;
      kernel.execute(demo);
    }, demo);
  });

  casper.then(function() { //make populations view visible
    casper.click('#Populations');
    casper.waitUntilVisible('button[id="newPopulationButton"]', function() {
      this.echo("Population view loaded");
    }, 5000);
  });

  casper.then(function() { //test first population exists after demo is loaded
    testPopulation(test, "button#S", "S", "HH", "PYR", "20");
  });

  casper.then(function() { //test second population exists after demo is loaded
    testPopulation(test, "button#M", "M", "HH", "PYR", "20");
  });

  casper.then(function() { //expand cell rules view
    casper.click('#CellRules');
    casper.waitUntilVisible('button[id="newCellRuleButton"]', function() {
      this.echo("Cell Rule view loaded");
    }, 5000);
  });

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
    casper.click('#exploreNetwork');
    casper.waitUntilVisible('button[id="okInstantiateNetwork"]', function() {
      casper.then(function() {
        canvasComponentsTests(test);
      });
      casper.then(function() { //switch to explore network tab
        casper.click('#okInstantiateNetwork');
        casper.waitWhileVisible('button[id="okInstantiateNetwork"]', function() {
          test.assertDoesntExist('button[id="okInstantiateNetwork"]', "Explore network dialog is gone");
          casper.waitWhileVisible('div[id="loading-spinner"]', function() {
            test.assertDoesntExist('button[id="okInstantiateNetwork"]', "Explore network's finished loading");
            this.echo("Testing meshes for network exist and are visible");
            testMeshVisibility(test, true, "network.S[0]");
            testMeshVisibility(test, true, "network.S[1]");
            testMeshVisibility(test, true, "network.S[2]");
            testMeshVisibility(test, true, "network.S[18]");
            testMeshVisibility(test, true, "network.S[19]");
          }, 5000);
        }, 5000);
      });

    }, 5000);
  });

  casper.then(function() { //open up plot menu 
    casper.click('#PlotButton');
  });

  casper.then(function() { //wait for plot menu to become visible
    casper.waitUntilVisible('div[role="menu"]', function() {
      test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");
      casper.then(function() { // test 2d Net plot comes up
        testPlotButton(test, "2dNetPlot", "Popup1");
      });
      //FIXME: Broken test
      /*casper.then(function(){ // test shape plot comes up
      	testPlotButton(test, "shapePlot", "Popup1");
      });*/
      casper.then(function() { // test connection plot comes up
        testPlotButton(test, "connectionPlot", "Popup1");
      });

    }, 5000);
  });

  casper.then(function() { // click on plot button again to close the menu	
    casper.evaluate(function() {
      $("#PlotButton").click();
    });
    casper.waitWhileVisible('div[role="menu"]', function() { //wait for menu to close
      test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");
    }, 5000);
  });

  casper.then(function() { //open up control panel
    casper.click('#ControlPanelButton');
  });

  casper.then(function() { //test initial load values in control panel
    testControlPanelValues(test, 43);
  });

  casper.then(function() { //close control panel
    casper.click('#ControlPanelButton');
  });
}
/*******************************************************
 * Test functionality within the simulate network view *
 *******************************************************/
function simulateNetwork(test) {
  casper.then(function() {
    this.echo("------Testing explore network");
    test.assertExists('button[id="simulateNetwork"]', "Simulate network button exists");
    casper.click('#simulateNetwork');
    casper.waitUntilVisible('button[id="runSimulation"]', function() {
      casper.then(function() {
        casper.click('#runSimulation');
        casper.waitWhileVisible('button[id="runSimulation"]', function() {
          casper.echo("Dialog disappeared");
          casper.waitWhileVisible('div[id="loading-spinner"]', function() {
            casper.echo("Loading spinner disappeared");
            this.echo("Testing meshes for network exist and are visible");
            testMeshVisibility(test, true, "network.S[0]");
            testMeshVisibility(test, true, "network.S[1]");
            testMeshVisibility(test, true, "network.S[2]");
            testMeshVisibility(test, true, "network.S[18]");
            testMeshVisibility(test, true, "network.S[19]");
          }, 150000);
        }, 150000);
      });

    }, 15000);
  });

  casper.then(function() {
    casper.click('#PlotButton');
  });

  casper.then(function() {
    casper.waitUntilVisible('div[role="menu"]', function() {
      test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");

      casper.then(function() {
        testPlotButton(test, "rasterPlot", "Popup1");
      });

      casper.then(function() {
        testPlotButton(test, "spikePlot", "Popup1");
      });

      //FIXME: Broken test
      /*casper.then(function(){
      	testPlotButton(test, "spikeStatsPlot", "Popup1");
      });*/

      casper.then(function() {
        testPlotButton(test, "ratePSDPlot", "Popup1");
      });

      casper.then(function() {
        testPlotButton(test, "tracesPlot", "Popup1");
      });

      casper.then(function() {
        testPlotButton(test, "grangerPlot", "Popup1");
      });
    }, 5000);
  });

  casper.then(function() {
    casper.evaluate(function() {
      $("#PlotButton").click();
    });

    casper.waitWhileVisible('div[role="menu"]', function() {
      test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");

    }, 5000);
  });
}

function testMeshVisibility(test, visible, variableName) {
  casper.then(function() {
    var visibility = casper.evaluate(function(variableName) {
      var visibility = CanvasContainer.engine.getRealMeshesForInstancePath(variableName)[0].visible;
      return visibility;
    }, variableName);
    test.assertEquals(visibility, visible, variableName + " visibility correct");
  });
}

function waitForPlotGraphElement(test, elementID) {
  casper.waitUntilVisible('g[id="' + elementID + '"]', function() {
    test.assertExists('g[id="' + elementID + '"]', "Element " + elementID + " exists");
  }, 5000);
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
    casper.evaluate(function(plotButton, expectedPlot) {
      document.getElementById(plotButton).click(); //Click on plot option
    }, plotButton, expectedPlot);
    casper.then(function() {
      casper.waitUntilVisible('div[id="' + expectedPlot + '"]', function() {
        test.assertExists('div[id="' + expectedPlot + '"]', expectedPlot + " (" + plotButton + ") exists");
        casper.then(function() { //test plot has certain elements that are render if plot succeeded
          waitForPlotGraphElement(test, "figure_1");
          waitForPlotGraphElement(test, "axes_1");
        });
        casper.then(function() { //destroy the plot widget
          casper.evaluate(function(expectedPlot) {
            window[expectedPlot].destroy();
          }, expectedPlot);
          casper.waitWhileVisible('div[id="' + expectedPlot + '"]', function() {
            test.assertDoesntExist('div[id="' + expectedPlot + '"]', expectedPlot + " (" + plotButton + ") no longer exists");
          }, 5000);
        });
      }, 5000);
    });
  });

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
    casper.waitUntilVisible('div#controlpanel', function() {
      test.assertVisible('div#controlpanel', "The control panel is correctly open.");
      var rows = casper.evaluate(function() {
        return $(".standard-row").length;
      });
      test.assertEquals(rows, values, "The control panel opened with right amount of rows");
    });
  });
  casper.then(function() {
    casper.evaluate(function() {
      $("#controlpanel").remove();
    });

    casper.waitWhileVisible('div#controlpanel', function() {
      test.assertDoesntExist('div#controlpanel', "Control Panel went away");
    }, 5000);
  });
}

/*******************************************************************************
*--------------------------------POP-PARAMS----------------------------------  *
*******************************************************************************/
function populatePopParams(test){
  message("populating popParams rule")
  casper.then(function(){//populate fields
    test.assertExists("#populationName", "Pop name Exists");
    setInputValue(test, "netParams.popParams[\'Population\'][\'cellType\']", "PYR")
    setInputValue(test, "netParams.popParams[\'Population\'][\'cellModel\']", "HH")
  })
  casper.then(function(){ // populate dimension component
    populatePopDimension(test)
  })
  casper.then(function(){
    this.wait(1500)//let python receive data
  })
  casper.thenClick('#spatialDistPopTab', function() { //go to second tab (spatial distribution)
    this.echo("changed tab")
    populateRangeComponent(test, "PopParams")// populate RangeComponent
  })
}

//----------------------------------------------------------------------------//

function checkPopParamsValues(test, ruleName, empty=false){
  casper.then(function(){// check fields remained the same after renaiming and closing card
    getInputValue(test, "populationName", ruleName);
    getInputValue(test, "netParams.popParams[\'"+ruleName+"\'][\'cellType\']", !empty?"PYR":"");
    getInputValue(test, "netParams.popParams[\'"+ruleName+"\'][\'cellModel\']", !empty?"HH":"");
  })
  
  casper.then(function(){//check dimension
    if (empty){
      assertDoesntExist(test, "popParamsDimensions");
    } else {
      getInputValue(test, "popParamsDimensions", "20");
    }
  })

  casper.thenClick('#spatialDistPopTab', function() { //go to second tab (spatial distribution)
    this.wait(1000)// wait for python to populate fields
  })
  
  casper.then(function(){
    if (empty){
      checkRangeComponentIsEmpty(test, "PopParams")
    } else {
      testRangeComponent(test, "PopParams")// check data remained the same
    }
  })
}

//----------------------------------------------------------------------------//

function populatePopDimension(test){
  casper.then(function(){
    click("popParamsDimensionsSelect", "div");//click dimension SelectList
  })
  casper.then(function() {// check all menuItems exist
    assertExist(test, "popParamSnumCells", "span");
    assertExist(test, "popParamSdensity", "span");
    assertExist(test, "popParamSgridSpacing", "span");
  });
  
  casper.thenClick("#popParamSnumCells", function() { //check 1st menuItem displays input field
    setInputValue(test, "popParamsDimensions", "20")
  })
  casper.then(function(){// let python receive changes
    casper.wait(1500)
  })
} 


//----------------------------------------------------------------------------//
function addTestPops(test){
  message("adding pops to test other cards")
  casper.thenClick('button[id="newPopulationButton"]', function() { //add new population
    this.waitUntilVisible('input[id="populationName"]', function(){
      test.assertExists('input[id="populationName"]', "rule added");
    })
  })
  casper.then(function(){//populate fields
    setInputValue(test, "netParams.popParams[\'Population\'][\'cellType\']", "GC")
    setInputValue(test, "netParams.popParams[\'Population\'][\'cellModel\']", "IF")
  })
  casper.then(function(){
    this.wait(1000)
  })
  casper.thenClick('button[id="newPopulationButton"]', function() { //add new population
    this.waitUntilVisible('button[id="Population 2"]', function(){
      test.assertExists('button[id="Population 2"]', "rule added");
    })
  })
  casper.then(function(){//populate fields
    setInputValue(test, "netParams.popParams[\'Population 2\'][\'cellType\']", "BC")
    setInputValue(test, "netParams.popParams[\'Population 2\'][\'cellModel\']", "Izi")
  })
  casper.then(function(){
    this.wait(1000)
  })
}

/*******************************************************************************
* ------------------------------- CELL-PARAMS -------------------------------- *
********************************************************************************/
function populateCellRule(test){
  message("populate cellParams general tab")
  casper.then(function() { // populate cellRule
    assertExist(test, "cellRuleName")
    setSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellType\']", "PYRMenuItem")
    setSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellModel\']", "HHMenuItem")
    setSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'pop\']", "newPop1MenuItem")
  })
  casper.then(function(){
    populateRangeComponent(test, "CellParams")// populate RangeComponent
  })
}

//----------------------------------------------------------------------------//

function checkCellParamsValues(test, name, cellType, cellModel, pop, rangeEmpty=false) {
  casper.then(function(){
    getInputValue(test, "cellRuleName", name)
    getSelectFieldValue(test, "netParams.cellParams[\'"+name+"\'][\'conds\'][\'cellType\']", cellType)
    getSelectFieldValue(test, "netParams.cellParams[\'"+name+"\'][\'conds\'][\'cellModel\']", cellModel)
    getSelectFieldValue(test, "netParams.cellParams[\'"+name+"\'][\'conds\'][\'pop\']", pop)
  })
  casper.then(function(){
    if (rangeEmpty){
      checkRangeComponentIsEmpty(test, "CellParams")
    } else {
      testRangeComponent(test, "CellParams")
    }
  })
}

/*******************************************************************************
* ---------------------------- CELL-PARAMS -- SECTION ------------------------ *
********************************************************************************/

function populateSectionGeomTab(test){
  casper.then(function(){
    this.echo("about to populate Geometry tab in section page...")
  })
  casper.then(function(){
    setInputValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "20")
    setInputValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'L\']", "30")
    setInputValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'Ra\']", "100")
    setInputValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'cm\']", "1")
    addListItem(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']", "10,0,0")
    addListItem(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']", "20,0,0")
  })
  casper.then(function(){
    casper.wait(2000)//let python receive values
  })
}

//----------------------------------------------------------------------------//

function checkSectionGeomTabValues(test, ruleName, sectionName, p2="[20,0,0]", p1="[10,0,0]", d="20", l="30", r="100", c="1") {
  casper.then(function(){
    getInputValue(test, "netParams.cellParams[\'"+ruleName+"\'][\'secs\'][\'"+sectionName+"\'][\'geom\'][\'diam\']", d)
    getInputValue(test, "netParams.cellParams[\'"+ruleName+"\'][\'secs\'][\'"+sectionName+"\'][\'geom\'][\'L\']", l)
    getInputValue(test, "netParams.cellParams[\'"+ruleName+"\'][\'secs\'][\'"+sectionName+"\'][\'geom\'][\'Ra\']", r)
    getInputValue(test, "netParams.cellParams[\'"+ruleName+"\'][\'secs\'][\'"+sectionName+"\'][\'geom\'][\'cm\']", c)
  })
  casper.then(function(){
    if (p2){
      getInputValue(test, "netParams.cellParams[\'"+ruleName+"\'][\'secs\'][\'"+sectionName+"\'][\'geom\'][\'pt3d\']1", p2)
    }
  })
  casper.then(function(){
    if (p1){
      getInputValue(test, "netParams.cellParams[\'"+ruleName+"\'][\'secs\'][\'"+sectionName+"\'][\'geom\'][\'pt3d\']0", p1)
    }
  })
}

//----------------------------------------------------------------------------//

function populateSectionTopoTab(test){
  casper.then(function(){//populate "topology" tab in "section" page
    setSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "SectionMenuItem")
    setInputValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentX\']", "1")
    setInputValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'childX\']", "0")
  })
  casper.then(function(){
    casper.wait(2000)//let python receive values
  })
}

//----------------------------------------------------------------------------//

function checkSectionTopoTabValues(test, cellRuleName, sectionName, parentSec, pX, cX) {
  casper.then(function(){
    getSelectFieldValue(test, "netParams.cellParams[\'"+cellRuleName+"\'][\'secs\'][\'"+sectionName+"\'][\'topol\'][\'parentSec\']", parentSec)
    getInputValue(test, "netParams.cellParams[\'"+cellRuleName+"\'][\'secs\'][\'"+sectionName+"\'][\'topol\'][\'parentX\']", pX)
    getInputValue(test, "netParams.cellParams[\'"+cellRuleName+"\'][\'secs\'][\'"+sectionName+"\'][\'topol\'][\'childX\']", cX)
  })
}

/*******************************************************************************
* ---------------------------- CELL-PARAMS -- MECHS -------------------------- *
********************************************************************************/

function populateMechs(test) {
  casper.then(function(){ // add HH mechanism and populate fields
    this.echo("add HH mech")
    populateMech(test, "hh", {n:"mechNamegnabar", v:"0.1"}, {n:"mechNamegkbar", v:"0.2"}, {n:"mechNamegl", v:"0.3"}, {n:"mechNameel", v:"0.4"})
  })
  
  casper.then(function(){ // add PAS mechanism and populate fields
    this.echo("add PAS mech")
    populateMech(test, "pas", {n:"mechNameg", v:"0.5"}, {n:"mechNamee", v:"0.6"}, {n:"", v:""}, {n:"", v:""})
  })
  
  casper.then(function(){ // add FASTPAS mechanism and populate fields
    this.echo("add FASTPAS mech")
    populateMech(test, "fastpas", {n:"mechNameg", v:"0.7"}, {n:"mechNamee", v:"0.8"}, {n:"", v:""}, {n:"", v:""})
  })
}

//----------------------------------------------------------------------------//

function checkMechs(test){
  casper.then(function(){// check values after coming back to HH mech
    this.echo("check HH fields")
    checkMechValues(test, "mechThumbhh", "hh", {n:"mechNamegnabar", v:"0.1"}, {n:"mechNamegkbar", v:"0.2"}, {n:"mechNamegl", v:"0.3"}, {n:"mechNameel", v:"0.4"})
  })
  casper.then(function(){// check values after coming back to PAS mech
    this.echo("check PAS fields")
    checkMechValues(test, "mechThumbpas", "pas", {n:"mechNameg", v:"0.5"}, {n:"mechNamee", v:"0.6"}, {n:"", v:""}, {n:"", v:""})
  })
  casper.then(function(){// check values after coming back to HH mech
    this.echo("check FASTPAS fields")
    checkMechValues(test, "mechThumbfastpas", "fastpas", {n:"mechNameg", v:"0.7"}, {n:"mechNamee", v:"0.8"}, {n:"", v:""}, {n:"", v:""})
  })
}

//----------------------------------------------------------------------------//

function populateMech(test, mechName, v1,v2, v3, v4){
  casper.thenClick('#addNewMechButton', function() { // click SelectField and check MenuItem exist
    this.waitUntilVisible('span[id="'+mechName+'"]')
  })
  casper.thenClick("#"+mechName, function() { // click add mech and populate fields
    getInputValue(test, "singleMechName", mechName)
    setInputValue(test, v1.n, v1.v);
    setInputValue(test, v2.n, v2.v);
    v3.v?setInputValue(test, v3.n, v3.v):{};
    v4.v?setInputValue(test, v4.n, v4.v):{};
  })
  casper.then(function(){
    casper.wait(2000)// for python to receive data
  })
}

//----------------------------------------------------------------------------//

function checkMechValues(test, mechThumb, mech, v1, v2, v3, v4){
  casper.thenClick('button[id="'+mechThumb+'"]')
  casper.then(function(){
    casper.wait(1500)// for python to populate fields
  })
  casper.then(function() { // check Fields
    getInputValue(test, "singleMechName", mech)
    getInputValue(test, v1.n, v1.v);
    getInputValue(test, v2.n, v2.v);
    v3.v?getInputValue(test, v3.n, v3.v):{};
    v4.v?getInputValue(test, v4.n, v4.v):{};
  });
}

/*******************************************************************************
* ----------------------- CELL-PARAMS -- Full check -------------------------- *
********************************************************************************/
function exploreCellRuleAfterRenaming(test){
  
  casper.then(function(){
    casper.wait(5000)//for python to populate fields
  })
  casper.then(function(){
    checkCellParamsValues(test, "newCell1", "PYR", "HH", "newPop1") 
  })
  
  casper.thenClick('button[id="cellParamsGoSectionButton"]', function() { //go to "sections"
    test.assertExist('button[id="newCellRuleSectionButton"]', "landed in section")
  })
  casper.then(function(){
    this.wait(2000)
  })
  casper.then(function(){
    this.waitUntilVisible('button[id="newSec1"]', function(){
      this.click('button[id="newSec1"]')
    })
  })
  casper.then(function(){
    this.wait(2000)//wait  for python to populate fields
  })
  
  casper.then(function(){// check section name
    getInputValue(test, "cellParamsSectionName", "newSec1")
  })
  casper.thenClick("#sectionGeomTab", function() { // go to Geometry tab 
    this.wait(2000)//wait  for python to populate fields
  })
  casper.then(function(){
    checkSectionGeomTabValues(test, "newCell1", "newSec1", "")
  })

  casper.thenClick("#sectionTopoTab", function() { // go to Topology tab
    casper.wait(2000)//wait  for python to populate fields
  })
  casper.then(function(){
    checkSectionTopoTabValues(test, "newCell1", "newSec1", "", "1", "0")
  })

  casper.thenClick("#sectionGeneralTab", function() {//go to "general tab" in "section" page
    casper.waitUntilVisible('button[id="cellParamsGoMechsButton"]')
  })
  casper.then(function() {// go to mechs page 
    click("cellParamsGoMechsButton", "button")
  })
  casper.then(function() {// wait for button to appear
    this.waitUntilVisible('button[id="mechThumbhh"]')
  })
  casper.then(function(){// select HH thumbnail
    this.click('button[id="mechThumbhh"]')
  })
  casper.then(function(){ // check values
    checkMechValues(test, "mechThumbhh", "hh", {n:"mechNamegnabar", v:"0.1"}, {n:"mechNamegkbar", v:"0.2"}, {n:"mechNamegl", v:"0.3"}, {n:"mechNameel", v:"0.4"})
  })

  casper.then(function(){ // check pas and fastpas Thumbnails don't exist
    assertDoesntExist(test, "mechThumbpas", "button")
    assertDoesntExist(test, "mechThumbpasfast", "button")
  })
}


/*******************************************************************************
* ----------------------------- SYNMECH-PARAMS ------------------------------- *
********************************************************************************/
function populateSynMech(test) {
  casper.then(function() {//check rule name exist
    casper.waitUntilVisible('input[id="synapseName"]', function() {
      test.assertExist('input[id="synapseName"]', "synapse Name exist");
    })
  })
  
  casper.then(function(){
    setSelectFieldValue(test, "synapseModSelect", "Exp2Syn")
  })
  
  casper.then(function(){
    setInputValue(test, "netParams.synMechParams[\'Synapse\'][\'tau1\']", "0.1");
    setInputValue(test, "netParams.synMechParams[\'Synapse\'][\'tau2\']", "10");
    setInputValue(test, "netParams.synMechParams[\'Synapse\'][\'e\']", "-70");
  })
  casper.then(function(){
    this.wait(2000) // for python to receive data
  })
}

//----------------------------------------------------------------------------//

function checkSynMechValues(test, name="Synapse", mod="Exp2Syn", tau2="10", tau1="0.1", e="-70") {
  casper.then(function(){
    getInputValue(test, "synapseName", name)
    getSelectFieldValue(test, "synapseModSelect", mod) 
    getInputValue(test, "netParams.synMechParams[\'"+name+"\'][\'e\']", e)
    getInputValue(test, "netParams.synMechParams[\'"+name+"\'][\'tau1\']", tau1)
    getInputValue(test, "netParams.synMechParams[\'"+name+"\'][\'tau2\']", tau2)
  })
}

//----------------------------------------------------------------------------//

function checkSynMechEmpty(test, name){
  casper.then(function() { //assert new Synapse rule does not displays params before selectiong a "mod"
    this.waitUntilVisible("#synapseName", function() {
      getSelectFieldValue(test, "synapseModSelect", "") 
      assertDoesntExist(test, "netParams.synMechParams[\'"+name+"\'][\'e\']");
      assertDoesntExist(test, "netParams.synMechParams[\'"+name+"\'][\'tau1\']");
      assertDoesntExist(test, "netParams.synMechParams[\'"+name+"\'][\'tau2\']");
    })
  })
}
//----------------------------------------------------------------------------//
function addTestSynMech(test){
  message("adding synMech to test other cards")
  casper.thenClick('button[id="newSynapseButton"]', function() { //add new population
    this.waitUntilVisible('input[id="synapseName"]', function(){
      test.assertExists('input[id="synapseName"]', "rule added");
    })
  })
  casper.thenClick('button[id="newSynapseButton"]', function() { //add new population
    this.waitUntilVisible('input[id="synapseName"]', function(){
      test.assertExists('input[id="synapseName"]', "rule added");
    })
  })
}
/*******************************************************************************
* ------------------------------- CONN-PARAMS -------------------------------- *
********************************************************************************/
function populateConnRule(test){
  casper.then(function(){
    assertExist(test, "ConnectivityName", "input", "conn name exist")
  })
  casper.then(function() { // check all fields exist
    addListItem(test, "netParams.connParams[\'ConnectivityRule\'][\'sec\']", "soma")
    addListItem(test, "netParams.connParams[\'ConnectivityRule\'][\'loc\']", "0.5")
    addListItem(test, "netParams.connParams[\'ConnectivityRule\'][\'sec\']", "dend")
    addListItem(test, "netParams.connParams[\'ConnectivityRule\'][\'loc\']", "1")
    setInputValue(test, "netParams.connParams[\'ConnectivityRule\'][\'delay\']", "5")
    setInputValue(test, "netParams.connParams[\'ConnectivityRule\'][\'weight\']", "0.03")
    setInputValue(test, "netParams.connParams[\'ConnectivityRule\'][\'plasticity\']", "0.0001")
    setInputValue(test, "netParams.connParams[\'ConnectivityRule\'][\'convergence\']", "1")
    setInputValue(test, "netParams.connParams[\'ConnectivityRule\'][\'divergence\']", "2")
    setInputValue(test, "netParams.connParams[\'ConnectivityRule\'][\'probability\']", "3")
    setInputValue(test, "netParams.connParams[\'ConnectivityRule\'][\'synsPerConn\']", "4")
    setSelectFieldValue(test, "netParams.connParams[\'ConnectivityRule\'][\'synMech\']", "SynapseMenuItem")
    
  })
  casper.then(function(){
    moveToTab(test, "preCondsConnTab", "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'pop\']", "div")
  })
  casper.then(function(){
    setSelectFieldValue(test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'pop\']", "PopulationMenuItem")
    setSelectFieldValue(test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'cellModel\']", "IFMenuItem")
    setSelectFieldValue(test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'cellType\']", "GCMenuItem")
    populateRangeComponent(test, "PreConn")
  })
  casper.then(function(){
    moveToTab(test, "postCondsConnTab", "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'pop\']", "div")
  })
  casper.then(function(){
    setSelectFieldValue(test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'pop\']", "Population 2MenuItem")
    setSelectFieldValue(test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'cellModel\']", "IziMenuItem")
    setSelectFieldValue(test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'cellType\']", "BCMenuItem")
  })
  casper.then(function(){
    this.wait(2000)//let python receive values
  })
  casper.then(function(){
    moveToTab(test, "generalConnTab", "ConnectivityName", "input")
  })
  
}
//----------------------------------------------------------------------------//
function checkConnRuleValues(test, name="ConnectivityRule", empty=false) {
  casper.then(function() { // check all fields exist
    if (empty){
      test.assertDoesntExist('input[id="netParams.connParams[\'"+name+"\'][\'sec\']0"]', "sec list is empty")
      test.assertDoesntExist('input[id="netParams.connParams[\'"+name+"\'][\'loc\']0"]', "loc list is empty")
    }else{
      getInputValue(test, "netParams.connParams[\'"+name+"\'][\'sec\']0", "soma")
      getInputValue(test, "netParams.connParams[\'"+name+"\'][\'sec\']1", "dend")
      getInputValue(test, "netParams.connParams[\'"+name+"\'][\'loc\']0", "0.5")
      getInputValue(test, "netParams.connParams[\'"+name+"\'][\'loc\']1", "1")
    }
    getInputValue(test, "netParams.connParams[\'"+name+"\'][\'delay\']", !empty?"5":"")
    getInputValue(test, "netParams.connParams[\'"+name+"\'][\'weight\']", !empty?"0.03":"")
    getInputValue(test, "netParams.connParams[\'"+name+"\'][\'plasticity\']", !empty?"0.0001":"")
    getInputValue(test, "netParams.connParams[\'"+name+"\'][\'convergence\']", !empty?"1":"")
    getInputValue(test, "netParams.connParams[\'"+name+"\'][\'divergence\']", !empty?"2":"")
    getInputValue(test, "netParams.connParams[\'"+name+"\'][\'probability\']", !empty?"3":"")
    getInputValue(test, "netParams.connParams[\'"+name+"\'][\'synsPerConn\']", !empty?"4":"")
    getSelectFieldValue(test, "netParams.connParams[\'"+name+"\'][\'synMech\']", !empty?"Synapse":"")
  })
  casper.then(function(){
    moveToTab(test, "preCondsConnTab", "netParams.connParams[\'"+name+"\'][\'preConds\'][\'pop\']", "div")
  })
  casper.then(function(){
    getSelectFieldValue(test, "netParams.connParams[\'"+name+"\'][\'preConds\'][\'pop\']", !empty?"Population":"")
    getSelectFieldValue(test, "netParams.connParams[\'"+name+"\'][\'preConds\'][\'cellModel\']", !empty?"IF":"")
    getSelectFieldValue(test, "netParams.connParams[\'"+name+"\'][\'preConds\'][\'cellType\']", !empty?"GC":"")
    if (empty){
      checkRangeComponentIsEmpty(test, "PreConn")
    } else {
      testRangeComponent(test, "PreConn")
    } 
  })
  casper.then(function(){
    moveToTab(test, "postCondsConnTab", "netParams.connParams[\'"+name+"\'][\'postConds\'][\'pop\']", "div")
  })
  casper.then(function(){
    getSelectFieldValue(test, "netParams.connParams[\'"+name+"\'][\'postConds\'][\'pop\']", !empty?"Population 2":"")
    getSelectFieldValue(test, "netParams.connParams[\'"+name+"\'][\'postConds\'][\'cellModel\']", !empty?"Izi":"")
    getSelectFieldValue(test, "netParams.connParams[\'"+name+"\'][\'postConds\'][\'cellType\']", !empty?"BC":"")
    checkRangeComponentIsEmpty(test, "PostConn")
  })
  casper.then(function(){
    moveToTab(test, "generalConnTab", "ConnectivityName", "input")
  })
}

/*******************************************************************************
* --------------------------- STIM-SOURCE-PARAMS ----------------------------- *
********************************************************************************/
function populateStimSourceRule(test){
  casper.then(function(){ //check name and source type
    getInputValue(test, "sourceName", "stim_source")
    getSelectFieldValue(test, "stimSourceSelect", "")
  })
  
  casper.then(function(){
    this.echo("VClamp")
    this.wait(500)
  })
  
  casper.then(function(){
    setSelectFieldValue(test, "stimSourceSelect", "VClampMenuItem")
  })
  
  casper.then(function() { // select VClamp source
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'tau1\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'tau2\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'gain\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'rstim\']", "")
    assertDoesntExist(test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']0")
    assertDoesntExist(test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']0")
  })

  casper.then(function(){
    this.echo("NetStim")
    this.wait(500)
  })
  casper.then(function(){
    setSelectFieldValue(test, "stimSourceSelect", "NetStimMenuItem")
  })
  
  casper.then(function() { // select NetStim source and check correct params
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'rate\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'interval\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'number\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'start\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'noise\']", "")
  })

  casper.then(function(){
    this.echo("Alpha Synapse")
    casper.wait(500)
  })
  casper.then(function(){
    setSelectFieldValue(test, "stimSourceSelect", "AlphaSynapseMenuItem")
  })
  
  casper.then(function() { // select AlphaSynapseMenuItem source and check correct params
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'onset\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'tau\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'gmax\']", "")
    getInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'e\']", "")
  })
  
  casper.then(function(){
    this.echo("IClamp")
    casper.wait(500)
  })
  
  casper.then(function(){
    setSelectFieldValue(test, "stimSourceSelect", "IClampMenuItem")
  })
  
  casper.then(function() { // select ICLamp source and check correct params
    setInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'del\']", "1")
    setInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']", "2")
    setInputValue(test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']", "3")
  })
}
//----------------------------------------------------------------------------//

function checkStimSourceEmpty(test, name){
  casper.then(function(){ //check name and source type
    getInputValue(test, "sourceName", name)
    getSelectFieldValue(test, "stimSourceSelect", "")
  })
}

//----------------------------------------------------------------------------//
function checkStimSourceValues(test, name){
  casper.then(function (){
    getInputValue(test, "sourceName", name)
    getSelectFieldValue(test, "stimSourceSelect", "IClamp")
    setInputValue(test, "netParams.stimSourceParams[\'"+name+"\'][\'del\']", "1")
    setInputValue(test, "netParams.stimSourceParams[\'"+name+"\'][\'dur\']", "2")
    setInputValue(test, "netParams.stimSourceParams[\'"+name+"\'][\'amp\']", "3")
  })
}
/*******************************************************************************
* --------------------------- STIM-TARGET-PARAMS ----------------------------- *
********************************************************************************/
function populateStimTargetRule(test){
  casper.then(function() { //
    getInputValue(test, "targetName", "stim_target")
    setSelectFieldValue(test, "netParams.stimTargetParams[\'stim_target\'][\'source\']", "newStimSourceMenuItem")
    setInputValue(test, "netParams.stimTargetParams['stim_target']['sec']", "soma")
    setInputValue(test, "netParams.stimTargetParams['stim_target']['loc']", "0.5")
  })
  casper.then(function(){
    this.wait(1000)//for python to receive data
  })
  
  casper.then(function(){
    moveToTab(test, "stimTargetCondsTab", "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "input")
  })
  
  casper.then(function(){
    setSelectFieldValue(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'pop\']", "PopulationMenuItem")
    setSelectFieldValue(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellModel\']", "IFMenuItem")
    setSelectFieldValue(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellType\']", "GCMenuItem")
  })
  casper.then(function() { // test range component
    populateRangeComponent(test, "StimTarget");
  });
  casper.then(function() {
    addListItem(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "0")
    addListItem(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "3")
  })
  casper.then(function(){
    this.wait(2000)//for python to receibe data
  })
}

//----------------------------------------------------------------------------//
function checkStimTargetValues(test, name, empty=false){
  casper.then(function() { //
    getInputValue(test, "targetName", name)
    getSelectFieldValue(test, "netParams.stimTargetParams[\'"+name+"\'][\'source\']", !empty?"newStimSource":"")
    getInputValue(test, "netParams.stimTargetParams['"+name+"']['sec']", !empty?"soma":"")
    getInputValue(test, "netParams.stimTargetParams['"+name+"']['loc']", !empty?"0.5":"")
  })
  
  casper.then(function(){
    moveToTab(test, "stimTargetCondsTab", "netParams.stimTargetParams[\'"+name+"\'][\'conds\'][\'cellList\']", "input")
  })
  
  casper.then(function(){
    getSelectFieldValue(test, "netParams.stimTargetParams[\'"+name+"\'][\'conds\'][\'pop\']", !empty?"Population":"")
    getSelectFieldValue(test, "netParams.stimTargetParams[\'"+name+"\'][\'conds\'][\'cellModel\']", !empty?"IF":"")
    getSelectFieldValue(test, "netParams.stimTargetParams[\'"+name+"\'][\'conds\'][\'cellType\']", !empty?"GC":"")
  })
  casper.then(function(){
    if (empty){
      checkRangeComponentIsEmpty(test, "StimTarget")
    } else {
      testRangeComponent(test, "StimTarget")// check data remained the same
    }
  })
  casper.then(function(){
    if (empty){
      assertDoesntExist(test, "netParams.stimTargetParams[\'"+name+"\'][\'conds\'][\'cellList\']0")
    } else {
      getInputValue(test, "netParams.stimTargetParams[\'"+name+"\'][\'conds\'][\'cellList\']0", "0")
      getInputValue(test, "netParams.stimTargetParams[\'"+name+"\'][\'conds\'][\'cellList\']1", "3")
    }
  })
}
/*******************************************************************************
 *                                functions                                    *
 *******************************************************************************/
function moveToTab(test, tabID, elementID, elementType){
  casper.then(function(){
    this.click('button[id="'+tabID+'"]', function(){
      this.echo("changing tab...")
    })
  })
  casper.then(function(){
    this.waitUntilVisible(elementType+'[id="'+elementID+'"]', function(){
      test.assertExist(elementType+'[id="'+elementID+'"]', "changed tab")
    })
  })
  casper.then(function(){
    this.wait(2000)
  })
}

//----------------------------------------------------------------------------//
function leaveReEnterTab(test, mainTabID, mainTabElementID, secondTabID, SecondTabElementID, mainElementType="input") {
  casper.thenClick('button[id="'+secondTabID+'"]', function() {
    this.waitForSelector('input[id="'+SecondTabElementID+'"]')
  });
  casper.thenClick('button[id="'+mainTabID+'"]', function() {
    this.wait(1500)//for python to re-populate fields
  })
  casper.then(function() {
    this.waitForSelector(mainElementType+'[id="'+mainTabElementID+'"]', function() {
      this.echo("leave and re-enter "+mainTabID+" tab")
    })
  })
  casper.then(function(){
    this.wait(2000)// for python to repopulate tab
  })
}

//----------------------------------------------------------------------------//
function leaveReEnterRule(test, mainThumbID, secondThumbID, elementID, type="input"){
  casper.thenClick('button[id="'+secondThumbID+'"]', function() { //move to another Rule thumbnail
    this.waitUntilVisible(type+'[id="'+elementID+'"]', function(){
      this.wait(2000)
    })
  })
  casper.thenClick('button[id="'+mainThumbID+'"]', function(){
    this.waitUntilVisible(type+'[id="'+elementID+'"]', function(){
      this.echo("moved to different Rule and came back")
    })
  })
  casper.then(function(){
    this.wait(2000)
  })
}
//----------------------------------------------------------------------------//
function create2rules(test, cardID, addButtonID, ruleThumbID){
  casper.then(function(){
    this.waitUntilVisible('div[id="'+cardID+'"]', function(){
      this.click('div[id="'+cardID+'"]'); //open Card
    })
  })
  
  casper.then(function() { // check ADD button exist
    this.waitUntilVisible('button[id="'+addButtonID+'"]', function() {
      test.assertExist('button[id="'+addButtonID+'"]', "open card")
    });
  })
  casper.thenClick('button[id="'+addButtonID+'"]', function() { //add new rule
    this.waitUntilVisible('button[id="'+ruleThumbID+'"]', function(){
      test.assertExist('button[id="'+ruleThumbID+'"]', "rule added");
    })
  })
  casper.thenClick('button[id="'+addButtonID+'"]', function() { //add new rule
    this.waitUntilVisible('button[id="'+ruleThumbID+' 2"]', function(){
      test.assertExist('button[id="'+ruleThumbID+' 2"]', "rule added");
    })
  })
  casper.thenClick('button[id="'+ruleThumbID+'"]', function(){// focus on first rule
    this.wait(1000)
  })
}

//----------------------------------------------------------------------------//
function renameRule(test, elementID, value){
  casper.then(function(){
    this.wait(2500)//let python populate all fields before rename
  })
  casper.then(function(){
    this.waitUntilVisible('input[id="'+elementID+'"]')
  })
  casper.then(function(){
    this.sendKeys('input[id="'+elementID+'"]', value, {reset: true})
  })
  casper.then(function(){//let python re-populate fields 
    this.wait(3000)
  })
  casper.then(function(){
    var currentValue = this.getElementAttribute('input[id="'+elementID+'"]', 'value');
    test.assertEqual(currentValue, value, "Rule renamed to: " + value)
  })
}

//----------------------------------------------------------------------------//
function selectThumbRule(test, thumbID, nameFieldID){ // select a thumbnailRule and wait to load data
  casper.thenClick('button[id="'+thumbID+'"]', function(){// focus on rule 1
    this.waitUntilVisible('input[id="'+nameFieldID+'"]')
  })
  casper.then(function(){
    this.wait(2000)
  })
}

//----------------------------------------------------------------------------//
function delThumbnail(test, elementID) {
  casper.then(function() {// click thumbnail
    this.waitForSelector('button[id="' + elementID + '"]', function() {
      this.mouse.click('button[id="' + elementID + '"]');
    })
  })
  casper.then(function() {// move mouse into thumbnail
    this.mouse.move('button[id="' + elementID + '"]')
  })
  casper.then(function() {//click thumbnail
    this.mouse.click('button[id="' + elementID + '"]')
  })
  casper.then(function(){//confirm deletion
    this.waitUntilVisible('button[id="confirmDeletion"]', function() {
      this.click('button[id="confirmDeletion"]')
    })
  })
  casper.then(function(){
    this.waitWhileVisible('button[id="'+ elementID+'"]', function(){
      test.assertDoesntExist('button[id="'+ elementID+'"]', elementID + " button deleted")
    })
  })
}

//----------------------------------------------------------------------------//
function setInputValue(test, elementID, value){
  casper.then(function(){
    casper.waitUntilVisible('input[id="'+elementID+'"]')
  })
  casper.thenEvaluate(function(elementID, value){//this hack breaks for latest React!!!!!
    var element = document.getElementById(elementID);
    var ev = new Event('input', { bubbles: true});
    ev.simulated = true;
    element.value = value;
    element.dispatchEvent(ev);
  }, elementID, value);
  casper.then(function(){
    var newValue = this.getElementAttribute('input[id="'+elementID+'"]', 'value');
    test.assertEqual(newValue, value, value + " set for: " + elementID)
  })
}

//----------------------------------------------------------------------------//
function getInputValue(test, elementID, expectedName) {
  casper.then(function() {
    this.waitUntilVisible('input[id="' + elementID + '"]')
  })
  casper.then(function(){
    var name = casper.evaluate(function(elementID) {
      return $('input[id="' + elementID + '"]').val();
    }, elementID);
    test.assertEquals(name, expectedName, (expectedName?expectedName:"(empty)") +" found in: "+elementID);
  })  
}

//----------------------------------------------------------------------------//
function setSelectFieldValue(test, selectFieldID, menuItemID){
  casper.then(function(){
    this.evaluate(function(selectFieldID) {
      document.getElementById(selectFieldID).scrollIntoView();
    }, selectFieldID);
  })
  casper.then(function(){// click selectField
    this.waitUntilVisible('div[id="'+selectFieldID+'"]', function(){
      var info = casper.getElementInfo('div[id="'+selectFieldID+'"]');
      this.mouse.click(info.x + 1, info.y + 1)
    })
  })
  
  casper.then(function(){
    this.wait(500)//wait for the menuitem animation to finish
  })
  casper.then(function(){// click menuItem
    this.waitUntilVisible('span[id="'+menuItemID+'"]', function(){
      var info = this.getElementInfo('span[id="'+menuItemID+'"]');
      this.mouse.click(info.x + 1, info.y + 1)
    })
  })
  casper.then(function(){// click outside selectField
    var info = this.getElementInfo('div[id="'+selectFieldID+'"]');
    this.mouse.click(info.x - 10, info.y)
  })
  casper.then(function(){
    this.wait(500)//wait for MenuItem animation to vanish 
  })
  casper.then(function(){//check value is ok
    this.waitWhileVisible('span[id="'+menuItemID+'"]', function(){
      getSelectFieldValue(test, selectFieldID, menuItemID.includes("MenuItem")?menuItemID.slice(0, -"menuItem".length):menuItemID)
    })
  })
}

//----------------------------------------------------------------------------//
function getSelectFieldValue(test, elementID, expected) {
  casper.then(function() {
    this.waitUntilVisible('div[id="' + elementID + '"]')
  })
  
  casper.then(function(){
    var text = this.evaluate(function(elementID) {
      return document.getElementById(elementID).getElementsByTagName("div")[0].textContent;
    }, elementID)
    test.assertEquals(text, expected, (expected?expected:"(empty)") + " found in: " + elementID);
  });
}

//----------------------------------------------------------------------------//
function assertExist(test, elementID, component = "input", message=false) {
  casper.then(function() {
    this.waitUntilVisible(component + '[id="' + elementID + '"]', function() {
      test.assertExist(component + '[id="' + elementID + '"]', message?message:component+ ": "+ elementID + " exist")
    })
  })
}

//----------------------------------------------------------------------------//
function assertDoesntExist(test, elementID, component = "input", message=false) {
  casper.then(function() {
    this.waitWhileSelector(component + '[id="' + elementID + '"]', function() {
      test.assertDoesntExist(component + '[id="' + elementID + '"]', message?message:component+ ": "+ elementID + " doesn't exist")
    })
  })
}

//----------------------------------------------------------------------------//
function testCheckBoxValue(test, elementID, expectedName) {
  casper.then(function(){
    this.waitForSelector('input[id="' + elementID + '"]')
  })
  casper.then(function() {
    var name = casper.evaluate(function(elementID) {
      return $('input[id="' + elementID + '"]').prop('checked');
    }, elementID);
    test.assertEquals(expectedName, name, (expectedName?expectedName:"(empty)") + " found in element: "+elementID);
  })
}

//----------------------------------------------------------------------------//
function message(message) {
  casper.then(function() {
    this.echo("<"+message.toUpperCase()+">")
  })
}

//----------------------------------------------------------------------------//
function click(elementID, type="div") {
  casper.then(function(){
    this.waitUntilVisible(type+'[id="'+elementID+'"]')
  })
  casper.then(function(){
    this.evaluate(function(elementID) {
      document.getElementById(elementID).scrollIntoView();
    }, elementID);
  })
  casper.then(function(){
    this.waitUntilVisible(type+'[id="'+elementID+'"]')
  })
  casper.then(function(){
    this.wait(500) // wait for animation in dropDownMenu to complete
  })
  casper.then(function(){
    var info = this.getElementInfo(type+'[id="'+elementID+'"]');
    this.mouse.click(info.x + 1, info.y +1);//move a bit away from corner
  })
  casper.then(function(){
    this.echo("Click on "+ elementID)
    this.wait(300)
  })
}
