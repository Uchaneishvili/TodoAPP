import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Pagination from "./Components/Pagination";

function App() {
  const [tasksList, setTasksList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isCompleted, setIsCompleted] = useState({
    activeObject: false,
  });
  const [pages, setPages] = useState();
  const [showTable, setshowTable] = useState(false);

  useEffect(() => {
    if (tasksList.length < 1) {
      return setshowTable(false);
    } else {
      return setshowTable(true);
    }
  }, [tasksList.length]);

  useEffect(() => {
    loadData(1);
  }, []);

  const selectAsComplete = () => {
    setIsCompleted({ ...isCompleted, activeObject: true });
  };

  const addOrUpdateTask = async () => {
    await axios.post("http://localhost:3001/insert", {
      name: inputValue,
    });
    setInputValue("");
    loadData(1);
  };

  const userInput = (event) => {
    setInputValue(event.target.value);
  };

  const loadData = async (page) => {
    let url = `http://localhost:3001/read?page=${page}`;

    await axios.get(url).then((response) => {
      setTasksList(response.data.data);
      setPages(response.data.pages);
    });
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3001/delete/${id}`);
    loadData(1);
    setInputValue("");
  };

  const generateTable = () => {
    const table = [];
    const names = tasksList.map((task) => task.name);

    for (let i = 0; i < tasksList.length; i++) {
      table.push(
        <tr key={tasksList[i]._id}>
          <td className={isCompleted.activeObject ? "is-complete" : ""}>
            {i + 1}
          </td>
          <td className={isCompleted.activeObject ? "is-complete" : ""}>
            {names[i]}
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
              onClick={() => selectAsComplete()}
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
      {showTable ? (
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
      <Pagination />
    </div>
  );
}

export default App;
