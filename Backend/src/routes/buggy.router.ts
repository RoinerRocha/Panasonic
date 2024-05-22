import { Router } from 'express';
import { BuggyController } from '../controller/BuggyController';

const router = Router();
const buggyController = new BuggyController();

router.get('/not-found', buggyController.getNotFound.bind(buggyController));
router.get('/bad-request', buggyController.getBadRequest.bind(buggyController));
router.get('/unauthorised', buggyController.getUnauthorised.bind(buggyController));
router.get('/validation-error', buggyController.getValidationError.bind(buggyController));
router.get('/server-error', buggyController.getServerError.bind(buggyController));

export default router;