import React from "react";
import propTypes from "prop-types";

export default function ValidationError(props) {
  if (props.hasError) {
    return <div className="error">{props.message}</div>;
  }

  return <></>;
}

ValidationError.propTypes = {
  hasError: propTypes.bool,
  message: propTypes.string
};
