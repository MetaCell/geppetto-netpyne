import React from "react";
import Divider from "material-ui/Divider";

export default ({ jobs, currentJob }) => ( 
  currentJob != -1 
    ? <div style={{ width: '100%', position: "relative" }}>
        <span style={{position: "absolute", top: "6px", left: "4px"}}>
          {jobs[currentJob].failed
            ? <i style={{color: "red"}} className="fa fa-exclamation-triangle" ></i>
            : !jobs[currentJob].terminalStage
              ? <i style={{color: "blue"}} className="fa fa-circle-o-notch fa-spin"></i>
              : <i style={{color: "green"}} className="fa fa-check "></i>
          }
        </span>
        <h3 style={{ marginLeft: "20px" }}>Details</h3>
        <Divider />
        <div style={{ marginLeft: "25px", height: "300px", "overflowX": "auto" }}>
          {Object.keys(jobs[currentJob]).map(key => (
            <details key={key} >
              <summary style={{ outline: "none" }}>{key}</summary>
              { key == "messages" 
                ? (jobs[currentJob][key].map(({timestamp, text}, index) => (
                    <details style={{ marginLeft: "12px" }}key={index}>
                      <summary style={{ outline: "none" }}>{timestamp}</summary>
                      <p style={{ marginLeft: "20px", wordWrap: "break-word" }}>{text}</p>
                    </details>
                  )))
                : <p style={{ marginLeft: "12px", wordWrap: "break-word" }}>
                    {(jobs[currentJob][key] === null || jobs[currentJob][key] === undefined)
                      ? "Empty"
                      : jobs[currentJob][key].constructor.name == "Boolean"
                        ? jobs[currentJob][key]
                          ? "Yes"
                          : "No"
                        : jobs[currentJob][key]
                    }
                  </p>
              }
            </details>
          ))}
        </div>
      </div>
    : null
)
