<template>
  <div class="container">
    <div class="pagetitle">
      <h1>Enseignants</h1>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">Ajouter <i class="bi bi-plus-lg"></i></button>
    </div>
    <div class="card">
            <div class="card-body">
              <div class="card-title">
                Liste des enseignants
                <input type="text" class="form-control" id="query" placeholder="Rechecher" v-model.trim="query">
                </div>
              <span v-if="loading" class="spinner-border spinner-border-lg" role="status"></span>
              <table v-else class="table">
                <thead>
                  <tr>
                    <th>Nom de l'enseignant</th>
                    <th class="text-primary">Modifier</th>
                    <th class="text-primary">Supprimer</th>
                  </tr>
                </thead>
                <tbody id="enseignant-liste">
                  <tr v-for="e in filteredEnseignants" v-bind:key="e.id">
                    <td>{{ e.nom_enseignant }}</td>
                    <td>
                      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateModal" @click="triggerUpdateRequest(e)"><i class="bi bi-pencil-square"></i></button>
                    </td>
                    <td>
                      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="triggerDeleteRequest(e.id)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
          </div>
      <AddModal @launchLoader = "loading = $event"/>
      <UpdateModal :enseignantInfoToUpdate = 'requestedUpdateEnseignant' @launchLoader = "loading = $event"/>
      <DeleteModal :enseignantInfoToDelete = 'requestedDeleteEnseignant' @launchLoader = "loading = $event"/>
  </div>
</template>

<script>
import AddModal from '@/components/modalsComponent/enseignantModals/AddModal.vue'
import UpdateModal from '@/components/modalsComponent/enseignantModals/UpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/enseignantModals/DeleteModal.vue'
import { readEntity } from '../services/crudService.js'
export default {
  components: {
        AddModal,
        UpdateModal,
        DeleteModal
    },
  data() {
    return {
      enseignants : [],
      requestedUpdateEnseignant : {},
      requestedDeleteEnseignant : '',
      loading : true,
      query : "",
      filteredEnseignants : []
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) this.getEnseignants();
    },
    query(newVal) {
      newVal !== '' ? this.search(newVal) : this.filteredEnseignants = [...this.enseignants];
    }
  },
  created() {
    this.getEnseignants();
  },
  methods: {
    async getEnseignants() {
      const loader = setTimeout(() => {
        readEntity('enseignants').then(res => {
          clearTimeout(loader);
          this.enseignants = [...res.data];
          this.query !== '' ? this.search(this.query) : this.filteredEnseignants = [...this.enseignants];
          this.loading = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loading = false;
        })
      }, 300)
    },
    async triggerUpdateRequest(enseignantInfo) {
      this.requestedUpdateEnseignant = {...enseignantInfo};
    },
    async triggerDeleteRequest(id) {
      this.requestedDeleteEnseignant = id;
    },
    search(query) {
      this.filteredEnseignants = this.enseignants.filter(it => {
        return it['nom_enseignant'].toLowerCase().trim().includes(query.toLowerCase());
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
