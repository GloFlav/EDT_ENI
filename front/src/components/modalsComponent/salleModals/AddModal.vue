<template>
    <div class="modal fade" ref="addModal" id="addModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="addSalle()">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajout - Salle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div>
                            <label for="lib" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Nom de la salle</label>
                            <input type="text" class="form-control" id="lib" name="lib" v-model="salleInfo['nom_salle']" required>
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
import { createEntity }  from '../../../services/crudService.js'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
export default {
    setup () {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            salleInfo : {}
        }
    },
    validations() {
        return {
            salleInfo : {
               nom_salle : { required }
            }
        }
    },
    mounted() {
    (this.$refs.addModal).addEventListener("hidden.bs.modal", () => {
        this.salleInfo = {};
        })
    },
    methods: {
        async addSalle() {
            createEntity('salle', this.salleInfo)
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