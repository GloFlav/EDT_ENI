<template>
    <div class="modal fade" id="updateModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="updateNiveau()">
                    <div class="modal-header">
                        <h5 class="modal-title">Modification - Niveau</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div class="mb-3">
                            <label for="lib" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Nom</label>
                            <input type="text" class="form-control" id="lib" name="lib" v-model="niveauInfo['nom_niveau']" required>
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
    props: ['niveauInfoToUpdate'],
    data() {
        return {
            niveauInfo : {
                nom_niveau : ""
            }
        }
    },
    validations() {
        return {
            niveauInfo : {
               nom_niveau : { required }
            }
        }
    },
    watch: {
        niveauInfoToUpdate: {
            handler(newVal) {
                if (JSON.stringify(newVal) !== '{}') {
                    this.niveauInfo = {...newVal}
                }
            },
            deep: true
        }
    },
    methods: {
        async updateNiveau() {
            updateEntity('niveau', this.niveauInfo.id, this.niveauInfo)
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