import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="error">
      <h1>Opps ! Error</h1>
      <Link to="/">Back to home page</Link>
    </div>
  );
};

export default Error;
