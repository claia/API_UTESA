const { param, check } = require("express-validator");
const { Router } = require("express");
// const { verifyToken } = require("../middlewares/tokenVerify");
const router = Router();

/* Controllers */
const documentsRequestsController = require("../controllers/documentsRequests.controller");

router.get("/documents", documentsRequestsController.getDocuments);
router.get(
  "/documents/:id",
  [param("id").notEmpty()],
  documentsRequestsController.getDocumentsByUserId
);
router.post(
  "/create",
  [
    check("userid").notEmpty(),
    check("documentid").notEmpty(),
    check("razon").notEmpty()
  ],
  documentsRequestsController.createRequest
);

module.exports = router;
