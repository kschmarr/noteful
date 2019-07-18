import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import "./AddFolder.css";
import ApiContext from "../ApiContext";
import config from "../config";
import ValidationError from "./ValidationError";

class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => {}
    }
  };
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameValid: false,
      validationMessages: {
        name: ""
      }
    };
  }

  validateName(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;
    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.name = "Name is required";
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.name = "Name must be at least 3 characters long";
        hasError = true;
      } else {
        fieldErrors.name = "";
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError,
      name: fieldValue
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { name } = this.state;

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ title: name })
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
        return res.json();
      })
      .then(() => this.context.AddFolder(name))

      .then(() => {
        return this.setState({ name: "" });
      })
      .then(() => this.props.history.push(`/`))

      .catch(error => {
        console.error({ error });
      });
  };

  render() {
    return (
      <section className="AddFolder">
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="folder-name-input">Name</label>
            <input
              type="text"
              id="folder-name-input"
              name="folder-name"
              onChange={e => this.validateName(e.target.value)}
              required
            />
            <ValidationError
              hasError={!this.state.nameValid}
              message={this.state.validationMessages.name}
            />
          </div>
          <div className="buttons">
            <button type="submit" disabled={!this.state.nameValid}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

export default AddFolder;
