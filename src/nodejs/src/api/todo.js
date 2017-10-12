/* eslint-disable eqeqeq, no-plusplus */
let nextId = 1;
let items = [];

const getNextId = () => nextId++;

module.exports = (app) => {
  app.get('/todo', (req, res) => {
    res.json(items);
  });

  app.get('/todo/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    if (item) res.json(item);
    else res.status(404).json('item not found');
  });

  app.post('/todo', (req, res) => {
    const item = Object.assign({}, req.body, { id: getNextId() });
    items.push(item);
    res.json(item);
  });

  app.put('/todo/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    if (item) {
      Object.assign(item, req.body);
      res.json(item);
    } else {
      res.status(404).json('item not found');
    }
  });

  app.delete('/todo/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    if (item) {
      items = items.filter(i => i.id != req.params.id);
      res.json(item);
    } else {
      res.status(404).json('item not found');
    }
  });

  return app;
};
