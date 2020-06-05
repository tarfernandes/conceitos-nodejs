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
    likes:0,
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(repository => 
    repository.id == id
  );

  if ( findRepositoryIndex == -1) {
    return response.status(400).json({error:'Repository does not exists.' });
  }

  const repository = {
    id,
    title, 
    url, 
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findrepositoryIndex = repositories.findIndex( repository => repository.id == id);

  if ( findrepositoryIndex >= 0 ) {
    repositories.splice(findrepositoryIndex, 1);
  }else {
    return response.status(400).json({error: 'Repository does not exists.'})
  }

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository => 
    repository.id == id
  );

  if ( findRepositoryIndex == -1) {
    return response.status(400).json({error:'Repository does not exists.' });
  }

  repositories[findRepositoryIndex].likes +=1 ;
 
  return response.json(repositories[findRepositoryIndex]);

});

module.exports = app;
