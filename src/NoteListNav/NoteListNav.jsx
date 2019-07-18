import React from "react";
import { NavLink, Link } from "react-router-dom";
import CircleButton from "../CircleButton/CircleButton";
import { countNotesForFolder } from "../notes-helpers";
import "./NoteListNav.css";
import ApiContext from "../ApiContext";

export default class NoteListNav extends React.Component {
  static contextType = ApiContext;
  render() {
    const { folders = [], notes = [] } = this.context;
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
