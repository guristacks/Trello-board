import React from "react";
import "./card.css";

const Card = React.memo(function Card({
  card,
  onDelete,
  onEdit,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  columnIndex,
}) {
  console.log("Card Rendered:", card.title);

  return (
    <div className="card">
      <h4>{card.title}</h4>

      <div className="btnGroup">
        <button className="up" onClick={() => moveUp(columnIndex, card.id)}>
          up
        </button>
        <button className="down" onClick={() => moveDown(columnIndex, card.id)}>
          down
        </button>
        <button className="left" onClick={() => moveLeft(columnIndex, card.id)}>
          left
        </button>
        <button className="right" onClick={() => moveRight(columnIndex, card.id)}>
          right
        </button>
      </div>

      <div className="btnGroup">
        <button className="edit" onClick={() => onEdit(columnIndex, card.id)}>
          Edit
        </button>
        <button className="dlt" onClick={() => onDelete(columnIndex, card.id)}>
          Delete
        </button>
      </div>
    </div>
  );
});

export default Card;
