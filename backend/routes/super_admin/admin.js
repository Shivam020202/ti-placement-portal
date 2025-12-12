const express = require("express");
const AdminRouter = express.Router();
const adminController = require('../../controllers/super_admin/adminController');

AdminRouter.get("/", adminController.GetAllAdmins);
AdminRouter.get("/export", adminController.ExtractAdminData);
AdminRouter.get("/:id", adminController.GetAdmin);
AdminRouter.put("/", adminController.UpdateAdminDetails);
AdminRouter.delete("/:adminEmail", adminController.DeleteAdmin);

module.exports = AdminRouter;