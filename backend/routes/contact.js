const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// Create a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const contact = new Contact({
      name,
      email,
      message,
    });

    await contact.save();
    res.status(201).json({ message: 'Thank you for contacting us! We will get back to you soon.' });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Error submitting contact form' });
  }
});

// Get all contact messages (for admin use)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Error fetching contact messages' });
  }
});

module.exports = router;

