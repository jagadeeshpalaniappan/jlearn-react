/*
  Simple Custom Routes:
    - using custom 'hashchange' logic
*/

import React from "react";
import ReactDOM from "react-dom";
import "../styles.css";

const Header = function() {
  return (
    <p>
      {" "}
      <a href="/#/home"> Home </a> | <a href="/#/menu1"> Menu1 </a> | <a href="/#/menu2"> Menu2 </a>{" "}
    </p>
  );
};

const HomePage = function() {
  return <h1 className="jumbotron"> HomePage </h1>;
};

const Menu1Page = function() {
  return <h1 className="jumbotron"> Menu1Page </h1>;
};

const Menu2Page = function() {
  return <h1 className="jumbotron"> Menu2Page </h1>;
};

class MyRouter extends React.Component {
  constructor(props) {
    super(props);

    this.hashChanged = this.hashChanged.bind(this);
    // register: 'hashchange' event
    window.addEventListener("hashchange", this.hashChanged);

    this.state = { routeUrl: "home" };
  }

  hashChanged() {
    var pathVars = window.location.hash.split("/");
    console.log("MyRouter:hashChanged", pathVars);
    this.setState({ routeUrl: pathVars[1] });
  }

  goBackHome() {
    window.location.hash = "#/home";
  }

  render() {
    let routeView = <HomePage />;

    switch (this.state.routeUrl) {
      case "menu1": {
        routeView = <Menu1Page />;
        break;
      }
      case "menu2": {
        routeView = <Menu2Page />;
        break;
      }
    }

    return (
      <div>
        <p>Route URL : {this.state.routeUrl}</p>
        {routeView}

        <button onClick={this.goBackHome}> Go Back Home </button>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Header />
        <MyRouter />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
