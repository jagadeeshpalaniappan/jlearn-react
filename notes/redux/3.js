import "../styles.css";
// REACT:
import React, { Component } from "react";
import ReactDOM from "react-dom";
// REDUX:
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";

// --------------------------------------- CONSTANTS -------------------------------------------------

const FilterTypes = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_COMPLETED: "SHOW_COMPLETED",
  SHOW_ACTIVE: "SHOW_ACTIVE"
};

// --------------------------------------- ACTIONS -------------------------------------------------
const exportActions = () => {
  let nextTodoId = 0;
  const addTodoAction = text => ({ type: "ADD_TODO", id: nextTodoId++, text });
  const removeTodoAction = id => ({ type: "REMOVE_TODO", id });
  const toggleTodoAction = id => ({ type: "TOGGLE_TODO", id });
  const setSelectedFilterAction = filter => ({ type: "SET_SELECTED_FILTER", filter });
  return { addTodoAction, removeTodoAction, toggleTodoAction, setSelectedFilterAction };
};
const actions = exportActions();
// --------------------------------------- REDUCERS -------------------------------------------------

const exportReducers = () => {
  const todosReducer = (state = [], action) => {
    console.log(action);
    switch (action.type) {
      case "ADD_TODO":
        return [...state, { id: action.id, text: action.text }];
      case "REMOVE_TODO":
        return state.filter(todo => todo.id !== action.id);
      case "TOGGLE_TODO":
        return state.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        );
      default:
        return state;
    }
  };

  const selectedFilterReducer = (state = FilterTypes.SHOW_ALL, action) => {
    switch (action.type) {
      case "SET_SELECTED_FILTER":
        return action.filter;
      default:
        return state;
    }
  };

  return { todosReducer, selectedFilterReducer };
};

const reducers = exportReducers();
// --------------------------------------- COMPONENTS -------------------------------------------------

// ------- AddTodoForm:
const AddTodoForm = ({ dispatch }) => {
  let input;

  const handleFormSubmit = e => {
    e.preventDefault();
    // dispatch: addTodoAction
    dispatch(actions.addTodoAction(input.value));
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
const Todo = ({ text, completed, onRemoveBtnClick, onTodoTextClick }) => (
  <li>
    <span onClick={onTodoTextClick} style={{ textDecoration: completed ? "line-through" : "none" }}>
      {text}
    </span>
    <a onClick={onRemoveBtnClick}>x</a>
  </li>
);

// TodoList:
const TodoList = ({ todos, removeTodo, toggleTodo }) => (
  <ul>
    {todos.map(todo => (
      <Todo
        key={todo.id}
        {...todo}
        onRemoveBtnClick={() => removeTodo(todo.id)}
        onTodoTextClick={() => toggleTodo(todo.id)}
      />
    ))}
  </ul>
);

// ------- TodoListContainer:

const exportTodoListContainer = () => {
  const getVisibleTodos = (todos, filter) => {
    switch (filter) {
      case FilterTypes.SHOW_ALL:
        return todos;
      case FilterTypes.SHOW_COMPLETED:
        return todos.filter(t => t.completed);
      case FilterTypes.SHOW_ACTIVE:
        return todos.filter(t => !t.completed);
      default:
        // throw new Error("Unknown filter: " + filter);
        return [];
    }
  };

  const mapStateToProps = state => {
    console.log(state);
    return {
      todos: getVisibleTodos(state.todos, state.selectedFilter)
    };
  };

  const mapDispatchToProps = dispatch => {
    // console.log(dispatch);
    const removeTodo = id => {
      console.log("gonna remove todo id:", id);
      dispatch(actions.removeTodoAction(id));
    };

    const toggleTodo = id => {
      console.log("toggle todo id:", id);
      dispatch(actions.toggleTodoAction(id));
    };

    return {
      removeTodo,
      toggleTodo
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoList);
};

const TodoListContainer = exportTodoListContainer();

// FilterLink:
const FilterLink = ({ active, children, onClick }) => (
  <button onClick={onClick} disabled={active} style={{ marginLeft: "4px" }}>
    {children}
  </button>
);

// FilterLinkContainer:
const exportFilterLinkContainer = () => {
  const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.selectedFilter
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(actions.setSelectedFilterAction(ownProps.filter))
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterLink);
};
const FilterLinkContainer = exportFilterLinkContainer();

// Footer:
const Footer = () => (
  <div>
    <span>Show: </span>
    <FilterLinkContainer filter={FilterTypes.SHOW_ALL}>All</FilterLinkContainer>
    <FilterLinkContainer filter={FilterTypes.SHOW_ACTIVE}>Active</FilterLinkContainer>
    <FilterLinkContainer filter={FilterTypes.SHOW_COMPLETED}>Completed</FilterLinkContainer>
  </div>
);

// --------------------------------------- MAIN -------------------------------------------------

const App = () => (
  <div>
    <AddTodoFormContainer />
    <TodoListContainer />
    <Footer />
  </div>
);

const rootReducer = combineReducers({
  todos: reducers.todosReducer,
  selectedFilter: reducers.selectedFilterReducer
});

const store = createStore(rootReducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
