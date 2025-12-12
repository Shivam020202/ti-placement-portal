const router = require('express').Router();
const AdminController = require("../../controllers/super_admin/invitations.js");

// Get admin by id
// router.get("/:id" , AdminController.getAdminById);

// Get all invited users
router.get("/" , AdminController.getAllInvitedUsers);

// Update admin by id
// router.delete("/:id" , AdminController.deleteAdminById);

// Invite user
router.post('/' , AdminController.invite);

// Invite Recruiter
router.post('/recruiter' , AdminController.inviteRecruiter)

module.exports = router;