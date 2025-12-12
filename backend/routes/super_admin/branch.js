const express = require("express");
const BranchController = require("../../controllers/super_admin/branch");
const branchRouter = express.Router();

branchRouter.post("/", BranchController.createBranch);
branchRouter.get("/", BranchController.getAllBranches);
branchRouter.get("/:code", BranchController.getBranchByCode);
branchRouter.put("/:code", BranchController.updateBranch);
branchRouter.delete("/:code", BranchController.deleteBranch);

module.exports = branchRouter;