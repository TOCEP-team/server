import {Pool} from '../models/poolMetadata.js';

export const createPool = async (req, res) => {
  try {
    const newPool = new Pool(req.body);
    const savedPool = await newPool.save();
    res.status(201).json(savedPool);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create pool' });
  }
};


export const deletePool = async (req, res) => {
  try {
    const pool_id = req.params.pool_id;

    const deletedPool = await Pool.findOneAndDelete({ pool_id });

    if (deletedPool) {
      res.json({ message: 'Pool deleted successfully' });
    } else {
      res.status(404).json({ error: 'Pool not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete pool' });
  }
};


export const updatePool = async (req, res) => {
  try {
    const pool_id = req.params.pool_id;
    const updateData = req.body;

    const updatedPool = await Pool.findOneAndUpdate(
      { pool_id },
      updateData,
      {
        new: true,
      },
    );

    if (updatedPool) {
      res.json(updatedPool);
    } else {
      res.status(404).json({ error: 'Pool not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update pool' });
  }
};


// Get pool by pool_id
export const getByPoolId = async (req, res) => {
  try {
    const pool = await Pool.findOne({ pool_id: req.params.pool_id });
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }
    res.json(pool);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get pool by pool_id' });
  }
};

// Get all pools
export const getAllPools = async (req, res) => {
  try {
    const pools = await Pool.find();
    res.json(pools);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get all pools' });
  }
};
