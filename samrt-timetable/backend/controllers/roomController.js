import Room from '../models/Room.js'

//Get all rooms
export const getAllRoom = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms', details: err.message });
  }
};

// Create a new room
export const createRoom = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'All fields (name) are required' });
  }

  try {
    const newRoom = new Room({ name });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Room', details: err.message });
  }
};

// Update an existing room
export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'All fields (name) are required' });
  }

  try {
    const updated = await Room.findByIdAndUpdate(
      id,
      { name},
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Room not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update Room', details: err.message });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Room.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete Room', details: err.message });
  }
};