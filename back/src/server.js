require('dotenv').config();

import express from 'express';
import cors from 'cors';
import viewEngineConfig from './config/viewEngine';
import initWebRoutes from './routes/web';
import expressListEndpoints from 'express-list-endpoints';
import morgan from 'morgan'

let app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

viewEngineConfig(app);

initWebRoutes(app);

let port = process.env.PORT || 7007;

const routes = expressListEndpoints(app);


routes.forEach(route => {
    let color;
    route.methods.forEach(r => {
        switch (r) {
            case 'GET':
                color = '\x1b[32m'; // Vert
                break;
              case 'POST':
                color = '\x1b[31m'; // Rouge
                break;
              case 'DELETE':
                color = '\x1b[31m'; // Rouge
                break;
              case 'PUT':
              case 'PATCH':
                color = '\x1b[33m'; // Jaune
                break;
              default:
                color = '\x1b[0m';
          }
        
          console.log(color + `${r} ${route.path}` + '\x1b[0m');
    })
    console.log("--")
  });
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
