import CalendarTask from '../models/CalendarTask.js'
import Group from '../models/Group.js'
import { getReminderDate, toTaskDateTime } from '../utils/taskReminder.js'

export const createTask = async (req, res) => {
  try {
    const { title, task, date, time, color, reminderMinutesBefore } = req.body
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
      reminderMinutesBefore,
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
    const taskData = { ...req.body }

    if (
      Object.prototype.hasOwnProperty.call(taskData, 'date') ||
      Object.prototype.hasOwnProperty.call(taskData, 'time') ||
      Object.prototype.hasOwnProperty.call(taskData, 'reminderMinutesBefore')
    ) {
      taskData.reminderSentAt = null
    }

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

export const getUpcomingReminders = async (req, res) => {
  try {
    const userId = req.user.id
    const limit = Math.min(Number(req.query.limit) || 5, 20)
    const now = new Date()

    const groups = await Group.find({ members: userId }, { _id: 1, name: 1 })
    const groupIds = groups.map((group) => group._id)

    if (!groupIds.length) {
      return res.status(200).json({ count: 0, reminders: [] })
    }

    const tasks = await CalendarTask.find({
      groupId: { $in: groupIds },
      date: { $ne: null },
      reminderSentAt: null,
    })

    const groupNameById = new Map(
      groups.map((group) => [String(group._id), group.name]),
    )

    const reminders = tasks
      .map((task) => {
        const reminderAt = getReminderDate(task)
        const dueAt = toTaskDateTime(task)

        if (!reminderAt || !dueAt || reminderAt <= now) {
          return null
        }

        return {
          taskId: task._id,
          title: task.title,
          reminderAt,
          dueAt,
          groupId: task.groupId,
          groupName: groupNameById.get(String(task.groupId)) || 'Группа',
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.reminderAt) - new Date(b.reminderAt))

    return res.status(200).json({
      count: reminders.length,
      reminders: reminders.slice(0, limit),
    })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to get reminders' })
  }
}
