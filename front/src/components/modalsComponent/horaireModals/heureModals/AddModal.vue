<template>
    <div class="modal fade" ref="addModal" id="addModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="addHeure()">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajout - Heure</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div class="mb-3">
                            <label for="date-debut" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Début</label>
                            <input type="time" class="form-control" id="date-debut" name="date-debut" v-model="heureInfo['debut']" required>
                        </div>
                        <div class="mb-3">
                            <label for="date-fin" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Fin</label>
                            <input type="time" class="form-control" id="date-fin" name="date-fin" v-model="heureInfo['fin']" required>
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
import moment from 'moment'
import { createEntity }  from '../../../../services/crudService.js'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
    setup () {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            heureInfo : {
                debut : "",
                fin : ""
            }
        }
    },
    validations() {
        return {
            heureInfo : {
                debut : { required },
                fin : { required, 
                        minValue(val, { debut }) {
                            return moment(val, 'HH:mm').isAfter(moment(debut, 'HH:mm'))
                    } 
                }
            }
        }
    },
    mounted() {
    (this.$refs.addModal).addEventListener("hidden.bs.modal", () => {
        this.heureInfo = {};
        })
    },
    methods: {
        async addHeure() {
            this.v$.$touch()
            if (!this.v$.$invalid) {
                createEntity('heure', this.heureInfo)
                .then(res => {
                    if (res.successResponse.status == 400 && res.successResponse.error) {
                        this.sendResponseError();
                    } else {
                        this.launchLoader();
                    }
                    })
                .catch(err => console.log(err.errorResponse))
            }
        },
        sendResponseError() {
            this.$emit('responseError', true);
        },
        launchLoader() {
            this.$emit('launchLoader', true);
        },
    },
}
</script>

<style scoped>

</style>