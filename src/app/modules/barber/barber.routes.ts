import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BarberController } from './barber.controller';
const router = express.Router();

router.get('/',
    auth(USER_ROLES.BARBER),
    BarberController.getBarberProfile
)

export const BarberRoutes = router;