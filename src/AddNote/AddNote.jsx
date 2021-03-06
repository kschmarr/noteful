import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import "./AddNote.css";
import ApiContext from "../ApiContext";
import config from "../config";

class AddNote extends Component {
  static defaultProps = {
    folders: [],
    history: {
      push: () => {}
    }
  };
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      nameValid: false,
      contentValid: false,
      folderIdValid: false,
      content: "",
      folderid: "",
      validationMessages: {
        title: "",
        content: "",
        folderid: ""
      }
    };
  }

  updateContent(content) {
    this.setState({ content });
  }
  updateFolderId(folderid) {
    this.setState({ folderid });
  }

  validateName(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;
    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        hasError = true;
      } else {
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError,
      title: fieldValue
    });
  }
  validateContent(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;
    if (fieldValue.trim().length === 0) {
      hasError = true;
    } else {
      if (fieldValue.trim().length < 3) {
        hasError = true;
      } else {
        hasError = false;
      }
    }

    this.setState({
      validationMessages: { ...fieldErrors },
      contentValid: !hasError,
      content: fieldValue
    });
  }
  validateFolderId(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;
    if (fieldValue.length === "" || fieldValue.length === "...") {
      hasError = true;
    } else {
      hasError = false;
    }
    this.setState({
      validationMessages: { ...fieldErrors },
      folderIdValid: !hasError,
      folderid: fieldValue
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { title, content, folderid } = this.state;
    const newNote = {
      title: title,
      content: content,
      folderid: folderid,
      date_modified: new Date()
    };

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newNote)
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.context.addNote(data[0]);
      })
      .then(data => {
        this.props.history.push(`/`);
        return data;
      })

      .catch(error => {
        console.error({ error });
      });
  };

  render() {
    const { folders = [] } = this.context;
    const { nameValid, contentValid, folderIdValid } = this.state;
    return (
      <section className="AddNote">
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="note-name-input">Name</label>
            <input
              type="text"
              id="note-name-input"
              name="note-name-input"
              onChange={e => this.validateName(e.target.value)}
              value={this.state.title}
            />
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea
              content="note-content-input"
              name="note-content-input"
              onChange={e => this.validateContent(e.target.value)}
              value={this.state.content}
            />
          </div>
          <div className="field">
            <label htmlFor="note-folder-select">Folder</label>
            <select
              folderid="note-folder-select"
              onChange={e => this.validateFolderId(e.target.value)}
            >
              <option value={null}>...</option>
              {folders.map(folder => (
                <option key={folder.folderid} value={folder.folderid}>
                  {folder.title}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button
              type="submit"
              disabled={!nameValid || !contentValid || !folderIdValid}
            >
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

export default AddNote;
