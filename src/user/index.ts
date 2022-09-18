import { Octokit } from "@octokit/rest";
import axios from "axios";
import { USERS_API } from "../api";

export class User {
  private readonly _username: string;
  private readonly _url: string;
  private readonly _name: string = "";
  private readonly _email: string = "";

  constructor(
    username: string,
    url: string,
    name: string = "",
    email: string = ""
  ) {
    this._username = username;
    this._url = url;
    this._name = name;
    this._email = email;
  }

  public get username(): string {
    return this._username;
  }

  public get url(): string {
    return this._url;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }
}

export const connectGithub = async (octokit: Octokit): Promise<User> => {
  return await octokit.users
    .getAuthenticated()
    .then((userInfo) => {
      const user = new User(
        userInfo.data.login,
        userInfo.data.url,
        userInfo.data.name ?? "",
        userInfo.data.email ?? ""
      );
      return saveUser(user);
    })
    .catch();
};

export const saveUser = async (user: User): Promise<User> => {
  return axios
    .post(USERS_API, user)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error: ", err));
};
