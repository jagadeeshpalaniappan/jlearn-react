import "../styles.css";
// REACT:
import React, { Component } from "react";
import ReactDOM from "react-dom";
// REDUX:
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
// --------------------------------------- ACTIONS -------------------------------------------------

let nextTodoId = 0;
const addTodoAction = text => ({ type: "ADD_TODO", id: nextTodoId++, text });
const removeTodoAction = id => ({ type: "REMOVE_TODO", id });

// --------------------------------------- REDUCERS -------------------------------------------------
const todosReducer = (state = [], action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: action.id, text: action.text }];
    case "REMOVE_TODO":
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
};

// --------------------------------------- COMPONENTS -------------------------------------------------

// ------- AddTodoForm:
const AddTodoForm = ({ dispatch }) => {
  let input;

  const handleFormSubmit = e => {
    e.preventDefault();
    // dispatch: addTodoAction
    dispatch(addTodoAction(input.value));
    // reset
    input.value = "";
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input ref={node => (input = node)} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};
const AddTodoFormContainer = connect()(AddTodoForm);

// ---------------------------------------------------------------------------------------

// Todo:
const Todo = ({ text, onRemoveBtnClick }) => (
  <li>
    {text} <a onClick={onRemoveBtnClick}>x</a>
  </li>
);

// TodoList:
const TodoList = ({ todos, removeTodo }) => (
  <ul>
    {todos.map(todo => (
      <Todo key={todo.id} {...todo} onRemoveBtnClick={() => removeTodo(todo.id)} />
    ))}
  </ul>
);

// ------- TodoListContainer:
const mapStateToProps = state => {
  console.log(state);
  return {
    todos: state.todosReducer
  };
};

const mapDispatchToProps = dispatch => {
  // console.log(dispatch);
  return {
    removeTodo: id => dispatch(removeTodoAction(id))
  };
};

const TodoListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

// --------------------------------------- MAIN -------------------------------------------------

const App = () => (
  <div>
    <AddTodoFormContainer />
    <TodoListContainer />
  </div>
);

const rootReducer = combineReducers({ todosReducer });
const store = createStore(rootReducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
