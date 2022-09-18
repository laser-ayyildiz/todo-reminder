import axios from "axios";
import { TODOS_API } from "../api";

export type Todo = {
  body: string;
  project: string;
  filePath: string;
  line: number;
  username: string;
};

export const createTodo = async (todo: Todo) => {
  return axios
    .post(TODOS_API, todo)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error: ", err));
};
