<template>
    <div class="modal fade" ref="addModal" id="addModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="addSemestre()">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajout - Semestre</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div class="mb-3">
                            <label for="lib" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Nom de la semestre</label>
                            <input type="text" class="form-control" id="lib" name="lib" v-model="semestreInfo['nom_semestre']" required>
                        </div>
                        <div class="mb-3">
                            <label for="date-debut" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Date de début</label>
                            <input type="date" class="form-control" id="date-debut" name="date-debut" v-model="semestreInfo['date_debut']" required>
                        </div>
                        <div class="mb-3">
                            <label for="date-fin" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Date de fin</label>
                            <input type="date" class="form-control" id="date-fin" name="date-fin" v-model="semestreInfo['date_fin']" required>
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
import { createEntity }  from '../../../services/crudService.js'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
export default {
    setup () {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            semestreInfo : {
                nom_semestre : "",
                date_debut : "",
                date_fin : ""
            }
        }
    },
    validations() {
        return {
            semestreInfo : {
                nom_semestre : { required },
                date_debut : { required },
                date_fin : { required, 
                        minValue(val, { date_debut }) {
                            return moment(val).isAfter(moment(date_debut))
                    } 
                }
            }
        }
    },
    mounted() {
    (this.$refs.addModal).addEventListener("hidden.bs.modal", () => {
        this.semestreInfo = {};
        })
    },
    methods: {
        async addSemestre() {
            //validateDateAfter
            createEntity('semestre', this.semestreInfo)
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