import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { MessageController } from './message.controller';
const router = express.Router();

router.post('/',
    auth(USER_ROLES.CUSTOMER, USER_ROLES.BARBER),
    MessageController.sendMessage
);
router.get('/:id',
    auth(USER_ROLES.CUSTOMER, USER_ROLES.BARBER),
    MessageController.getMessage
);

export const MessageRoutes = router;
