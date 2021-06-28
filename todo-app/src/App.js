import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasksList, setTasksList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    loadData(1);
  }, []);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const selectAsComplete = (task) => {
    console.log(task);
    task.overline = !task.overline;
    addOrUpdateTask(task);
  };

  const addOrUpdateTask = async (task) => {
    if (task && task._id) {
      await axios.put("http://localhost:3001/update", task);
    } else {
      await axios.post("http://localhost:3001/insert", {
        name: inputValue,
        overline: false,
      });
    }
    setInputValue("");
    loadData(currentPage);
  };

  const userInput = (event) => {
    setInputValue(event.target.value);
  };

  const loadData = async (page) => {
    setTasksList([]);
    let url = `http://localhost:3001/read?page=${page}`;

    await axios.get(url).then((response) => {
      setTasksList(response.data.data);
      setTotalPages(response.data.pages);
    });
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3001/delete/${id}`);
    loadData(currentPage);
    setInputValue("");
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const generateTable = () => {
    const table = [];

    for (let i = 0; i < tasksList.length; i++) {
      table.push(
        <tr key={tasksList[i]._id}>
          <td className={tasksList[i].overline ? "is-complete" : ""}>
            {5 * (currentPage - 1) + (i + 1)}
          </td>
          <td className={tasksList[i].overline ? "is-complete" : ""}>
            {tasksList[i].name}
          </td>
          <td className="buttons-container">
            <button
              type="button"
              className="btn btn-danger delete-button"
              onClick={() => deleteTask(tasksList[i]._id)}
            >
              <ion-icon name="trash-outline"></ion-icon>
            </button>

            <button
              type="button"
              className="btn btn-success complete-button"
              onClick={() => selectAsComplete(tasksList[i])}
            >
              <ion-icon name="checkmark-done-outline"></ion-icon>
            </button>
          </td>
        </tr>
      );
    }
    return table;
  };

  return (
    <div className="container todoMainApp">
      <h1 className="headTitle">Todo App</h1>
      <div className="input-group">
        <input
          type="text"
          className="form-control task-input"
          name="name"
          value={inputValue}
          aria-label="Text input with segmented dropdown button"
          onChange={userInput}
        />

        <button
          type="submit"
          className="btn btn-outline-light submit-button"
          onClick={() => addOrUpdateTask()}
        >
          Add Task
        </button>
      </div>
      {tasksList.length ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{generateTable()}</tbody>
        </table>
      ) : (
        " "
      )}

      {tasksList.length ? (
        <div className="pagination-container">
          <button
            className="btn btn-outline-light pagination-buttons"
            disabled={currentPage === 1}
            onClick={() => previousPage()}
          >
            {"<"}
          </button>
          <button
            className="btn btn-outline-light pagination-buttons current-page"
            disabled
          >
            {currentPage}
          </button>
          <button
            className="btn btn-outline-light pagination-buttons"
            disabled={currentPage === totalPages}
            onClick={() => nextPage()}
          >
            {">"}
          </button>
        </div>
      ) : (
        " "
      )}
    </div>
  );
}

export default App;
