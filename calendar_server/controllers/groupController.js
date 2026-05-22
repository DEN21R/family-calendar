import Group from '../models/Group.js'
import User from '../models/User.js'

const groupPopulate = [
  { path: 'owner', select: 'name email' },
  { path: 'members', select: 'name email' },
]

const getGroupWithUsers = async (groupId) =>
  Group.findById(groupId).populate(groupPopulate)

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

    const populatedGroup = await getGroupWithUsers(newGroup._id)

    return res.status(201).json({ group: populatedGroup })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id
    const groups = await Group.find({ members: userId }).populate(groupPopulate)

    return res.status(200).json({ groups })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const getGroupById = async (req, res) => {
  try {
    const group = await getGroupWithUsers(req.group._id)
    return res.status(200).json({ group })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const inviteMember = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const alreadyMember = req.group.members.some(
      (member) => member.toString() === user._id.toString(),
    )

    if (alreadyMember) {
      return res.status(400).json({ error: 'User is already a member' })
    }

    req.group.members.push(user._id)
    await req.group.save()

    const group = await getGroupWithUsers(req.group._id)

    return res.status(200).json({ group })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params
    const targetUserId = String(userId)
    const requesterId = req.user.id

    if (req.group.owner.toString() !== requesterId) {
      return res.status(403).json({ error: 'Only owner can remove members' })
    }

    if (req.group.owner.toString() === targetUserId) {
      return res.status(400).json({ error: 'Owner cannot be removed' })
    }

    const isMember = req.group.members.some(
      (member) => member.toString() === targetUserId,
    )

    if (!isMember) {
      return res.status(404).json({ error: 'Member not found in group' })
    }

    req.group.members = req.group.members.filter(
      (member) => member.toString() !== targetUserId,
    )

    await req.group.save()

    const group = await getGroupWithUsers(req.group._id)

    return res.status(200).json({ group })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
