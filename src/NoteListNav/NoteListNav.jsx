import React from "react";
import { NavLink, Link } from "react-router-dom";
import CircleButton from "../CircleButton/CircleButton";
import { countNotesForFolder } from "../notes-helpers";
import "./NoteListNav.css";
import ApiContext from "../ApiContext";
import config from "../config";

export default class NoteListNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      folders: []
    };
  }
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
    const { folders, notes } = this.state;
    return (
      <div className="NoteListNav">
        <ul className="NoteListNav__list">
          {folders.map(folder => (
            <li key={folder.folderid}>
              <NavLink
                className="NoteListNav__folder-link"
                to={`/folder/${folder.folderid}`}
              >
                <span className="NoteListNav__num-notes">
                  {countNotesForFolder(notes, folder.folderid)}
                </span>
                {folder.title}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="NoteListNav__button-wrapper">
          <CircleButton
            tag={Link}
            to="/add-folder"
            type="button"
            className="NoteListNav__add-folder-button"
          >
            Add Folder
          </CircleButton>
        </div>
      </div>
    );
  }
}
