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
    // test.assertExists('div[id="Populations"]', 'Populations button exists.');
    // test.assertExists('div[id="CellRules"]', "Cell rules button exists.");
    // test.assertExists('div[id="Synapses"]', "Synapses button exists.");
    // test.assertExists('div[id="Connections"]', "Connections button exists.");
    // test.assertExists('div[id="SimulationSources"]', "Connections button exists.");
    // test.assertExists('div[id="Configuration"]', "Configuration button exists.");
    // test.assertExists('button[id="defineNetwork"]', 'Define network button exists.');
    // test.assertExists('button[id="exploreNetwork"]', 'Explore network button exists.');
    // test.assertExists('button[id="simulateNetwork"]', 'Simulate network button exists.');
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
  message("add new popParams rule")
  casper.click('#Populations'); //open Pop Card
  casper.then(function() { // check add pop button exist 
    casper.waitUntilVisible('button[id="newPopulationButton"]', function() {
      test.assertExist('button[id="newPopulationButton"]', "add population button exists")
    });
  })
  casper.thenClick('button[id="newPopulationButton"]', function() { //add new population
    test.assertExists('button[id="Population"]', "Pop thumbnail Exists");
    casper.wait(1000, function() {
      this.echo("waited for metadata")
    });
  })
  message("check popParams fields")
  casper.then(function() { // check all fields exist
    test.assertExists("#populationName", "Pop name Exists");
    assertExist(test, "netParams.popParams[\'Population\'][\'cellType\']")
    assertExist(test, "netParams.popParams[\'Population\'][\'cellModel\']")
    test.assertExists("#popParamsDimensionsSelect", "Pop dimensions selectField Exists");
  })
  casper.then(function() { //check MenuItems for Dimension exist
    click("#popParamsDimensionsSelect");
    casper.waitForSelector("#popParamSgridSpacing", function() {
      test.assertExist("#popParamSnumCells", "Pop numCells menuItem Exist");
      test.assertExist("#popParamSdensity", "Pop density menuItem Exist");
      test.assertExist("#popParamSgridSpacing", "Pop gridSpacing menuItem Exist");
    });
  })
  casper.thenClick("#popParamSnumCells", function() { //check 1st menuItem shows field
    test.assertExist("#popParamsDimensions", "Pop numCells field Exist");
  })
  casper.then(function() { //click SelectField again
    click("#popParamsDimensionsSelect")
  })
  casper.thenClick("#popParamSdensity", function() { //check 2st menuItem shows field
    test.assertExist("#popParamsDimensions", "Pop density field Exist");
  })
  casper.then(function() { //click SelectField again
    click("#popParamsDimensionsSelect")
  })
  casper.thenClick("#popParamSdensity", function() { //check 3st menuItem shows field
    test.assertExist("#popParamSgridSpacing", "Pop gridSpacing field Exist");
  })

  casper.thenClick('#spatialDistPopTab', function() { //go to second tab in population
    casper.waitForSelector("#xRangePopParamsSelect", function() {
      exploreRangeComponent(test, "PopParams", "x", "Absolute");
      exploreRangeComponent(test, "PopParams", "x", "Normalized");
      exploreRangeComponent(test, "PopParams", "y", "Absolute");
      exploreRangeComponent(test, "PopParams", "y", "Normalized");
      exploreRangeComponent(test, "PopParams", "z", "Absolute");
      exploreRangeComponent(test, "PopParams", "z", "Normalized");
    })
  })
  message("add and delete populations")
  casper.then(function() { //back to General tab
    casper.click('#generalPopTab');
    casper.waitForSelector("#populationName", function() {
      test.assertExists("#populationName", "come back to general tab");
    })
  });

  casper.thenClick('button[id="newPopulationButton"]', function() { //add second population
    casper.waitUntilVisible('button[id="Population 2"]', function() {
      test.assertExist('button[id="Population 2"]', "Population 2 thumbnail added");
    });
  })
  casper.then(function() { //delete first population
    delThumbnail("Population")
    casper.waitWhileVisible('button[id="Population"]', function() {
      test.assertDoesntExist('button[id="Population"]', "Population deletion");
    })
  })

  casper.then(function() { // delete second population
    delThumbnail("Population 2")
    casper.waitWhileVisible('button[id="Population 2"]', function() {
      test.assertDoesntExist('button[id="Population 2"]', "Population 2 deletion");
    })
  })
  message("colapse popParams card")
  casper.thenClick("#Populations", function() { // colapse card
    casper.waitWhileVisible('button[id="newPopulationButton"]', function() {
      test.assertDoesntExist('button[id="newPopulationButton"]', "Populations view collapsed");
    }, 5000);
  });
}

/***********************************************
 * Create  cell  rule  using  the  add  button *
 ***********************************************/
function addCellRule(test) {
  message("add cellParams rule")
  casper.click('#CellRules', function() { // expand card
    test.assertExist('button[id="newCellRuleButton"]', "add new CellRule button exist")
  })
  casper.thenClick('button[id="newCellRuleButton"]', function() { //click add cellRule
    assertExist(test, "CellRule", "button")
  })
  
  message("explore cellParams fields")
  casper.then(function() { // check fields exist
    assertExist(test, "cellRuleName")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellType\']", "div")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellModel\']", "div")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'pop\']", "div")
  })
  casper.then(function() { // explore spatial distribution tab
    exploreRangeComponent(test, "CellParams", "x", "Absolute");
    exploreRangeComponent(test, "CellParams", "y", "Absolute");
    exploreRangeComponent(test, "CellParams", "z", "Absolute");
    exploreRangeComponent(test, "CellParams", "x", "Normalized");
    exploreRangeComponent(test, "CellParams", "y", "Normalized");
    exploreRangeComponent(test, "CellParams", "z", "Normalized");
  });
  
  message("create new section")
  casper.thenClick('button[id="cellParamsGoSectionButton"]', function() { //go to sections
    assertExist(test, "newCellRuleSectionButton", "button")
  })
  casper.thenClick('#newCellRuleSectionButton', function() { //add new section and check name
    assertExist(test, "cellParamsSectionName")
  });
  
  message("explore cellParams.section fields")
  casper.thenClick("#sectionGeomTab", function() { //go to geom tab and chec fields
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'L\']")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'Ra\']")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'cm\']")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']AddButton", "button")
  })
  casper.thenClick("#sectionTopoTab", function() { // go to Topo tab and check fields
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "div")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentX\']")
    assertExist(test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'childX\']")
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
    assertExist(test, "singleMechName");
    assertExist(test, "mechNamegnabar");
    assertExist(test, "mechNamegkbar");
    assertExist(test, "mechNamegl");
    assertExist(test, "mechNameel");
  })
  casper.thenClick('#addNewMechButton', function() { // add pas mech and check Fields
    casper.waitForSelector("#pas", function(){
      casper.thenClick("#pas", function() {
        assertExist(test, "singleMechName");
        assertExist(test, "mechNameg");
        assertExist(test, "mechNamee");
      })
    })
  });
  casper.thenClick('#addNewMechButton', function() { // add pas mech and check Fields
    casper.waitForSelector("#fastpas", function(){
      casper.thenClick("#fastpas", function() {
        assertExist(test, "singleMechName");
        assertExist(test, "mechNameg");
        assertExist(test, "mechNamee");
      })
    })
  });

  message("delete cellParams.section.mechanism")
  casper.then(function() { // delete hh mech
    delThumbnail("mechThumbhh")
    assertDoesntExist(test, "mechThumbhh", "button");
  })
  casper.then(function() { // del pas mech
    delThumbnail("mechThumbpas")
    assertDoesntExist(test, "mechThumbpas", "button");
  })
  casper.then(function() { // del fastpas mech
    delThumbnail("mechThumbfastpas")
    assertDoesntExist(test, "mechThumbfastpas", "button");
  })
  
  message("delete cellParams.section")
  casper.thenClick('#fromMech2SectionButton', function() { // come back to --secion--
    assertDoesntExist(test, "addNewMechButton", "button")
  });
  casper.thenClick('#newCellRuleSectionButton', function() { // create a second section
    assertExist(test, "Section 2", "button")
  });
  casper.then(function() { //delete section1
    delThumbnail("Section")
  })
  casper.then(function() { //delete second section and check non exist
    delThumbnail("Section 2")
      assertDoesntExist(test, "Section", "button");
      assertDoesntExist(test, "Section 2", "button");
  })
  
  message("delete cellParams rule")
  casper.thenClick("#fromSection2CellRuleButton", function() { // go back to cellRule main content
    assertDoesntExist(test, "newCellRuleSectionButton", "button")
  })
  casper.then(function() {
    delThumbnail("CellRule")
    assertDoesntExist(test, "CellRule", "button")
  })
  
  message("colapse cellParams rule")
  casper.thenClick('#CellRules', function(){
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
  casper.then(function(){
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
  casper.thenClick('#Synapses', function(){
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
      exploreRangeComponent(test, "PreConn", "x", "Absolute");
      exploreRangeComponent(test, "PreConn", "x", "Normalized");
      exploreRangeComponent(test, "PreConn", "y", "Absolute");
      exploreRangeComponent(test, "PreConn", "y", "Normalized");
      exploreRangeComponent(test, "PreConn", "z", "Absolute");
      exploreRangeComponent(test, "PreConn", "z", "Normalized");
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
      exploreRangeComponent(test, "PostConn", "x", "Absolute");
      exploreRangeComponent(test, "PostConn", "x", "Normalized");
      exploreRangeComponent(test, "PostConn", "y", "Absolute");
      exploreRangeComponent(test, "PostConn", "y", "Normalized");
      exploreRangeComponent(test, "PostConn", "z", "Absolute");
      exploreRangeComponent(test, "PostConn", "z", "Normalized");
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
  casper.thenClick('#Connections', function(){
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
  casper.thenClick('#SimulationSources', function(){//collapse card
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
    exploreRangeComponent(test, "StimTarget", "x", "Absolute");
    exploreRangeComponent(test, "StimTarget", "x", "Normalized");
    exploreRangeComponent(test, "StimTarget", "y", "Absolute");
    exploreRangeComponent(test, "StimTarget", "y", "Normalized");
    exploreRangeComponent(test, "StimTarget", "z", "Absolute");
    exploreRangeComponent(test, "StimTarget", "z", "Normalized");
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
  casper.thenClick('#stimTargets', function(){//colapse stimTarget card
    assertDoesntExist(test, "newStimulationTargetButton", "button")
  });
}


/*************************************
 * Check  simConfig  initial  state  *
 *************************************/
function checkSimConfigParams(test) {
  casper.thenClick('#Configuration', function() { // expand configuration Card
    casper.wait(100)
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
    casper.wait(1000);
  });
  assertExist(test, "simConfig.recordLFP")
  assertExist(test, "simConfig.recordCells")
  assertExist(test, "simConfig.recordTraces")
  testElementValue(test, "simConfig.recordStep", "0.1");
  testCheckBoxValue(test, "simConfig.saveLFPCells", false);
  testCheckBoxValue(test, "simConfig.recordStim", false);

  casper.thenClick("#configSaveConfiguration", function() { //go to saveConfig tab
    casper.wait(1000)
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
    casper.wait(1000)
  });
  testCheckBoxValue(test, "simConfig.checkErrors", false);
  testCheckBoxValue(test, "simConfig.checkErrorsVerbose", false);

  casper.thenClick("#confignetParams", function() { //go to network configuration tab
    casper.wait(1000)
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
function message(message) {
  casper.then(function() {
    this.echo("------" + message + "-----")
  })
}

function assertExist(test, elementID, component = "input") {
  casper.then(function() {
    this.waitForSelector(component + '[id="' + elementID + '"]', function() {
      test.assertExist(component + '[id="' + elementID + '"]', elementID + " " + component + " exist")
    })
  })
}

function assertDoesntExist(test, elementID, component = "input") {
  casper.then(function() {
    this.waitWhileSelector(component + '[id="' + elementID + '"]', function() {
      test.assertDoesntExist(component + '[id="' + elementID + '"]', elementID + " " + component + " does not exist")
    })
  })
}

function testSelectFieldValue(test, elementID, expected) {
  casper.then(function() {
    this.waitForSelector('div[id="' + elementID + '"]', function() {
      var text = casper.evaluate(function(elementID) {
        return document.getElementById(elementID).getElementsByTagName("div")[0].textContent;
      }, elementID)
      test.assertEquals(text, expected, elementID + " field value OK");
    })
  });
}

function testElementValue(test, elementID, expectedName) {
  casper.then(function() {
    this.waitForSelector('input[id="' + elementID + '"]', function() {
      var name = casper.evaluate(function(elementID) {
        return $('input[id="' + elementID + '"]').val();
      }, elementID);
      test.assertEquals(name, expectedName, elementID + " field value OK");
    });
  })
}

function testCheckBoxValue(test, elementID, expectedName) {
  casper.waitForSelector('input[id="' + elementID + '"]', function() {
    var name = casper.evaluate(function(elementID) {
      return $('input[id="' + elementID + '"]').prop('checked');
    }, elementID);
    test.assertEquals(name, expectedName, elementID + " checkBox value OK");
  })
}

function delThumbnail(elementID) {
  casper.wait(500)
  casper.then(function() {
    casper.waitForSelector('button[id="' + elementID + '"]', function() {
      casper.mouse.doubleclick('button[id="' + elementID + '"]');
    })
  })
  casper.then(function() {
    casper.wait(500)
  })
  casper.thenClick('button[id="' + elementID + '"]', function() {
    casper.wait(500)
  })
  casper.then(function() {
    casper.waitUntilVisible('button[id="confirmDeletion"]', function() {
      casper.thenClick('button[id="confirmDeletion"]')
    })
  })
}

function click(elementID) {
  casper.then(function (){
    this.evaluate(function(elementID) {
      document.getElementById(elementID).scrollIntoView();
    }, elementID.replace("#", ''));
    var info = casper.getElementInfo(elementID);
    this.mouse.click(info.x + 1, info.y + 1);
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
      casper.click('#' + expectedName);
      casper.then(function() { //give it time so metadata gets loaded
        casper.wait(2000, function() {
          this.echo("I've waited a second for metadata to be populated")
        });
      });
      this.echo('Population metadata loaded.');
      casper.then(function() { //test metadata contents
        testElementValue(test, "populationName", expectedName);
        testElementValue(test, "netParams.popParams[\'"+expectedName+"\'][\'cellModel\']", expectedCellModel);
        testElementValue(test, "netParams.popParams[\'"+expectedName+"\'][\'cellType\']", expectedCellType);
        testElementValue(test, "popParamsDimensions", expectedDimensions);
      });
    }, 5000);
  });
}
/**********************************************************************
 * Explore SelectField, MenuItems and TextField inside RangeComponent *
 **********************************************************************/
function exploreRangeComponent(test, model, axis, norm) {
  casper.then(function() {
    var elementID = "#" + axis + "Range" + model + "Select"
    var secondElementID = "#" + axis + "Range" + model + norm + "MenuItem"
    casper.waitForSelector(elementID, function() {
      test.assertExist(elementID, "SelectField in " + axis + "-axis EXISTS");
    })
    click(elementID)
    casper.then(function(){
      casper.waitForSelector(secondElementID, function() {
        test.assertExist(secondElementID, norm + " menu item in " + axis + "-axis EXISTS");
        casper.thenClick(secondElementID, function(){
          casper.wait(500, function() {
            casper.waitForSelector(elementID.replace('Select', '') + "MinRange", function() {
              test.assertExist(elementID.replace('Select', '') + "MinRange", norm + " min in " + axis + "-axis EXISTS");
              test.assertExist(elementID.replace('Select', '') + "MaxRange", norm + " max in " + axis + "-axis EXISTS");
            });
          })
        })
      });
    })  
  })
};
/************************************************
 * Test adding a new cell rule and its contents *
 ************************************************/
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
