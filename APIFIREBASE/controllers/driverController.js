const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Driver, storage } = require('../config/config');  // Cambiado de "Driver" a "Drivers"

const upload = multer({ storage: multer.memoryStorage() });

router.post('/drivers', upload.single('photo'), async (req, res) => {
    try {
        const { body, file } = req;
        let newDriver;
        try {
            newDriver = JSON.parse(body.data);
        } catch (error) {
            throw new Error('Invalid JSON data in the request body');
        }

        if (file) {
            const photoName = `drivers/${Date.now()}_${file.originalname}`;
            const photoFile = storage.ref().child(photoName);
            await photoFile.put(file.buffer);
            const photoUrl = await photoFile.getDownloadURL();
            newDriver.photo = photoUrl;
        }

        const driverRef = await Driver.add(newDriver);
        const driverId = driverRef.id;

        await Driver.doc(driverId).update({ id: driverId });

        res.send({ msg: 'Driver added successfully', driver: { id: driverId, ...newDriver } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/drivers', async (req, res) => {
    try {
        const driversSnapshot = await Driver.get();
        const drivers = driversSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.send({ drivers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/drivers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const driverDoc = await Driver.doc(id).get();
        if (!driverDoc.exists) {
            res.status(404).json({ error: 'Driver not found' });
            return;
        }
        const driver = { id: driverDoc.id, ...driverDoc.data() };
        res.send({ driver });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/drivers/:id', upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        const { body, file } = req;

        let updatedDriver;
        try {
            updatedDriver = JSON.parse(body.data);
        } catch (error) {
            throw new Error('Invalid JSON data in the request body');
        }

        if (file) {
            const photoName = `drivers/${Date.now()}_${file.originalname}`;
            const photoFile = storage.ref().child(photoName);
            await photoFile.put(file.buffer);
            const photoUrl = await photoFile.getDownloadURL();
            updatedDriver.photo = photoUrl;
        }

        await Driver.doc(id).update(updatedDriver);
        res.send({ msg: 'Driver updated successfully', driver: { id, ...updatedDriver } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/drivers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Driver.doc(id).delete();
        res.send({ msg: 'Driver deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
