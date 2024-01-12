// controllers/userController.js

const express = require('express');
const multer = require('multer');
const router = express.Router();
const { User, storage } = require('../config/config');

const upload = multer({ storage: multer.memoryStorage() });

// POST para agregar un nuevo usuario
router.post('/users', upload.single('photo'), async (req, res) => {
    try {
        const { body, file } = req;
        const newUser = JSON.parse(body.data);

        if (file) {
            const photoName = `users/${Date.now()}_${file.originalname}`;
            const photoFile = storage.ref().child(photoName);
            await photoFile.put(file.buffer);
            const photoUrl = await photoFile.getDownloadURL();
            newUser.photo = photoUrl;
        }

        const userRef = await User.add(newUser);
        const userId = userRef.id;

        await User.doc(userId).update({ id: userId });

        res.send({ msg: 'User added successfully', user: { id: userId, ...newUser } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET para obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const usersSnapshot = await User.get();
        const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.send({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET para obtener un usuario por ID
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userDoc = await User.doc(id).get();
        if (!userDoc.exists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const user = { id: userDoc.id, ...userDoc.data() };
        res.send({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/users/:id', upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        const { body, file } = req;
        const updatedUser = JSON.parse(body.data);

        if (file) {
            const photoName = `users/${Date.now()}_${file.originalname}`;
            const photoFile = storage.ref().child(photoName);
            await photoFile.put(file.buffer);
            const photoUrl = await photoFile.getDownloadURL();
            updatedUser.photo = photoUrl;
        }

        await User.doc(id).update(updatedUser);
        res.send({ msg: 'User updated successfully', user: { id, ...updatedUser } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE para eliminar un usuario por ID
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.doc(id).delete();
        res.send({ msg: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

