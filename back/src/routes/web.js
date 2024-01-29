import express from 'express';
import { sendCoucou } from '../controllers/main';
import { deleteEnseignant, getAllEnseignant, getEnseignant, postEnseignant, putEnseignant } from '../controllers/enseignantController';
import { deleteSemestre, getAllSemestre, getSemestre, postSemestre, putSemestre } from '../controllers/semestreController';
import { deleteNiveau, getAllNiveau, getNiveau, postNiveau, putNiveau } from '../controllers/niveauController';
import { deleteMatiere, getAllMatiere, getMatiere, getMatiereWithParam, postMatiere, putMatiere } from '../controllers/matiereController';
import { deleteSalle, getAllSalle, getSalle, postSalle, putSalle } from '../controllers/salleController';
import { deleteParam, getAllParam, postParam, putParam } from '../controllers/paramController';
import { deleteParcours, getAllParcours, getParcours, postParcours, putParcours } from '../controllers/parcoursController';
import { deleteGroupe, getAllGroupe, getGroupe, getGroupeWithParam, postGroupe, putGroupe } from '../controllers/groupeController';
import { deleteHeure, getAllHeure, getHeure, postHeure, putHeure } from '../controllers/heureController';
import { deleteJour, getAllJour, getJour, putJour } from '../controllers/jourController';
import { deleteIntervalle, getAllIntervalle, getIntervalle, postIntervalle, putIntervalle } from '../controllers/intervalleController';
import { deletePlanification, getPlanification, getSalleLibre, postPlanification, putPlanification } from '../controllers/planificationController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', sendCoucou);

    router.get('/salle_libre', getSalleLibre);
    router.get('/planifications', getPlanification);
    router.post('/planification', postPlanification);
    router.put('/planification', putPlanification);
    router.delete('/planification/:id', deletePlanification);

    router.get('/semestres', getAllSemestre);
    router.get('/semestre/:id', getSemestre);
    router.post('/semestre', postSemestre);
    router.put('/semestre/:id', putSemestre);
    router.delete('/semestre/:id', deleteSemestre);

    router.get('/enseignants', getAllEnseignant);
    router.get('/enseignant/:id', getEnseignant);
    router.post('/enseignant', postEnseignant);
    router.put('/enseignant/:id', putEnseignant);
    router.delete('/enseignant/:id', deleteEnseignant);

    router.get('/niveaux', getAllNiveau);
    router.get('/niveau/:id', getNiveau);
    router.post('/niveau', postNiveau);
    router.put('/niveau/:id', putNiveau);
    router.delete('/niveau/:id', deleteNiveau);

    router.get('/parcours', getAllParcours);
    router.get('/parcours/:id', getParcours);
    router.post('/parcours', postParcours);
    router.put('/parcours/:id', putParcours);
    router.delete('/parcours/:id', deleteParcours);

    router.get('/matieres', getAllMatiere);
    router.get('/matieres_planification', getMatiereWithParam)
    router.get('/matiere/:id', getMatiere);
    router.post('/matiere', postMatiere);
    router.put('/matiere/:id', putMatiere);
    router.delete('/matiere/:id', deleteMatiere);

    router.get('/groupes', getAllGroupe);
    router.get('/groupes_planification', getGroupeWithParam)
    router.get('/groupe/:id', getGroupe);
    router.post('/groupe', postGroupe);
    router.put('/groupe/:id', putGroupe);
    router.delete('/groupe/:id', deleteGroupe);

    router.get('/salles', getAllSalle);
    router.get('/salle/:id', getSalle);
    router.post('/salle', postSalle);
    router.put('/salle/:id', putSalle);
    router.delete('/salle/:id', deleteSalle);

    router.get('/intervalles', getAllIntervalle);
    router.get('/intervalle/:id', getIntervalle);
    router.post('/intervalle', postIntervalle);
    router.put('/intervalle/:id', putIntervalle);
    router.delete('/intervalle/:id', deleteIntervalle);

    router.get('/jours', getAllJour);
    router.get('/jour/:id', getJour);
    router.put('/jour/:id', putJour);
    router.delete('/jour/:id', deleteJour);

    router.get('/heures', getAllHeure);
    router.get('/heure/:id', getHeure);
    router.post('/heure', postHeure);
    router.put('/heure/:id', putHeure);
    router.delete('/heure/:id', deleteHeure);

    router.get('/param', getAllParam);
    router.post('/param', postParam);
    router.put('/param/:id', putParam);
    router.delete('/param/:id', deleteParam);

    return app.use('/', router);
};

module.exports = initWebRoutes;