import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasksList, setTasksList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [overline, setOverline] = useState(false);
  const [taskDetail, setTaskDetail] = useState([]);

  useEffect(() => {
    loadData(1);
  }, []);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const selectAsComplete = (task) => {
    console.log(taskDetail);
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
          <td>
            <button
              type="button"
              className="btn btn-danger delete-button"
              onClick={() => deleteTask(tasksList[i]._id)}
            >
              <img
                className="delete-icon"
                width="10px"
                height="10px"
                alt="delete icon"
                src="https://www.flaticon.com/svg/vstatic/svg/3096/3096673.svg?token=exp=1620930418~hmac=6cf7e82f2391b78faf55a57d174c9c1d"
              ></img>
            </button>

            <button
              type="button"
              className="btn btn-success complete-button"
              onClick={() => selectAsComplete(tasksList[i])}
            >
              <img
                className="complete-icon"
                width="10px"
                height="10px"
                alt="check icon"
                src="https://www.flaticon.com/svg/vstatic/svg/860/860798.svg?token=exp=1620931221~hmac=6070ef761136aa2375b6adf8553c7040"
              ></img>
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
