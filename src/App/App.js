import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import AddFolder from "../AddFolder/AddFolder";
import AddNote from "../AddNote/AddNote";
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

  handleAddFolder = newFolder => {
    this.setState({ folders: [...this.state.folders, newFolder] });
  };

  handleDeleteNote = noteid => {
    this.setState({
      notes: this.state.notes.filter(note => note.noteid !== noteid)
    });
  };

  renderNavRoutes() {
    return (
      <>
        <Error>
          {["/", "/folder/:folderid"].map(path => (
            <Route exact key={path} path={path} component={NoteListNav} />
          ))}
        </Error>
        <Error>
          <Route path="/note/:noteid" component={NotePageNav} />
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
    return (
      <>
        {["/", "/folder/:folderid"].map(path => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/note/:noteid" component={NotePageMain} />
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
      deleteNote: this.handleDeleteNote,
      mountWithFolder: this.handleMountWithFolder
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
