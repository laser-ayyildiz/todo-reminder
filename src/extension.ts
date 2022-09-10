"use strict";

import * as vscode from "vscode";

let commentId = 1000;

class NoteComment implements vscode.Comment {
  id: number;
  label: string | undefined;
  savedBody: string | vscode.MarkdownString; // for the Cancel button
  constructor(
    public body: string | vscode.MarkdownString,
    public mode: vscode.CommentMode,
    public author: vscode.CommentAuthorInformation,
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
    return "todo-reminder";
  };

  const replyNote = async (reply: vscode.CommentReply) => {
    const thread = reply.thread;
    const user = await getUser();
    const newReminder = new NoteComment(
      reply.text,
      vscode.CommentMode.Preview,
      { name: user },
    );

    thread.comments = [newReminder];
  };
}
