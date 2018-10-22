import React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import ActionDialog from './ActionDialog';

export default class ImportExportSonata extends React.Component {
    constructor(props) {
        super(props);
    }

    render() { 
        switch(this.props.mode) {
            case "IMPORT": 
                var header =  <CardHeader title="Import from Sonata" subtitle="Sonata file" titleColor={blue500}/>
                var content = <CardText style={{marginTop: -30}}><h3>Under construction...</h3></CardText>
                var buttonLabel = 'Import'
                var title = 'Import'
                break
            case "EXPORT":
                var header = <CardHeader title="Export to Sonata" subtitle="Sonata file" titleColor={blue500} />
                var content = <CardText style={{marginTop: -30}}><h3>Under construction...</h3></CardText>
                var buttonLabel = 'Export'
                var title = 'Export'
                break
        }
        return (
            <ActionDialog
                command ={""}
                message = {""}
                args = {{tab: 'define'}}
                buttonLabel={buttonLabel}
                title={title}
                {...this.props}>
                <Card style={{padding: 10, float: 'left', width: '100%', marginTop: 10}} zDepth={2}>
                    {header}
                    {content}
                </Card>
            </ActionDialog>
        )
    }
}