import React from "react";
import Utils from '../../Utils';

export default ({ errorMessage, errorDetails }) => (
  errorMessage 
    ? <span>
        {errorMessage}
        {Utils.parsePythonException(errorDetails)}
      </span>
    : null 
)