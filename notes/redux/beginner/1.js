/*
  React & Redux:
    - action: addStudentAction
    - store: students // studentsReducer
    - react-redux: connect(mapStateToProps)(MyComponent)
    - form: using 'ref' (not recommended)
*/

import "../../styles.css";
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
  return { addStudentAction };
};
const actions = exportActions();
// --------------------------------------- REDUCERS -------------------------------------------------

const exportReducers = () => {
  // Model: students
  const studentsReducer = (state = [], action) => {
    switch (action.type) {
      case "ADD_STUDENT":
        return [...state, action.student]; // new 'student' added in 'students' model
      default:
        return state; // no change in 'students' model
    }
  };

  return { studentsReducer };
};

const reducers = exportReducers();
// --------------------------------------- COMPONENTS -------------------------------------------------

// ------- StudentForm (NOT RECOMMENDED WAY):
// (using 'ref' is not recommended):
const StudentForm = props => {
  // console.log(props); // {dispatch: ƒn}
  let nameNode, ageNode;
  const handleFormSubmit = e => {
    e.preventDefault();
    // Validate & Save
    const student = { name: nameNode.value + "11", age: ageNode.value };
    props.dispatch(actions.addStudentAction(student));
  };

  return (
    <form onSubmit={handleFormSubmit}>
      Name: <input type="text" ref={node => (nameNode = node)} />
      Age: <input type="number" ref={node => (ageNode = node)} />
      <input type="submit" value="Add" />
    </form>
  );
};
const StudentFormContainer = connect()(StudentForm);

// ------- Student:
const StudentList = props => {
  // console.log(props); // {students: [...], dispatch: ƒn}
  return (
    <ul>
      {props.students.map(student => (
        <li>
          {student.name}--{student.age}
        </li>
      ))}
    </ul>
  );
};

const mapStateToProps = state => {
  return { students: state.students };
};
const StudentListContainer = connect(mapStateToProps)(StudentList);

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
