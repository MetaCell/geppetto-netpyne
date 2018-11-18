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

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton'

import  ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import { pink400, cyan500 } from 'material-ui/styles/colors';

import Utils from '../../../Utils';
import NSG from '../../general/NSG.png';

import Login from "../../neurogateway/Login";
import Error from "../../neurogateway/Error";
import JobList from "../../neurogateway/JobList";
import Settings from '../../neurogateway/Settings';
import Details from '../../neurogateway/Details';
import Download from '../../neurogateway/Download';

const styles = {
  refresh: {
    top: '33px',
    left: '185px',
    position: 'fixed',
    display: ''
  },
};

const successDialog = close => (
  <div style={{height: "150px", borderRadius: "3px", textAlign: "center", marginTop: "5px"}}>
    <div style={{backgroundColor: cyan500, height: "145px", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <ActionCheckCircle color="white" style={{width: "70px", height:"70px"}}/>
    </div>
    <h3>Great!</h3>
    <p style={{fontSize: "12px"}}>Job successfully send</p>
    <RaisedButton
      primary
      label="close"
      onClick={()=>close()}
    />
  </div>
)

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
      number_cores_: 1,
      filename_:"init.py",
      tool: { id: "NEURON74_PY_TG", name: "NEURON 7.4 on Comet using python" },
      //metadata
      statusEmail: true,
      clientJobId: "",
      clientJobName: "",
      emailAddress: "frodriguez4600@gmail.com",
      // job list
      jobs: [],
      currentJob: -1,
      // status info
      tools: [],
      tabIndex: 0,
      fetching: false,
      errorMessage: undefined,
      errorDetails: undefined,
      // setting navigation
      settingIndex: 0,
      saveLocally: false,
      // logged info
      logged: false,
      jobWasSend: false,
      // download
      openFileBrowser: false,
      downloadDir: ""
    }
    this.parser = new DOMParser();
  }

  async login(){
    const { password, username, appID, baseUrl } = this.state;
    const payload = { password, username, appID, baseUrl }
    this.setState({fetching: true, logged: false})
    const response = await Utils.evalPythonMessage('netpyne_geppetto.nsg_login', [payload])
    if (!this.processError(response)){ //handle error at backend level
      if (response.success) { // handle error at NSG restAPI level
        const tools = await this.fetchTools()
        this.setState(({ username }) => ({
          tools,
          logged: true, 
          password: "",
          username: "",
          loginName: username,
          errorMessage: undefined, 
          errorDetails: undefined,
        }))
      } else {
        this.setState({errorMessage: response.displayMessage, errorDetails: response.message})
      }
    }
    this.setState({fetching: false})
  }

  logout(){
    this.setState({
      logged: false,
    })
  }

  async fetchTools(){
    const { baseUrl } = this.state;
    const url = baseUrl + "/tool"
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
    return tools
  }

  async jobList(){
    this.setState({fetching: true})
    const response = await Utils.evalPythonMessage('netpyne_geppetto.job_list', [])

    if (!this.processError(response)){
      this.setState({errorMessage: undefined, errorDetails: undefined, jobs: response})
    }
    
    this.setState({fetching: false})
  }

  async submitJob() {
    const { runtime_, number_nodes_, number_cores_, filename_, tool, statusEmail, clientJobId, emailAddress, clientJobName } = this.state;
    const metadata = { statusEmail, clientJobId, emailAddress, clientJobName }
    const vParams = { runtime_, number_nodes_, number_cores_, filename_, tool: tool.id }
    
    this.setState({fetching: true})
    const response = await Utils.evalPythonMessage('netpyne_geppetto.submit_job', [vParams, metadata])
    if (!this.processError(response)){
      this.setState({errorMessage: undefined, errorDetails: undefined, jobWasSend: true})
    }
    this.setState({fetching: false})
  }

  async deleteJob(){
    const { jobs, currentJob } = this.state;
    this.setState({fetching: true})
    const response = await Utils.evalPythonMessage('netpyne_geppetto.delete_job', [jobs[currentJob].jobUrl])
    if (!this.processError(response)) {
      const newJobs = jobs.filter((tool, index) => index!=currentJob)

      this.setState({errorMessage: undefined, errorDetails: undefined, currentJob: -1, jobs: newJobs})
    }
    this.setState({fetching: false})

  }

  async downloadResults() {
    const { jobs, currentJob, downloadDir } = this.state;

    this.setState({ fetching: true })
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "DOWNLOADING DATA");
    const response = await Utils.evalPythonMessage("netpyne_geppetto.download_job", [ jobs[currentJob].jobUrl, downloadDir ])
    
    if (!this.processError(response)) {
      console.log("download successful")
      console.log(response);
      this.setState({errorMessage: undefined, errorDetails: undefined})
    }
    this.setState({fetching: false})
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
  }

  async plugResults() {
    const { jobs, currentJob } = this.state;

    this.setState({ fetching: true })
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "DOWNLOADING DATA");
    const response = await Utils.evalPythonMessage("netpyne_geppetto.load_job", [ jobs[currentJob].jobUrl ])
    if (!this.processError(response)) {
      console.log("load successful")
      console.log(response);
      this.setState({errorMessage: undefined, errorDetails: undefined})
    }
    this.setState({fetching: false})
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
  }
  

  processError = (response) => {
    var parsedResponse = Utils.getErrorResponse(response);
    if (parsedResponse) {
        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
        this.setState({ errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details']})
        return true;
    }
    return false;
  }

  render() {
    const { open, onRequestClose } = this.props;
    const { logged, tabIndex, jobWasSend, openFileBrowser, currentJob, fetching } = this.state;

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
        
        {!logged
          ? <div style={{textAlign: "center"}}>
              <Login
                { ...this.state }
                ClickLogin={ () => this.login() }
                setValue={(field, value) => this.setState({ [field]: value })}
              />
              <Error 
                { ...this.state }
              />
            </div>
          : <Tabs 
              value={tabIndex} 
              inkBarStyle={{ backgroundColor: "#00BCD4" }}
              onChange={value => logged ? this.setState({tabIndex: value}) : null}
            >
              <Tab 
                value={0}
                label="New"
              >
                {jobWasSend
                  ? successDialog(() => this.setState({ jobWasSend: false }) )
                  : <span>
                      <Settings
                        { ...this.state }
                        setValue={(field, value) => this.setState({ [field]: value })}
                        setSwitch={ field => this.setState(({[field]: value }) => ({ [field]: !value }) )}
                      />
                      <Error 
                        { ...this.state }
                      />
                      
                      <div style={{textAlign: "center", position: "absolute", top: '560px', width: '100%'}}>
                        <RaisedButton
                          secondary
                          label={fetching ? "..." : "run"}
                          disabled={fetching ? true : false}
                          onClick={ () => this.submitJob() }
                        />
                      </div>
                    </span>
                  }
              </Tab>
              <Tab 
                value={1}
                label="Status"
                onActive={() => logged ? this.jobList() : null}
              > 
                <JobList
                  { ...this.state }
                  setValue={(field, value) => this.setState({ [field]: value })}
                />
                {
                  currentJob != -1
                  ? <span style={{width: '90%', overflow: "hidden"}}>
                      <IconButton
                        touch
                        tooltip="Delete"
                        disabled={fetching}
                        tooltipPosition="top-center"
                        onClick={ () => this.deleteJob() }
                        style={{ float: "right", marginLeft: "20px", marginRight: "20px", paddingTop: "20px" }}
                      >
                        <FontIcon 
                          color={cyan500} 
                          hoverColor={pink400}
                          className="fa fa-trash-o"
                        />
                      </IconButton>
                      <IconButton
                        touch
                        tooltip="Refresh"
                        disabled={fetching}
                        tooltipPosition="top-center"
                        onClick={() => this.jobList() }
                        style={{ float: "right", paddingTop: "20px" }}
                      >
                        <FontIcon 
                          color={cyan500} 
                          hoverColor={pink400} 
                          className="fa fa-refresh" 
                        />
                      </IconButton>
                      <IconButton
                        touch
                        tooltip="Download"
                        disabled={fetching}
                        tooltipPosition="top-center"
                        style={{ float: "right", paddingTop: "20px" }}
                        onClick={() => this.setState({ openFileBrowser: true }) }
                      >
                        <FontIcon 
                          color={cyan500} 
                          hoverColor={pink400} 
                          className="fa fa-download"
                        />
                      </IconButton>
                      <IconButton
                        touch
                        tooltip="Open"
                        disabled={fetching}
                        tooltipPosition="top-center"
                        onClick={() => this.plugResults() }
                        hoveredStyle={{color: cyan500}}
                        style={{ float: "right", paddingTop: "20px" }}
                      >
                        <FontIcon 
                          color={cyan500}
                          hoverColor={pink400}
                          className="fa fa-arrow-left"
                        />
                      </IconButton>
                    </span>
                  : null
                }
                
                <Details
                  { ...this.state }
                />

                <Error 
                  { ...this.state }
                />

                <Download
                  open={openFileBrowser}
                  close={path => this.setState({downloadDir: path, openFileBrowser: false}, () => this.downloadResults())}
                />
              </Tab>
            </Tabs>
          }
          <RaisedButton
            label={"close"}
            disabled={fetching ? true : false}
            style={{position: "absolute", bottom: "0px", width:"100%"}}
            onClick={ () => onRequestClose() }
          />
      </Drawer>
    )
  }
}
// async currentJobs() {
    //   const { username, password, appID, baseUrl } = this.state;
    //   if (username_ && password_ && appID) {
    //     const headers = new Headers();
    //     const url = `${baseUrl}/job/${user}`
    //     headers.append('Authorization', `Basic ${btoa(username_+':'+password_)}`);
    //     headers.append('cipres-appkey', appID)
    //     const response = await fetch(url, { method:'GET', headers: headers })
    //     const consumedResponse = await response.text()
        
    //     console.log(consumedResponse);
    //   }
    // }


    // async componentDidMount() {
    //   const { password, username, appID, baseUrl } = this.state;
      
    //   if (username && password && appID) {
    //     const url = `${baseUrl}/tool`
    //     this.setState({fetching: true})
        
    //     const response = await fetch(url, { method:'GET' })
    //     const consumedResponse = await response.text()
    //     const xmlToolName = await this.parser.parseFromString(consumedResponse,"text/xml").getElementsByTagName("toolName")
    //     const xmlToolID = await this.parser.parseFromString(consumedResponse,"text/xml").getElementsByTagName("toolName")
    //     let tools = []
    //     for (let i = 0 ; i < xmlToolName.length ; i++) {
    //       tools.push({
    //         name: xmlToolName[i].textContent,
    //         id: xmlToolID[i].textContent
    //       })
    //     }

    //     this.setState({ tools, fetching: false })
        
    //   }
    // }



    // <List>
    //             <ListItem
    //               disabled={true}
    //               leftAvatar={
    //                 <Avatar
    //                   size={40}  
    //                   color={"white"}
    //                   backgroundColor={"#2196F3"}
    //                 >
    //                   {loginName[0]}
    //                 </Avatar>
    //               }
    //             >
    //               {loginName}
    //             </ListItem>
    //           </List>