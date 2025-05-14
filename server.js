// backend/server.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Datos en memoria
let categorias = [
  { id: 1, nombre: 'Frutas', descripcion: 'Alimentos naturales y dulces' },
  { id: 2, nombre: 'Verduras', descripcion: 'Hortalizas y plantas comestibles' }
];

let alimentos = [
  { id: 1, nombre: 'Manzana', categoria: 1, calorias: 52, descripcion: 'Fruta roja', disponible: true },
  { id: 2, nombre: 'Zanahoria', categoria: 2, calorias: 41, descripcion: 'Buena para la vista', disponible: true }
];

let nextId = 3;

// ==== Categorías ====

app.get('/categorias', (req, res) => {
  res.json(categorias);
});

app.post('/categorias', (req, res) => {
  const nueva = { id: Date.now(), ...req.body };
  categorias.push(nueva);
  res.status(201).json(nueva);
});

// ==== Alimentos ====

app.get('/alimentos', (req, res) => {
  const resultado = alimentos.map(a => ({
    ...a,
    categoria: categorias.find(c => c.id === a.categoria)
  }));
  res.json(resultado);
});

app.post('/alimentos', (req, res) => {
  const nuevo = { id: nextId++, ...req.body };
  alimentos.push(nuevo);
  res.status(201).json(nuevo);
});

app.get('/alimentos/:id', (req, res) => {
  const alimento = alimentos.find(a => a.id == req.params.id);
  if (!alimento) return res.status(404).json({ error: 'No encontrado' });
  res.json(alimento);
});

app.put('/alimentos/:id', (req, res) => {
  const index = alimentos.findIndex(a => a.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });
  alimentos[index] = { ...alimentos[index], ...req.body };
  res.json(alimentos[index]);
});

app.delete('/alimentos/:id', (req, res) => {
  const index = alimentos.findIndex(a => a.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });
  alimentos.splice(index, 1);
  res.json({ mensaje: 'Alimento eliminado' });
});

app.listen(4000, () => {
  console.log('✅ Backend sin base de datos corriendo en puerto 4000');
});
