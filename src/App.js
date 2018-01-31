import './App.css'

import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'

import Home from './components/home'
import React from 'react'
import logo from './animation.gif'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Transformer Battles</h1>
          </header>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
