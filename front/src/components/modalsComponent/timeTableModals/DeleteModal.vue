<template>
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="deletePlanification()">
                    <div class="modal-header">
                        <h5 class="modal-title">Suppression - Plannification</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Etes-vous vraiment sûr de supprimer cette plannification ?
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
import { deletePlanification } from '../../../services/planificationService';
export default {
    props: ['planIdToDelete'],
    methods: {
        async deletePlanification() {
            deletePlanification(this.planIdToDelete)
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