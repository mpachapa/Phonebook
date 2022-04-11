const express = require("express");
const app = express();
const morgan = require("morgan");
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms :body"));
// app.use(morgan("tiny"));
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
//Front Page
app.get("/", (request, response) => {
  response.send("<h2>Hello World!!</h2><br><p>This is my phonebook webserer that uses express, morgan and nodemon. I used postman to POST, DELTE, and GET.</p>");
});
//Info status Page
app.get("/info", (request, response) => {
  response.send(
    `<h1>Phonebook has info for ${persons.length} people</h1><br><p>${new Date()}</p>`
  );
});
//Returns all people in the Phonebook
app.get("/api/persons", morgan(`tiny`), (request, response) => {
  response.json(persons);
});
//Returns specified id or 404 error if doesn't exist
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
//Delete specified persons
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});
app.use(express.json());

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  };
  if (body.name == "") {
    return response.status(400).json({ error: "name is missing" });
  } else if (body.number == "") {
    return response.status(400).json({ error: "number is missing" });
  }
  if (persons.map((x) => x.name).includes(body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }
  console.log(persons);
  persons = persons.concat(person);
  response.json(persons);
});

const PORT = 3003;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
