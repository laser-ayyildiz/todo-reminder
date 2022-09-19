import { Octokit } from "@octokit/rest";
import axios from "axios";
import { USERS_API } from "../api";
import { window } from "vscode";

export class User {
  public readonly username: string;
  public readonly url: string;
  public readonly name: string = "";
  public readonly email: string = "";

  constructor(
    username: string,
    url: string,
    name: string = "",
    email: string = ""
  ) {
    this.username = username;
    this.url = url;
    this.name = name;
    this.email = email;
  }
}

export const connectGithub = async (octokit: Octokit): Promise<User> => {
  return await octokit.users
    .getAuthenticated()
    .then((userInfo) => {
      return new User(
        userInfo.data.login,
        userInfo.data.url,
        userInfo.data.name ?? "",
        userInfo.data.email ?? ""
      );
    })
    .catch((err) => {
      window.showErrorMessage(
        "I could not recognize you. Can i access your GitHub :)"
      );
      throw new Error(err.response);
    });
};

export const saveUser = async (user: User): Promise<User> => {
  return axios
    .post(USERS_API, user)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error: ", err));
};
