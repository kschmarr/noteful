import React from "react";
import { Link } from "react-router-dom";
import Note from "../Note/Note";
import CircleButton from "../CircleButton/CircleButton";
import "./NoteListMain.css";
import ApiContext from "../ApiContext";
import { getNotesForFolder } from "../notes-helpers";
import config from "../config";

export default class NoteListMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      folders: []
    };
  }
  static defaultProps = {
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
    const { folderid } = this.props.match.params;
    const { notes = [] } = this.state;
    const notesForFolder = getNotesForFolder(notes, folderid);

    return (
      <section className="NoteListMain">
        <ul>
          {notesForFolder.map(note => (
            <li key={note.noteid}>
              <Note
                noteid={Number(note.noteid)}
                name={note.title}
                modified={note.date_published}
              />
            </li>
          ))}
        </ul>
        <div className="NoteListMain__button-container">
          <CircleButton
            tag={Link}
            to="/add-note"
            type="button"
            className="NoteListMain__add-note-button"
          >
            Add Note
          </CircleButton>
        </div>
      </section>
    );
  }
}
