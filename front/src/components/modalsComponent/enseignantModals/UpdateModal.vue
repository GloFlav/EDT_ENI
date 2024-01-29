<template>
    <div class="modal fade" id="updateModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="updateEnseignant()">
                    <div class="modal-header">
                        <h5 class="modal-title">Modification - Enseignant</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div>
                            <label for="nom" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Nom complet</label>
                            <input type="text" class="form-control" id="nom" name="nom" v-model.trim="enseignantInfo['nom_enseignant']" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" :disabled="v$.$invalid">Enregistrer</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { updateEntity }  from '../../../services/crudService.js'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
export default {
    setup () {
        return { v$: useVuelidate() }
    },
    props: ['enseignantInfoToUpdate'],
    data() {
        return {
            enseignantInfo : {
                id : '',
                nom_enseignant : ''
            }
        }
    },
    validations() {
        return {
            enseignantInfo : {
               nom_enseignant : { required }
            }
        }
    },
    watch: {
        enseignantInfoToUpdate: {
            handler(newVal) {
                if (JSON.stringify(newVal) !== '{}') {
                    this.enseignantInfo = {...newVal}
                }
            },
            deep: true
        }
    },
    methods: {
        async updateEnseignant() {
            updateEntity('enseignant', this.enseignantInfo.id, this.enseignantInfo)
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