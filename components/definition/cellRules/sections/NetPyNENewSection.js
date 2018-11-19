import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import ImageCrop169 from 'material-ui/svg-icons/image/crop-16-9';

export default class NetPyNENewSection extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick({ 'Section': {'geom': {}, 'topol': {}, 'mechs': {}} });
    }
  }

  render() {
    return (
      <FlatButton
        id="newCellRuleSectionButton"
        label="+"
        labelPosition="after"
        disabled={false}
        primary={false}
        secondary={true}
        icon={<ImageCrop169/>}
        onClick={this.handleClick}
      />
    );
  }
}
