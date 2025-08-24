// routes/group.routes.js
import express from 'express';
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addRating,
  getRatings,
  addMember,
  removeMember
} from '../controllers/group.controller.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/v1/groups - Get all groups
router.get('/', getGroups);

// GET /api/v1/groups/:id - Get a single group
router.get('/:id', getGroup);

// POST /api/v1/groups - Create a new group
router.post('/', createGroup);

// PUT /api/v1/groups/:id - Update a group
router.put('/:id', updateGroup);

// DELETE /api/v1/groups/:id - Delete a group
router.delete('/:id', deleteGroup);

// POST /api/v1/groups/:id/ratings - Add a rating to a group
router.post('/:id/ratings', addRating);

// GET /api/v1/groups/:id/ratings - Get ratings for a group
router.get('/:id/ratings', getRatings);

// POST /api/v1/groups/:id/members - Add a member to a group
router.post('/:id/members', addMember);

// DELETE /api/v1/groups/:id/members/:userId - Remove a member from a group
router.delete('/:id/members/:userId', removeMember);

export default router;