const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('data', (request, response) => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Anton",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Aaron",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

const randomId = () => Math.floor(Math.random() * 100000)

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    newPerson.id = randomId()

    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({
            error: 'name and number required'
        })
    }

    if (persons.find(person => person.name === newPerson.name)) {
        return response.status(400).json({
            error: 'the person already exists'
        })
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})