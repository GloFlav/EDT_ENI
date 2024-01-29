<template>
  <div>
    <div class="pagetitle">
      <h1>Salles</h1>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">Ajouter <i class="bi bi-plus-lg"></i></button>
    </div>
    <div class="card">
            <div class="card-body">
              <div class="card-title">
                Liste des salles
                <input type="text" class="form-control" id="query" placeholder="Rechecher" v-model.trim="query">
              </div>
              <span v-if="loading" class="spinner-border spinner-border-lg" role="status"></span>
              <table v-else class="table">
                <thead>
                  <tr>
                    <th>Salle</th>
                    <th class="text-primary">Modifier</th>
                    <th class="text-primary">Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in filteredSalles" v-bind:key="s.id">
                    <td>{{ s.nom_salle }}</td>
                    <td>
                      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateModal" @click="triggerUpdateRequest(s)"><i class="bi bi-pencil-square"></i></button>
                    </td>
                    <td>
                      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="triggerDeleteRequest(s.id)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      <AddModal @launchLoader = "loading = $event"/>
      <UpdateModal :salleInfoToUpdate = 'requestedUpdateSalle' @launchLoader = "loading = $event"/>
      <DeleteModal :salleInfoToDelete = 'requestedDeleteSalle' @launchLoader = "loading = $event"/>
  </div>
</template>

<script>
import AddModal from '@/components/modalsComponent/salleModals/AddModal.vue'
import UpdateModal from '@/components/modalsComponent/salleModals/UpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/salleModals/DeleteModal.vue'
import { readEntity } from '../services/crudService.js'
export default {
  components: {
        AddModal,
        UpdateModal,
        DeleteModal
    },
  data() {
    return {
      salles : [],
      requestedUpdateSalle : {},
      requestedDeleteSalle : '',
      loading : true,
      query : "",
      filteredSalles : [],
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) this.getSalles();
    },
    query(newVal) {
      newVal !== '' ? this.search(newVal) : this.filteredSalles = [...this.salles];
    }
  },
  created() {
    this.getSalles()
  },
  methods: {
    async getSalles() {
      const loader = setTimeout(() => {
        readEntity('salles').then(res => {
          clearTimeout(loader);
          this.salles = [...res.data];
          this.query !== '' ? this.search(this.query) : this.filteredSalles = [...this.salles];
          this.loading = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loading = false;
        })
      }, 300)
    },
    async triggerUpdateRequest(salleInfo) {
      this.requestedUpdateSalle = {...salleInfo};
    },
    async triggerDeleteRequest(id) {
      this.requestedDeleteSalle = id;
    },
    search(query) {
      this.filteredSalles = this.salles.filter(it => {
        return it['nom_salle'].toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""));
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
