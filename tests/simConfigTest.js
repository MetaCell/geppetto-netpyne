//----------------------------------------------------------------------------//
function setSimConfigParams(casper, test, toolbox) {
  casper.then(function() {
    this.waitUntilVisible('div[id="Configuration"]', function() {
      toolbox.active = {
        cardID: "Configuration",
        buttonID: "configGeneral",
        tabID: false
      }
    })
  })
  casper.thenClick('#Configuration')

  casper.then(function() {
    toolbox.setInputValue(this, test, "simConfig.duration", "999");
    toolbox.setInputValue(this, test, "simConfig.dt", "0.0249");
    toolbox.getInputValue(this, test, "simConfig.printRunTime", "false");
    toolbox.getInputValue(this, test, "simConfig.hParams0", "clamp_resist : 0.001");
    toolbox.getInputValue(this, test, "simConfig.hParams1", "celsius : 6.3");
    toolbox.deleteListItem(this, test, "simConfig.hParams2", "v_init : -65");
    toolbox.addListItem(this, test, "simConfig.hParams", "fake: 123456")
    toolbox.getInputValue(this, test, "simConfig.seeds0", "loc : 1");
    toolbox.getInputValue(this, test, "simConfig.seeds1", "stim : 1");
    toolbox.deleteListItem(this, test, "simConfig.seeds2", "conn : 1");
    toolbox.addListItem(this, test, "simConfig.seeds", "fakeII: 654321")

  })
  casper.then(function() {
    this.wait(1000)
  })
  casper.then(function() {
    toolbox.clickCheckBox(this, test, "simConfig.createNEURONObj");
    toolbox.clickCheckBox(this, test, "simConfig.createPyStruct");
    toolbox.clickCheckBox(this, test, "simConfig.addSynMechs");
    toolbox.clickCheckBox(this, test, "simConfig.includeParamsLabel");
    toolbox.clickCheckBox(this, test, "simConfig.timing");
    toolbox.clickCheckBox(this, test, "simConfig.verbose");
    toolbox.clickCheckBox(this, test, "simConfig.compactConnFormat");
    toolbox.clickCheckBox(this, test, "simConfig.connRandomSecFromList");
    toolbox.clickCheckBox(this, test, "simConfig.printPopAvgRates");
    toolbox.clickCheckBox(this, test, "simConfig.printSynsAfterRule");
    toolbox.clickCheckBox(this, test, "simConfig.gatherOnlySimData");
    toolbox.clickCheckBox(this, test, "simConfig.cache_efficient");
    toolbox.clickCheckBox(this, test, "simConfig.cvode_active");
  })

  casper.then(function() {
    this.wait(2500)
  })
  casper.thenClick("#configRecord", function() { //go to record tab
    this.wait(2500); //let python populate fields
    toolbox.active.tabID = "configRecord"
  });
  casper.then(function() {
    toolbox.addListItem(this, test, "simConfig.recordCells", "22")
    toolbox.addListItem(this, test, "simConfig.recordLFP", "1,2,3")
    toolbox.addListItem(this, test, "simConfig.recordTraces", "Vsoma: {sec: soma, loc: 0.5, var: v}")
    toolbox.setInputValue(this, test, "simConfig.recordStep", "10");
    toolbox.clickCheckBox(this, test, "simConfig.saveLFPCells");
    toolbox.clickCheckBox(this, test, "simConfig.recordStim");
  })

  casper.then(function() {
    this.wait(2500)
  })

  casper.thenClick("#configSaveConfiguration", function() { //go to saveConfig tab
    this.wait(2500) //let python populate fields
    toolbox.active.tabID = "configSaveConfiguration"
  });
  casper.then(function() {
    toolbox.assertExist(this, test, "simConfig.simLabel")
    toolbox.assertExist(this, test, "simConfig.saveDataInclude")
    toolbox.assertExist(this, test, "simConfig.backupCfgFile")
    toolbox.getInputValue(this, test, "simConfig.filename", "model_output");
    toolbox.getInputValue(this, test, "simConfig.saveDataInclude0", "netParams");
    toolbox.getInputValue(this, test, "simConfig.saveDataInclude1", "netCells");
    toolbox.getInputValue(this, test, "simConfig.saveDataInclude2", "netPops");
    toolbox.getInputValue(this, test, "simConfig.saveDataInclude3", "simConfig");
    toolbox.getInputValue(this, test, "simConfig.saveDataInclude4", "simData");
  })
  casper.then(function() {
    toolbox.clickCheckBox(this, test, "simConfig.saveCellSecs");
    toolbox.clickCheckBox(this, test, "simConfig.saveCellConns");
    toolbox.clickCheckBox(this, test, "simConfig.timestampFilename");
    toolbox.clickCheckBox(this, test, "simConfig.savePickle");
    toolbox.clickCheckBox(this, test, "simConfig.saveJson");
    toolbox.clickCheckBox(this, test, "simConfig.saveMat");
    toolbox.clickCheckBox(this, test, "simConfig.saveHDF5");
    toolbox.clickCheckBox(this, test, "simConfig.saveDpk");
    toolbox.clickCheckBox(this, test, "simConfig.saveDat");
    toolbox.clickCheckBox(this, test, "simConfig.saveCSV");
    toolbox.clickCheckBox(this, test, "simConfig.saveTiming");
  })

  casper.then(function() {
    this.wait(2500)
  })

  casper.thenClick("#configErrorChecking", function() { //go to checkError tab
    this.wait(2500) //let python populate fields
    toolbox.active.tabID = "configErrorChecking"
  });
  casper.then(function() {
    toolbox.clickCheckBox(this, test, "simConfig.checkErrors");
    toolbox.clickCheckBox(this, test, "simConfig.checkErrorsVerbose");
  })
  casper.then(function() {
    this.wait(2500)
  })

  casper.thenClick("#confignetParams", function() { //go to network configuration tab
    this.wait(2500) //let python populate fields
    toolbox.active.tabID = "confignetParams"
  });
  casper.then(function() {
    toolbox.assertExist(this, test, "netParams.scaleConnWeightModels")
    toolbox.setInputValue(this, test, "netParams.scale", "2");
    toolbox.setInputValue(this, test, "netParams.defaultWeight", "3");
    toolbox.setInputValue(this, test, "netParams.defaultDelay", "4");
    toolbox.setInputValue(this, test, "netParams.scaleConnWeight", "5");
    toolbox.setInputValue(this, test, "netParams.scaleConnWeightNetStims", "6");
    toolbox.setInputValue(this, test, "netParams.sizeX", "200");
    toolbox.setInputValue(this, test, "netParams.sizeY", "300");
    toolbox.setInputValue(this, test, "netParams.sizeZ", "400");
    toolbox.setInputValue(this, test, "netParams.propVelocity", "1000");
    toolbox.getInputValue(this, test, "netParams.rotateCellsRandomly", "false");
    toolbox.getSelectFieldValue(this, test, "netParams.shape", "cuboid")
    toolbox.addListItem(this, test, "netParams.scaleConnWeightModels", "0: 0.001")
  })
  casper.then(function() {
    this.wait(3000)
  })
}

//----------------------------------------------------------------------------//
function getSimConfigParams(casper, test, toolbox) {
  casper.thenClick("#configGeneral", function() { //go to network configuration tab
    this.wait(2500) //let python populate fields
    toolbox.active.tabID = "configGeneral"
  });
  casper.then(function() {
    toolbox.getInputValue(this, test, "simConfig.duration", "999");
    toolbox.getInputValue(this, test, "simConfig.dt", "0.0249");
    toolbox.getListItemValue(this, test, "simConfig.hParams2", "fake : 123456")
    toolbox.getListItemValue(this, test, "simConfig.seeds2", "fakeII : 654321")
    toolbox.testCheckBoxValue(this, test, "simConfig.createNEURONObj", false);
    toolbox.testCheckBoxValue(this, test, "simConfig.createPyStruct", false);
    toolbox.testCheckBoxValue(this, test, "simConfig.addSynMechs", false);
    toolbox.testCheckBoxValue(this, test, "simConfig.includeParamsLabel", false);
    toolbox.testCheckBoxValue(this, test, "simConfig.timing", false);
    toolbox.testCheckBoxValue(this, test, "simConfig.verbose", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.compactConnFormat", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.connRandomSecFromList", false);
    toolbox.testCheckBoxValue(this, test, "simConfig.printPopAvgRates", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.printSynsAfterRule", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.gatherOnlySimData", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.cache_efficient", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.cvode_active", true);
  })

  casper.thenClick("#configRecord", function() { //go to record tab
    this.wait(3500); //let python populate fields
    toolbox.active.tabID = "configRecord"
  });
  casper.then(function() {
    toolbox.getListItemValue(this, test, "simConfig.recordCells0", "22")
    toolbox.getListItemValue(this, test, "simConfig.recordLFP0", "[1,2,3]")
    toolbox.getListItemValue(this, test, "simConfig.recordTraces0", "Vsoma:   {var: v, loc: 0.5, sec: soma}")
    toolbox.getInputValue(this, test, "simConfig.recordStep", "10");
    toolbox.testCheckBoxValue(this, test, "simConfig.saveLFPCells", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.recordStim", true);
  })

  casper.thenClick("#configSaveConfiguration", function() { //go to saveConfig tab
    this.wait(2500) //let python populate fields
    toolbox.active.tabID = "configSaveConfiguration"
  });
  casper.then(function() {
    toolbox.testCheckBoxValue(this, test, "simConfig.saveCellSecs", false);
    toolbox.testCheckBoxValue(this, test, "simConfig.saveCellConns", false);
    toolbox.testCheckBoxValue(this, test, "simConfig.timestampFilename", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.savePickle", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.saveJson", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.saveMat", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.saveHDF5", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.saveDpk", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.saveDat", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.saveCSV", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.saveTiming", true);
  })

  casper.thenClick("#configErrorChecking", function() { //go to checkError tab
    this.wait(2500) //let python populate fields
    toolbox.active.tabID = "configErrorChecking"
  });
  casper.then(function() {
    toolbox.testCheckBoxValue(this, test, "simConfig.checkErrors", true);
    toolbox.testCheckBoxValue(this, test, "simConfig.checkErrorsVerbose", true);
  })

  casper.thenClick("#confignetParams", function() { //go to network configuration tab
    this.wait(2500) //let python populate fields
    toolbox.active.tabID = "confignetParams"
  });
  casper.then(function() {
    toolbox.getInputValue(this, test, "netParams.scale", "2");
    toolbox.getInputValue(this, test, "netParams.defaultWeight", "3");
    toolbox.getInputValue(this, test, "netParams.defaultDelay", "4");
    toolbox.getInputValue(this, test, "netParams.scaleConnWeight", "5");
    toolbox.getInputValue(this, test, "netParams.scaleConnWeightNetStims", "6");
    toolbox.getInputValue(this, test, "netParams.sizeX", "200");
    toolbox.getInputValue(this, test, "netParams.sizeY", "300");
    toolbox.getInputValue(this, test, "netParams.sizeZ", "400");
    toolbox.getInputValue(this, test, "netParams.propVelocity", "1000");
    toolbox.getListItemValue(this, test, "netParams.scaleConnWeightModels0", "0 : 0.001")
  })
}

//----------------------------------------------------------------------------//
module.exports = {
  getSimConfigParams: getSimConfigParams,
  setSimConfigParams: setSimConfigParams
}
