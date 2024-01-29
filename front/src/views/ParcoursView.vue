<template>
  <div>
    <div class="pagetitle">
      <h1>Parcours</h1>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">Ajouter <i class="bi bi-plus-lg"></i></button>
    </div>
    <div class="card">
            <div class="card-body">
              <div class="card-title">
                Liste des parcours
                <input type="text" class="form-control" id="query" placeholder="Rechecher" v-model.trim="query">
              </div>
              <span v-if="loading" class="spinner-border spinner-border-lg" role="status"></span>
              <table v-else class="table">
                <thead>
                  <tr>
                    <th>Parcours</th>
                    <th class="text-primary">Modifier</th>
                    <th class="text-primary">Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in filteredParcours" v-bind:key="p.id">
                    <td>{{ p.nom_parcours }}</td>
                    <td>
                      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateModal" @click="triggerUpdateRequest(p)"><i class="bi bi-pencil-square"></i></button>
                    </td>
                    <td>
                      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="triggerDeleteRequest(p.id)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
    <AddModal @launchLoader = "loading = $event"/>
    <UpdateModal :parcoursInfoToUpdate = 'requestedUpdateParcours' @launchLoader = "loading = $event"/>
    <DeleteModal :parcoursInfoToDelete = 'requestedDeleteParcours' @launchLoader = "loading = $event"/>
  </div>
</template>

<script>
import AddModal from '@/components/modalsComponent/parcoursModals/AddModal.vue'
import UpdateModal from '@/components/modalsComponent/parcoursModals/UpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/parcoursModals/DeleteModal.vue'
import { readEntity } from '../services/crudService.js'
export default {
  components: {
        AddModal,
        UpdateModal,
        DeleteModal
    },
  data() {
    return {
      parcours : [],
      requestedUpdateParcours : {},
      requestedDeleteParcours : '',
      loading : true,
      query : "",
      filteredParcours : []
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) this.getParcours();
    },
    query(newVal) {
      newVal !== '' ? this.search(newVal) : this.filteredParcours = [...this.parcours];
    }
  },
  created() {
    this.getParcours()
  },
  methods: {
    async getParcours() {
      const loader = setTimeout(() => {
        readEntity('parcours').then(res => {
          clearTimeout(loader);
          this.parcours = [...res.data];
          this.query !== '' ? this.search(this.query) : this.filteredParcours = [...this.parcours];
          this.loading = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loading = false;
        })
      }, 300)
    },
    async triggerUpdateRequest(parcoursInfo) {
      this.requestedUpdateParcours = {...parcoursInfo};
    },
    async triggerDeleteRequest(id) {
      this.requestedDeleteParcours = id;
    },
    search(query) {
      this.filteredParcours = this.parcours.filter(it => {
        return it['nom_parcours'].toLowerCase().trim().includes(query.toLowerCase());
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
