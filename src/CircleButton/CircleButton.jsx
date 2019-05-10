import React from "react";
import "./CircleButton.css";
import propTypes from "prop-types";

export default function NavCircleButton(props) {
  const { tag, className, children, ...otherProps } = props;

  return React.createElement(
    tag,
    {
      className: ["NavCircleButton", className].join(" "),
      ...otherProps
    },
    children
  );
}

NavCircleButton.propTypes = {
  Link: propTypes.object,
  className: propTypes.string,
  to: propTypes.string,
  type: propTypes.string
};
