const express = require('express');
const Report = require('../models/Report');
const upload = require('../middleware/upload');
const path = require('path');

const router = express.Router();

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error fetching reports' });
  }
});

// Create a new report
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, category, description } = req.body;
    // For Vercel, files are in /tmp and we should store base64 or use cloud storage
    // For now, we'll store the filename (in production, upload to Cloudinary/S3)
    const filePath = req.file ? `/tmp/uploads/${req.file.filename}` : null;

    if (!name || !category || !description) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const report = new Report({
      name,
      category,
      description,
      file: filePath,
      status: 'Pending',
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Error creating report' });
  }
});

// Get a single report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Error fetching report' });
  }
});

// Update report status (for admin use)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report status updated', report });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Error updating report' });
  }
});

module.exports = router;

