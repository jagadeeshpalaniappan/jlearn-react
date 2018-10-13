/*
  React Router:
    - using 'react-router-dom' 'BrowserRouter' 
    - <HashRouter> uses the hash portion of the URL (E.g. mydomain.com/app1/#/hashurl/...)
      - (i.e. window.location.hash) to keep your UI in sync with the URL.
*/

import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

const HomePage = () => <h1 className="jumbotron">HomePage</h1>;
const Menu1Page = () => <h1 className="jumbotron">Menu1Page</h1>;

// Menu2:
const Menu2HomePage = () => <h1>Menu2HomePage</h1>;
const Menu2Child1Page = () => <h1>Menu2Child1Page</h1>;
const Menu2Child2Page = () => <h1>Menu2Child2Page</h1>;

const Menu2Page = () => (
  <React.Fragment>
    <h1 className="jumbotron">Menu2Page</h1>
    Sub Menus: <Link to="/menu2">Home</Link> | <Link to="/menu2/child1">Child1</Link> | <Link to="/menu2/child2">Child2</Link>
    {/* Sub Route View */}
    <div className="container">
      <Switch>
        <Route exact path="/menu2" component={Menu2HomePage} />
        <Route path="/menu2/child1" component={Menu2Child1Page} />
        <Route path="/menu2/child2" component={Menu2Child2Page} />
      </Switch>
    </div>
  </React.Fragment>
);

// Menu3:
const Menu3HomePage = () => <p>Menu3HomePage</p>;
const Menu3Child1Page = props => <p>Menu3HomePage: Path Variable: id= {props.match.params.id}</p>;
const Menu3Child2Page = props => <p>Menu3HomePage: Path Variable: id (optional) = {props.match.params.id}</p>;

const Menu3Page = () => (
  <React.Fragment>
    <h1 className="jumbotron">Menu3Page</h1>
    Sub Menus: <Link to="/menu3">HomePage</Link> | <Link to="/menu3/child1/101">Child1 (id: 101)</Link> {""}
    | <Link to="/menu3/child2">Child2</Link> | <Link to="/menu3/child2/102">Child2 (id: 102)</Link>
    <Switch>
      <Route exact path="/menu3" component={Menu3HomePage} />
      <Route exact path="/menu3/child1/:id" component={Menu3Child1Page} />
      <Route path="/menu3/child2/:id?" component={Menu3Child2Page} />
    </Switch>
  </React.Fragment>
);

const Header = () => (
  <header>
    <Link to="/">Home</Link> | <Link to="/menu1">Menu1</Link> | <Link to="/menu2">Menu2</Link> | <Link to="/menu3">Menu3</Link>
  </header>
);

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/menu1" component={Menu1Page} />
      <Route path="/menu2" component={Menu2Page} />
      <Route path="/menu3" component={Menu3Page} />
    </Switch>
  </main>
);

const App = () => (
  <div className="container">
    <Header />
    <Main />
  </div>
);

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
