import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import "./Note.css";
import ApiContext from "../ApiContext";
import config from "../config";
import propTypes from "prop-types";

export default class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false
    };
  }
  static defaultProps = {
    history: {
      push: () => {}
    },
    onDeleteNote: () => {}
  };
  static contextType = ApiContext;

  handleClickDelete = e => {
    e.preventDefault();
    const noteid = this.props.noteid;
    fetch(`${config.API_ENDPOINT}/notes/${noteid}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(e => Promise.reject(e));
        }
        return res.json();
      })
      .then(data => {
        this.context.deleteNote(noteid);
        this.props.onDeleteNote(noteid);
      })
      .then(() => {
        this.setState({
          changed: true ? false : true
        });
      })
      .then(() => this.props.history.push("/"))
      .catch(error => {
        console.error({ error });
      });
  };
  render() {
    const { name, noteid, modified } = this.props;
    return (
      <div className="Note">
        <h2 className="Note__title">
          <Link to={`/note/${noteid}`}>{name}</Link>
        </h2>
        <button
          className="Note__delete"
          type="button"
          onClick={this.handleClickDelete}
        >
          Remove
        </button>
        <div className="Note__dates">
          <div className="Note__dates-modified">
            Modified{" "}
            <span className="Date">{format(modified, "Do MMM YYYY")}</span>
          </div>
        </div>
      </div>
    );
  }
}

Note.propTypes = {
  noteid: propTypes.number,
  name: propTypes.string,
  modified: propTypes.string,
  onDeleteNote: propTypes.func
};
