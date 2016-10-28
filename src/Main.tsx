/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */
import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import { deepOrange500 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

const styleRaised = {
    margin: 12,
};

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
});

export default class Main extends React.Component<any, any> {

    constructor(props, context) {
        super(props, context);

        // this.handleRequestClose = this.handleRequestClose.bind(this);
        // this.handleTouchTap = this.handleTouchTap.bind(this);

        this.state = {
            open: false,
        };
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    handleTouchTap() {
        console.log("handleTouchTap");
        // this.setState({
        //   open: true,
        // });
    }

    render() {
        // const standardActions = (
        //     <FlatButton
        //         label="Ok"
        //         primary={true}
        //         onTouchTap={this.handleRequestClose}
        //         />
        // );

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.container}>
                    <h1>Material-UI</h1>
                    <h2>example project</h2>
                    <RaisedButton
                        disableTouchRipple={false}
                        label="Super Secret Password"
                        secondary={true}
                        onTouchTap={this.handleTouchTap}
                        />
                    <canvas id="glcanvas" width="640" height="480">
                        Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.
                    </canvas>
                </div>
            </MuiThemeProvider>
        );
    }
}