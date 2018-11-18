import React from "react";
import Checkbox from "material-ui/Checkbox";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import { Stepper, Step, StepButton, StepContent } from "material-ui/Stepper";

export default ({ filename_, runtime_, number_nodes_, number_cores_, tool, tools, settingIndex, clientJobId, clientJobName, statusEmail, emailAddress, saveLocally, setValue, setSwitch }) => (
  <Stepper orientation="vertical" >
    <Step completed={false} active={ settingIndex === 0 }>
      <StepButton onClick={ () => setValue("settingIndex", 0) }>Simulation</StepButton>
      <StepContent>
        <TextField 
          value={filename_}
          hintText="Main file name"
          floatingLabelText="Main file name"
          style={{float:"left", width:"45%", margin:"5px"}}
          onChange={e => setValue("filename_", e.target.value) }
          errorText={filename_.endsWith(".py") ? undefined : "File extension must be .py"}
        />
        <TextField
          value={runtime_}  
          hintText="Maximum run time (hs)"
          floatingLabelText="Maximum run time (hs)"
          style={{float:"right", width:"45%", margin:"5px"}}
          onChange={e => setValue("runtime_", e.target.value) }
          errorText={runtime_ > 24 ? "24 hours max." : undefined}
        />
        <TextField
          value={number_nodes_}  
          hintText="Number of nodes"
          floatingLabelText="Number of nodes"
          style={{float:"left", width:"45%", margin:"5px"}}
          onChange={e => setValue("number_nodes_", e.target.value) }
          errorText={number_nodes_ > 30 ? "30 nodes max." : undefined}
        />
        <TextField
          value={number_cores_}  
          hintText="Cores per node"
          floatingLabelText="Cores per node"
          style={{float:"right", width:"45%", margin:"5px"}}
          errorText={number_cores_ > 24 ? "24 cores per node max." : undefined}
          onChange={e => setValue("number_cores_", e.target.value) }
        />

        <SelectField
          value={tool.name}
          menuStyle={{ width:"97%" }}
          floatingLabelText="Select the tool"
          style={{ margin:"5px", width: "97%" }}
          onChange={(e, index, value) => setValue("tool", { name: "NEURON 7.4 on Comet using python",  id: "NEURON74_PY_TG" }) }
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
    <StepButton onClick={ () => setValue("settingIndex", 1) }>Metadata</StepButton>
      <StepContent>
        <TextField 
          value={clientJobId}
          hintText="Client job ID"
          style={{ width: '95%' }}
          floatingLabelText="Client job ID"
          errorText={clientJobId.length > 100 ? "100 char max." : undefined}
          onChange={e => setValue("clientJobId", e.target.value) }
        />
        <TextField
          value={clientJobName}
          hintText="Client name"
          style={{ width: '95%' }}
          floatingLabelText="Client name"
          onChange={e => setValue("clientJobName", e.target.value) }
          errorText={clientJobName.length > 100 ? "100 char max." : undefined}
        />
        <Checkbox
          checked={statusEmail}
          style={{marginTop: "20px"}}
          label="Notify me by email when finished"
          onClick={ ()=> setSwitch("statusEmail") }
        />
        <TextField
          value={emailAddress}
          disabled={!statusEmail}
          style={{ width: '95%' }}
          hintText="Notify me by email when finished"
          floatingLabelText="Notify me by email when finished"
          onChange={e => setValue("emailAddress", e.target.value) }
          errorText={emailAddress.length > 100 ? "100 char max." : undefined}
        />
      </StepContent>
    </Step>
    <Step completed={false} active={settingIndex === 2}>
      <StepButton onClick={() => setValue("settingIndex", 2) }>Storage</StepButton>
      <StepContent>
        <Checkbox
          checked={saveLocally}
          style={{marginTop: "20px"}}
          label="Save a local copy of the model"
          onClick={ () => setSwitch("saveLocally") }
        />
      </StepContent>
    </Step>
  </Stepper>
)