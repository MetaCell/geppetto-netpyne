import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { pink400 } from 'material-ui/styles/colors';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';


export default ({handleClick, selection}) => (
  <span>
    <IconButton
      style={styles.home.container}
      data-tooltip={selection ? "Unselect" : undefined}
      iconStyle={{color: pink400, ...styles.home.icon}}
      onClick={ () => handleClick()}
    >
      <FontIcon className="fa fa-home"/>
    </IconButton>
    <NavigationChevronRight style={styles.rightArrow}/>
  </span>
)

const styles = {
  rightArrow : {
    float: 'left',
    color: 'grey',
    fontSize: "20px",
    marginLeft: '15px',
    marginTop: '7px',
  },
  home: {
    container : {
      float: 'left',
      height: '36px',
      width: '36px',
      padding: '0px'
    },
    icon: {
      width: '36px',
      height: '36px'
    }
  }
}
