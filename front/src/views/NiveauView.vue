<template>
  <div>
    <div class="pagetitle">
      <h1>Niveaux</h1>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">Ajouter <i class="bi bi-plus-lg"></i></button>
    </div>
    <div class="card">
            <div class="card-body">
              <div class="card-title">
                Liste des niveaux
                <input type="text" class="form-control" id="query" placeholder="Rechecher" v-model.trim="query">  
              </div>
              <span v-if="loading" class="spinner-border spinner-border-lg" role="status"></span>
              <table v-else class="table">
                <thead>
                  <tr>
                    <th>Niveau</th>
                    <th class="text-primary">Modifier</th>
                    <th class="text-primary">Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="n in filteredNiveaux" v-bind:key="n.id">
                    <td>{{ n.nom_niveau }}</td>
                    <td>
                      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateModal" @click="triggerUpdateRequest(n)"><i class="bi bi-pencil-square"></i></button>
                    </td>
                    <td>
                      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="triggerDeleteRequest(n.id)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      <AddModal @launchLoader = "loading = $event"/>
      <UpdateModal :niveauInfoToUpdate = 'requestedUpdateNiveau' @launchLoader = "loading = $event"/>
      <DeleteModal :niveauInfoToDelete = 'requestedDeleteNiveau' @launchLoader = "loading = $event"/>
  </div>
</template>

<script>
import AddModal from '@/components/modalsComponent/niveauModals/AddModal.vue'
import UpdateModal from '@/components/modalsComponent/niveauModals/UpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/niveauModals/DeleteModal.vue'
import { readEntity } from '../services/crudService.js'
export default {
  components: {
        AddModal,
        UpdateModal,
        DeleteModal
    },
  data() {
    return {
      niveaux : [],
      requestedUpdateNiveau : {},
      requestedDeleteNiveau : '',
      loading : true,
      query : "",
      filteredNiveaux : [],
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) this.getNiveaux();
    },
    query(newVal) {
      newVal !== '' ? this.search(newVal) : this.filteredNiveaux = [...this.niveaux];
    }
  },
  created() {
    this.getNiveaux()
  },
  methods: {
    async getNiveaux() {
      const loader = setTimeout(() => {
        readEntity('niveaux').then(res => {
          clearTimeout(loader);
          this.niveaux = [...res.data];
          this.query !== '' ? this.search(this.query) : this.filteredNiveaux = [...this.niveaux];
          this.loading = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loading = false;
        })
      }, 300)
    },
    async triggerUpdateRequest(niveauInfo) {
      this.requestedUpdateNiveau = {...niveauInfo};
    },
    async triggerDeleteRequest(id) {
      this.requestedDeleteNiveau = id;
    },
    search(query) {
      this.filteredNiveaux = this.niveaux.filter(it => {
        return it['nom_niveau'].toLowerCase().trim().includes(query.toLowerCase());
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
