import React from 'react';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import NavigationMoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';

import Utils from '../../../../../Utils';

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';

const styles = {
	anchorOrigin: {
		horizontal: 'left', 
		vertical: 'bottom'
	},
	anchorTarget: {
		horizontal: 'left',
		vertical: 'top'
	},
	color: 'white'
};

export default class NetPyNENewMechanism extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false,
			mechanisms: []
		};
	};
  
	async componentDidMount() {
		const response = await Utils.evalPythonMessage("netpyne_geppetto.getAvailableMechs", [])
		this.setState({mechanisms: response})
	};
	
	handleClick = (value) => {
		this.setState({open: false});
		this.props.handleClick(value);
	};

	handleButtonClick = (anchor) => {
		const { blockButton, handleHierarchyClick } = this.props;
		if (!blockButton) {
			this.setState({open: true, anchorEl: anchor})
		};
		handleHierarchyClick();
	};

	render() {
		const { disabled, blockButton } = this.props;
		const { open, anchorEl, mechanisms } = this.state;
		
		return <div>
			<IconButton
				data-tooltip={
					disabled 
						? "No section selected" 
						: blockButton 
							? "Explore mechanisms" 
							: "Add new mechanism"
				}
				id="newMechButton"
				className="gearAddButton"
				disabled={disabled}
				onClick={ e => this.handleButtonClick(e.currentTarget) }
      >
				<FontIcon 
					style={{position: 'absolute'}}
					className="gpt-fullgear"
					color={changeColor} 
					hoverColor={hoverColor} 
				/>
				
				{disabled 
					? "" 
					: blockButton
						? <NavigationMoreHoriz />
						: <ContentAdd/>
				}
      </IconButton>

			<Popover
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={styles.anchorOrigin}
				targetOrigin={styles.anchorTarget}
				onRequestClose={ () => this.setState({open: false}) }
			>
				<Menu onChange={ (e, v) => this.handleClick(v) }>
					{mechanisms.map( mechLabel => 
						<MenuItem id={mechLabel} key={mechLabel} value={mechLabel} primaryText={mechLabel}/>)
					}
				</Menu>
			</Popover>
		</div>
	};
};
