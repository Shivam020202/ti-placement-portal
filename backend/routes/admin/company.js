const express = require("express");
const router = express.Router();
const CompanyController = require("../../controllers/admin/company");
const upload = require("../../config/multer");

router.post("/", upload("./uploads/logo"), CompanyController.createCompany);
router.get("/", CompanyController.getAllCompanies);
router.get("/:id", CompanyController.getCompanyById);
router.get("/search", CompanyController.searchCompaniesByName);
router.get("/name", CompanyController.getCompanyByName);
router.delete("/:id", CompanyController.deleteCompanyById);
router.patch(
  "/:id",
  upload("./uploads/logo"),
  CompanyController.updateCompanyById
);

module.exports = router;
