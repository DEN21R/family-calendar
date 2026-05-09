import CalendarTask from '../models/CalendarTask.js'

export const createTask = async (req, res) => {
  try {
    const { title, task, date, time } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const newTask = await CalendarTask.create({ title, task, date, time })
    return res.status(201).json({ task: newTask })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const getTasks = async (req, res) => {
  try {
    const tasks = await CalendarTask.find({})
    return res.status(200).json({ tasks })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch tasks' })
  }
}

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id
    const taskData = req.body
    const task = await CalendarTask.findByIdAndUpdate(taskId, taskData, {
      new: true,
      runValidators: true,
    })

    return res.status(200).json({ message: 'Task updated', task })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update task' })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id
    await CalendarTask.findByIdAndDelete(taskId)
    return res.status(200).json({ message: 'Task deleted' })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to delete task' })
  }
}
