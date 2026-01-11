import { Router } from 'express';
import { addMeasurement, getMeasurements } from '../controllers/measurementController';

const router = Router();

router.post('/', addMeasurement);
router.get('/', getMeasurements);

export default router;
