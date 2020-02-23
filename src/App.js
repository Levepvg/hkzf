import React from 'react';
// import { Button } from 'antd-mobile';
import './App.css';
import { Route, BrowserRouter as Router , Switch , Redirect} from 'react-router-dom';
import Home from './views/layout/index.js'
import CityList from './views/city/index'
import TestMap from './views/map/index'

function Login(){
  return(
    <div>
      登录
    </div>
  )
}

function NotFounld () {
  return (
    <div>
      页面不见鸟
    </div>
  )
}

function App() {
  return (
    <div style={ {height: "100%" }}>
      <Router>
        <Switch>
           <Redirect exact from="/" to='/login' />
           <Route path='/login' component={Login} />
           <Route path="/home" component={Home} />
           <Route path="/map" component={TestMap} />
           <Route path="/citylist" component={CityList} />
           <Route component={NotFounld} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
