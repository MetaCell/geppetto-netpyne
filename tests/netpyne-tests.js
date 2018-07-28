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

  casper.then(function() { //test HTML elements in landing page
    casper.echo("######## Testing landping page contents and layout ######## ");
    testLandingPage(test);
  });
  
  casper.then(function() { //test initial state of consoles
    casper.echo("######## Test Consoles ######## ");
    testConsoles(test);
  });

  casper.then(function() { // test adding a population using UI
    casper.echo("######## Test Add Population ######## ");
    addPopulation(test);
  });

  casper.then(function() { // test adding a cell rule using UI
    casper.echo("######## Test Add Cell Rule ######## ");
    addCellRule(test);
  });
  
  casper.then(function() { // test adding a synapse rule using UI
    casper.echo("######## Test Add Synapse ######## ");
    addSynapse(test);
  });
  
  casper.then(function() { // test adding a connection using UI
    casper.echo("######## Test Add Connection Rule ######## ");
    addConnection(test);
  });
  
  casper.then(function() { // test adding a stimulus  source using UI
    casper.echo("######## Test Add stim Source Rule ######## ");
    addStimSource(test);
  });
  
  casper.then(function() { // test adding a stimulus target using UI
    casper.echo("######## Test Add stimTarget Rule ######## ");
    addStimTarget(test);
  });
  
  casper.then(function() { // test config 
    casper.echo("######## Test default simConfig ######## ");
    checkSimConfigParams(test);
  });
  
  casper.then(function() { //test full netpyne loop using a demo project
    casper.echo("######## Running Demo ######## ");
    var demo = "from netpyne_ui.tests.tut3 import netParams, simConfig \n" +
      "netpyne_geppetto.netParams=netParams \n" +
      "netpyne_geppetto.simConfig=simConfig";
    loadModelUsingPython(test, demo);
  });
  
  casper.then(function() { //test explore network tab functionality
    casper.echo("######## Test Explore Network Functionality ######## ");
    exploreNetwork(test);
  });
  
  casper.then(function() { //test simulate network tab functionality
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
  message("add popParams rule")
  casper.waitUntilVisible('div[id="Populations"]', function(){
    casper.thenClick('div[id="Populations"]'); //open Pop Card
  })
    
  casper.then(function() { 
    casper.waitUntilVisible('button[id="newPopulationButton"]', function() {// check add-pop button exist 
      test.assertExist('button[id="newPopulationButton"]', "add population button exists")
    });
  })
  
  casper.thenClick('button[id="newPopulationButton"]', function() { //add new population
    test.assertExists('button[id="Population"]', "Pop thumbnail Exists");
    casper.wait(1000, function() {
      this.echo("waited for metadata")
    });
  })
  casper.then(function(){
    populatePopParams(test)//populate all fields within popParams
  })
  
  // casper.thenClick('#spatialDistPopTab', function() { //go to second tab (spatial distribution)
  //   this.echo("moved to spatial distribution Tab")
  //   populateRangeComponent(test, "PopParams")// populate RangeComponent
  // })

  casper.then(function(){ //move to general tab and come back
    leaveReEnterTab(test, "spatialDistPopTab", "xRangePopParamsSelect", "generalPopTab", "populationName", "div")
  })
  
  casper.then(function(){ // check values remane the same after leaving tab
    testRangeComponent(test, "PopParams")
  })
  
  message("rename pop and check data")
  casper.thenClick('#generalPopTab', function() { //go back to general tab
    renameRule(test, "populationName", "newPop1")// rename rule
    colapseReOpenCard(test, "Populations", "newPopulationButton")//close and re open card
  })
  
  casper.then(function(){
    checkPopParamsValues(test, "newPop1", "PYR", "HH", "20")// check values remained the same after renaming
  })
  
  message("add and delete a population")//deleting second population -> "Population 2"
  casper.thenClick('button[id="newPopulationButton"]', function() { //add second population
    casper.waitUntilVisible('button[id="Population"]', function() {
      test.assertExist('button[id="Population"]', "Population thumbnail added");
    });
  })
  casper.then(function(){
    checkPopParamsValues(test, "Population", "", "", "")// check values remained the same after renaming
  })
  
  delThumbnail("Population")
  casper.waitWhileVisible('button[id="Population"]', function() {
    test.assertDoesntExist('button[id="Population"]', "Population deletion");
  })

  message("colapse popParams card")
  casper.thenClick("#Populations", function() { // colapse card
    casper.waitWhileVisible('button[id="newPopulationButton"]', function() {
      test.assertDoesntExist('button[id="newPopulationButton"]', "Populations view collapsed");
    });
  });
}

/***********************************************
 * Create  cell  rule  using  the  add  button *
 ***********************************************/
function addCellRule(test) {
  message("add cellParams rule")
  casper.waitForSelector('#CellRules', function(){
    casper.click('#CellRules', function() { // expand cellParams card
      test.assertExist('button[id="newCellRuleButton"]', "add new CellRule button exist")
    })
  })
  casper.thenClick('button[id="newCellRuleButton"]', function() { //add cellRule
    assertExist(test, "CellRule", "button")
  })
  
  message("checking cellParams fields")
  casper.then(function() { // populate cellRule
    assertExist(test, "cellRuleName")
    setSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellModel\']", "HHMenuItem0")
    setSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellType\']", "PYRMenuItem0")
    setSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'pop\']", "newPop1MenuItem0")
  })
  casper.then(function() { // explore spatial distribution tab
    exploreRangeComponent(test, "CellParams")
  });
  casper.then(function(){
    this.echo("populate rangeComponent")
  })
  
  casper.then(function(){ // populate rangeComponent fields with correct and wrong values
    populateRangeComponent(test, "CellParams")
  })
  casper.then(function(){
    casper.wait("2000")//send values to python
  })
  casper.thenClick('button[id="newCellRuleButton"]', function() { //add new cellRule
    this.echo("leave and re-enter CellRule")
    assertExist(test, "CellRule 2", "button")
    casper.thenClick('button[id="CellRule"]', function(){
    })
  })
  casper.then(function(){
    casper.wait(2000)//for python to populate fields
  })
  casper.then(function(){ // check values after leaving tab
    testElementValue(test, "cellRuleName", "CellRule")
    testSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellType\']", "PYR")
    testSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellModel\']", "HH")
    testSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'pop\']", "newPop1")
    testRangeComponent(test, "CellParams")
  })
  
  message("create new section")
  casper.thenClick('button[id="cellParamsGoSectionButton"]', function() { //go to sections
    assertExist(test, "newCellRuleSectionButton", "button")
  })
  casper.thenClick('#newCellRuleSectionButton', function() { //add new section and check name
    testElementValue(test, "cellParamsSectionName", "Section")
  });
  casper.thenClick('#newCellRuleSectionButton', function() { //add new section and check name
    testElementValue(test, "cellParamsSectionName", "Section 2")
  });
  casper.thenClick('button[id="Section"]')
  message("explore cellParams.section fields")
  casper.thenClick("#sectionGeomTab", function() { //go to geom tab and chec fields
    this.echo("Geometry tab")
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
  
  leaveReEnterTab(test, "sectionGeomTab", "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "sectionGeneralTab", "cellParamsSectionName")
  
  casper.then(function(){
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "20")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'L\']", "30")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'Ra\']", "100")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'cm\']", "1")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']0", "[10,0,0]")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']1", "[20,0,0]")
    deleteListItem(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']1")
  })
  casper.thenClick('button[id="Section 2"]', function(){
    this.echo("leave and re-enter sectionRule")
    casper.click('button[id="Section"]')
  })
  casper.then(function(){
    casper.wait(2000)//for python to populate fields
  })
  
  casper.then(function(){
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "20")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'L\']", "30")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'Ra\']", "100")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'cm\']", "1")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']0", "[10,0,0]")
  })
  
  casper.thenClick("#sectionTopoTab", function() { // go to Topo tab and check fields
    this.wait(2000)//let python populate fields
  })
  casper.then(function(){
    setSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "SectionMenuItem0")
    setInputValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentX\']", "1")
    setInputValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'childX\']", "0")
  })
  casper.then(function(){
    casper.wait(2000)//let python receive values
  })
  
  leaveReEnterTab(test, "sectionTopoTab", "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "sectionGeneralTab", "cellParamsSectionName", "div")
  
  casper.then(function(){
    testSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "Section")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentX\']", "1")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'childX\']", "0")
  })
  
  casper.thenClick('button[id="Section 2"]', function(){//leave and re-enter sectionRule
    this.echo("leave and re-enter SectionRule")
    casper.click('button[id="Section"]')
  })
  casper.then(function(){//wait for python to populate fields
    casper.wait(2000)
  })
  casper.then(function(){
    testSelectFieldValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "Section")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentX\']", "1")
    testElementValue(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'childX\']", "0")
  })
  
  message("add new cellParams.section.mechanism")
  casper.thenClick("#sectionGeneralTab", function() { //Go to Mechs
    casper.waitUntilVisible('button[id="cellParamsGoMechsButton"]', function() {
      casper.click("#cellParamsGoMechsButton", function() {
        test.assertExist("#addNewMechButton", "Go to CellRule mechanisms");
      })
    })
  })
 
  message("explore cellParams.section.mechanisms fields")
  casper.thenClick('#addNewMechButton', function() { // click SelectField and check MenuItems
    assertExist(test, "pas", "span")
    assertExist(test, "hh", "span")
    assertExist(test, "fastpas", "span")
  })
  casper.thenClick("#hh", function() { // add hh mech and check Fields
    testElementValue(test, "singleMechName", "hh")
    setInputValue(test, "mechNamegnabar", 0.1);
    setInputValue(test, "mechNamegkbar", 0.2);
    setInputValue(test, "mechNamegl", 0.3);
    setInputValue(test, "mechNameel", 0.4);
  })
  casper.then(function(){
    casper.wait(1500)// for python to receive data
  })
  casper.thenClick('#addNewMechButton', function() { // add pas mech and check Fields
    casper.waitForSelector("#pas", function() {
      casper.thenClick("#pas", function() {
        testElementValue(test, "singleMechName", "pas");
        setInputValue(test, "mechNameg", 0.5);
        setInputValue(test, "mechNamee", 0.6);
      })
    })
  });
  casper.then(function(){
    casper.wait(1500)// for python to receive data
  })
  casper.thenClick('#addNewMechButton', function() { // add pas mech and check Fields
    casper.waitForSelector("#fastpas", function() {
      casper.thenClick("#fastpas", function() {
        testElementValue(test, "singleMechName", "fastpas");
        setInputValue(test, "mechNameg", 0.7);
        setInputValue(test, "mechNamee", 0.8);
      })
    })
  });
  casper.then(function(){
    casper.wait(1500)// for python to receive data
  })
  casper.thenClick('button[id="mechThumbhh"]')
  casper.then(function(){
    casper.wait(1500)// for python to populate fields
  })
  casper.then(function() { // add pas mech and check Fields
    testElementValue(test, "singleMechName", "hh")
    testElementValue(test, "mechNamegnabar", "0.1");
    testElementValue(test, "mechNamegkbar", "0.2");
    testElementValue(test, "mechNamegl", "0.3");
    testElementValue(test, "mechNameel", "0.4");
  });
  casper.thenClick('button[id="mechThumbpas"]')
  casper.then(function(){
    casper.wait(1500)// for python to populate fields
  })
  casper.then(function(){
    testElementValue(test, "singleMechName", "pas");
    testElementValue(test, "mechNameg", "0.5");
    testElementValue(test, "mechNamee", "0.6");
  });
  casper.thenClick('button[id="mechThumbfastpas"]')
  casper.then(function(){
    casper.wait(1500)// for python to populate fields
  })
  casper.then(function(){
    testElementValue(test, "singleMechName", "fastpas");
    testElementValue(test, "mechNameg", "0.7");
    testElementValue(test, "mechNamee", "0.8");
  })
  casper.thenClick('#fromMech2SectionButton', function() { // come back to --secion--
    this.echo("leave and re-enter mechRule")
    casper.click("#cellParamsGoMechsButton")
  })
  casper.thenClick('button[id="mechThumbhh"]')
  casper.then(function(){
    casper.wait(1500)// for python to populate fields
  })
  casper.then(function() { // add pas mech and check Fields
    testElementValue(test, "singleMechName", "hh")
    testElementValue(test, "mechNamegnabar", "0.1");
    testElementValue(test, "mechNamegkbar", "0.2");
    testElementValue(test, "mechNamegl", "0.3");
    testElementValue(test, "mechNameel", "0.4");
  });
  casper.thenClick('button[id="mechThumbpas"]')
  casper.then(function(){
    casper.wait(1500)// for python to populate fields
  })
  casper.then(function() { // add pas mech and check Fields
    testElementValue(test, "singleMechName", "pas");
    testElementValue(test, "mechNameg", "0.5");
    testElementValue(test, "mechNamee", "0.6");
  });
  casper.thenClick('button[id="mechThumbfastpas"]')
  casper.then(function(){
    casper.wait(1500)// for python to populate fields
  })
  casper.then(function() { // add pas mech and check Fields
    testElementValue(test, "singleMechName", "fastpas");
    testElementValue(test, "mechNameg", "0.7");
    testElementValue(test, "mechNamee", "0.8");
  })
  
  message("delete cellParams.section.mechanism")
  casper.then(function() { // del pas mech
    delThumbnail("mechThumbpas")
  })
  casper.then(function() { // del fastpas mech
    delThumbnail("mechThumbfastpas")
  })
  casper.thenClick('button[id="fromMech2SectionButton"]', function() { // go back to --sections--
    this.waitWhileVisible('button[id="addNewMechButton"]', function(){
      this.echo("back to Section page")
    })
  });
  message("delete cellParams.section")
  casper.then(function() { //delete section2
    delThumbnail("Section 2")
  })
  
  casper.thenClick('button[id="Section"]', function(){
    renameRule(test, "cellParamsSectionName", "newSec1")// rename section 
  })
  
  message("delete cellParams rule")
  casper.thenClick('button[id="fromSection2CellRuleButton"]', function() { // go back to cellRule
    this.waitWhileVisible('button[id="newCellRuleSectionButton"]', function(){
      this.echo("back to CellRule page")
    })
  })
  
  casper.then(function() {// delete cellParams Rule
    delThumbnail("CellRule 2")
  })
  
  casper.thenClick('button[id="CellRule"]', function(){
    renameRule(test, "cellRuleName", "newCell1")// rename cellParams Rule 
  })
  
  exploreCellRuleAfterRenaming(test) // re-explore whole rule after renaming

  message("colapse cellParams rule") // colapse cellParams card
  casper.thenClick('#CellRules', function() {
    assertDoesntExist(test, "newCellRuleButton", "button")
  });
}

/**************************************************
 * Create  Synapse  rule  using  the  add  button *
 **************************************************/
function addSynapse(test) {
  message("add synMechParam rule")
  casper.then(function() { //expand synapse card
    casper.click('#Synapses', function() {
      casper.waitUntilVisible('button[id="newSynapseButton"]', function() {
        test.assertExist('button[id="newSynapseButton"]', "Add synapse button exist");
      })
    });
  })
  casper.thenClick('button[id="newSynapseButton"]', function() { //add new synaptic rule
    casper.waitUntilVisible('button[id="Synapse"]', function() {
      test.assertExist('button[id="Synapse"]', "New Synapse rule added");
    })
  })

  message("explore synMechParams fields")
  casper.then(function() {
    casper.waitForSelector("#synapseModSelect", function() {
      test.assertExist("#synapseName", "synapse Name field Exist");
      test.assertExist("#synapseModSelect", "synapse mod selectField Exist");
    })
  })
  casper.then(function() { //check selectField has correct MenuItems
    click("#synapseModSelect")
    casper.then(function() {
      casper.waitForSelector("#Exp2Syn", function() {
        test.assertExist("#ExpSyn", "ExpSyn mech MenuItem Exist");
        test.assertExist("#Exp2Syn", "Exp2Syn mech MenuItem Exist");
      })
    })
  })

  message("synapse type Exp2Syn")
  casper.thenClick("#Exp2Syn", function() { // select Exp2Syn mod and check correct params
    assertExist(test, "netParams.synMechParams[\'Synapse\'][\'tau1\']");
    assertExist(test, "netParams.synMechParams[\'Synapse\'][\'tau2\']");
    assertExist(test, "netParams.synMechParams[\'Synapse\'][\'e\']");
  })
  casper.then(function() {
    casper.wait(1000)
  })
  casper.then(function() { //change to ExpSyn mod in SelectField
    click("#synapseModSelect")
    casper.then(function() {
      casper.waitForSelector("#ExpSyn", function() {
        casper.click("#ExpSyn");
      })
    })
  })

  message("synapse type ExpSyn")
  casper.then(function() { // check ExpSyn mod has correct params
    assertExist(test, "netParams.synMechParams[\'Synapse\'][\'e\']");
    assertExist(test, "netParams.synMechParams[\'Synapse\'][\'tau1\']");
    assertDoesntExist(test, "netParams.synMechParams[\'Synapse\'][\'tau2\']");
  })

  message("delete synMechParams rules")
  casper.thenClick("#newSynapseButton", function() { //add new synaptic rule
    casper.waitUntilVisible('button[id="Synapse 2"]', function() {
      test.assertExist('button[id="Synapse 2"]', "Synapse2 Thumbnail exist");
    })
  })
  casper.then(function() { //assert new Synapse rule does not displays params before selectiong a "mod"
    casper.waitForSelector("#synapseName", function() {
      test.assertExist("#synapseName", "synapse Name field Exist");
      test.assertExist("#synapseModSelect", "synapse mod selectField Exist");
      assertDoesntExist(test, "netParams.synMechParams[\'Synapse\'][\'e\']");
      assertDoesntExist(test, "netParams.synMechParams[\'Synapse\'][\'tau1\']");
      assertDoesntExist(test, "netParams.synMechParams[\'Synapse\'][\'tau2\']");
    })
  })
  casper.then(function() { // delete synapse rule 1
    delThumbnail("Synapse")
    casper.waitWhileVisible('button[id="Synapse"]', function() {
      test.assertDoesntExist("#Synapse", "Synapse deleted");
    })
  })
  casper.then(function() { //delete synapse rule 2
    delThumbnail("Synapse 2")
    casper.waitWhileVisible('button[id="Synapse 2"]', function() {
      test.assertDoesntExist('button[id="Synapse 2"]', "Synapse 2 deleted");
    })
  })

  message("colapse synMechParams card")
  casper.thenClick('#Synapses', function() {
    assertDoesntExist(test, "newSynapseButton", "button")
  });
}

/*******************************************************
 * Create  connectivity  rule  using  the  add  button *
 *******************************************************/
function addConnection(test) {
  message("add connParams rule")
  casper.click('#Connections'); //open Connection Card
  casper.then(function() { // check add conn button exist 
    casper.waitUntilVisible('button[id="newConnectivityRuleButton"]', function() {
      test.assertExist("#newConnectivityRuleButton", "add connection rule button exists")
    });
  })
  casper.thenClick("#newConnectivityRuleButton", function() { //add new connectivity rule
    assertExist(test, "ConnectivityRule", "button");
    casper.then(function() {
      casper.wait(1000, function() {
        this.echo("waited for metadata")
      })
    })
  })

  message("explore connParams fields")
  casper.then(function() { // check all fields exist
    test.assertExists("#ConnectivityRule", "Connectivity Name field Exists");
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'sec\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'loc\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'sec\']AddButton", "button")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'loc\']AddButton", "button")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'delay\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'weight\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'plasticity\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'convergence\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'divergence\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'probability\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'synsPerConn\']")
    assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'synMech\']", "div")
  })

  message("explore connParams.preConds fields")
  casper.then(function() { // Go to preConds tab
    casper.waitUntilVisible('button[id="preCondsConnTab"]', function() {
      casper.click("#preCondsConnTab");
    })
    casper.then(function() { //check fields exist
      assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'pop\']", "div");
      assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'cellModel\']", "div");
      assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'cellType\']", "div");
      exploreRangeComponent(test, "PreConn");
    });
  });

  message("explore connParams.preConds fields")
  casper.then(function() { // go to postConds
    casper.waitUntilVisible('button[id="postCondsConnTab"]', function() {
      casper.click("#postCondsConnTab");
    })
    casper.then(function() { //check fields exist
      assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'pop\']", "div");
      assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'cellModel\']", "div");
      assertExist(test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'cellType\']", "div");
      exploreRangeComponent(test, "PostConn");
    });
  });

  message("delete connParams rules")
  casper.then(function() { //wait before start deleting rules
    casper.wait(500)
  })
  casper.thenClick("#newConnectivityRuleButton", function() { //add new connectivity rule
    assertExist(test, "ConnectivityRule 2", "button")
  })
  casper.then(function() { // delete connectivity rule
    delThumbnail("ConnectivityRule")
    assertDoesntExist(test, "ConnectivityRule", "button")
  })
  casper.then(function() { // delete connectivity rule
    delThumbnail("ConnectivityRule 2")
    assertDoesntExist(test, "ConnectivityRule 2", "button")
  })

  message("colapse connParams card")
  casper.thenClick('#Connections', function() {
    assertDoesntExist(test, "newConnectivityRuleButton", "button")
  });
}
/*****************************************************
 * Create  StimSource  rule  using  the  add  button *
 *****************************************************/
function addStimSource(test) {
  message("add stimSourceParams rule")
  casper.then(function() { //expand stimSource card
    casper.click('#SimulationSources', function() {
      casper.waitUntilVisible('button[id="newStimulationSourceButton"]', function() {
        test.assertExist("#newStimulationSourceButton", "Add stimSource button exist");
      })
    });
  })
  casper.thenClick("#newStimulationSourceButton", function() { //add new stim source rule
    assertExist(test, "stim_source", "button")
  })

  message("explore stimSource fields")
  casper.then(function() { // check fields exist
    casper.waitForSelector("#sourceName", function() {
      test.assertExist("#sourceName", "stim source Name field Exist");
      test.assertExist("#stimSourceSelect", "stim source selectField Exist");
    })
  })
  casper.then(function() { //check selectField has corretc MenuItems
    click("#stimSourceSelect")
    casper.then(function() {
      casper.waitForSelector("#IClampMenuItem", function() {
        test.assertExist("#IClampMenuItem", "IClamp stimSource MenuItem Exist");
        test.assertExist("#VClampMenuItem", "VClamp stimSource MenuItem Exist");
        test.assertExist("#NetStimMenuItem", "NetStim stimSource MenuItem Exist");
        test.assertExist("#AlphaSynapseMenuItem", "AlphaSynapse stimSource MenuItem Exist");
      })
    })
  })

  message("explore IClamp source fields")
  casper.thenClick("#IClampMenuItem", function() { // select ICLamp source and check correct params
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'del\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']")
  })

  message("explore VClamp source fields")
  casper.then(function() { //wait before continuing
    casper.wait(500)
  })
  casper.then(function() { //change to VClamp in SelectField
    click("#stimSourceSelect")
    casper.then(function() {
      casper.waitForSelector("#VClampMenuItem", function() {
        casper.click("#VClampMenuItem");
      })
    })
  })
  casper.then(function() { // select VClamp source and check correct params
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'tau1\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'tau2\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'gain\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'rstim\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']AddButton", "button");
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']AddButton", "button");
  })

  message("explore NetStim source fields")
  casper.then(function() { //wait before continuing
    casper.wait(500)
  })
  casper.then(function() { //change to NetStim source in SelectField
    click("#stimSourceSelect")
    casper.then(function() {
      casper.waitForSelector("#NetStimMenuItem", function() {
        casper.click("#NetStimMenuItem");
      })
    })
  })
  casper.then(function() { // select NetStim source and check correct params
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'rate\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'interval\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'number\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'start\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'noise\']")
  })

  message("explore AlphaSynapse source fields")
  casper.then(function() { //wait before continuing
    casper.wait(500)
  })
  casper.then(function() { //change to NetStim source in SelectField
    click("#stimSourceSelect")
    casper.then(function() {
      casper.waitForSelector("#AlphaSynapseMenuItem", function() {
        casper.click("#AlphaSynapseMenuItem");
      })
    })
  })
  casper.then(function() { // select AlphaSynapseMenuItem source and check correct params
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'onset\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'tau\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'gmax\']")
    assertExist(test, "netParams.stimSourceParams[\'stim_source\'][\'e\']")
  })

  message("delete stimSourceParams rules")
  casper.thenClick("#newStimulationSourceButton", function() { //add new stim source rule
    assertExist(test, "stim_source 2", "button")
  })
  casper.then(function() { // delete synapse rule 1
    delThumbnail("stim_source")
    assertDoesntExist(test, "stim_source", "button")
  })
  casper.then(function() { //delete synapse rule 2
    delThumbnail("stim_source 2")
    assertDoesntExist(test, "stim_source 2")
  })

  message("collapse stimSourceParams")
  casper.thenClick('#SimulationSources', function() { //collapse card
    assertDoesntExist(test, "newStimulationSourceButton", "button")
  });
}
/*****************************************************
 * Create  StimTarget  rule  using  the  add  button *
 *****************************************************/
function addStimTarget(test) {
  message("add stimTarget rule")
  casper.then(function() { //expand card
    casper.click('#stimTargets');
    casper.waitUntilVisible('button[id="newStimulationTargetButton"]', function() {
      casper.click('#newStimulationTargetButton');
    })
  });
  casper.then(function() { //check new stimTarget rule was created
    assertExist(test, "stim_target", "button")
  })

  message("explore stimTargetParams rule fields")
  casper.then(function() { //check fields exist
    test.assertExist("#targetName", "stimTarget name field exist")
    assertExist(test, "netParams.stimTargetParams[\'stim_target\'][\'source\']", "div")
    assertExist(test, "netParams.stimTargetParams[\'stim_target\'][\'sec\']")
    assertExist(test, "netParams.stimTargetParams[\'stim_target\'][\'loc\']")
  })

  message("explore stimTargeParams rule conditions")
  casper.then(function() { // move to conds tab
    casper.waitUntilVisible('button[id="stimTargetCondsTab"]', function() {
      casper.click("#stimTargetCondsTab");
    })
  })
  casper.then(function() { // check conds fields exist
    assertExist(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'pop\']", "div")
    assertExist(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellModel\']", "div")
    assertExist(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellType\']", "div")
  })
  casper.then(function() { // test range component
    exploreRangeComponent(test, "StimTarget");
  });
  casper.then(function() {
    assertExist(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']")
    assertExist(test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']AddButton", "button")
  })

  message("delete stimTargetParams rules")
  casper.thenClick("#newStimulationTargetButton", function() { //add new stim target rule
    assertExist(test, "stim_target 2", "button")
  })
  casper.then(function() { // delete target rule 1
    delThumbnail("stim_target")
    assertDoesntExist(test, "stim_target", "button")
  })
  casper.then(function() { //delete target rule 2
    delThumbnail("stim_target 2")
    assertDoesntExist(test, "stim_target 2", "button")
  })

  message("collapse stimTargetParams rule")
  casper.thenClick('#stimTargets', function() { //colapse stimTarget card
    assertDoesntExist(test, "newStimulationTargetButton", "button")
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
  testElementValue(test, "simConfig.duration", "1000");
  testElementValue(test, "simConfig.dt", "0.025");
  testElementValue(test, "simConfig.printRunTime", "false");
  testElementValue(test, "simConfig.hParams0", "clamp_resist : 0.001");
  testElementValue(test, "simConfig.hParams1", "celsius : 6.3");
  testElementValue(test, "simConfig.hParams2", "v_init : -65");
  testElementValue(test, "simConfig.seeds0", "loc : 1");
  testElementValue(test, "simConfig.seeds1", "stim : 1");
  testElementValue(test, "simConfig.seeds2", "conn : 1");
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
  testElementValue(test, "simConfig.recordStep", "0.1");
  testCheckBoxValue(test, "simConfig.saveLFPCells", false);
  testCheckBoxValue(test, "simConfig.recordStim", false);

  casper.thenClick("#configSaveConfiguration", function() { //go to saveConfig tab
    casper.wait(1500)//let python populate fields
  });
  assertExist(test, "simConfig.simLabel")
  assertExist(test, "simConfig.saveFolder")
  assertExist(test, "simConfig.saveDataInclude")
  assertExist(test, "simConfig.backupCfgFile")
  testElementValue(test, "simConfig.filename", "model_output");
  testElementValue(test, "simConfig.saveDataInclude0", "netParams");
  testElementValue(test, "simConfig.saveDataInclude1", "netCells");
  testElementValue(test, "simConfig.saveDataInclude2", "netPops");
  testElementValue(test, "simConfig.saveDataInclude3", "simConfig");
  testElementValue(test, "simConfig.saveDataInclude4", "simData");
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
  testElementValue(test, "netParams.scale", "1");
  testElementValue(test, "netParams.defaultWeight", "1");
  testElementValue(test, "netParams.defaultDelay", "1");
  testElementValue(test, "netParams.scaleConnWeight", "1");
  testElementValue(test, "netParams.scaleConnWeightNetStims", "1");
  testElementValue(test, "netParams.sizeX", "100");
  testElementValue(test, "netParams.sizeY", "100");
  testElementValue(test, "netParams.sizeZ", "100");
  testElementValue(test, "netParams.propVelocity", "500");
  testElementValue(test, "netParams.rotateCellsRandomly", "false");
  testSelectFieldValue(test, "netParams.shape", "cuboid")
}
/*******************************************************
 *                    functions                        *
 *******************************************************/
function leaveReEnterTab(test, mainTabID, mainTabElementID, secondTabID, SecondTabElementID, mainElementType="input") {
  casper.thenClick('button[id="'+secondTabID+'"]', function() {
    casper.waitForSelector('input[id="'+SecondTabElementID+'"]')
  });
  casper.thenClick('button[id="'+mainTabID+'"]', function() {
    casper.wait(1500)//for python to re-populate fields
  })
  casper.then(function() {
    casper.waitForSelector(mainElementType+'[id="'+mainTabElementID+'"]', function() {
      this.echo("leave and re-enter "+mainTabID+" tab")
    })
  })
}
function colapseReOpenCard(test, cardID, buttonID){
  casper.thenClick("#"+cardID, function() {
    casper.waitWhileVisible('button[id="'+buttonID+'"]')
  });
  casper.thenClick("#"+cardID, function() {
    casper.waitUntilVisible('button[id="'+buttonID+'"]')
  })
  casper.then(function(){
    this.wait(2000, function(){ // for python to re-populate fields
      this.echo("leave and re-enter " + cardID + " card")
    })
  })
}
function renameRule(test, elementID, value){
  casper.then(function(){
    this.wait(2500)//let python populate all fields before rename
  })
  casper.then(function(){
    this.waitForSelector('input[id="'+elementID+'"]')
  })
  casper.then(function(){
    this.sendKeys('input[id="'+elementID+'"]', value, {reset: true})
  })
  casper.then(function(){//let python re-populate fields 
    this.wait(3000, function(){
      this.echo("renamed element " + elementID + " to: " + value)
    })
  })
}

function setInputValue(test, elementID, value){
  casper.then(function(){
    casper.waitUntilVisible('input[id="'+elementID+'"')
  })
  casper.thenEvaluate(function(elementID, value){
    var element = document.getElementById(elementID);
    var ev = new Event('input', { bubbles: true});
    ev.simulated = true;
    element.value = value;
    element.dispatchEvent(ev);
  }, elementID, value);
  casper.then(function(){
    this.echo(value + " set for " + elementID)
  })
}

function message(message) {
  casper.then(function() {
    this.echo("------" + message + "-----")
  })
}

function assertExist(test, elementID, component = "input", message=false) {
  casper.then(function() {
    this.waitUntilVisible(component + '[id="' + elementID + '"]', function() {
      test.assertExist(component + '[id="' + elementID + '"]', message?message:component+ ": "+ elementID + " exist")
    })
  })
}

function assertDoesntExist(test, elementID, component = "input", message=false) {
  casper.then(function() {
    this.waitWhileSelector(component + '[id="' + elementID + '"]', function() {
      test.assertDoesntExist(component + '[id="' + elementID + '"]', message?message:component+ ": "+ elementID + " doesn't exist")
    })
  })
}

function setSelectFieldValue(test, selectFieldID, menuItemID, value){
  casper.then(function(){// click selectField
    this.waitUntilVisible('div[id="'+selectFieldID+'"]', function(){
      var info = casper.getElementInfo('div[id="'+selectFieldID+'"]');
      this.mouse.click(info.x + 1, info.y + 1)
    })
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
  casper.then(function(){//check value is ok
    this.waitWhileVisible('span[id="'+menuItemID+'"]', function(){
      testSelectFieldValue(test, selectFieldID, menuItemID.slice(0, -"menuItem0".length))
    })
  })
}

function testSelectFieldValue(test, elementID, expected) {
  casper.then(function() {
    this.waitForSelector('div[id="' + elementID + '"]')
  })
  casper.then(function(){
    var text = this.evaluate(function(elementID) {
      return document.getElementById(elementID).getElementsByTagName("div")[0].textContent;
    }, elementID)
    test.assertEquals(text, expected, elementID + " field value OK");
  });
}

function testElementValue(test, elementID, expectedName) {
  casper.then(function() {
    this.waitForSelector('input[id="' + elementID + '"]')
  })
  casper.then(function(){
    var name = casper.evaluate(function(elementID) {
      return $('input[id="' + elementID + '"]').val();
    }, elementID);
    test.assertEquals(name, expectedName, elementID + " field value OK");
  })  
}

function testCheckBoxValue(test, elementID, expectedName) {
  casper.then(function(){
    this.waitForSelector('input[id="' + elementID + '"]')
  })
  casper.then(function() {
    var name = casper.evaluate(function(elementID) {
      return $('input[id="' + elementID + '"]').prop('checked');
    }, elementID);
    test.assertEquals(name, expectedName, elementID + " checkBox value OK");
  })
}

function delThumbnail(elementID) {
  casper.then(function() {// click thumbnail
    casper.waitForSelector('button[id="' + elementID + '"]', function() {
      casper.mouse.click('button[id="' + elementID + '"]');
    })
  })
  casper.then(function() {// move mouse into thumbnail
    casper.mouse.move('button[id="' + elementID + '"]')
  })
  casper.then(function() {//click thumbnail
    casper.mouse.click('button[id="' + elementID + '"]')
  })
  casper.then(function(){//confirm deletion
    casper.waitUntilVisible('button[id="confirmDeletion"]', function() {
      casper.click('button[id="confirmDeletion"]')
    })
  })
  casper.then(function(){
    this.waitWhileVisible('button[id="'+ elementID+'"]', function(){
      this.echo(elementID + " button deleted")
    })
  })
}

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
    var info = this.getElementInfo(type+'[id="'+elementID+'"]');
    this.mouse.click(info.x + 1, info.y +1);//move a bit away from corner
  })
  casper.then(function(){
    this.echo("Click on "+ elementID)
    this.wait(300)
  })
}
/************************************
 *    Tests    list    component    *
 ************************************/
function addListItem(test, rute, value){
  setInputValue(test, rute, value)
  click(rute+"AddButton", "button")
}
function deleteListItem(test, rule){
  casper.then(function(){
    this.waitUntilVisible('button[id="'+rule+'RemoveButton"]')
  })
  casper.then(function(){
    this.click('button[id="'+rule+'RemoveButton"]')
  })
  casper.then(function(){
    casper.waitWhileVisible('input[id="'+rule+'"]')
  })
  casper.then(function(){
    this.echo("item removed from list: "+ rule)
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
    testElementValue(test, "populationName", expectedName);
    testElementValue(test, "netParams.popParams[\'" + expectedName + "\'][\'cellModel\']", expectedCellModel);
    testElementValue(test, "netParams.popParams[\'" + expectedName + "\'][\'cellType\']", expectedCellType);
    testElementValue(test, "popParamsDimensions", expectedDimensions);
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
    setInputValue(test, "xRange"+model+"MinRange", 0.1)
    setInputValue(test, "xRange"+model+"MaxRange", 0.9)
    setInputValue(test, "yRange"+model+"MinRange", 100)
    setInputValue(test, "yRange"+model+"MaxRange", 900)
    setInputValue(test, "zRange"+model+"MinRange", 0.2)
    setInputValue(test, "zRange"+model+"MaxRange", "A")
  })
  casper.then(function(){//let python receive data
    this.wait(2000) 
  })
}

//----------------------------------------------------------------------------//

function exploreRangeComponent(test, model){
 casper.then(function() {
   exploreRangeAxis(test, model, "x", "Absolute");
   exploreRangeAxis(test, model, "y", "Normalized");
   exploreRangeAxis(test, model, "z", "Absolute");
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
    assertExist(test, elementID.replace("Select", "") + "MinRange", "input", norm + " min range " + axis + " Exist" )
    assertExist(test, elementID.replace("Select", "") + "MaxRange", "input", norm + " max range " + axis + " Exist" )
  })
}

//----------------------------------------------------------------------------//

function testRangeComponent(test, model){
  casper.then(function(){ 
    casper.wait(1500, function(){// let pyhton populate fields
      testElementValue(test, "xRange"+model+"MinRange", "0.1");
      testElementValue(test, "xRange"+model+"MaxRange", "0.9");
      testElementValue(test, "yRange"+model+"MinRange", "100");
      testElementValue(test, "yRange"+model+"MaxRange", "900");
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
        testElementValue(test, "cellRuleName", expectedName);
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
/****************************************
*  Test  Dimension  tag  in  PopParams  *
****************************************/

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
  casper.then(function(){
    casper.wait(1000)//wait for python to receive data
  })
  casper.then(function(){ // populate dimension component
    populatePopDimension(test)
  })
  casper.then(function(){
    this.wait(1500)//let python receive data
  })
  casper.thenClick('#spatialDistPopTab', function() { //go to second tab (spatial distribution)
    this.echo("moved to spatial distribution Tab")
    populateRangeComponent(test, "PopParams")// populate RangeComponent
  })
}

//----------------------------------------------------------------------------//

function checkPopParamsValues(test, ruleName, cellType, cellModel, dimension){
  casper.then(function(){// check fields remained the same after renaiming and closing card
    testElementValue(test, "populationName", ruleName);
    testElementValue(test, "netParams.popParams[\'"+ruleName+"\'][\'cellType\']", cellType);
    testElementValue(test, "netParams.popParams[\'"+ruleName+"\'][\'cellModel\']", cellModel);
  })
  
  casper.then(function(){
    if (dimension===""){
      assertDoesntExist(test, "popParamsDimensions");
    } else {
      testElementValue(test, "popParamsDimensions", dimension);
    }
  })

  casper.thenClick('#spatialDistPopTab', function() { //go to second tab (spatial distribution)
    this.wait(1000)// wait for python to populate fields
  })
  casper.then(function(){//wait for python to populate fields
    if (dimension==""){
      checkRangeComponentIsEmpty(test, "popParams")
    } else {
      testRangeComponent(test, "PopParams")// check data remained the same
    }
  })
  casper.thenClick('#generalPopTab') //go to second tab (spatial distribution)
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
    setInputValue(test, "popParamsDimensions", 20)
  })
  casper.then(function(){// let python receive changes
    casper.wait(1500)
  })
} 
/***************************************************
*  Explore  CellRule  Values  After  Nenaming  it  *
****************************************************/
function exploreCellRuleAfterRenaming(test){
  
  casper.then(function(){
    casper.wait(5000)//for python to populate fields
  })
  
  casper.then(function(){//check field values in landing page 
    testElementValue(test, "cellRuleName", "newCell1")
    testSelectFieldValue(test, "netParams.cellParams[\'newCell1\'][\'conds\'][\'cellType\']", "PYR")
    testSelectFieldValue(test, "netParams.cellParams[\'newCell1\'][\'conds\'][\'cellModel\']", "HH")
    testSelectFieldValue(test, "netParams.cellParams[\'newCell1\'][\'conds\'][\'pop\']", "newPop1")
    testRangeComponent(test, "CellParams")
  })
  
  casper.thenClick('button[id="cellParamsGoSectionButton"]', function() { //go to "sections"
    assertExist(test, "newCellRuleSectionButton", "button")
  })
  casper.then(function(){
    casper.wait(2000)
  })
  casper.then(function(){
    casper.waitUntilVisible('button[id="newSec1"]', function(){
      casper.click('button[id="newSec1"]')
    })
  })
  casper.then(function(){
    casper.wait(2000)//wait  for python to populate fields
  })
  casper.then(function(){// check section name
    testElementValue(test, "cellParamsSectionName", "newSec1")
  })
  
  casper.thenClick("#sectionGeomTab", function() { // go to Geometry tab 
    casper.wait(2000)//wait  for python to populate fields
  })
  casper.then(function(){//check field values in topology tab
    testElementValue(test, "netParams.cellParams[\'newCell1\'][\'secs\'][\'newSec1\'][\'geom\'][\'diam\']", "20")
    testElementValue(test, "netParams.cellParams[\'newCell1\'][\'secs\'][\'newSec1\'][\'geom\'][\'L\']", "30")
    testElementValue(test, "netParams.cellParams[\'newCell1\'][\'secs\'][\'newSec1\'][\'geom\'][\'Ra\']", "100")
    testElementValue(test, "netParams.cellParams[\'newCell1\'][\'secs\'][\'newSec1\'][\'geom\'][\'cm\']", "1")
    testElementValue(test, "netParams.cellParams[\'newCell1\'][\'secs\'][\'newSec1\'][\'geom\'][\'pt3d\']0", "[10,0,0]")
  })

  casper.thenClick("#sectionTopoTab", function() { // go to Topology tab
    casper.wait(2000)//wait  for python to populate fields
  })

  casper.then(function(){//check field values in topology tab
    testSelectFieldValue(test, "netParams.cellParams[\'newCell1\'][\'secs\'][\'newSec1\'][\'topol\'][\'parentSec\']", "")
    testElementValue(test, "netParams.cellParams[\'newCell1\'][\'secs\'][\'newSec1\'][\'topol\'][\'parentX\']", "1")
    testElementValue(test, "netParams.cellParams[\'newCell1\'][\'secs\'][\'newSec1\'][\'topol\'][\'childX\']", "0")
  })

  casper.thenClick("#sectionGeneralTab", function() {
    casper.waitUntilVisible('button[id="cellParamsGoMechsButton"]')
  })
  casper.then(function() {
    click("cellParamsGoMechsButton", "button")
  })
  casper.then(function() {
    this.waitUntilVisible('button[id="mechThumbhh"]', function(){
      this.echo("go to cell mechanisms page");
    })
  })
  casper.then(function(){
    this.click('button[id="mechThumbhh"]')
  })
  casper.then(function(){
    casper.wait(1500)//for python to populate fields
  })
  casper.then(function() { // acheck field values in mech section
    testElementValue(test, "singleMechName", "hh")
    testElementValue(test, "mechNamegnabar", "0.1");
    testElementValue(test, "mechNamegkbar", "0.2");
    testElementValue(test, "mechNamegl", "0.3");
    testElementValue(test, "mechNameel", "0.4");
  });
  casper.then(function(){ // check pas and fastpas Thumbnails don't exist
    assertDoesntExist(test, "mechThumbpas", "button")
    assertDoesntExist(test, "mechThumbpasfast", "button")
  })
}
