/*

React & Redux:

- store: students // studentsReducer
- react-redux: connect(mapStateToProps)(MyComponent)

const rootReducer = combineReducers({...studentsReducer..});
const store = createStore(rootReducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);


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

// --------------------------------------- REDUCERS -------------------------------------------------

const exportReducers = () => {
  // Model: students
  const studentsReducer = (state = [], action) => {
    return [...state, { name: "Jag", age: 22 }, { name: "Pal", age: 23 }]; // no change in 'students' model
  };
  return { studentsReducer };
};

const reducers = exportReducers();
// --------------------------------------- COMPONENTS ------------------------------------------------
// ------- StudentList:
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
