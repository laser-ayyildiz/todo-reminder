import { Credentials } from "./user/credentials";
import { replyNote } from "./comment-popup";
import { connectGithub, User } from "./user";
import {
  commands,
  CommentReply,
  comments,
  ExtensionContext,
  Range,
  TextDocument,
} from "vscode";

export async function activate(context: ExtensionContext) {
  const credentials = new Credentials();
  await credentials.initialize(context);
  const user: User = await connectGithub(await credentials.getOctokit());

  const commentController = comments.createCommentController(
    "todo-reminder",
    "TODO Reminder"
  );

  context.subscriptions.push(commentController);
  commentController.commentingRangeProvider = {
    provideCommentingRanges: (document: TextDocument) => {
      const lineCount = document.lineCount;
      return [new Range(0, 0, lineCount - 1, 0)];
    },
  };

  context.subscriptions.push(
    commands.registerCommand(
      "todo-reminder.remindMe",
      (reply: CommentReply) => {
        replyNote(reply, user);
        reply.thread.canReply = false;
      }
    )
  );
}
