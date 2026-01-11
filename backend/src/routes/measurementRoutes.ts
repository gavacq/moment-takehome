import { Router } from 'express';
import { addMeasurement, getMeasurements, reseedMeasurements } from '../controllers/measurementController';

const router = Router();

router.post('/', addMeasurement);
router.get('/', getMeasurements);
router.post('/reseed', reseedMeasurements);

export default router;
