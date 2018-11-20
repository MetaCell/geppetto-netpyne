import React from 'react';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import NavigationMoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NetPyNECellRule from './NetPyNECellRule';
import NetPyNEThumbnail from '../../general/NetPyNEThumbnail';
import NetPyNESection from './sections/NetPyNESection';
import NetPyNESectionThumbnail from './sections/NetPyNESectionThumbnail';
import NetPyNEMechanism from './sections/mechanisms/NetPyNEMechanism';
import NetPyNENewMechanism from './sections/mechanisms/NetPyNENewMechanism';
import NetPyNEMechanismThumbnail from './sections/mechanisms/NetPyNEMechanismThumbnail';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import { pink400, cyan500 } from 'material-ui/styles/colors';
import { HomeIcon } from '../../general/CustomIcons';
import Dialog from 'material-ui/Dialog/Dialog';

import Utils from '../../../Utils';

const styles = {
  rightArrow : {
    float: 'left',
    color: 'grey',
    fontSize: "20px",
    marginLeft: '15px'
  },
  home: {
    container : {
      float: 'left',
      height: '36px',
      width: '36px',
      padding: '0px'
    },
    icon: {
      width: '36px',
      height: '36px'
    }
  },
  cellRule: {
    marginTop: "15px",
    float: "left",
    textAlign: 'center'
  },
  sections: {
    container: {
      marginLeft: '15px',
      float: 'left',
      borderRadius: 25,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 6px 0 rgba(0, 0, 0, 0.19)'
    },
    icon: {
      borderRadius: 25 
    }
  }
}

export default class NetPyNECellRules extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedCellRule: undefined,
      selectedSection: undefined,
      selectedMechanism: undefined,
      deletedCellRule: undefined,
      deletedSection: undefined,
      errorMessage: undefined,
      errorDetails: undefined,
      page: "main"
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectCellRule = this.selectCellRule.bind(this);
    this.handleNewCellRule = this.handleNewCellRule.bind(this);
    this.deleteCellRule = this.deleteCellRule.bind(this);

    this.selectSection = this.selectSection.bind(this);
    this.handleNewSection = this.handleNewSection.bind(this);
    this.deleteSection = this.deleteSection.bind(this);

    this.selectMechanism = this.selectMechanism.bind(this);
    this.handleNewMechanism = this.handleNewMechanism.bind(this);
    this.deleteMechanism = this.deleteMechanism.bind(this);

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
    this.handleRenameSections = this.handleRenameSections.bind(this);
  }

  selectPage(page, state) {
    this.setState({ page: page, ...state });
  }

  selectCellRule(cellRule) {
    this.setState({selectedCellRule: cellRule, selectedSection: undefined, selectedMechanism: undefined});
  }

  handleNewCellRule(defaultCellRules) {
    var key = Object.keys(defaultCellRules)[0];
    var value = defaultCellRules[key];
    var {value: model} = this.state;

    // Get New Available ID
    var cellRuleId = Utils.getAvailableKey(model, key);
    var newCellRule = Object.assign({name: cellRuleId}, value);
    // Create Cell Rule Client side
    Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + cellRuleId + '"] = ' + JSON.stringify(value));
    model[cellRuleId] = newCellRule;
    // Update state
    this.setState({
      value: model,
      selectedCellRule: cellRuleId,
      selectedSection: undefined,
      selectedMechanism: undefined
    });
  }

  selectSection(section) {
    this.setState({ selectedSection: section, selectedMechanism: undefined });
  }

  handleNewSection(defaultSectionValues) {
    let key = Object.keys(defaultSectionValues)[0];
    let value = defaultSectionValues[key];
    const { value: model, selectedCellRule } = this.state;
    
    // Get New Available ID
    var sectionId = Utils.getAvailableKey(model[selectedCellRule]['secs'], key);
    var newSection = Object.assign({name: sectionId}, value);
    if (model[selectedCellRule]['secs'] == undefined) {
      model[selectedCellRule]['secs'] = {};
      Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"] = {}');
    }
    Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + sectionId + '"] = ' + JSON.stringify(value));
    model[selectedCellRule]["secs"][sectionId] = newSection;
    // Update state
    this.setState({
      value: model,
      selectedSection: sectionId,
      selectedMechanism: undefined
    });
  }

  selectMechanism(mechanism) {
    this.setState({ selectedMechanism: mechanism });
  }

  handleNewMechanism(mechanism) {
    const {value: model, selectedCellRule, selectedSection } = this.state;
    
    // Create Mechanism Client side
    if (model[selectedCellRule].secs[selectedSection]['mechs'] == undefined) {
      model[selectedCellRule].secs[selectedSection]['mechs'] = {};
      Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + selectedSection + '"]["mechs"] = {}');
    };
    var params = {};
    Utils
      .evalPythonMessage("netpyne_geppetto.getMechParams", [mechanism])
      .then((response) => {
        response.forEach((param) => params[param] = 0);
        Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + selectedSection + '"]["mechs"]["' + mechanism + '"] = ' + JSON.stringify(params));
      })
    this.setState({
      value: model,
      selectedMechanism: mechanism
    });
  }

  hasSelectedCellRuleBeenRenamed(prevState, currentState) {
    var currentModel = prevState.value;
    var model = currentState.value;
    //deal with rename
    if (currentModel != undefined && model != undefined) {
      var oldP = Object.keys(currentModel);
      var newP = Object.keys(model);
      if (oldP.length == newP.length) {
        //if it's the same lenght there could be a rename
        for (var i = 0; i < oldP.length; i++) {
          if (oldP[i] != newP[i]) {
            if (prevState.selectedCellRule != undefined) {
              if (oldP[i] == prevState.selectedCellRule) {
                return newP[i];
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  hasSelectedSectionBeenRenamed(prevState, currentState) {
    var currentModel = prevState.value;
    var model = this.state.value;
    var currentCellRule = undefined;
    var newCellRule = undefined;

    if (prevState.value != undefined && prevState.value != undefined) {
      currentCellRule = prevState.value[currentState.selectedCellRule];
      newCellRule = currentState.value[currentState.selectedCellRule];
    }

    if (currentModel != undefined && model != undefined && prevState.selectedCellRule != undefined && currentCellRule != undefined && newCellRule != undefined) {
      //loop sections
      var oldS = Object.keys(currentCellRule.secs);
      var newS = Object.keys(newCellRule.secs);
      if (oldS.length == newS.length) {
        for (var i = 0; i < oldS.length; i++) {
          if (oldS[i] != newS[i]) {
            if (prevState.selectedSection != undefined) {
              if (oldS[i] == prevState.selectedSection) {
                return newS[i];
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  hasSelectedMechanismBeenRenamed(prevState, currentState) {
    var currentModel = prevState.value;
    var model = this.state.value;
    var currentCellRule = undefined;
    var newCellRule = undefined;
    if (prevState.value != undefined && prevState.value != undefined) {
      currentCellRule = prevState.value[currentState.selectedCellRule];
      newCellRule = currentState.value[currentState.selectedCellRule];
    }
    var currentSection = undefined;
    var newSection = undefined;
    if (currentCellRule != undefined && newCellRule != undefined) {
      currentSection = currentCellRule.secs[currentState.selectedSection];
      newSection = newCellRule.secs[currentState.selectedSection];
    }
    if (currentModel != undefined && model != undefined && prevState.selectedSection != undefined && currentSection != undefined && newSection != undefined) {
      //loop mechanisms
      var oldM = Object.keys(currentSection.mechs);
      var newM = Object.keys(newSection.mechs);
      if (oldM.length == newM.length) {
        for (var i = 0; i < oldM.length; i++) {
          if (oldM[i] != newM[i]) {
            if (prevState.selectedMechanism != undefined) {
              if (oldM[i] == prevState.selectedMechanism) {
                return newM[i];
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  componentDidUpdate(prevProps, prevState) {
    //we need to check if any of the three entities have been renamed and if that's the case change the state for the selection variable
    var newCellRuleName = this.hasSelectedCellRuleBeenRenamed(prevState, this.state);
    if (newCellRuleName !== undefined) {
      this.setState({ selectedCellRule: newCellRuleName, deletedCellRule: undefined });
    } else if((prevState.value !== undefined) && (Object.keys(prevState.value).length !== Object.keys(this.state.value).length)) {
      // logic into this if to check if the user added a new object from the python backend and
      // if the name convention pass the checks, differently rename this and open dialog to inform.
      var model = this.state.value;
      for(var m in model) {
        if((prevState.value !== "") && (!(m in prevState.value))) {
          var newValue = Utils.nameValidation(m);
          if(newValue != m) {
            newValue = Utils.getAvailableKey(model, newValue);
            model[newValue] = model[m];
            delete model[m];
            this.setState({ value: model,
                            errorMessage: "Error",
                            errorDetails: "Leading digits or whitespaces are not allowed in CellRule names.\n" +
                                          m + " has been renamed " + newValue},
                            function() {
                              Utils.renameKey('netParams.cellParams', m, newValue, (response, newValue) => {});
                            }.bind(this));
          }
        }
      }
    }
    var newSectionName = this.hasSelectedSectionBeenRenamed(prevState, this.state);
    if (newSectionName !== undefined) {
      this.setState({ selectedSection: newSectionName, deletedSection: undefined });
    } else if((prevState.value !== undefined)) {
      // logic into this if to check if the user added a new object from the python backend and
      // if the name convention pass the checks, differently rename this and open dialog to inform.
      var model2 = this.state.value;
      var prevModel = prevState.value;
      for(var n in model2) {
        if((prevModel[n] !== undefined) && (Object.keys(model2[n]['secs']).length !== Object.keys(prevModel[n]['secs']).length)) {
          var cellRule = model2[n]['secs'];
          for(var s in cellRule) {
            if(!(s in prevState.value[n]['secs'])) {
              var newValue2 = Utils.nameValidation(s);
              if(newValue2 != s) {
                newValue2 = Utils.getAvailableKey(model2[n]['secs'], newValue2);
                model2[n]['secs'][newValue2] = model2[n]['secs'][s];
                delete model2[n]['secs'][s];
                this.setState({ value: model2,
                  errorMessage: "Error",
                  errorDetails: "Leading digits or whitespaces are not allowed in Population names.\n" +
                  s + " has been renamed " + newValue2},
                  function() {
                    Utils.renameKey('netParams.cellParams["'+n+'"]["secs"]', s, newValue2, (response, newValue) => {});
                  }.bind(this));
              }
            }
          }
        }
      }
    }
    var newMechanismName = this.hasSelectedMechanismBeenRenamed(prevState, this.state);
    if (newMechanismName !== undefined) {
      this.setState({ selectedMechanism: newMechanismName });
    }
  }

  handleHierarchyClick = (nextPage) => {
    const { page, selectedCellRule, value } = this.state;
    if (nextPage===page) {
      switch (page) {
        case "main": 
          this.handleNewCellRule({ 'CellRule': {'conds':{}, 'secs':{}} });
          break;
        case "sections":
          this.handleNewSection({ 'Section': {'geom': {}, 'topol': {}, 'mechs': {}} });
          break;
        default:
          break;
      }
    }
    else {
      this.setState({page: nextPage});
      if (nextPage == 'sections') { // saves one click if there are no sections
        if (Object.keys(value[selectedCellRule]['secs']).length == 0) {
          this.handleNewSection({ 'Section': {'geom': {}, 'topol': {}, 'mechs': {}} });
        }
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    var itemRenamed = this.hasSelectedCellRuleBeenRenamed(this.state, nextState) !== undefined || this.hasSelectedSectionBeenRenamed(this.state, nextState) !== undefined || this.hasSelectedMechanismBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedCellRule != nextState.selectedCellRule || this.state.selectedSection != nextState.selectedSection || this.state.selectedMechanism != nextState.selectedMechanism;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = ((Object.keys(this.state.value).length != Object.keys(nextState.value).length));
      if (this.state.selectedCellRule != undefined && nextState.value[this.state.selectedCellRule] != undefined) {
        var oldLength = this.state.value[this.state.selectedCellRule] == undefined ? 0 : Object.keys(this.state.value[this.state.selectedCellRule].secs).length;
        newItemCreated = ((newItemCreated || oldLength != Object.keys(nextState.value[this.state.selectedCellRule].secs).length));
      }
      if (this.state.selectedSection != undefined && nextState.value[this.state.selectedCellRule] != undefined && nextState.value[this.state.selectedCellRule].secs[this.state.selectedSection] != undefined) {
        var oldLength = this.state.value[this.state.selectedCellRule].secs[this.state.selectedSection] == undefined ? 0 : Object.keys(this.state.value[this.state.selectedCellRule].secs[this.state.selectedSection].mechs).length;
        newItemCreated = (newItemCreated || oldLength != Object.keys(nextState.value[this.state.selectedCellRule].secs[this.state.selectedSection].mechs).length);
      }
    }
    var errorDialogOpen = (this.state.errorDetails !== nextState.errorDetails) ? true : false;
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged || errorDialogOpen;
  }

  deleteCellRule(name) {
    var parameter = "cellParams['" + name + "']"
    Utils.execPythonMessage('netpyne_geppetto.deleteParam("' + parameter + '")').then((response) =>{
      var model = this.state.value;
      delete model[name];
      this.setState({value: model, selectedCellRule: undefined, deletedCellRule: name});
    });
  };

  deleteMechanism(name) {
    if(this.state.selectedCellRule != undefined && this.state.selectedSection != undefined) {
      var parameter = "cellParams['" + this.state.selectedCellRule + "']['secs']['" + this.state.selectedSection + "']['mechs']['" + name + "']"
      Utils.execPythonMessage('netpyne_geppetto.deleteParam("' + parameter + '")').then((response) =>{
        var model = this.state.value;
        delete model[this.state.selectedCellRule].secs[this.state.selectedSection]['mechs'][name];
        this.setState({value: model, selectedMechanism: undefined});
      });
    }
  };

  deleteSection(name) {
    if(this.state.selectedCellRule != undefined) {
      var parameter = "cellParams['" + this.state.selectedCellRule + "']['secs']['" + name + "']"
      Utils.execPythonMessage('netpyne_geppetto.deleteParam("' + parameter + '")').then((response) =>{
        var model = this.state.value;
        delete model[this.state.selectedCellRule]['secs'][name];
        this.setState({value: model, selectedSection: undefined, deletedSection: name});
      });
    }
  };

  handleRenameChildren(childName) {
    childName = childName.replace(/\s*$/,"");
    var childrenList = Object.keys(this.state.value);
    for(var i=0 ; childrenList.length > i ; i++) {
      if(childName === childrenList[i]) {
        return false;
      }
    }
    return true;
  };

  handleRenameSections(childName, leaf) {
    childName = childName.replace(/\s*$/,"");
    var childrenList = Object.keys(this.state.value[leaf]['secs']);
    for(var i=0 ; childrenList.length > i ; i++) {
      if(childName === childrenList[i]) {
        return false;
      }
    }
    return true;
  };

  render() {

    const { value: model, page, selectedCellRule, selectedSection, selectedMechanism, errorMessage, errorDetails } = this.state;
    var selectedCellRuleContainer = undefined;

    const actions = <RaisedButton primary label={"BACK"} onTouchTap={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}/>

    const dialogPop = (errorMessage != undefined 
      ? <Dialog
          title={errorMessage}
          open={true}
          actions={actions}
          bodyStyle={{ overflow: 'auto' }}
          style={{ whiteSpace: "pre-wrap" }}>
          {errorDetails}
        </Dialog> 
      : undefined
    );

    if (page == 'main') {
      if ( selectedCellRule !== undefined && model && Object.keys(model).indexOf(selectedCellRule) > -1) {
        selectedCellRuleContainer = (
          <NetPyNECellRule
            name={selectedCellRule}
            selectPage={this.selectPage}
            model={model[selectedCellRule]}
            renameHandler={this.handleRenameChildren} 
          />
        )
      }
      if (model != undefined) {
        var cellRulesContainer = Object.keys(model).map( cellRuleName => 
          <NetPyNEThumbnail
            id={cellRuleName}
            name={cellRuleName}
            key={cellRuleName} 
            selected={cellRuleName == selectedCellRule}
            deleteMethod={this.deleteCellRule}
            handleClick={this.selectCellRule} 
          />
        )
      }
    }
    else if (page == "sections") {
      var selectedSectionContainer = undefined;
      const sectionsModel = model[selectedCellRule].secs;
      if ( selectedSection !== undefined && Object.keys(sectionsModel).indexOf(selectedSection) > -1 ) {
        selectedSectionContainer = (
          <NetPyNESection
            name={selectedSection}
            cellRule={selectedCellRule}
            selectPage={this.selectPage}
            model={sectionsModel[selectedSection]}
            renameHandler={this.handleRenameSections}
          />
        )
      }
      var sectionsContainer = Object.keys(sectionsModel).map( sectionName => 
        <NetPyNESectionThumbnail 
          key={sectionName} 
          name={sectionName}
          selected={sectionName == selectedSection}
          deleteMethod={this.deleteSection}
          handleClick={this.selectSection} 
        />
      )
    }
    else if (page == "mechanisms") {
      var selectedMechanismContainer = undefined;
      const mechanismsModel = model[selectedCellRule].secs[selectedSection].mechs;
      if ((selectedMechanism !== undefined) && Object.keys(mechanismsModel).indexOf(selectedMechanism) > -1) {
        selectedMechanismContainer = (
          <NetPyNEMechanism 
            cellRule={selectedCellRule}
            section={selectedSection} 
            name={selectedMechanism} 
            model={mechanismsModel[selectedMechanism]}
          />
        )
      }
      var mechanismsContainer = Object.keys(mechanismsModel).map( mechName => 
        <NetPyNEMechanismThumbnail 
          name={mechName} 
          key={mechName} 
          selected={mechName == selectedMechanism} 
          model={mechanismsModel[mechName]} 
          deleteMethod={this.deleteMechanism}
          handleClick={this.selectMechanism} 
        />
      )
    }
    
    const content = (
      <CardText className={"tabContainer"} expandable={true}>
        <div className={"thumbnails"}>
          <div className="breadcrumb">
            <IconButton
              style={styles.home.container}
              data-tooltip={ page != "main" ? "Go back to main" : undefined }
              iconStyle={{color: page != 'main' ? cyan500 : pink400, ...styles.home.icon}}
              onClick={ () => this.setState({page: 'main', selectedCellRule: undefined, selectedSection: undefined, selectedMechanism: undefined})}
            >
              <HomeIcon/>
            </IconButton>

            <NavigationChevronRight style={styles.rightArrow}/>

            <FloatingActionButton
              zDepth={1}
              id="newCellRuleButton"
              style={styles.cellRule}
              className={"actionButton smallActionButton"}
              secondary={ page != 'main' }
              data-tooltip={ 
                page != 'main'
                  ? selectedCellRule && selectedCellRule.length > 8 
                    ? selectedCellRule 
                    : "Go back to rule"
                  : "Create rule"
                }
              onClick={() => this.handleHierarchyClick('main')}
            >
              { page != 'main' 
                ? selectedCellRule.length > 8 
                  ? (selectedCellRule.slice(0,7)+'...') 
                  : selectedCellRule 
                : <ContentAdd/>
              }
            </FloatingActionButton>
            
            <NavigationChevronRight style={styles.rightArrow}/>

            <RaisedButton
              id="newSectionButton"
              style={styles.sections.container}
              disabledBackgroundColor="grey"
              buttonStyle={styles.sections.icon}
              primary={ page != 'mechanisms' }
              secondary={ page == 'mechanisms' }
              disabled={ selectedCellRule == undefined }
              onClick={ () => this.handleHierarchyClick('sections') }
              data-tooltip={ page == 'mechanisms' 
                ? !!selectedSection && selectedSection.length > 9 
                  ? selectedSection 
                  : "Go back to section"
                : page == "sections" 
                  ? "Create a section" 
                  : !!selectedCellRule
                    ?  !!model && !!model[selectedCellRule] && Object.keys(model[selectedCellRule]['secs']).length > 0
                      ? "Explore sections"
                      : "Create first section"
                    : "No rule selected" 
              }
            >
              <p style={{color: 'white', height: '100%'}}>
                {page == "mechanisms" 
                  ? selectedSection != undefined 
                    ? selectedSection.length > 9 
                      ? selectedSection.slice(0,7) + "..."
                      : selectedSection 
                    : ""
                  : page == "sections" 
                    ? <ContentAdd style={{height: '100%'}} color="white"/>
                    : !!selectedCellRule
                      ? !!model && !!model[selectedCellRule] && Object.keys(model[selectedCellRule]['secs']).length > 0
                        ? <NavigationMoreHoriz style={{height: '100%'}} color="white"/>
                        : <ContentAdd style={{height: '100%'}} color="white"/>
                      : ""
                }
              </p>
            </RaisedButton>

            <NavigationChevronRight style={styles.rightArrow}/>

            <NetPyNENewMechanism
              blockButton={page != 'mechanisms' && !!model && !!model[selectedCellRule] && !!model[selectedCellRule]['secs'][selectedSection] && Object.keys(model[selectedCellRule]['secs'][selectedSection]['mechs']).length > 0}
              handleClick={this.handleNewMechanism}
              handleHierarchyClick={ () => this.handleHierarchyClick('mechanisms')}
              disabled={selectedSection == undefined || page == 'main'}
            /> 
          </div>
          <div style={{ clear: "both" }}/>
          { page == "main" ? cellRulesContainer : page == "sections" ? sectionsContainer : mechanismsContainer }
        </div>
        <div className="details">
          { page == "main" ? selectedCellRuleContainer : page == "sections" ? selectedSectionContainer : selectedMechanismContainer }
        </div>
      </CardText>
    );

    return (
        <Card style={{ clear: 'both' }}>
            <CardHeader
              id="CellRules"
              title="Cell rules"
              subtitle="Define here the rules to set the biophysics and morphology of the cells in your network"
              actAsExpander={true}
              showExpandableButton={true}
            />
            {content}
            {dialogPop}
        </Card>
    );
  }
}
