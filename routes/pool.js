import express from 'express';
import {
    createPool,
    deletePool,
    updatePool,
    getByPoolId,
    getAllPools,
} from '../controllers/pool.js';

const router = express.Router();

router.post('/pool/create', createPool);
router.get('/pool/:pool_id', getByPoolId);

router.get('/pool', getAllPools);

router.delete('/pool/delete/:pool_id', deletePool);

router.put('/pool/update/:pool_id', updatePool);

export default router;
