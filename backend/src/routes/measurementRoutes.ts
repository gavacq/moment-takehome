import { Router } from 'express';
import { addMeasurement, getMeasurements, reseedMeasurements, generateLiveMeasurements } from '../controllers/measurementController';

const router = Router();

router.post('/', addMeasurement);
router.get('/', getMeasurements);
router.post('/reseed', reseedMeasurements);
router.post('/generate-live', generateLiveMeasurements);

export default router;
