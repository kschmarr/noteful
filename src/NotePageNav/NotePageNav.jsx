import React from "react";
import CircleButton from "../CircleButton/CircleButton";
import "./NotePageNav.css";
import ApiContext from "../ApiContext";
import { findNote, findFolder } from "../notes-helpers";
import config from "../config";

export default class NotePageNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      folders: []
    };
  }
  static defaultProps = {
    history: {
      goBack: () => {}
    },
    match: {
      params: {}
    }
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
  static contextType = ApiContext;

  render() {
    const { notes, folders } = this.state;
    const { noteId } = this.props.match.params;
    const note = findNote(notes, noteId) || {};
    const folder = findFolder(folders, note.folderId);
    return (
      <div className="NotePageNav">
        <CircleButton
          tag="button"
          role="link"
          onClick={() => this.props.history.goBack()}
          className="NotePageNav__back-button"
        >
          Back
        </CircleButton>

        {folder && <h3 className="NotePageNav__folder-name">{folder.title}</h3>}
      </div>
    );
  }
}
