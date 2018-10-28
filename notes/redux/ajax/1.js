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

// --------------------------------------- CONSTANTS -------------------------------------------------

// --------------------------------------- ACTIONS -------------------------------------------------
const exportActions = () => {
  const requestGetAllStudentsAction = () => ({ type: "REQUEST_ALL_STUDENTS" });
  const receiveGetAllStudentsAction = json => ({
    type: "RECEIVE_ALL_STUDENTS",
    students: json
  });
  const getAllStudentsAction = () => {
    // console.log(dispatch); // 'dispatch' is NOT available
    return dispatch => {
      // console.log(dispatch); // 'dispatch' is available
      dispatch(requestGetAllStudentsAction());
      return fetch(`https://jag-json-db.herokuapp.com/users`)
        .then(response => response.json())
        .then(json => dispatch(receiveGetAllStudentsAction(json)));
    };
  };

  return { getAllStudentsAction };
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
  const studentsReducer = (state = { isFetching: false, items: [] }, action) => {
    switch (action.type) {
      case "REQUEST_ALL_STUDENTS":
        return { ...state, isFetching: true };
      case "RECEIVE_ALL_STUDENTS":
        return { ...state, isFetching: false, items: transformStudents(action.students) };
      default:
        return state;
    }
  };

  return { studentsReducer };
};

const reducers = exportReducers();
// --------------------------------------- COMPONENTS ------------------------------------------------
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
        {this.props.isFetching && "Loading..."}
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
    isFetching: state.students.isFetching,
    students: state.students.items || []
  };
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
