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
    this.noteNameInput = React.createRef();
    this.noteContentInput = React.createRef();
    this.noteFolderSelect = React.createRef();
  }

  handleSubmit = e => {
    e.preventDefault();
    const newNote = {
      name: this.noteNameInput.current.value,
      content: this.noteContentInput.current.value,
      folderId: this.noteFolderSelect.current.value,
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
        this.context.addNote(note);
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
              ref={this.noteNameInput}
            />
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea
              id="note-content-input"
              name="note-content-input"
              ref={this.noteContentInput}
            />
          </div>
          <div className="field">
            <label htmlFor="note-folder-select">Folder</label>
            <select id="note-folder-select" ref={this.noteFolderSelect}>
              <option value={null}>...</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button type="submit">Add note</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

export default AddNote;
