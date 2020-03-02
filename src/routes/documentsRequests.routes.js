const { param, check } = require("express-validator");
const { Router } = require("express");
// const { verifyToken } = require("../middlewares/tokenVerify");
const router = Router();

/* Controllers */
const documentsRequestsController = require("../controllers/documentsRequests.controller");

router.get("/documents", documentsRequestsController.getDocuments);
router.put(
  "/",
  [check("requestid").notEmpty()],
  documentsRequestsController.updateRequestStatus
);
router.delete(
  "/",
  [check("requestid").notEmpty()],
  documentsRequestsController.cancelRequest
);
router.get(
  "/documents/:id",
  [param("id").notEmpty()],
  documentsRequestsController.getDocumentsByUserId
);
router.post(
  "/",
  [
    check("userid").notEmpty(),
    check("documentid").notEmpty(),
    check("razon").notEmpty()
  ],
  documentsRequestsController.createRequest
);

module.exports = router;
