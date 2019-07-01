import React from "react";
import ReactDOM from "react-dom";

class MyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ clicked: true });
  }
  render() {
    return (
      <>
        <button onClick={this.handleClick}>Click Me</button>
        <p>Clicked: {"" + this.state.clicked}</p>
      </>
    );
  }
}

function App() {
  return (
    <div className="App">
      <MyButton />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
