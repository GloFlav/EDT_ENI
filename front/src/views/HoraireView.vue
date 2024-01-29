<template>
  <div>
    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="heureExists">
        <i class="bi bi-exclamation-triangle me-1"></i>
        Désolé, la/les heures que vous voulez insérer sont déjà incluses dans une autre intervalle d'heures existante.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="heureExists=false"></button>
    </div>
    <div class="pagetitle">
      <h1>Horaires</h1>
      </div>
      <div class="row">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Liste des jours</h5>
              <span v-if="loadingJ" class="spinner-border spinner-border-lg" role="status"></span>
              <table v-else class="table">
                <thead>
                  <tr>
                    <th>Jour</th>
                    <th class="text-primary">Modifier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="j in jours" v-bind:key="j.id">
                    <td>{{ j.nom_jour }}</td>
                    <td>
                      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateDayModal" @click="triggerUpdateJourRequest(j)"><i class="bi bi-pencil-square"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
              <div class="card-body">
                <div class="title-section">
                  <h5 class="card-title">Liste des heures</h5>
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">Ajouter <i class="bi bi-plus-lg"></i></button>
                </div>
                <span v-if="loadingH" class="spinner-border spinner-border-lg" role="status"></span>
                <table v-else class="table">
                  <thead>
                    <tr>
                      <th>Début</th>
                      <th>Fin</th>
                      <th class="text-primary">Modifier</th>
                      <th class="text-primary">Supprimer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="h in heures" v-bind:key="h.id">
                    <td>{{ formatTime(h.debut) }}</td>
                    <td>{{ formatTime(h.fin) }}</td>
                      <td>
                        <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateModal" @click="triggerUpdateHeureRequest(h)"><i class="bi bi-pencil-square"></i></button>
                      </td>
                      <td>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="triggerDeleteHeureRequest(h.id)"><i class="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
      <UpdateDayModal :jourInfoToUpdate = 'requestedUpdateJour' @launchLoader = "loadingJ = $event"/>
      <AddModal @launchLoader = "loadingH = $event" @responseError = "heureExists = $event"/>
      <UpdateModal :heureInfoToUpdate = 'requestedUpdateHeure' @launchLoader = "loadingH = $event" @responseError = "heureExists = $event"/>
      <DeleteModal :heureInfoToDelete = 'requestedDeleteHeure' @launchLoader = "loadingH = $event"/>
  </div>
</template>

<script>
import moment from 'moment'
import UpdateDayModal from '@/components/modalsComponent/horaireModals/jourModals/UpdateDayModal.vue'
import AddModal from '@/components/modalsComponent/horaireModals/heureModals/AddModal.vue'
import UpdateModal from '@/components/modalsComponent/horaireModals/heureModals/UpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/horaireModals/heureModals/DeleteModal.vue'
import { readEntity } from '../services/crudService.js'
export default {
  components: {
        AddModal,
        UpdateModal,
        DeleteModal,
        UpdateDayModal
    },
  data() {
    return {
      jours : [],
      heures : [],
      requestedUpdateHeure : {},
      requestedDeleteHeure : '',
      heureExists : false,
      requestedUpdateJour : {},
      loadingJ : false,
      loadingH : false
    }
  },
  watch: {
    loadingJ(newVal) {
      if (newVal) this.getJours();
    },
    loadingH(newVal) {
      if (newVal) this.getHeures();
    },
    heureExists(newVal) {
      if (newVal) {
        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          this.heureExists = false;
        }, 5000)
      }
    }
  },
  created() {
    this.getJours()
    this.getHeures()
  },
  methods: {
    async getJours() {
      this.loadingJ = true;
      const loader = setTimeout(() => {
        readEntity('jours').then(res => {
          clearTimeout(loader);
          this.jours = [...res.data];
          this.loadingJ = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loadingJ = false;
        })
      }, 300)
    },
    async getHeures() {
      this.loadingH = true;
      const loader = setTimeout(() => {
        readEntity('heures').then(res => {
          clearTimeout(loader);
          this.heures = [...res.data];
          this.loadingH = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loadingH = false;
        })
      }, 300)
    },
    async triggerUpdateHeureRequest(heureInfo) {
      this.requestedUpdateHeure = {...heureInfo};
    },
    async triggerUpdateJourRequest(jourInfo) {
      this.requestedUpdateJour = {...jourInfo};
    },
    async triggerDeleteHeureRequest(id) {
      this.requestedDeleteHeure = id;
    },
    formatTime(time) {
      return moment(time, 'HH:mm:ss').format('HH:mm')
    }
  },
}
</script>

<style scoped>
  .title-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title-section button {
    display: block;
  }
  .card {
    margin-top: 30px;
  }
  button {
    display: flex;
  }
</style>
