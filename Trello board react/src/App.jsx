import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Card from "./card.jsx";
import "./App.css";

const initialBoard = [
  { id: uuid(), name: "Todo", cards: [], newTask: "" },
  { id: uuid(), name: "Doing", cards: [], newTask: "" },
  { id: uuid(), name: "Done", cards: [], newTask: "" },
];

export default function App() {
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem("kanbanBoard");
    return saved ? JSON.parse(saved) : initialBoard;
  });

  const [showModal, setShowModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("kanbanBoard", JSON.stringify(board));
  }, [board]);

  // Add Card
  const addCard = (columnIndex, title) => {
    if (!title.trim()) return;

    const newBoard = [...board];
    newBoard[columnIndex].cards.push({
      id: uuid(),
      title,
    });

    newBoard[columnIndex].newTask = "";
    setBoard(newBoard);
  };

  // Delete Card
  const deleteCard = (colIndex, cardId) => {
    const newBoard = [...board];
    newBoard[colIndex].cards = newBoard[colIndex].cards.filter(
      (c) => c.id !== cardId
    );
    setBoard(newBoard);
  };

  // Edit Card
  const editCard = (colIndex, cardId) => {
    const newTitle = prompt("Edit title");
    if (!newTitle) return;

    const newBoard = [...board];
    const card = newBoard[colIndex].cards.find((c) => c.id === cardId);
    card.title = newTitle;

    setBoard(newBoard);
  };

  // Move Card Left / Right
  const moveCardHorizontal = (colIndex, cardId, direction) => {
    const newBoard = [...board];
    const cardIndex = newBoard[colIndex].cards.findIndex(
      (c) => c.id === cardId
    );

    const [card] = newBoard[colIndex].cards.splice(cardIndex, 1);

    const newCol = colIndex + direction;
    if (newCol < 0 || newCol >= newBoard.length) return;

    newBoard[newCol].cards.push(card);
    setBoard(newBoard);
  };

  // Move Card Up / Down
  const moveCardVertical = (colIndex, cardId, direction) => {
    const newBoard = [...board];
    const cards = newBoard[colIndex].cards;
    const index = cards.findIndex((c) => c.id === cardId);

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= cards.length) return;

    [cards[index], cards[newIndex]] = [cards[newIndex], cards[index]];
    setBoard(newBoard);
  };

  // Clear Board
  const clearBoard = () => {
    setBoard(initialBoard);
    setShowModal(false);
  };

  // Add Column (Modal based)
  const addColumn = () => {
    if (!newColumnTitle.trim()) return;

    setBoard((prevBoard) => [
      ...prevBoard,
      {
        id: uuid(),
        name: newColumnTitle,
        cards: [],
        newTask: "",
      },
    ]);

    setNewColumnTitle("");
    setShowColumnModal(false);
  };

  return (
    <div className="container">
      <h2>Kanban Board</h2>

      <div className="board">
        {board.map((column, colIndex) => (
          <div key={column.id} className="column">
            <h3>{column.name}</h3>

            <div className="addTaskBox">
              <input
                type="text"
                placeholder="Enter task..."
                value={column.newTask}
                onChange={(e) => {
                  const newBoard = [...board];
                  newBoard[colIndex].newTask = e.target.value;
                  setBoard(newBoard);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCard(colIndex, column.newTask);
                  }
                }}
              />

              <button
                className="small-btn"
                onClick={() => addCard(colIndex, column.newTask)}
              >
                + Add
              </button>
            </div>

            {column.cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                columnIndex={colIndex}
                onDelete={deleteCard}
                onEdit={editCard}
                moveLeft={(col, id) =>
                  moveCardHorizontal(col, id, -1)
                }
                moveRight={(col, id) =>
                  moveCardHorizontal(col, id, 1)
                }
                moveUp={(col, id) =>
                  moveCardVertical(col, id, -1)
                }
                moveDown={(col, id) =>
                  moveCardVertical(col, id, 1)
                }
              />
            ))}
          </div>
        ))}
      </div>

      <div className="boardActions">
        <button className="clearBtn" onClick={() => setShowModal(true)}>
          Clear Board
        </button>

        <button
          className="addColumnBtn"
          onClick={() => setShowColumnModal(true)}
        >
          Add Column
        </button>
      </div>

      {/* Clear Board Modal */}
      {showModal && (
        <div className="modal">
          <div className="modalContent">
            <p>Are you sure you want to clear the board?</p>
            <button onClick={clearBoard}>Yes</button>
            <button onClick={() => setShowModal(false)}>No</button>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {showColumnModal && (
        <div className="modal">
          <div className="modalContent">
            <h3>Add New Column</h3>

            <input
              type="text"
              placeholder="Enter column title"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={addColumn}>Add</button>
              <button onClick={() => setShowColumnModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
