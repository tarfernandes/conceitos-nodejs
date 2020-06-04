const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title, url, techs } = request.query; 
  
  const results = title
    ? repositories.filter(repositories => repositories.title.includes(title))
    : repositories;

  return response.json(results);


});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  };

  repositories.push(repository);


  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoriesIndex = repositories.findIndex(repository => repository.id == id);

  if ( repositoriesIndex < 0) {
    return response.status(400).json({error:'Repository not found.' })
  }

  const repository = {
    title, 
    url, 
    techs,
  }

  repositories[projectIndex] = repository;

  return  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex( repository => repository.id == id);

  if ( repositoriesIndex < 0 ) {
    return response.status(400).json({error: 'Repository not found.'})
  }

  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id == id);

  repository.likes += 1;

  return response.json(repository);

});

module.exports = app;
