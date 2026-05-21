import CalendarTask from '../models/CalendarTask.js'

export const createTask = async (req, res) => {
  try {
    const { title, task, date, time, color } = req.body
    const { groupId } = req.params

    const userId = req.user.id

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const newTask = await CalendarTask.create({
      title,
      task,
      date,
      time,
      color,
      groupId,
      createdBy: userId,
    })
    return res.status(201).json({ task: newTask })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const getTasks = async (req, res) => {
  try {
    const groupId = req.params.groupId

    const tasks = await CalendarTask.find({ groupId })
    return res.status(200).json({ tasks })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch tasks' })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { groupId } = req.params
    const { id } = req.params
    const taskData = req.body

    const task = await CalendarTask.findOneAndUpdate(
      { _id: id, groupId },
      taskData,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!task) {
      return res.status(404).json({ error: 'Task not found in this group' })
    }

    return res.status(200).json({ message: 'Task updated', task })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update task' })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const { groupId } = req.params
    const { id } = req.params

    const task = await CalendarTask.findOneAndDelete({ _id: id, groupId })

    if (!task) {
      return res.status(404).json({ error: 'Task not found in this group' })
    }

    return res.status(200).json({ message: 'Task deleted' })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to delete task' })
  }
}
