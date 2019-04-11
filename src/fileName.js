import React, { Component } from "react";
import swal from "sweetalert";
const DEFAULT_INPUT_TEXT = "";

export default class MyInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: DEFAULT_INPUT_TEXT
    };
  }
  changeText(e) {
    let text = e.target.value;
    this.setState({
      text
    });
    swal.setActionValue(text);
  }

  render() {
    return (
      <input value={this.state.text} onChange={this.changeText.bind(this)} />
    );
  }
}
