import Group from '../models/Group.js'

const isMember = async (req, res, next) => {
  try {
    const { id } = req.params
    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    const userId = req.user.id
    const hasAccess = group.members.some(
      (member) => member.toString() === userId,
    )

    if (!hasAccess) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    req.group = group
    return next()
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export default isMember
