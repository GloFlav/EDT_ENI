import express from 'express';
import morgan from 'morgan'
let viewEngineConfig = (app) => {
    app.use('/static', express.static('./src/public'));
    app.use(morgan('dev'))
    app.set('view engine', 'ejs');
    app.set('views', './src/views');
}

module.exports = viewEngineConfig;
