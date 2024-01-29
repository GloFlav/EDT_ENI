<template>
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="deleteGroupe()">
                    <div class="modal-header">
                        <h5 class="modal-title">Suppression - Groupe</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Etes-vous vraiment sûr de supprimer ce groupe ?
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Oui</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Non</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteEntity }  from '../../../services/crudService.js'
export default {
    props: ['groupeInfoToDelete'],
    methods: {
        async deleteGroupe() {
            deleteEntity('groupe', this.groupeInfoToDelete)
            .then(res => {
                console.log(res.successResponse);
                this.launchLoader();
                })
            .catch(err => console.log(err.errorResponse))
        },
        launchLoader() {
            this.$emit('launchLoader', true);
        },
    },
}
</script>

<style scoped>

</style>