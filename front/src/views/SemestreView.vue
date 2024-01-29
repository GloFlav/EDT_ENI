<template>
  <div>
    <div class="pagetitle">
      <h1>Semestres</h1>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">Ajouter <i class="bi bi-plus-lg"></i></button>
    </div>
    <div class="card">
            <div class="card-body">
              <h5 class="card-title">Liste des semestres</h5>
              <span v-if="loading" class="spinner-border spinner-border-lg" role="status"></span>
              <table v-else class="table">
                <thead>
                  <tr>
                    <th>Semestre</th>
                    <th>Date de début</th>
                    <th>Date de fin</th>
                    <th class="text-primary">Modifier</th>
                    <th class="text-primary">Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in semestres" v-bind:key="s.id">
                    <td>{{ s.nom_semestre }}</td>
                    <td>{{ formatDate(s.date_debut) }}</td>
                    <td>{{ formatDate(s.date_fin) }}</td>
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
      <UpdateModal :semestreInfoToUpdate = 'requestedUpdateSemestre' @launchLoader = "loading = $event"/>
      <DeleteModal :semestreInfoToDelete = 'requestedDeleteSemestre' @launchLoader = "loading = $event"/>
  </div>
</template>

<script>
import moment from 'moment'
import AddModal from '@/components/modalsComponent/semestreModals/AddModal.vue'
import UpdateModal from '@/components/modalsComponent/semestreModals/UpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/semestreModals/DeleteModal.vue'
import { readEntity } from '../services/crudService.js'
export default {
  components: {
        AddModal,
        UpdateModal,
        DeleteModal
    },
  data() {
    return {
      semestres : [],
      requestedUpdateSemestre : {},
      requestedDeleteSemestre : '',
      loading: false
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) this.getSemestres();
    }
  },
  created() {
    this.getSemestres()
  },
  methods: {
    async getSemestres() {
      this.loading = true;
      const loader = setTimeout(() => {
        readEntity('semestres').then(res => {
          clearTimeout(loader);
          this.semestres = [...res.data];
          this.loading = false;
        }).catch(err => { 
          clearTimeout(loader);
          console.log(err.errorResponse);
          this.loading = false;
        })
      }, 300)
    },
    async triggerUpdateRequest(semestreInfo) {
      this.requestedUpdateSemestre = {...semestreInfo};
    },
    async triggerDeleteRequest(id) {
      this.requestedDeleteSemestre = id;
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
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
</style>
