import Note from '../models/Note.js'

export const createNote = async (req, res) => {
  try {
    const { title, content, type } = req.body
    const { groupId } = req.params

    const userId = req.user.id

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' })
    }

    const newNote = await Note.create({
      title,
      content,
      type: type || 'plan',
      groupId,
      createdBy: userId,
    })
    return res.status(201).json({ note: newNote })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const getNote = async (req, res) => {
  try {
    const groupId = req.params.groupId

    const notes = await Note.find({ groupId })
    return res.status(200).json({ notes })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch notes' })
  }
}

export const updateNote = async (req, res) => {
  try {
    const { groupId } = req.params
    const { id } = req.params
    const noteData = req.body

    const note = await Note.findOneAndUpdate({ _id: id, groupId }, noteData, {
      new: true,
      runValidators: true,
    })

    if (!note) {
      return res.status(404).json({ error: 'note not found in this group' })
    }

    return res.status(200).json({ message: 'note updated', note })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update note' })
  }
}

export const deleteNote = async (req, res) => {
  try {
    const { groupId } = req.params
    const { id } = req.params

    const note = await Note.findOneAndDelete({ _id: id, groupId })

    if (!note) {
      return res.status(404).json({ error: 'note not found in this group' })
    }

    return res.status(200).json({ message: 'note deleted' })
  } catch (error) {
    return res.status(400).json({ error: 'Failed to delete note' })
  }
}
