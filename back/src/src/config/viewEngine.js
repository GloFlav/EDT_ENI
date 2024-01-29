import express from 'express';

let viewEngineConfig = (app) => {
    app.use('/static', express.static('./src/public'));
    app.set('view engine', 'ejs');
    app.set('views', './src/views');
}

module.exports = viewEngineConfig;
