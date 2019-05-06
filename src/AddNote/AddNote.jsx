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
      noteName: "",
      nameValid: false,
      content: "",
      folderId: "",
      validationMessages: {
        noteName: "",
        content: "",
        folderId: ""
      }
    };
  }

  updateNoteName(noteName) {
    this.setState({ noteName });
  }
  updateContent(content) {
    this.setState({ content });
  }
  updateFolderId(folderId) {
    this.setState({ folderId });
  }

  addNote(noteName) {
    this.setState({ noteName });
  }

  validateName(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;
    console.log(fieldValue);
    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.noteName = "Name is required";
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.noteName = "Name must be at least 3 characters long";
        hasError = true;
      } else {
        fieldErrors.noteName = "";
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const newNote = {
      name: e.target["note-name-input"].value,
      content: e.target["note-content-input"].value,
      folderId: e.target["note-folder-select"].value,
      modified: new Date()
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
      .then(note => {
        this.addNote(note);
        this.props.history.push(`/`);
      })
      .catch(error => {
        console.error({ error });
      });
  };

  render() {
    const { folders = [] } = this.context;

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
              required
              onChange={e => this.validateName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea
              id="note-content-input"
              name="note-content-input"
              required
              onChange={e => this.updateContent(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="note-folder-select">Folder</label>
            <select
              id="note-folder-select"
              required
              onChange={e => this.updateFolderId(e.target.value)}
            >
              <option value={null}>...</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button type="submit" disabled={!this.state.nameValid}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

export default AddNote;
