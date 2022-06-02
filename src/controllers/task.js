import UserModel from "../models/Auth.js";
import TaskModel from "../models/Task.js";

export const read = async (req, res) => {
  const { id } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = await TaskModel.findById(id).populate("author");
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  try {
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const readAllFromAuthor = async (req, res) => {
  const { author } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(author)) {
    return res.status(404).json({ error: "Author not found" });
  }

  const authorExists = await UserModel.findById(author);
  if (!authorExists) {
    return res.status(404).json({ error: "Author not found" });
  }

  const tasks = await TaskModel.find({ author: author });

  try {
    tasks.forEach((task) => (task.author = undefined));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  const { author, name, priority } = req.body;

  if (!name) {
    return res.status(422).json({ error: "Name is required" });
  }
  if (!priority) {
    return res.status(422).json({ error: "Priority is required" });
  }
  if (!author) {
    return res.status(422).json({ error: "Author is required" });
  }

  if (!/^[0-9a-fA-F]{24}$/.test(author)) {
    return res.status(404).json({ error: "Author not found" });
  }

  const authorExists = await UserModel.findById(author);
  if (!authorExists) {
    return res.status(404).json({ error: "Author not found" });
  }

  try {
    const newTask = await TaskModel.create(req.body);
    const updateAuthor = await UserModel.findByIdAndUpdate(author, {
      tasks: [...authorExists.tasks, newTask],
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, priority, isCompleted } = req.body;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = await TaskModel.findById(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (!name && !priority && isCompleted === undefined) {
    return res.status(422).json({ error: "Missing or invalid data" });
  }

  //Evita que a data de conclusão seja atualizada se a tarefa já estiver concluída!!!
  let completedDate = task.isCompleted
    ? undefined
    : isCompleted
    ? Date.now()
    : undefined;

  try {
    const taskUpdated = await TaskModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        completedDate,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    //Retira a propriedade completedDate caso isCompleted seja false
    if (isCompleted === false) {
      taskUpdated.completedDate = undefined;
      await taskUpdated.save();
    }

    res.status(200).json(taskUpdated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = await TaskModel.findById(id).populate("author");
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  try {
    await task.delete();
    const updateAuthor = await UserModel.findByIdAndUpdate(task.author._id, {
      tasks: task.author.tasks.filter(({ _id }) => _id !== task._id),
    });
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeAllFromAuthor = async (req, res) => {
  const { author } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(author)) {
    return res.status(404).json({ error: "Author not found" });
  }

  const authorExists = await UserModel.findById(author);
  if (!authorExists) {
    return res.status(404).json({ error: "Author not found" });
  }

  try {
    const tasksByAuthor = await TaskModel.deleteMany({ author: author });
    const updateAuthor = await UserModel.findByIdAndUpdate(author, {
      tasks: [],
    });
    res.status(200).json(tasksByAuthor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
