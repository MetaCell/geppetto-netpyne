import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import FileBrowser from '../../general/FileBrowser';
import ListComponent from '../../general/List';


export default class ImportCellParams extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      fileName: '',
      cellName: '',
      modFolder: '',
      compileMod: false,
      importSynMechs: false,
      explorerDialogOpen: false,
      exploreOnlyDirs: false,
      errorMessage: undefined,
      errorDetails: undefined
    };
    
    this.performAction = this.performAction.bind(this);
    this.cancelImportCellParams = this.cancelImportCellParams.bind(this);
  };

  updateCheck(name) {
    this.setState(({[name]: pv}) => ({ [name]: !pv}));
	};
	
	componentDidUpdate(nextProps, nextState) {
		if (nextProps.open != this.props.open) {
			this.setState({open: true})
		}
	}

  processError(response) {
    var parsedResponse = Utils.getErrorResponse(response);
    if (parsedResponse) {
			GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
			this.setState({ open: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] })
			return true;
    }
    return false;
  };

  performAction =  async () => {
		const { name } = this.props;
		const cellArgs = this.refs.cellArgs.state.children;
		const { fileName, cellName, modFolder, compileMod } = this.state;

		this.closeImportCellParams();
		GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.IMPORTING_MODEL);
		
    const conds = await Utils.evalPythonMessage(`netpyne_geppetto.netParams.cellParams['${name}']['conds']`)
    
    const data = { conds, cellArgs, fileName, cellName, label: name };
        
		const response = await Utils.evalPythonMessage('netpyne_geppetto.importCellTemplate', [data, modFolder, compileMod])
		
		if (!this.processError(response)) {
			GEPPETTO.CommandController.log("The cell params were imported");
			GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
		}
  };

  closeImportCellParams() {
    this.setState({ open: false, errorMessage: undefined, errorDetails: undefined });
  }

  cancelImportCellParams() {
    this.closeImportCellParams();
    this.props.onRequestClose();
  }

  showExplorerDialog(explorerParameter, exploreOnlyDirs) {
    this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs });
  };

  closeExplorerDialog(fieldValue) {
    var newState = { explorerDialogOpen: false };
    if (fieldValue) {
      switch (this.state.explorerParameter) {
        case "fileName":
          newState["fileName"] = fieldValue.path;
          break;
        case "modFolder":
          newState["modFolder"] = fieldValue.path;
          break;
        default:
          throw ("Not a valid parameter!");
      }
    }

    this.setState(newState);
  };

  render() {
		const { open, fileName, cellName, modFolder, importSynMechs, compileMod, errorMessage, errorDetails, explorerDialogOpen, exploreOnlyDirs } = this.state;
    if (open) {
      var cancelAction = <FlatButton
        label={'CANCEL'}
				style={{ marginRight: 16 }}
				onClick={this.cancelImportCellParams}
      />
      if (errorMessage == undefined) {
        var actions = [
          cancelAction,
          <RaisedButton
            primary
            label={"IMPORT"}
            onClick={this.performAction}
          />
        ];
        var children = (
					<Card style={styles.card.main}>
						<CardTitle 
							style={styles.card.title}
							title="Import Cell Template"
							subtitle="Python or Hoc files"
						/>
						<CardText>
							<NetPyNEField id="netParams.importCellParams.fileName" className="netpyneFieldNoWidth">
								<TextField
									readOnly
									value={fileName}
									onClick={() => this.showExplorerDialog('fileName', false)}
								/>
							</NetPyNEField>

							<NetPyNEField id="netParams.importCellParams.cellName" className="netpyneRightField">
								<TextField
									value={cellName}
									onChange={event => this.setState({ cellName: event.target.value })}
								/>
							</NetPyNEField>

							<NetPyNEField id="netParams.importCellParams.modFolder" className="netpyneRightField" >
								<TextField
									readOnly
									value={modFolder}
									onClick={() => this.showExplorerDialog('modFolder', true)} 
								/>
							</NetPyNEField>

							<div className="listStyle netpyneField">
								<ListComponent realType="dict" floatingLabelText="Cell Template Parameters (key:value pair)" ref="cellArgs" />
							</div>

							<div style={styles.mods.container}>
								<div style={styles.mods.leftSubContainer}>
									<NetPyNEField id="netParams.importCellParams.importSynMechs" className="netpyneCheckbox netpyneFieldNoWidth" noStyle>
										<Checkbox
											checked={importSynMechs}
											style={styles.mods.checkbox}
											onCheck={() => this.updateCheck('importSynMechs')}
										/>
									</NetPyNEField>
								</div>

								<div style={styles.mods.rightSubContainer}>
									<NetPyNEField id="netParams.importCellParams.compileMod" className="netpyneCheckbox netpyneFieldNoWidth" noStyle>
										<Checkbox
											checked={compileMod}
											style={styles.mods.checkbox}
											onCheck={() => this.updateCheck('compileMod')}
										/>
									</NetPyNEField>
								</div>
							</div>

							<FileBrowser 
								open={explorerDialogOpen} 
								exploreOnlyDirs={exploreOnlyDirs} 
								onRequestClose={selection => this.closeExplorerDialog(selection)}
							/>
						</CardText>
        	</Card>
				)
      }
      else {
        var actions = [
          cancelAction,
          <RaisedButton
            primary
            label={"BACK"}
            onClick={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
          />
        ];
        var title = errorMessage;
        var children = Utils.parsePythonException(errorDetails);
      }

      return (
        <Dialog
          title={title}
          open={open}
          actions={actions}
          bodyStyle={{ overflow: 'auto' }}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {children}
        </Dialog>);
    }
    return null;
  };
};

const styles = {
	card: {
		main: {
			padding: 10, float: 'left', width: '100%'
		},
		title: {
			paddingBottom: 0
		}
	},
	mods: {
		container: {
			width: '100%', float: 'left', marginTop: '15px'
		},
		leftSubContainer: {
			float: 'left', width: '50%'
		},
		rightSubContainer: {
			float: 'right', width: '50%'
		},
		checkbox: {
			width: '90%'
		}
	}
}