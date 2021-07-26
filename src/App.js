import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, BrowserRouter} from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import ResourceMoniter from './components/ResourceMonitor/ResourceMonitor'
import CodeProfiler from './components/CodeProfiler/CodeProfiler';
import Predictions from './components/Predictions/Predictions';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard'
import Signup from './components/Signup/Signup';
import UpdateProfile from './components/UpdateProfile/UpdateProfile'
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Login from './components/Login/Login'
import { Component } from 'react';
import { Container } from 'react-bootstrap'
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute'


const DefaultContainer = () => (
  <Router>
    
    <AuthProvider>
      <Sidebar />
      <Switch>
        <PrivateRoute exact path='/' component={Home}/>
        <PrivateRoute path='/resourcemonitor' component={ResourceMoniter}/>
        <PrivateRoute path='/codeprofiler' component={CodeProfiler}/>
        <PrivateRoute path='/predictions' component={Predictions}/>
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/update-profile" component={UpdateProfile} />
      </Switch>
    </AuthProvider>
  </Router>
)

const LoginContainer = () => (
  <Container className='d-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}>
    <div className="w-100" style={{maxWidth: "400px"}}>
      <Router>
          <AuthProvider>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup}/>
              <Route path="/forgot-password" component={ForgotPassword}/>
            </Switch>
          </AuthProvider>
      </Router>
    </div>
  </Container>
)


class App extends Component {
  
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div className="App">
            <Route exact path = "/login" component={LoginContainer}/>
            <Route exact path = "/" component={DefaultContainer}/>
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
  
}

export default App;
