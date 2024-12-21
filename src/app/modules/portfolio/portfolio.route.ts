import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { PortfolioController } from './portfolio.controller';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLES.BARBER),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {

                let image;
                if (req.files && "image" in req.files && req.files.image[0]) {
                    image = `/images/${req.files.image[0].filename}`;
                }

                req.body = { image, barber: req.user.id };
                next();

            } catch (error) {
                return res.status(500).json({ message: "Invalid Image Format" });
            }
        },
        PortfolioController.createPortfolio
    )
    .get(
        auth(USER_ROLES.BARBER),
        PortfolioController.getPortfolio
    );

router
    .route('/:id')
    .delete(
        auth(USER_ROLES.BARBER),
        PortfolioController.deletePortfolio
    )

export const PortfolioRoutes = router;