import React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import ActionDialog from './ActionDialog';

export default class DeleteWork extends React.Component {
    constructor(props) {
        super(props);
    }

    render() { 
        return (
            <ActionDialog
                command ={"netpyne_geppetto.deleteModel"}
                message = {"DELETING MODEL"}
                args = {{tab: 'define'}}
                buttonLabel={"Delete"}
                title={"Delete"}
                {...this.props}
							>
                <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                    <CardHeader title="Clear" subtitle="Delete model" titleColor={blue500}/>
                    <CardText style={{marginTop: -30}}><h4>The model will be deleted</h4></CardText>
                </Card>
            </ActionDialog>
        )
    }
}