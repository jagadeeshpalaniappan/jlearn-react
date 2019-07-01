/*
  React (Multi Selection -suing Keyboard Shortcuts):
  - shiftKey, Todo: ctrlKey, metaKey
*/

import React from "react";
import { render } from "react-dom";
import "./styles.css";

const ListItem = props => {
  const onClick = e => {
    props.onSelect({
      item: props.item,
      keysPressed: { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey }
    });
  };

  return (
    <li className={`jag-li ${props.item.selected ? "selected" : ""}`} onClick={onClick}>
      {props.item.name}
    </li>
  );
};

const items = [];
for (let i = 0; i < 5; i++) {
  items.push({ id: i, name: `Item ${i}`, selected: false, index: i });
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: items
    };
    this.onListItemSelect = this.onListItemSelect.bind(this);
    this.markItemsAsSelected = this.markItemsAsSelected.bind(this);

    this.lastSelectedItem = null;
  }

  markItemsAsSelected(selectedItemsIndex) {
    this.setState(prevState => {
      prevState.items.forEach(item => {
        if (selectedItemsIndex[item.index]) {
          item.selected = true;

          if (Object.keys(selectedItemsIndex).length === 1) {
            this.lastSelectedItem = item;
          }
        } else {
          item.selected = false;
        }
      });
      return prevState;
    });
  }

  shiftForwardSelection(itemsToSelect, startIndex, endIndex) {
    for (let i = startIndex; i <= endIndex; i++) {
      itemsToSelect[i] = true;
    }
  }

  shiftBackwardelection(itemsToSelect, startIndex, endIndex) {
    for (let i = endIndex; i <= startIndex; i++) {
      itemsToSelect[i] = true;
    }
  }

  getAllItemsToSelect(selectedItem) {
    const itemsToSelect = {};
    if (selectedItem.keysPressed.shiftKey) {
      const startIndex = this.lastSelectedItem.index;
      const endIndex = selectedItem.item.index;

      if (this.lastSelectedItem.index < selectedItem.item.index) {
        this.shiftForwardSelection(itemsToSelect, startIndex, endIndex);
      } else if (this.lastSelectedItem.index > selectedItem.item.index) {
        this.shiftBackwardelection(itemsToSelect, startIndex, endIndex);
      }
    } else {
      itemsToSelect[selectedItem.item.index] = true;
    }

    return itemsToSelect;
  }

  onListItemSelect(selectedItem) {
    const itemsToSelect = this.getAllItemsToSelect(selectedItem);
    this.markItemsAsSelected(itemsToSelect);
  }

  render() {
    return (
      <ul>
        {this.state.items.map(item => (
          <ListItem key={item.id} item={item} onSelect={this.onListItemSelect} />
        ))}
      </ul>
    );
  }
}

const App = () => <List />;

render(<App />, document.getElementById("root"));
