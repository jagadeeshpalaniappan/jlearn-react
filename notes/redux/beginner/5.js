/*
  React & Redux:
    - action: addStudentAction, deleteStudentAction / *** addTeacherAction, deleteTeacherAction ***
    - store: 'students' // studentsReducer, ***'teachers' //teacherReducer ***
    - react-redux: connect(mapStateToProps, mapDispatchToProps)(MyComponent)
    - studentId logic added // studentIdCounter // ***teacherIdCounter***
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

  const addTeacherAction = teacher => {
    return { type: "ADD_TEACHER", teacher };
  };
  const deleteTeacherAction = teacherId => {
    return { type: "DELETE_TEACHER", teacherId };
  };
  return { addStudentAction, deleteStudentAction, addTeacherAction, deleteTeacherAction };
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

  let teacherIdCounter = 1;
  // Model: teachers
  const teachersReducer = (state = [], action) => {
    switch (action.type) {
      case "ADD_TEACHER":
        action.teacher.id = teacherIdCounter++;
        return [...state, action.teacher]; // new 'student' added in 'students' model
      case "DELETE_TEACHER":
        return state.filter(teacher => teacher.id !== action.teacherId);
      default:
        return state; // no change in 'students' model
    }
  };

  return { studentsReducer, teachersReducer };
};

const reducers = exportReducers();
// --------------------------------------- COMPONENTS -------------------------------------------------

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
    return { addStudent: student => dispatch(actions.addStudentAction(student)) };
  };
  const StudentFormContainer = connect(
    null,
    mapDispatchToProps
  )(StudentForm);

  return StudentFormContainer;
};
const StudentFormContainer = exportStudentFormContainer();

// ------- StudentListContainer:
const exportStudentListContainer = () => {
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

  return StudentListContainer;
};
const StudentListContainer = exportStudentListContainer();

// ------- TeacherFormContainer:
const exportTeacherFormContainer = () => {
  class TeacherForm extends React.Component {
    constructor(props) {
      super(props);
      // console.log(props); // { addStudent: ƒn}
      this.props = props;
      this.state = { teacher: { name: "", age: "" } };
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleAgeChange = this.handleAgeChange.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    handleNameChange(e) {
      this.setState({ ...this.state, teacher: { ...this.state.teacher, name: e.target.value } });
    }

    handleAgeChange(e) {
      this.setState({ ...this.state, teacher: { ...this.state.teacher, age: e.target.value } });
    }
    handleFormSubmit(e) {
      e.preventDefault();
      // Validate & Save
      this.props.addTeacher(this.state.teacher);
      // reset:
      this.setState({ ...this.state, teacher: { name: "", age: "" } });
    }
    render() {
      return (
        <form onSubmit={this.handleFormSubmit}>
          Name:{" "}
          <input type="text" value={this.state.teacher.name} onChange={this.handleNameChange} />
          Age:{" "}
          <input type="number" value={this.state.teacher.age} onChange={this.handleAgeChange} />
          <input type="submit" value="Add" />
        </form>
      );
    }
  }

  const mapDispatchToProps = dispatch => {
    return { addTeacher: teacher => dispatch(actions.addTeacherAction(teacher)) };
  };
  const TeacherFormContainer = connect(
    null,
    mapDispatchToProps
  )(TeacherForm);

  return TeacherFormContainer;
};
const TeacherFormContainer = exportTeacherFormContainer();

// ------- StudentListContainer:
const exportTeacherListContainer = () => {
  const TeachertList = props => {
    console.log(props); // {students: [...], deleteStudent: ƒn}
    return (
      <ul>
        {props.teachers.map(teacher => (
          <li>
            {teacher.id} -- {teacher.name}--{teacher.age}
            -- <a onClick={e => props.deleteTeacher(teacher.id)}>x</a>
          </li>
        ))}
      </ul>
    );
  };

  const mapStateToProps = state => {
    console.log(state.teachers);
    return { teachers: state.teachers };
  };
  const mapDispatchToProps = dispatch => {
    return { deleteTeacher: teacherId => dispatch(actions.deleteTeacherAction(teacherId)) };
  };
  const TeacherListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeachertList);

  return TeacherListContainer;
};
const TeacherListContainer = exportTeacherListContainer();

// --------------------------------------- MAIN -------------------------------------------------

const StudentMgmnt = () => (
  <div>
    <h1>Student:</h1>
    <StudentFormContainer />
    <StudentListContainer />
  </div>
);

const TeacherMgmnt = () => (
  <div>
    <h1>Teacher:</h1>
    <TeacherFormContainer />
    <TeacherListContainer />
  </div>
);

const App = () => (
  <div>
    <StudentMgmnt />
    <hr />
    <TeacherMgmnt />
  </div>
);

const rootReducer = combineReducers({
  students: reducers.studentsReducer,
  teachers: reducers.teachersReducer
});

const store = createStore(rootReducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
