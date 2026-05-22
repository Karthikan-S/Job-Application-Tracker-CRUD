import { Router, Response } from 'express';
import pool from '../config/db';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { AuthRequest } from '../types';

const router = Router();

// GET /api/admin/users — get all users
router.get('/users', protect, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id — delete a user
router.delete('/users/:id', protect, adminOnly, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (id === req.user?.id) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;