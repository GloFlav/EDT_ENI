<template>
  <div>
    <div class="pagetitle">
      <h1>Matières</h1>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal" @click="getEntityLinkedData()">Ajouter <i class="bi bi-plus-lg"></i></button>
    </div>
    <div class="card">
            <div class="card-body">
              <div class="card-title">
                Liste des matières
                <input type="text" class="form-control" id="query" placeholder="Rechecher" v-model.trim="query">  
              </div>
              <span v-if="loading" class="spinner-border spinner-border-lg" role="status"></span>
              <table v-else class="table">
                <thead>
                  <tr>
                    <th>Matière</th>
                    <th>Parcours</th>
                    <th>Niveau</th>
                    <th>Enseignant</th>
                    <!-- <th>Semestre</th> -->
                    <th class="text-primary">Modifier</th>
                    <th class="text-primary">Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in filteredMatieres" v-bind:key="m.id">
                    <td>{{ m.matiere.nom_matiere }}</td>
                    <td><span v-for="p in m.parcours" v-bind:key="p.id">{{ p.nom_parcours }}<br></span></td>
                    <td>{{ m.matiere.nom_niveau }}</td>
                    <td>{{ m.matiere.nom_enseignant }}</td>
                    <!-- <td>{{ m.matiere.nom_semestre }}</td> -->
                    <td>
                      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateModal" @click="triggerUpdateRequest(m)"><i class="bi bi-pencil-square"></i></button>
                    </td>
                    <td>
                      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="triggerDeleteRequest(m.matiere.id)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- <div class="card-footer">
              <ul class="pagination">
                  <li class="page-item">
                    <span class="page-link" aria-hidden="true">&laquo; Précédent</span>
                  </li>
                  <li class="page-item">
                    <span class="page-link" aria-hidden="true">Suivant &raquo;</span>
                  </li>
                </ul>
            </div> -->
          </div>
      <AddModal :errMsg= "onRequestErrMsg" :enseignants='enseignants' :parcours='parcours' :niveaux='niveaux' :semestres='semestres' @launchLoader = "loading = $event" @resetErrMsg = "onRequestErrMsg = $event"/>
      <UpdateModal :errMsg= "onRequestErrMsg" :enseignants='enseignants' :parcours='parcours' :niveaux='niveaux' :semestres='semestres' :matiereInfoToUpdate = 'requestedUpdateMatiere' @launchLoader = "loading = $event" @resetErrMsg = "onRequestErrMsg = $event"/>
      <DeleteModal :matiereInfoToDelete = 'requestedDeleteMatiere' @launchLoader = "loading = $event"/>
  </div>
</template>

<script>
import AddModal from '@/components/modalsComponent/matiereModals/AddModal.vue'
import UpdateModal from '@/components/modalsComponent/matiereModals/UpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/matiereModals/DeleteModal.vue'
import { readEntity } from '../services/crudService.js'
export default {
  components: {
        AddModal,
        UpdateModal,
        DeleteModal
    },
  data() {
    return {
      matieres : [],
      filteredMatieres : [],
      query : "",
      requestedUpdateMatiere : {},
      requestedDeleteMatiere : '',
      enseignants : [],
      parcours : [],
      niveaux : [],
      semestres : [],
      loading : true,
      onRequestErrMsg : "",
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) this.getMatieres();
    },
    query(newVal) {
      newVal !== '' ? this.search(newVal) : this.filteredMatieres = [...this.matieres];
    }
  },
  created() {
    this.getMatieres()
  },
  methods: {
    async getMatieres() {
      const loader = setTimeout(() => {
        readEntity('matieres').then(res => {
          clearTimeout(loader);
          this.matieres = [...res.data];
          this.query !== '' ? this.search(this.query) : this.filteredMatieres = [...this.matieres];
          this.loading = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loading = false;
        })
      }, 300)
    },
    async triggerUpdateRequest(matiereInfo) {
      this.getEntityLinkedData()
      this.requestedUpdateMatiere = {...matiereInfo};
    },
    async triggerDeleteRequest(id) {
      this.requestedDeleteMatiere = id;
    },
    async getEntityLinkedData() {
      await Promise.all([
        this.getEnseignants(),
        this.getParcours(),
        this.getNiveaux(),
        this.getSemestres()
      ]);
      if (this.niveaux.length == 0 || this.parcours.length == 0 || this.enseignants.length ==0) {
        if (this.niveaux.length == 0 && this.parcours.length == 0 && this.enseignants.length ==0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours, niveau et enseignant";
        } else if (this.niveaux.length == 0 && this.parcours.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours et un niveau";
        } else if (this.parcours.length == 0 && this.enseignants.length ==0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours et une enseignant";
        } else if (this.niveaux.length == 0 && this.enseignants.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un niveau et une enseignant";
        } else if (this.parcours.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours";
        } else if (this.niveaux.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un niveau";
        } else if (this.enseignants.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins une enseignant";
        }
      }
    },
    async getEnseignants() {
      return new Promise((resolve, reject) => {
        try {
          readEntity('enseignants').then(res => {
            this.enseignants = [...res.data];
            resolve(res.successResponse);
          }).catch(err => console.log(err.errorResponse))
        }
        catch (e) {
          reject(e)
        }
      })
    },
    async getParcours() {
      return new Promise((resolve, reject) => {
        try {
          readEntity('parcours').then(res => {
            this.parcours = [...res.data];
            resolve(res.successResponse);
          }).catch(err => console.log(err.errorResponse))
        }
        catch (e) {
          reject(e)
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
        catch (e) {
          reject(e)
        }
      })
    },
    async getSemestres() {
      return new Promise((resolve, reject) => {
        try {
          readEntity('semestres').then(res => {
            this.semestres = [...res.data];
            resolve(res.successResponse);
          }).catch(err => console.log(err.errorResponse))
        }
        catch (e) {
          reject(e)
        }
      })
    },
    search(query) {
      query = query.toLowerCase();
      this.filteredMatieres = this.matieres.filter(it => {
        return (it['matiere']['nom_matiere'].toLowerCase().trim().includes(query) || 
        it['matiere']['nom_niveau'].toLowerCase().trim().includes(query) ||
        it['matiere']['nom_enseignant'].toLowerCase().trim().includes(query) ||
        it['parcours'].some(el => el['nom_parcours'].toLowerCase().trim().includes(query)));
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
  .pagination {
    justify-content: center;
  }
  .page-item {
    cursor: pointer;
  }
</style>
