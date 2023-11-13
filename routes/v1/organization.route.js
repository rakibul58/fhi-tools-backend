const express = require("express");
const organizationControllers = require("../../controllers/organization.controller");

const router = express.Router();

router
    .route("/")
    .post(organizationControllers.addAOrganization)
    .get(organizationControllers.getUserByEmail);


router
    .route("/:id")
    .put(organizationControllers.updateOrganization);

router
    .route("/financialData")
    .post(organizationControllers.postFinancialData)


module.exports = router;
