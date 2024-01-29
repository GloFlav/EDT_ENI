<template>
  <div>
    <div class="pagetitle">
      <h1>Paramètres</h1>
    </div>
    <div class="card">
            <div class="card-body">
              <h5 class="card-title">Liste des paramètres</h5>

              <table class="table">
                <thead>
                  <tr>
                    <th>Durée normale séance matière</th>
                    <th class="text-primary">Modifier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>
                      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#basicModal"><i class="bi bi-pencil-square"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      <UpdateModal/>
  </div>
</template>

<script>
import UpdateModal from '@/components/modalsComponent/paramModals/UpdateModal.vue'
export default {
  components: {
        UpdateModal
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
