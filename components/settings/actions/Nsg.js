import React from 'react';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import NSG from '../../general/NSG.png'

export default class Nsg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          open: false,
          key: 'netpyne-4B3B1CC6623047BC8C1F5E0ED31914FE',
          user: 'frodriguez4600',
          pass: 'P&wonqn2208',
        }
        this.parser = new DOMParser();
        
        this.url = "https://nsgr.sdsc.edu:8443/cipresrest/v1"
    }

    async componentDidMount() {
      const { user, pass, key } = this.state;
      
      if (user && pass && key) {
        const url = `${this.url}/tool`
        
        const response = await fetch(url, { method:'GET' })
        const consumedResponse = await response.text()
        const xmlData = await this.parser.parseFromString(consumedResponse,"text/xml").getElementsByTagName("toolName")
    
        let deployments = []
        for (let i = 0 ; i < xmlData.length ; i++) {
          deployments.push(xmlData[i].textContent)
        }
        
        this.setState({ deployments })
        
      }
    }

    async currentJobs() {
      const { user, pass, key } = this.state;
      
      if (user && pass && key) {
        const headers = new Headers();
        const url = `${this.url}/job/${user}`

        headers.append('Authorization', `Basic ${btoa(user+':'+pass)}`);
        headers.append('cipres-appkey', key)
        console.log(headers);
        
        
        const response = await fetch(url, { method:'GET', headers: headers })
        const consumedResponse = await response.text()
        
        console.log(consumedResponse);
      }
    }


    render() {
      const { user, pass, key } = this.state;
      const { open, onRequestClose } = this.props;
      console.log("HEHEHEHEH")
      console.log(open)
      return (
        <Drawer width={460} openSecondary={true} open={open}>
          
          <img style={{ marginLeft: 25, marginTop: 5, marginBottom: 8, width: 350 }} src={NSG} />
          
          <Divider /> 

          <TextField
            hintText="User name"
            value={user}  
            floatingLabelText="User name"
            style={{ float:"left", width:"45%", margin:"5px" }}
            onChange={e => this.setState({ user: e.target.value })}
          />

          <TextField
            type="password"
            hintText="Password"
            value={pass}
            id="nsg_pass"
            floatingLabelText="Password"
            style={{float:"right", width:"45%", margin:"5px"}}
            onChange={e => this.setState({ pass: e.target.value })}
          />

          <TextField
            value={key}  
            hintText="The ID created "
            floatingLabelText="Application ID"
            style={{ margin:"5px", width: "97%" }}
            onChange={e => this.setState({ key: e.target.value })}
          />

          



          <div style={{textAlign: "center"}}>
            <RaisedButton
              label="run" 
              style={{ margin:"1px", marginTop: "20px" }}
              onClick={()=>this.currentJobs()}
            />
            <RaisedButton
              label={"close"}
              style={{ margin:"1px", marginTop: "20px" }}
              onClick={() => onRequestClose()}
            />
          </div>
          

        </Drawer>
      )
    }
}