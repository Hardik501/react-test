import React from 'react';
import CardList from './CardList';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

function App() {


  return (
    <Router>
      <div>
        <Routes>
          <Route exact path='/' element={<CardList/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;