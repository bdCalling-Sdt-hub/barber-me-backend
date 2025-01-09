import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BarberController } from './barber.controller';
const router = express.Router();

router.get('/customer/:id',
    BarberController.getBarberProfile
);

router.get('/:id',
    auth(USER_ROLES.BARBER),
    BarberController.getCustomerProfile
);

export const BarberRoutes = router;