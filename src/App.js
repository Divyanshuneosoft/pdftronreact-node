import React from 'react';
import {Route,Switch,BrowserRouter as Router} from 'react-router-dom'
import './App.css';
import Editform from './components/Editform';
import Mailform from './components/Mailform'
import Loadpdf from './components/Loadpdf';

function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route exact path="/" component={Loadpdf} />
        <Route path="/edit" component = {Editform} />
        <Route path="/mail" component = {Mailform} />

      </Switch>
    </Router>
    </>
  );
}

export default App;
