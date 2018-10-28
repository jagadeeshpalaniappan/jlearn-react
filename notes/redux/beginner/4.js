/*
  React & Redux:
    - action: addStudentAction, deleteStudentAction
    - store: students // studentsReducer
    - react-redux: connect(mapStateToProps, ***mapDispatchToProps***)(MyComponent)
    - studentId logic added // studentIdCounter
    - form: using 'class component' & 'state' (recommended)
*/

import "./styles.css";
// REACT:
import React from "react";
import ReactDOM from "react-dom";
// REDUX:
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";

// --------------------------------------- CONSTANTS -------------------------------------------------

// --------------------------------------- ACTIONS -------------------------------------------------
const exportActions = () => {
  const addStudentAction = student => {
    return { type: "ADD_STUDENT", student };
  };
  const deleteStudentAction = studentId => {
    return { type: "DELETE_STUDENT", studentId };
  };
  return { addStudentAction, deleteStudentAction };
};
const actions = exportActions();
// --------------------------------------- REDUCERS -------------------------------------------------

const exportReducers = () => {
  let studentIdCounter = 1;
  // Model: students
  const studentsReducer = (state = [], action) => {
    switch (action.type) {
      case "ADD_STUDENT":
        action.student.id = studentIdCounter++;
        return [...state, action.student]; // new 'student' added in 'students' model
      case "DELETE_STUDENT":
        return state.filter(student => student.id !== action.studentId);
      default:
        return state; // no change in 'students' model
    }
  };

  return { studentsReducer };
};

const reducers = exportReducers();
// --------------------------------------- COMPONENTS -------------------------------------------------

// ------- StudentForm (Proper Way):
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
    return { addStudent: student => dispatch(actions.addStudentAction(student)) };
  };
  const StudentFormContainer = connect(
    null,
    mapDispatchToProps
  )(StudentForm);

  return StudentFormContainer;
};

const StudentFormContainer = exportStudentFormContainer();

// ------- Student:
const StudentList = props => {
  // console.log(props); // {students: [...], deleteStudent: ƒn}
  return (
    <ul>
      {props.students.map(student => (
        <li>
          {student.id} -- {student.name}--{student.age}
          -- <a onClick={e => props.deleteStudent(student.id)}>x</a>
        </li>
      ))}
    </ul>
  );
};

const mapStateToProps = state => {
  return { students: state.students };
};
const mapDispatchToProps = dispatch => {
  return { deleteStudent: studentId => dispatch(actions.deleteStudentAction(studentId)) };
};
const StudentListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentList);

// --------------------------------------- MAIN -------------------------------------------------

const App = () => (
  <div>
    <StudentFormContainer />
    <hr />
    <StudentListContainer />
  </div>
);

const rootReducer = combineReducers({
  students: reducers.studentsReducer
});
const store = createStore(rootReducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
