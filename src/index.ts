import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  createdAt: Date;
  updatedAt: Date;
}

const app = new Hono();

let todos: Todo[] = [];

app.get("/", (c) => {
  return c.text("Hello Tanim!");
});

//post-method using here
app.post("/todos", async (c) => {
  const { title } = (await c.req.json()) as { title: string };

  if (!title) {
    return c.status(400).json("title is required");
  }
  const newTodo: Todo = {
    id: uuidv4(),
    title,
    status: "todo",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  todos.push(newTodo);

  return c.json(
    {
      message: "Todo Created",
      todo: newTodo,
    },
    201
  );
});

//GET-method--using
app.get("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return c.status(404).json({ message: "Todo not found" });
  }
  return c.json(todo);
});

//put method using
app.put("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const { title, status } = await c.req.json();
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return c.status(404).json({ message: "Todo not found" });
  }

  if (title) todo.title = title;
  if (status) todo.status = status;

  todo.updatedAt = new Date();

  return c.json({
    message: "Todo updated",
    todo,
  });
});

//del metho;d using

app.delete("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const idIndex = todos.findIndex((todo) => todo.id === id);

  if (idIndex === -1) {
    return c.status(404).json({ message: "Todo not found" });
  }
  todos.splice(idIndex, 1);
  return c.json({ message: "Todo deleted" });
});

app.get("/todos", (c) => {
  return c.json(todos);
});

const port = 3000;
console.log(`Server is running on port ${port}`);
serve({ fetch: app.fetch, port });
