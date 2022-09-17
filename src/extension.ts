"use strict";

import axios from "axios";
import * as vscode from "vscode";

let commentId = 1000;

type Todo = {
  body: string;
  project: string;
  filePath: string;
  line: number;
};

class NoteComment implements vscode.Comment {
  id: number;
  label: string | undefined;
  savedBody: string | vscode.MarkdownString; // for the Cancel button
  constructor(
    public body: string | vscode.MarkdownString,
    public mode: vscode.CommentMode,
    public author: vscode.CommentAuthorInformation
  ) {
    this.id = ++commentId;
    this.savedBody = this.body;
  }
}

export function activate(context: vscode.ExtensionContext) {
  // A `CommentController` is able to provide comments for documents.
  const commentController = vscode.comments.createCommentController(
    "todo-reminder",
    "TODO Reminder"
  );
  context.subscriptions.push(commentController);

  commentController.commentingRangeProvider = {
    provideCommentingRanges: (
      document: vscode.TextDocument,
      token: vscode.CancellationToken
    ) => {
      const lineCount = document.lineCount;
      return [new vscode.Range(0, 0, lineCount - 1, 0)];
    },
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "todo-reminder.remindMe",
      (reply: vscode.CommentReply) => {
        replyNote(reply);
        reply.thread.canReply = false;
      }
    )
  );

  const getUser = async () => {
    return "laser-ayyildiz";
  };

  const replyNote = async (reply: vscode.CommentReply) => {
    const thread = reply.thread;
    const user = await getUser();
    const newReminder = new NoteComment(
      reply.text,
      vscode.CommentMode.Preview,
      { name: user }
    );

    const todo: Todo = {
      body: reply.text,
      project: "todo-reminder",
      filePath: "src/extension.ts",
      line: reply.thread.range.start.line,
    };

    const isTodoCreated = await createTodo(todo, user);
    if (isTodoCreated) {
      vscode.window.showInformationMessage(
        "Be cool, i gotcha. I will remind you this todo ◝(ᵔᵕᵔ)◜"
      );
    } else {
      vscode.window.showErrorMessage(
        "Hey dude i have a problem 🥺 if you update me maybe i can solve the problem 🤔"
      );
      return;
    }

    thread.comments = [newReminder];
  };

  const createTodo = async (todo: Todo, username: string) => {
    return axios
      .post(`http://localhost:8080/api/v1/todos?username=${username}`, todo)
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.log("error: ", err));
  };
}
