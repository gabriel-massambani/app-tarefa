const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tarefa_db'
});

// Conectar ao MySQL
db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

// Rotas
app.get('/tarefas', (req, res) => {
    db.query('SELECT * FROM tarefas', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/tarefas', (req, res) => {
    const { descricao, prioridade, dataConclusao } = req.body;

    // Criação de um objeto de tarefa com os novos campos
    const tarefa = { descricao, prioridade, data_conclusao: dataConclusao };

    db.query('INSERT INTO tarefas SET ?', tarefa, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...tarefa });
    });
});

app.delete('/tarefas/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM tarefas WHERE id = ?', id, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Tarefa deletada!' });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
