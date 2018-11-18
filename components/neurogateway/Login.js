import React from 'react';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { cyan500 } from 'material-ui/styles/colors';

export default ({ username, password, appID, fetching, logged, setValue, ClickLogin }) => (
  <span>
    <div style={{backgroundColor: cyan500, height: "85px", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <h2 style={{color: "white", margin: "0px"}}>Welcome</h2>
    </div>
    <TextField
      value={username}  
      hintText="User name"
      style={{ width:"85%" }}
      floatingLabelText="User name"
      onChange={e => setValue("username", e.target.value) }
    />

    <TextField
      id="nsg_pass"
      type="password"
      value={password}
      hintText="Password"
      style={{ width:"85%" }}
      floatingLabelText="Password"
      onChange={e => setValue("password", e.target.value) }
    />

    <TextField
      value={appID}  
      style={{ width: "85%" }}
      hintText="The ID created "
      floatingLabelText="Application ID"
      onChange={e => setValue("appID", e.target.value) }
    />

    <RaisedButton
      primary
      label={"login"}
      onClick={() => ClickLogin()}
      style={{ width: "85%", marginTop: "10px" }}
      disabled={fetching ? true : logged ? false : username && password && appID ? false : true}
    />
    <p style={{marginTop: '12px', fontSize: "12px"}}>Dont't have an account? <a target="_blank" href="https://www.nsgportal.org/gest/reg.php">Sign up</a></p>
  </span>
  
)
