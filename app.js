// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user'); // Importa el modelo User

app.use(bodyParser.json());

// Importa y utiliza el enrutador de post
const postRoute = require('./routes/post');
app.use('/posts', postRoute);

// Ruta para el registro de usuarios (método POST)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const user = new User({ username, password });
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para el inicio de sesión (método POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Usa async/await con el método mongoose.connect
(async () => {
    try {
        await mongoose.connect('mongodb+srv://santiagolopez5041:Pastelero5041@patologos.2alfeki.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Sí hay conexión a la BD');
    } catch (error) {
        console.error('Error de conexión a la BD:', error.message);
    }

    app.listen(10000, () => {
        console.log('Servidor escuchando en el puerto 10000');
    });
})();



