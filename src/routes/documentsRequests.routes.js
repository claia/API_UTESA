const { header, check } = require("express-validator");
const { Router } = require("express");
const router = Router();

/* Controllers */
const documentsRequestsController = require("../controllers/documentsRequests.controller");

router.get(
  "/",
  [header("studentsid").notEmpty()],
  documentsRequestsController.index
);
router.get("/documents", documentsRequestsController.getDocuments);
router.post(
  "/",
  [check("studentsid").notEmpty(), check("documentsid").notEmpty()],
  documentsRequestsController.requestDocument
);

module.exports = router;
