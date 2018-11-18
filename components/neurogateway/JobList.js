import React from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableRowColumn,
} from 'material-ui/Table';

export default ({ currentJob, jobs, setValue }) => (
  <Table
    selectable
    fixedHeader
    height="200px"
    style={{width: "100%"}}
    onCellClick={ (row, col) => setValue("currentJob", row) }
  >
    <TableBody
      deselectOnClickaway={false}
      displayRowCheckbox={false}
    >
      {jobs.map( (row, index) => (
        <TableRow key={row.jobHandle} selected={ currentJob == index }>
          <TableRowColumn>{row.jobHandle}</TableRowColumn>
        </TableRow>
        ))}
    </TableBody>
  </Table>
)