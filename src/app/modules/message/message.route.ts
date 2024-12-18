import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { MessageController } from './message.controller';
const router = express.Router();

router.post('/',
    auth(USER_ROLES.USER, USER_ROLES.PROFESSIONAL),
    MessageController.sendMessage
);
router.get('/:id',
    auth(USER_ROLES.USER, USER_ROLES.PROFESSIONAL),
    MessageController.getMessage
);

export const MessageRoutes = router;
