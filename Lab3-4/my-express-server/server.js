const express = require("express");
const app = express();
app.use(express.json()); 

app.use((req, res, next) => {
 console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
 next();
});

const items = [
{ id: 1, name: "Товар 1", price: 100 },
{ id: 2, name: "Товар 2", price: 200 }
];

// Отримання списку товарів
app.get("/items", (req, res) => {
 res.json(items);
});

// Отримання товару за id
app.get("/items/:id", (req, res) => {
 const id = parseInt(req.params.id, 10);
 const item = items.find(i => i.id === id);
 if (!item) {
 return res.status(404).json({ error: "Item not found" });
 }
 res.json(item);
});

// Додавання нового товару
app.post("/items", (req, res) => {
 const { id, name, price } = req.body;
 // Валідація
 if (typeof id !== "number" || typeof name !== "string" || typeof price !== "number") {
 return res.status(400).json({ error: "Invalid item format" });
 }
 // Перевірка унікальності id
 if (items.some(i => i.id === id)) {
 return res.status(409).json({ error: "Item with this id already exists" });
 }
 const item = { id, name, price };
 items.push(item);
 res.status(201).json(item);
});

// Оновлення товару за ідентифікатором
app.put("/items/:id", (req, res) => {
 const id = parseInt(req.params.id, 10);
 const { name, price } = req.body;
 const idx = items.findIndex(i => i.id === id);
 if (idx === -1) {
 return res.status(404).json({ error: "Note not found" });
 }
 // Валідація
 if (typeof text !== "string") {
 return res.status(400).json({ error: "Invalid note format" });
 }
 // id беремо з URL, щоб не “губився” та не змінювався
 const updatedItem = { id, name, price };
 items[idx] = updatedItem;
 res.json(updatedItem);
});

// Видалення товару за ідентифікатором
app.delete("/items/:id", (req, res) => {
 const id = parseInt(req.params.id, 10);
 const idx = items.findIndex(i => i.id === id);
 if (idx === -1) {
 return res.status(404).json({ error: "Item not found" });
 }
 items.splice(idx, 1);
 res.status(204).send(); // No Content
});
app.listen(3000, () => {
 console.log("Server is running on port 3000");
});