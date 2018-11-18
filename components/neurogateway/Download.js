import React from "react";
import FileBrowser from '../general/FileBrowser';

export default ({ open, close }) => (
  <FileBrowser 
    open={open}  
    exploreOnlyDirs
    onRequestClose={selection => close(selection.path)} 
  />
)
