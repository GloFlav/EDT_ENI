<template>
  <div>
    <div class="pagetitle">
      <h1>Groupes</h1>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal" @click="getEntityLinkedData()">Ajouter <i class="bi bi-plus-lg"></i></button>
    </div>
    <div class="card">
            <div class="card-body">
              <div class="card-title">
                Liste des groupes
                <input type="text" class="form-control" id="query" placeholder="Rechecher" v-model.trim="query">
              </div>
              <span v-if="loading" class="spinner-border spinner-border-lg" role="status"></span>
              <table v-else class="table">
                <thead>
                  <tr>
                    <th>Nom du groupe</th>
                    <th>Parcours</th>
                    <th>Niveau</th>
                    <th class="text-primary">Modifier</th>
                    <th class="text-primary">Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="g in filteredGroupes" v-bind:key="g.id">
                    <td>{{ g.nom_groupe }}</td>
                    <td>{{ g.nom_parcours }}</td>
                    <td>{{ g.nom_niveau }}</td>
                    <td>
                      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateModal" @click="triggerUpdateRequest(g)"><i class="bi bi-pencil-square"></i></button>
                    </td>
                    <td>
                      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="triggerDeleteRequest(g.id)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      <AddModal :errMsg= "onRequestErrMsg" :parcours='parcours' :niveaux='niveaux' @launchLoader = "loading = $event" @resetErrMsg = "onRequestErrMsg = $event"/>
      <UpdateModal :errMsg= "onRequestErrMsg" :parcours='parcours' :niveaux='niveaux' :groupeInfoToUpdate = 'requestedUpdateGroupe' @launchLoader = "loading = $event" @resetErrMsg = "onRequestErrMsg = $event"/>
      <DeleteModal :groupeInfoToDelete = 'requestedDeleteGroupe' @launchLoader = "loading = $event"/>
  </div>
</template>

<script>
import AddModal from '@/components/modalsComponent/groupeModals/AddModal.vue'
import UpdateModal from '@/components/modalsComponent/groupeModals/UpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/groupeModals/DeleteModal.vue'
import { readEntity } from '../services/crudService.js'
export default {
  components: {
        AddModal,
        UpdateModal,
        DeleteModal
    },
  data() {
    return {
      groupes : [],
      requestedUpdateGroupe : {},
      requestedDeleteGroupe : '',
      parcours : [],
      niveaux : [],
      loading : true,
      query : "",
      filteredGroupes : [],
      onRequestErrMsg : ''
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) this.getGroupes();
    },
    query(newVal) {
      newVal !== '' ? this.search(newVal) : this.filteredGroupes = [...this.groupes];
    }
  },
  created() {
    this.getGroupes();
  },
  methods: {
    async getGroupes() {
      const loader = setTimeout(() => {
        readEntity('groupes').then(res => {
          clearTimeout(loader);
          this.groupes = [...res.data];
          this.query !== '' ? this.search(this.query) : this.filteredGroupes = [...this.groupes];
          this.loading = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loading = false;
        })
      }, 300)
    },
    async triggerUpdateRequest(groupeInfo) {
      this.getEntityLinkedData();
      this.requestedUpdateGroupe = {...groupeInfo};
    },
    async triggerDeleteRequest(id) {
      this.requestedDeleteGroupe = id;
    },
    async getEntityLinkedData() {
      await Promise.all([
        this.getParcours(),
        this.getNiveaux()
      ]);
      if (this.parcours.length == 0 || this.parcours.length == 0) {
            if (this.niveaux.length == 0 && this.parcours.length == 0) {
              this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un niveau et un parcours"
            } else if (this.parcours.length == 0) {
              this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un niveau"
            } else if (this.niveaux.length) {
              this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours"
            }
        }
    },
    async getParcours() {
      return new Promise((resolve, reject) => {
        try {
          readEntity('parcours').then(res => {
            this.parcours = [...res.data];
            resolve(res.successResponse);
          }).catch(err => console.log(err.errorResponse))
        }
        catch(e) {
          reject(e);
        }
      })
    },
    async getNiveaux() {
      return new Promise((resolve, reject) => {
        try {
          readEntity('niveaux').then(res => {
            this.niveaux = [...res.data];
            resolve(res.successResponse);
          }).catch(err => console.log(err.errorResponse))
        }
        catch(e) {
          reject(e);
        }
      })
    },
    search(query) {
      query = query.toLowerCase();
      this.filteredGroupes = this.groupes.filter(it => {
        return (it['nom_groupe'].toLowerCase().replace(/\s+/g, "").includes(query.replace(/\s+/g, "")) || 
        it['nom_parcours'].toLowerCase().trim().includes(query) ||
        it['nom_niveau'].toLowerCase().trim().includes(query));
      })
    }
  },
}
</script>

<style scoped>
  .pagetitle {
    display: flex;
    justify-content: space-between;
  }
  .card {
    margin-top: 30px;
  }
  .card-title {
    display: flex;
    justify-content: space-between;
  }
  .card-title #query {
    width: 50%;
  }
  tbody {
    display: block;
    max-height: 450px;
    overflow-y: auto;
  }
  tbody::-webkit-scrollbar {
    width: 10px;
    background-color: #fff;
  }
  tbody::-webkit-scrollbar-thumb {
    background-color: #aab7cf;
  }
  tbody::-webkit-scrollbar-thumb:hover {
    background-color: #aab7aa;
  }
  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
</style>
