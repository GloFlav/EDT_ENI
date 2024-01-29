import { createRouter, createWebHashHistory } from 'vue-router'
import TimeTableView from '../views/TimeTableView.vue'
import SemestreView from '../views/SemestreView.vue'
import EnseignantView from '../views/EnseignantView.vue'
import NiveauView from '../views/NiveauView.vue'
import MatiereView from '../views/MatiereView.vue'
import SalleView from '../views/SalleView.vue'
import HoraireView from '../views/HoraireView.vue'
import ParamView from '../views/ParamView.vue'
import ParcoursView from '../views/ParcoursView.vue'
import GroupeView from '../views/GroupeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: TimeTableView
  },
  {
    path: '/semestre',
    name: 'semestre',
    component: SemestreView
  },
  {
    path: '/enseignant',
    name: 'enseignant',
    component: EnseignantView
  },
  {
    path: '/niveau',
    name: 'niveau',
    component: NiveauView
  },
  {
    path: '/parcours',
    name: 'parcours',
    component: ParcoursView
  },
  {
    path: '/groupe',
    name: 'groupe',
    component: GroupeView
  },
  {
    path: '/matiere',
    name: 'matiere',
    component: MatiereView
  },
  {
    path: '/horaire',
    name: 'horaire',
    component: HoraireView
  },
  {
    path: '/salle',
    name: 'salle',
    component: SalleView
  },
  {
    path: '/param',
    name: 'param',
    component: ParamView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
