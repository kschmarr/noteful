import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import AddFolder from "../AddFolder/AddFolder";
import AddNote from "../AddNote/AddNote";
// import dummyStore from "../dummy-store";
// import { getNotesForFolder, findNote, findFolder } from "../notes-helpers";
import "./App.css";
import ApiContext from "../ApiContext";
import config from "../config";
import Error from "./Error";

class App extends Component {
  state = {
    notes: [],
    folders: []
  };

  componentDidMount() {
    // setTimeout(() => this.setState(dummyStore), 600);
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`)
    ])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok) return notesRes.json().then(e => Promise.reject(e));
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e));

        return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders });
      })
      .catch(error => {
        console.error({ error });
      });
  }

  handleAddNote = note => {
    this.setState({
      notes: [...this.state.notes, note]
    });
  };

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };

  renderNavRoutes() {
    // const { notes, folders } = this.state;
    return (
      <>
        <Error>
          {["/", "/folder/:folderId"].map(path => (
            <Route exact key={path} path={path} component={NoteListNav} />
          ))}
        </Error>
        <Error>
          <Route path="/note/:noteId" component={NotePageNav} />
        </Error>
        <Error>
          <Route path="/add-folder" component={NotePageNav} />
        </Error>
        <Error>
          <Route path="/add-note" component={NotePageNav} />
        </Error>
      </>
    );
  }

  renderMainRoutes() {
    // const { notes, folders } = this.state;
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/note/:noteId" component={NotePageMain} />
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note" component={AddNote} />
      </>
    );
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      AddFolder: this.handleAddFolder,
      AddNote: this.handleAddNote,
      deleteNote: this.handleDeleteNote
    };
    return (
      <ApiContext.Provider value={value}>
        <div className="App">
          <nav className="App__nav">{this.renderNavRoutes()}</nav>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>
            </h1>
          </header>
          <main className="App__main">{this.renderMainRoutes()}</main>
        </div>
      </ApiContext.Provider>
    );
  }
}

export default App;
