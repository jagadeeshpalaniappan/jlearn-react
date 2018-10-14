/*
  React Router:
    - using 'react-router-dom' --> 'BrowserRouter' 
    - <BrowserRouter> uses the HTML5 'history' API 
        - (pushState, replaceState and the popstate event) to keep your UI in sync with the URL.

    https://www.sitepoint.com/react-router-v4-complete-guide/
*/

import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";

const HomePage = () => <h1 className="jumbotron">HomePage</h1>;
const Menu1Page = () => <h1 className="jumbotron">Menu1Page</h1>;

// Menu2:
const Menu2HomePage = () => <h1>Menu2HomePage</h1>;
const Menu2Child1Page = () => <h1>Menu2Child1Page</h1>;
const Menu2Child2Page = () => <h1>Menu2Child2Page</h1>;

const Menu2Page = () => (
  <React.Fragment>
    <h1 className="jumbotron">Menu2Page</h1>
    Sub Menus: <Link to="/menu2">Home</Link> | <Link to="/menu2/child1">Child1</Link> |{" "}
    <Link to="/menu2/child2">Child2</Link>
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
const Menu3Child2Page = props => (
  <p>Menu3HomePage: Path Variable: id (optional) = {props.match.params.id}</p>
);

const Menu3Page = () => (
  <React.Fragment>
    <h1 className="jumbotron">Menu3Page</h1>
    Sub Menus: <Link to="/menu3">HomePage</Link> |{" "}
    <Link to="/menu3/child1/101">Child1 (id: 101)</Link> {""}
    | <Link to="/menu3/child2">Child2</Link> | <Link to="/menu3/child2/102">Child2 (id: 102)</Link>
    <Switch>
      <Route exact path="/menu3" component={Menu3HomePage} />
      <Route exact path="/menu3/child1/:id" component={Menu3Child1Page} />
      <Route path="/menu3/child2/:id?" component={Menu3Child2Page} />
    </Switch>
  </React.Fragment>
);

class Menu4Page extends React.Component {
  constructor(props) {
    super(props);
    this.goto = this.goto.bind(this);
  }
  goto(url) {
    this.props.history.push(url);
  }
  render() {
    return (
      <div>
        <h1 className="jumbotron">Menu4Page (History API)</h1>
        <button onClick={() => this.goto("/menu1")}> Goto: Menu1</button>
        <button onClick={() => this.goto("/menu2/child2")}> Goto: Menu2</button>
      </div>
    );
  }
}

const NotFoundPage = () => <h1> 404: Page Not Found </h1>;

const Header = () => (
  <header>
    <Link to="/">Home</Link> | <Link to="/menu1">Menu1</Link> | <Link to="/menu2">Menu2</Link> |{" "}
    <Link to="/menu3">Menu3</Link>
    | <Link to="/menu4">Menu4</Link>
  </header>
);

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/menu1" component={Menu1Page} />
      <Route path="/menu2" component={Menu2Page} />
      <Route path="/menu3" component={Menu3Page} />
      <Route path="/menu4" component={Menu4Page} />

      <Redirect from="/old-menu1" to="/menu1" />
      <Redirect from="/old-menu2*" to="/menu2" />
      <Route path="*" component={NotFoundPage} />
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
