import React from 'react';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
  StepButton
} from 'material-ui/Stepper';

import Utils from '../../../Utils';
import NSG from '../../general/NSG.png';


const styles = {
  refresh: {
    top: '33px',
    left: '185px',
    position: 'fixed',
    display: ''
  },
};

export default class Nsg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          // fetch information
          password: 'P&wonqn2208',
          username: 'frodriguez4600',
          appID: 'netpyne-4B3B1CC6623047BC8C1F5E0ED31914FE',
          baseUrl: "https://nsgr.sdsc.edu:8443/cipresrest/v1",
          //vparams
          runtime_: 0.5,
          number_nodes_: 1,
          number_cores_: 8,
          filename_:"init.py",
          tool: { id: "NEURON74_PY_TG", name: "NEURON 7.4 on Comet using python" },
          tools: [],
          //metadata
          statusEmail: false,
          clientJobId: "",
          emailAddress: "",
          clientJobName: "",
          // job list
          currentJob: -1,
          jobs: [
            {
              id: "netpyne-4872897241",
              name: "simple cell",
              status: "error"
            },
            {
              id: "netpyne-8457728373",
              name: "complex cell",
              status: "queue"
            },
            {
              id: "netpyne-7696292384",
              name: "simple cell",
              status: "completed"
            }
          ],
          // status info
          fetching: false,
          errorMessage: undefined,
          errorDetails: undefined,
          // setting navigation
          settingIndex: 0,
          saveLocally: false
        }
        this.parser = new DOMParser();
    }

    async componentDidMount() {
      const { username, password, appID, baseUrl } = this.state;
      
      if (username && password && appID) {
        const url = `${baseUrl}/tool`
        this.setState({fetching: true})
        
        const response = await fetch(url, { method:'GET' })
        const consumedResponse = await response.text()
        const xmlToolName = await this.parser.parseFromString(consumedResponse,"text/xml").getElementsByTagName("toolName")
        const xmlToolID = await this.parser.parseFromString(consumedResponse,"text/xml").getElementsByTagName("toolName")
        let tools = []
        for (let i = 0 ; i < xmlToolName.length ; i++) {
          tools.push({
            name: xmlToolName[i].textContent,
            id: xmlToolID[i].textContent
          })
        }

        this.setState({ tools, fetching: false })
        
      }
    }

    async currentJobs() {
      const { username, password, appID, baseUrl } = this.state;
      if (username && password && appID) {
        const headers = new Headers();
        const url = `${baseUrl}/job/${user}`
        headers.append('Authorization', `Basic ${btoa(username+':'+password)}`);
        headers.append('cipres-appkey', appID)
        const response = await fetch(url, { method:'GET', headers: headers })
        const consumedResponse = await response.text()
        
        console.log(consumedResponse);
      }
    }

    async submitJob() {
    }

    async testRequestJobs(){
      const { password, username, appID, baseUrl } = this.state;
      const payload = { password, username, appID, baseUrl }

      this.setState({fetching: true})
      const response = await Utils.evalPythonMessage('netpyne_geppetto.test', [payload])
      
      if (!this.processError(response)){
        console.log(response)
        this.setState({errorMessage: undefined, errorDetails: undefined})
      }
      this.setState({fetching: false})
    }

    processError = (response) => {
      var parsedResponse = Utils.getErrorResponse(response);
      if (parsedResponse) {
          GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
          this.setState({ open: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details']})
          return true;
      }
      return false;
    }

    render() {
      const { open, onRequestClose } = this.props;
      const { 
        tools, jobs, currentJob, // general info
        username, password, appID, // fetch info
        errorMessage, errorDetails, fetching, // status info
        clientJobId, clientJobName, statusEmail, emailAddress,  // metadata
        filename_, runtime_, number_nodes_, number_cores_, tool, // vparams
        settingIndex, saveLocally//settings
      } = this.state;
  
      return (
        <Drawer width={460} openSecondary={true} open={open} style={{position: "relative"}}>
          
          <img style={{ marginLeft: 17, marginTop: 5, marginBottom: 5, width: 400 }} src={NSG} />
          
          <CircularProgress
            size={25}
            thickness={2}
            color="#1c3434"
            style={{ ...styles.refresh, visibility: fetching ? "visible" : "hidden"}}
          />
          
          <Divider /> 
          
          <Tabs>
            <Tab 
              label="New"
              onActive={() => this.submitJob()}
            >
              <div style={{textAlign: "center", position: "absolute", top: '560px', width: '100%'}}>
                <RaisedButton
                  label="run"
                  onClick={()=>this.testRequestJobs()}
                  style={{ margin:"1px" }}
                />
                <RaisedButton
                  label={"close"}
                  onClick={() => onRequestClose()}
                  style={{ margin:"1px" }}
                />
              </div>
            </Tab>
            <Tab 
              label="Status"
              onActive={() => this.testRequestJobs()}
            >
              { errorMessage ? <span>{errorMessage}{Utils.parsePythonException(errorDetails)}</span> : null }
              
              <Table
                selectable
                height="200px"
                onCellClick={ (row, col) => this.setState({ currentJob: row }) }
                fixedHeader={this.state.fixedHeader}
                fixedFooter={this.state.fixedFooter}
              >
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn colSpan="3" style={{textAlign: 'center'}}>
                      <h6>{`current jobs: (${username})`}</h6>
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow>
                    <TableHeaderColumn >Local ID</TableHeaderColumn>
                    <TableHeaderColumn >name</TableHeaderColumn>
                    <TableHeaderColumn >Status</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                  <TableBody
                    displayRowCheckbox={this.state.showCheckboxes}
                    showRowHover={this.state.showRowHover}
                  >
                    {jobs.map( (row, index) => (
                      <TableRow key={row.id} selected={ currentJob == index }>
                        <TableRowColumn>{row.id}</TableRowColumn>
                        <TableRowColumn>{row.name}</TableRowColumn>
                        <TableRowColumn>{row.status}</TableRowColumn>
                      </TableRow>
                      ))}
                  </TableBody>
              </Table>
              
              {currentJob != -1
                ? <div style={{width: '100%', height: '400px'}}>
                    <h3>Details</h3>
                    <Divider/>
                    <h4>Name:</h4>
                    <h5>{jobs[currentJob].name}</h5>
                    <h4>Status:</h4>
                    <h5>{jobs[currentJob].status}</h5>
                  </div>
                : null
              }
            </Tab>

            <Tab label="Account" >
              <TextField
                hintText="User name"
                value={username}  
                floatingLabelText="User name"
                style={{ float:"left", width:"45%", margin:"5px" }}
                onChange={e => this.setState({ username: e.target.value })}
              />

              <TextField
                id="nsg_pass"
                type="password"
                value={password}
                hintText="Password"
                floatingLabelText="Password"
                style={{float:"right", width:"45%", margin:"5px"}}
                onChange={e => this.setState({ password: e.target.value })}
              />

              <TextField
                value={appID}  
                hintText="The ID created "
                floatingLabelText="Application ID"
                style={{ margin:"5px", width: "97%" }}
                onChange={e => this.setState({ appID: e.target.value })}
              />
            </Tab>

            <Tab label="Settings" >
              <Stepper orientation="vertical" >
                <Step completed={false} active={settingIndex === 0}>
                  <StepButton onClick={() => this.setState({settingIndex: 0})}>Simulation</StepButton>
                  <StepContent>
                    <TextField 
                      value={filename_}
                      hintText="Main file name"
                      floatingLabelText="Main file name"
                      style={{float:"left", width:"45%", margin:"5px"}}
                      onChange={e => this.setState({ filename_: e.target.value })}
                      errorText={filename_.endsWith(".py") ? undefined : "File extension must be .py"}
                    />
                    <TextField
                      value={runtime_}  
                      hintText="Maximum run time (hs)"
                      floatingLabelText="Maximum run time (hs)"
                      style={{float:"right", width:"45%", margin:"5px"}}
                      onChange={e => this.setState({ runtime_: e.target.value })}
                      errorText={runtime_ > 24 ? "24 hours max." : undefined}
                    />
                    <TextField
                      value={number_nodes_}  
                      hintText="Number of nodes"
                      floatingLabelText="Number of nodes"
                      style={{float:"left", width:"45%", margin:"5px"}}
                      onChange={e => this.setState({ number_nodes_: e.target.value })}
                      errorText={number_nodes_ > 30 ? "30 nodes max." : undefined}
                    />
                    <TextField
                      value={number_cores_}  
                      hintText="Cores per node"
                      floatingLabelText="Cores per node"
                      style={{float:"right", width:"45%", margin:"5px"}}
                      errorText={number_cores_ > 24 ? "24 cores per node max." : undefined}
                      onChange={e => this.setState({ number_cores_: e.target.value })}
                    />

                    <SelectField
                      value={tool.name}
                      menuStyle={{ width:"97%" }}
                      floatingLabelText="Select the tool"
                      style={{ margin:"5px", width: "97%" }}
                      onChange={ (event, index, value) => this.setState({ 
                        tool: {
                          name: "NEURON 7.4 on Comet using python", 
                          id: "NEURON74_PY_TG"
                        }
                      })}
                    >
                      {tools.map(_tool => (
                        <MenuItem 
                          key={_tool.name} 
                          value={_tool.name} 
                          primaryText={_tool.name} 
                          disabled={ _tool.name.includes("NEURON 7.4 on Comet using python") ? false : true}
                        />
                      ))}
                    </SelectField>
                  </StepContent>
                </Step>
                <Step completed={false} active={settingIndex === 1}>
                <StepButton onClick={() => this.setState({settingIndex: 1})}>Metadata</StepButton>
                  <StepContent>
                    <TextField 
                      value={clientJobId}
                      hintText="Client job ID"
                      style={{ width: '95%' }}
                      floatingLabelText="Client job ID"
                      errorText={clientJobId.length > 100 ? "100 char max." : undefined}
                      onChange={e => this.setState({ clientJobId: e.target.value })}
                    />
                    <TextField
                      value={clientJobName}
                      hintText="Client name"
                      style={{ width: '95%' }}
                      floatingLabelText="Client name"
                      onChange={e => this.setState({ clientJobName: e.target.value })}
                      errorText={clientJobName.length > 100 ? "100 char max." : undefined}
                    />
                    <Checkbox
                      checked={statusEmail}
                      style={{marginTop: "20px"}}
                      label="Notify me by email when finished"
                      onCheck={()=> this.setState(({ statusEmail }) => ({ statusEmail: !statusEmail }))}
                    />
                    <TextField
                      value={emailAddress}
                      disabled={!statusEmail}
                      style={{ width: '95%' }}
                      hintText="Notify me by email when finished"
                      floatingLabelText="Notify me by email when finished"
                      onChange={e => this.setState({ emailAddress: e.target.value })}
                      errorText={emailAddress.length > 100 ? "100 char max." : undefined}
                    />
                  </StepContent>
                </Step>
                <Step completed={false} active={settingIndex === 2}>
                  <StepButton onClick={() => this.setState({settingIndex: 2})}>Storage</StepButton>
                  <StepContent>
                    <Checkbox
                      checked={saveLocally}
                      label="Save a local copy of the model"
                      onCheck={()=> this.setState(({saveLocally}) => ({saveLocally: !saveLocally}))}
                    />
                  </StepContent>
                </Step>
              </Stepper>
            </Tab>
          </Tabs>
        </Drawer>
      )
    }
}
