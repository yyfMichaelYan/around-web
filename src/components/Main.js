import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Register from './Register';
import Login from './Login.js';

class Main extends Component {
    render() {
        return (
            <div className="main">
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                </Switch>
            </div>
        );
    }
}

export default Main;