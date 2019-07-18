import React from "react";
import Note from "../Note/Note";
import "./NotePageMain.css";
import ApiContext from "../ApiContext";
import { findNote } from "../notes-helpers";

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  };
  static contextType = ApiContext;

  handleDeleteNote = () => {
    this.props.history.push("/");
  };
  render() {
    const { notes = [] } = this.context;
    const { noteid } = this.props.match.params;
    const note = findNote(notes, noteid) || { content: "" };

    return (
      <section className="NotePageMain">
        <Note
          noteid={note.noteid}
          name={note.title}
          modified={note.date_published}
          onDeleteNote={this.handleDeleteNote}
        />
        <div className="NotePageMain__content">
          {note.content.split(/\n \r|\n/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>
    );
  }
}
