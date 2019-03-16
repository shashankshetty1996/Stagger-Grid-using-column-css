import React from "react";
import PropTypes from "prop-types";

const Card = props => {
  const { title, url, body } = props;
  return (
    <div className="card">
      <div className="card-header">
        {props.index} | {title}
      </div>
      <div className="card-content">
        {url && <img src={url} alt="" />}
        <p>{body}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  data: PropTypes.object
};

Card.defaultProps = {
  data: { title: "Card Title missing", body: "no data found", url: null }
};

export default Card;
