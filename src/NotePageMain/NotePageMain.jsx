import React from "react";
import Note from "../Note/Note";
import "./NotePageMain.css";
import ApiContext from "../ApiContext";
import { findNote } from "../notes-helpers";
import { withRouter } from "react-router-dom";
import config from "../config";
class NotePageMain extends React.Component {
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
    },
    history: {
      push: () => {}
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
    const { notes = [] } = this.state;
    const { noteid } = this.props.match.params;
    const note = findNote(notes, noteid) || { content: "" };
    return (
      <section className="NotePageMain">
        <Note
          noteid={Number(note.noteid)}
          name={note.title}
          modified={note.date_published}
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
export default withRouter(NotePageMain);
