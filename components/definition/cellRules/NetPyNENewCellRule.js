import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import ImagePanoramaFishEye from 'material-ui/svg-icons/image/panorama-fish-eye';

export default class NetPyNEAddNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleClick = this.handleClick.bind(this);
  };

  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick();
    };
  };

  render() {
    return (
      <FlatButton
        id={this.props.id}
        label="+"
        labelPosition="after"
        primary={true}
        onClick={this.handleClick}
        icon={<ImagePanoramaFishEye/>}
      />
    );
  };
};
