<template>
    <div class="modal fade" id="updateModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="updateParcours()">
                    <div class="modal-header">
                        <h5 class="modal-title">Modification - Parcours</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div class="mb-3">
                            <label for="lib" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Nom</label>
                            <input type="text" class="form-control" id="lib" name="lib" v-model="parcoursInfo['nom_parcours']" required>
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
    props: ['parcoursInfoToUpdate'],
    data() {
        return {
            parcoursInfo : {
                nom_parcours : ""
            }
        }
    },
    validations() {
        return {
            parcoursInfo : {
               nom_parcours : { required }
            }
        }
    },
    watch: {
        parcoursInfoToUpdate: {
            handler(newVal) {
                if (JSON.stringify(newVal) !== '{}') {
                    this.parcoursInfo = {...newVal}
                }
            },
            deep: true
        }
    },
    methods: {
        async updateParcours() {
            updateEntity('parcours', this.parcoursInfo.id, this.parcoursInfo)
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