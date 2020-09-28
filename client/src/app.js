import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Join from "./components/Join";

const App = () => (
  <Router>
    <Route path="/register" exact component={Register} />
    <Route path="/login" exact component={Login} />
    <Route path="/join" exact component={Join} />
  </Router>
);

export default App;
