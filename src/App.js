import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Title } from "./components/Title";
import { Form } from "./components/Form";
import { ListArea } from "./components/ListArea";
import { useEffect, useState } from "react";
import {
  fetchAllTask,
  postTask,
  updateTask,
  deleteTask,
} from "./helpers/axiosHelpers";

const herPerWek = 7 * 24;

function App() {
  const [taskList, setTaskList] = useState([]);
  const [itmToDelete, setItmToDelete] = useState([]);
  const [response, setResponse] = useState({});
  const [IsAllSelected, setIsAllSelected] = useState(false);
  let [check, strchecked] = useState("false");
  console.log(check);

  const totalHrs = taskList.reduce((subTtl, item) => subTtl + +item.hr, 0);

  useEffect(() => {
    getTasks();
  }, []);

  var ele = document.getElementsByName("chk");

  // call axios to feth all data
  const getTasks = async () => {
    const { status, tasks } = await fetchAllTask();
    status === "success" && setTaskList(tasks);
  };

  const addTask = async (data) => {
    if (herPerWek < totalHrs + +data.hr) {
      return alert("Boss, you don't ecought time, sorry la");
    }
    // send data to the api
    const result = await postTask(data);
    console.log(result);

    result?.status === "success" && getTasks();
    setResponse(result);
  };

  const switchTask = async (_id, type) => {
    const result = await updateTask({ _id, type });
    setResponse(result);

    result?.status === "success" && getTasks();
  };

  const handleOnSelect = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setItmToDelete([...itmToDelete, value]);
      setIsAllSelected(taskList.length === itmToDelete.length + 1);
    } else {
      setItmToDelete(itmToDelete.filter((item) => item !== value));
      setIsAllSelected(false);
    }
  };

  const handleOnSelectAll = (e) => {
    const { checked } = e.target;

    if (checked) {
      setIsAllSelected(true);
      setItmToDelete(taskList.map(({ _id }) => _id));
    } else {
      setItmToDelete([]);
      setIsAllSelected(false);
    }
    // console.log(e);
  };

  const handleOnDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }

    const result = await deleteTask(itmToDelete);
    setResponse(result);
    // setTaskList(taskList.filter((item) => !itmToDelete.includes(item._id)));
    setItmToDelete([]);
    result?.status === "success" && getTasks();
  };

  return (
    <div className="wrapper">
      <div className="container">
        <Title />

        {response.message && (
          <div
            className={
              response.status === "success"
                ? "alert alert-success"
                : "alert alert-danger"
            }
          >
            {response.message}
          </div>
        )}
        <Form addTask={addTask} name="Sam" />

        <ListArea
          taskList={taskList}
          switchTask={switchTask}
          handleOnSelect={handleOnSelect}
          itmToDelete={itmToDelete}
          ele={ele}
        />
        {taskList.length ? (
          <div className="fw-bolder py-4">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={handleOnSelectAll}
              checked={IsAllSelected}
            />
            <label htmlFor="">Select All The task</label>
          </div>
        ) : null}

        <div className="row fw-bold">
          <div className="col">
            The total hours allocated = {totalHrs}
            Hrs
          </div>
        </div>
        {itmToDelete.length > 0 && (
          <div className="d-grid g-2">
            <button onClick={handleOnDelete} className="btn btn-danger">
              Delete selected {itmToDelete.length} Task(s)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
