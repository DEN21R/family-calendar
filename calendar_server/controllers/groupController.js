import authMiddleware from '../middleware/authMiddleware.js'
import Group from '../models/Group.js'

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body
    const userId = req.user.id

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const newGroup = await Group.create({
      name,
      owner: userId,
      members: [userId],
    })

    return res.status(201).json({ group: newGroup })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id
    const groups = await Group.find({ members: userId })

    return res.status(200).json({ groups })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
