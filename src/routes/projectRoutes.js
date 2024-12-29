const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Project = require('../models/Project');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "projectPhotos") {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
    } else if (file.fieldname === "projectVideo") {
        if (!file.originalname.match(/\.(mp4|MP4|mov|MOV|avi|AVI)$/)) {
            return cb(new Error('Only video files are allowed!'), false);
        }
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
    }
});

// Error handling middleware
const handleError = (err, res) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message || 'An error occurred',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

// Upload Project Route
router.post('/upload', (req, res) => {
    upload.fields([
        { name: 'projectPhotos', maxCount: 5 },
        { name: 'projectVideo', maxCount: 1 }
    ])(req, res, async (err) => {
        try {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            // Validate required fields
            if (!req.body.name || !req.body.type || !req.body.description || 
                !req.body.innovatorName || !req.body.innovatorContact || !req.body.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all required fields'
                });
            }

            // Check if files were uploaded
            if (!req.files || !req.files['projectPhotos']) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload at least one project photo'
                });
            }

            const projectData = {
                name: req.body.name,
                type: req.body.type,
                description: req.body.description,
                innovatorName: req.body.innovatorName,
                innovatorContact: req.body.innovatorContact,
                price: parseFloat(req.body.price),
                projectPhotos: req.files['projectPhotos'].map(file => `/uploads/${file.filename}`),
                projectVideo: req.files['projectVideo'] ? `/uploads/${req.files['projectVideo'][0].filename}` : null
            };

            const newProject = new Project(projectData);
            await newProject.save();

            res.status(201).json({
                success: true,
                message: 'Project uploaded successfully',
                project: newProject
            });
        } catch (error) {
            handleError(error, res);
        }
    });
});

// Get All Projects Route
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        
        res.json({
            success: true,
            count: projects.length,
            projects
        });
    } catch (error) {
        handleError(error, res);
    }
});

// Get Single Project Route
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .select('-__v');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            project
        });
    } catch (error) {
        handleError(error, res);
    }
});

// Test Database Connection and Data
router.get('/test/database', async (req, res) => {
    try {
        // Check connection
        const dbStatus = mongoose.connection.readyState;
        const connectionStatus = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        // Count projects
        const projectCount = await Project.countDocuments();
        
        // Get latest 5 projects
        const latestProjects = await Project.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name type createdAt');

        res.json({
            success: true,
            database: {
                status: connectionStatus[dbStatus],
                totalProjects: projectCount,
                latestProjects: latestProjects,
                databaseName: mongoose.connection.name,
                host: mongoose.connection.host
            }
        });
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;
