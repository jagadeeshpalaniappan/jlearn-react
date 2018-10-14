/*
  React Router: Private Route (Custom) 
      -display routes based on Authetication
*/

import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Switch, Route, Redirect, Link, withRouter } from "react-router-dom";

// ------------------------------ fakeAuthApi ------------------------------

const fakeAuthApi = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  logOut(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

// ------------------------------ AuthButton ------------------------------

const AuthButton = withRouter(props => {
  const logOut = () => {
    fakeAuthApi.logOut(function() {
      // logOut: success
      props.history.push("/");
    });
  };

  if (fakeAuthApi.isAuthenticated) {
    return (
      <p>
        Welcome! <button onClick={logOut}>Log out</button>
      </p>
    );
  } else {
    return <p>You are not logged in.</p>;
  }
});

// ------------------------------ AdminPage ------------------------------

const AdminPage = () => (
  <div>
    <h1> AdminPage </h1>
    <AuthButton />
  </div>
);

// ------------------------------ LoginPage** ------------------------------

class LoginPage extends React.Component {
  state = {
    isUserLoggedIn: false
  };

  login = () => {
    fakeAuthApi.authenticate(() => {
      // Authentication Success: User 'Logged In'
      this.setState({ isUserLoggedIn: true });
    });
  };

  render() {
    console.log("LoginPage:render", this.props.location);

    // Default: requestedLocation
    // If u hit '/login' url direclty, 'location.state' will not be available
    let requestedLocation = { pathname: "/" };
    if (this.props.location.state) {
      // 'requestedLocation' - from PrivateRoute
      requestedLocation = this.props.location.state.requestedLocation;
    }

    if (this.state.isUserLoggedIn) {
      // User already 'Logged In': Redirect to 'requestedLocation'
      return <Redirect to={requestedLocation} />;
    } else {
      // Not Authenticated: Load LoginPage
      return (
        <div>
          <p>You must log in to view the page at {requestedLocation.pathname}</p>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button onClick={this.login}>Log in</button>
        </div>
      );
    }
  }
}

// ------------------------------ PrivateRoute*** ------------------------------

const PrivateRoute = ({ component: Component, ...otherProps }) => {
  const routeRender = props => {
    console.log("PrivateRoute:routeRender", props.location);
    if (fakeAuthApi.isAuthenticated) {
      return <Component {...props} />;
    } else {
      return <Redirect to={{ pathname: "/login", state: { requestedLocation: props.location } }} />;
    }
  };
  return <Route {...otherProps} render={routeRender} />;
};

// ------------------------------ HomePage ------------------------------

const HomePage = () => (
  <div>
    <h1 className="jumbotron">HomePage</h1>
    <AuthButton />
  </div>
);
const Menu1Page = () => <h1 className="jumbotron">Menu1Page</h1>;

const NotFoundPage = () => <h1> 404: Page Not Found </h1>;

const Header = () => (
  <header>
    <Link to="/">Home</Link>
    | <Link to="/menu1">Menu1</Link>
    | <Link to="/admin">Admin</Link>
  </header>
);

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/menu1" component={Menu1Page} />

      <Route path="/login" component={LoginPage} />
      <PrivateRoute path="/admin*" component={AdminPage} />

      <Redirect from="/old-menu1" to="/menu1" />
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
