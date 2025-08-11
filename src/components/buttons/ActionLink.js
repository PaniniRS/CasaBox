import React from "react";
import "./ActionLink.css";

const ActionLink = ({ onClick, children, variant = "primary" }) => {
  return (
    <button onClick={onClick} className={`action-link-btn ${variant}`}>
      {children}
    </button>
  );
};

export default ActionLink;
