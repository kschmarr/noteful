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
      folderName: "",
      nameValid: false,
      validationMessages: {
        folderName: ""
      }
    };
    // this.context.addFolder(folder);
  }

  validateName(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;

    // fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.folderName = "Name is required";
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.folderName = "Name must be at least 3 characters long";
        hasError = true;
      } else {
        fieldErrors.folderName = "";
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    });
  }

  addFolder(folderName) {
    this.setState({ folderName }, () => {
      this.validateName(folderName);
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const folder = {
      name: e.target["folder-name"].value
    };

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(folder)
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
        return res.json();
      })
      .then(folder => {
        this.addFolder(folder);
        this.props.history.push(`/`);
      })
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
              onChange={e => this.addFolder(e.target.value)}
            />
            <ValidationError
              hasError={!this.state.nameValid}
              message={this.state.validationMessages.folderName}
            />
          </div>
          <div className="buttons">
            <button type="submit">Add folder</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

export default AddFolder;
