import {
  Comment,
  CommentAuthorInformation,
  CommentMode,
  CommentReply,
  MarkdownString,
  window,
} from "vscode";
import { createTodo, Todo } from "../todo";
import { User } from "../user";

let commentId = 1;

export class CommentPopup implements Comment {
  id: number;
  label: string | undefined;
  savedBody: string | MarkdownString;
  constructor(
    public body: string | MarkdownString,
    public mode: CommentMode,
    public author: CommentAuthorInformation
  ) {
    this.id = ++commentId;
    this.savedBody = this.body;
  }
}

export const replyNote = async (reply: CommentReply, user: User) => {
  const thread = reply.thread;

  const newReminder = new CommentPopup(reply.text, CommentMode.Preview, {
    name: user.username,
  });

  const todo: Todo = {
    body: reply.text,
    project: "todo-reminder",
    filePath: "src/extension.ts",
    line: reply.thread.range.start.line,
    username: user.username,
  };

  const isTodoCreated = await createTodo(todo);

  if (isTodoCreated) {
    window.showInformationMessage(
      "Be cool, i gotcha. I will remind you this todo ◝(ᵔᵕᵔ)◜"
    );
  } else {
    window.showErrorMessage(
      "Hey dude i have a problem 🥺 if you update me maybe i can solve the problem 🤔"
    );
    return false;
  }

  thread.comments = [newReminder];
};
