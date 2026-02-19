import { test } from "@playwright/test";
import * as tasks from "../../pages/tasks";

test("should create a new task successfully", async ({ request }) => {
  const title = tasks.generateTaskTitle();
  await tasks.createTaskViaAPI(request, title);
});

test("should edit a task successfully", async ({ request }) => {
  const title = tasks.generateTaskTitle();
  const editedTitle = title + "edited";
  const taskId = await tasks.createTaskViaAPI(request, title);
  await tasks.editTaskViaAPI(request, taskId, editedTitle);
});

test("should delete a task successfully", async ({ request }) => {
  const title = tasks.generateTaskTitle();
  const taskId = await tasks.createTaskViaAPI(request, title);
  await tasks.deleteTaskViaAPI(request, taskId);
});

test("should complete task successfully", async ({ request }) => {
  const title = tasks.generateTaskTitle();
  const taskId = await tasks.createTaskViaAPI(request, title);
  await tasks.completeTaskViaAPI(request, taskId);
});
