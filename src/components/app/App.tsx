import React from 'react';
import logo from '../../logo.svg';
import './App.css';
import store from "../../components/app/store";

import {Route, Switch} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";

import Home from "../../components/app/Home";
import Login from "../../components/authentication/Login";
import Logout from "../../components/authentication/Logout";
import Register from "../../components/authentication/Register";
import Navbar from "../../components/navbar/Navbar";
import Profile from "../profile/Profile";


const App = () => (
    <div>
      <Provider store={store}>
        <Router>
          <Navbar/>
          <main role="main" className="container">
            <Switch>
              <Route path='/profile/:id'>{Profile}</Route>
              <Route path='/login' component={Login}/>
              <Route path='/register' component={Register}/>
              <Route path='/logout' component={Logout}/>
              <Route exact path='/' component={Home}/>
            </Switch>
          </main>
        </Router>
      </Provider>
    </div>
);

export default App;
