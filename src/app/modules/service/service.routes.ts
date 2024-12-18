import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { ServiceController } from "./service.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceValidation } from "./service.validation";
const router = express.Router()

router
    .route("/")
    .post(
        validateRequest(ServiceValidation.createServiceZodSchema), 
        auth(USER_ROLES.BARBER), ServiceController.createService
    )

router
    .route("/:id")
    .patch(auth(USER_ROLES.BARBER), ServiceController.updateService)

export const ServiceRoutes = router;