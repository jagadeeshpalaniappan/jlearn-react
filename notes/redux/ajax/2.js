/*
  React & Redux & Thunk
*/

import "./styles.css";
// REACT:
import React from "react";
import ReactDOM from "react-dom";
// REDUX:
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

// --------------------------------------- CONSTANTS -------------------------------------------------

// --------------------------------------- ACTIONS -------------------------------------------------
const exportActions = () => {
  const requestGetAllStudentsAction = () => ({ type: "REQUEST_ALL_STUDENTS" });
  const receiveGetAllStudentsAction = json => ({ type: "RECEIVE_ALL_STUDENTS", students: json });
  const getAllStudentsAction = () => {
    // console.log(dispatch); // 'dispatch' is NOT available
    return dispatch => {
      // console.log(dispatch); // 'dispatch' is available
      dispatch(requestGetAllStudentsAction());
      return fetch(`https://jag-json-db.herokuapp.com/users`)
        .then(response => response.json())
        .then(json => delay(1000, json))
        .then(json => dispatch(receiveGetAllStudentsAction(json)));
    };
  };

  const generateStudentId = students => {
    return Math.max(...students.map(s => s.id), 0) + 1;
  };

  const getStudentRequestBody = (student, getState) => {
    console.log(getState());
    console.log(student);
    const name = student.name.split(" ");
    return {
      id: generateStudentId(getState().students.items),
      firstName: name[0],
      lastName: name[1],
      age: student.age
    };
  };

  const requestCreateStudentAction = () => ({ type: "REQUEST_CREATE_STUDENT" });
  const receiveCreateStudentAction = json => ({ type: "RECEIVE_CREATE_STUDENT", students: json });
  const createStudentAction = student => {
    // console.log(dispatch); // 'dispatch' is NOT available
    return (dispatch, getState) => {
      // console.log(dispatch); // 'dispatch' is available
      dispatch(requestCreateStudentAction());

      return fetch(`https://jag-json-db.herokuapp.com/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(getStudentRequestBody(student, getState))
      })
        .then(response => response.json())
        .then(json => delay(1000, json))
        .then(json => dispatch(receiveCreateStudentAction()))
        .then(json => dispatch(getAllStudentsAction()));
    };
  };

  return { getAllStudentsAction, createStudentAction };
};
const actions = exportActions();

// --------------------------------------- REDUCERS -------------------------------------------------

const exportReducers = () => {
  const transformStudents = students => {
    return students.map(student => {
      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        age: student.age
      };
    });
  };

  // store: 'students'
  const studentsReducer = (state = { items: [], isFetching: false, isCreating: false }, action) => {
    switch (action.type) {
      case "REQUEST_ALL_STUDENTS":
        // store-changed: 'students.isFetching'
        return { ...state, isFetching: true };
      case "RECEIVE_ALL_STUDENTS":
        // store-changed: 'students.isFetching, students.items'
        return { ...state, isFetching: false, items: transformStudents(action.students) };
      case "REQUEST_CREATE_STUDENT":
        // store-changed: 'students.isFetching'
        return { ...state, isCreating: true };
      case "RECEIVE_CREATE_STUDENT":
        // store-changed: 'students.isFetching'
        return { ...state, isCreating: false };
      default:
        return state;
    }
  };

  return { studentsReducer };
};

const reducers = exportReducers();
// --------------------------------------- COMPONENTS ------------------------------------------------

// ------- StudentFormContainer:
const exportStudentFormContainer = () => {
  class StudentForm extends React.Component {
    constructor(props) {
      super(props);
      // console.log(props); // { addStudent: ƒn}
      this.props = props;
      this.state = { student: { name: "", age: "" } };
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleAgeChange = this.handleAgeChange.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    handleNameChange(e) {
      this.setState({ ...this.state, student: { ...this.state.student, name: e.target.value } });
    }

    handleAgeChange(e) {
      this.setState({ ...this.state, student: { ...this.state.student, age: e.target.value } });
    }
    handleFormSubmit(e) {
      e.preventDefault();
      // Validate & Save
      this.props.addStudent(this.state.student);
      // reset:
      this.setState({ ...this.state, student: { name: "", age: "" } });
    }
    render() {
      return (
        <form onSubmit={this.handleFormSubmit}>
          Name:{" "}
          <input type="text" value={this.state.student.name} onChange={this.handleNameChange} />
          Age:{" "}
          <input type="number" value={this.state.student.age} onChange={this.handleAgeChange} />
          <input type="submit" value="Add" />
        </form>
      );
    }
  }

  const mapDispatchToProps = dispatch => {
    return { addStudent: student => dispatch(actions.createStudentAction(student)) };
  };
  const StudentFormContainer = connect(
    null,
    mapDispatchToProps
  )(StudentForm);

  return StudentFormContainer;
};
const StudentFormContainer = exportStudentFormContainer();

// ------- StudentList:
class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  componentDidMount() {
    console.log("componentDidMount");
    this.props.dispatch(actions.getAllStudentsAction("reactjs"));
  }
  render() {
    return (
      <div>
        {this.props.isCreating && "Creating Student..."}
        {this.props.isFetching && "Loading All Students..."}
        <ul>
          {this.props.students.map(student => (
            <li key={student.id}>
              {student.id} -- {student.name}--{student.age}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = state => {
  console.log(state);
  return {
    students: state.students.items || [],
    isCreating: state.students.isCreating,
    isFetching: state.students.isFetching
  };
};
const StudentListContainer = connect(mapStateToProps)(StudentList);

// --------------------------------------- MAIN -------------------------------------------------

const App = () => (
  <div>
    <StudentFormContainer />
    <StudentListContainer />
  </div>
);

const rootReducer = combineReducers({
  students: reducers.studentsReducer
});

const middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

const store = createStore(rootReducer, applyMiddleware(...middleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
