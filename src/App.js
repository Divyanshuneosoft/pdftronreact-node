import React from 'react';
import {Route,Switch,BrowserRouter as Router} from 'react-router-dom'
import './App.css';
import Editform from './components/Editform';
import Mailform from './components/Mailform'
import Annotation from './components/Annotation';

function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route exact path="/" component={Annotation} />
        <Route path="/edit" component = {Editform} />
        <Route path="/mail" component = {Mailform} />

      </Switch>
    </Router>
    </>
  );
}

export default App;
