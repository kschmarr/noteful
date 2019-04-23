import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import AddFolder from "../AddFolder/AddFolder";
import AddNote from "../AddNote/AddNote";
import dummyStore from "../dummy-store";
import { getNotesForFolder, findNote, findFolder } from "../notes-helpers";
import "./App.css";
import ApiContext from "../ApiContext";
import config from "../config";

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
        {["/", "/folder/:folderId"].map(path => (
          <Route
            exact
            key={path}
            path={path}
            // render={routeProps => (
            //   <NoteListNav folders={folders} notes={notes} {...routeProps} />
            // )}
            component={NoteListNav}
          />
        ))}
        <Route
          path="/note/:noteId"
          // render={routeProps => {
          //   const { noteId } = routeProps.match.params;
          //   const note = findNote(notes, noteId) || {};
          //   const folder = findFolder(folders, note.folderId);
          //   return <NotePageNav {...routeProps} folder={folder} />;
          // }}
          component={NotePageNav}
        />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    // const { notes, folders } = this.state;
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route
            exact
            key={path}
            path={path}
            // render={routeProps => {
            //   const { folderId } = routeProps.match.params;
            //   const notesForFolder = getNotesForFolder(notes, folderId);
            //   return <NoteListMain {...routeProps} notes={notesForFolder} />;
            // }}
            component={NoteListMain}
          />
        ))}
        <Route
          path="/note/:noteId"
          // render={routeProps => {
          //   const { noteId } = routeProps.match.params;
          //   const note = findNote(notes, noteId);
          //   return <NotePageMain {...routeProps} note={note} />;
          // }}
          component={NotePageMain}
        />
        <Route path="/add-folder" component={AddFolder} />
        <Route
          path="/add-note"
          // render={routeProps => {
          //   return <AddNote {...routeProps} folder={folders} />;
          // }}
          component={AddNote}
        />
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
