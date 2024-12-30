import express from 'express';
import { CustomerController } from './customer.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/',
    auth(USER_ROLES.CUSTOMER),
    CustomerController.customerProfile
);

export const CustomerRoutes = router;