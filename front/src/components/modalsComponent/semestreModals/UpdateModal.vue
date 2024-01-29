<template>
    <div class="modal fade" id="updateModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="updateSemestre()">
                    <div class="modal-header">
                        <h5 class="modal-title">Modification - Semestre</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div class="mb-3">
                            <label for="lib" class="form-label">Nom de la semestre</label>
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
import { updateEntity }  from '../../../services/crudService.js'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
export default {
    setup () {
        return { v$: useVuelidate() }
    },
    props: ['semestreInfoToUpdate'],
    data() {
            return {
            semestreInfo : {
                id : "",
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
    watch: {
        semestreInfoToUpdate: {
            handler(newVal) {
                if (JSON.stringify(newVal) !== '{}') {
                    this.semestreInfo['id'] = newVal['id'];
                    this.semestreInfo['nom_semestre'] = newVal['nom_semestre'];
                    this.semestreInfo['date_debut'] = moment(newVal['date_debut']).format('YYYY-MM-DD');
                    this.semestreInfo['date_fin'] = moment(newVal['date_fin']).format('YYYY-MM-DD');
                }
            },
            deep: true
        }
    },
    methods: {
        async updateSemestre() {
            updateEntity('semestre', this.semestreInfo.id, this.semestreInfo)
            .then(res => {
                console.log(res.successResponse);
                this.launchLoader();
                })
            .catch(err => console.log(err.errorResponse))
        },
        formatDate(date) {
            return moment(date).format('YYYY-MM-DD');
        },
        launchLoader() {
            this.$emit('launchLoader', true);
        },
    },
}
</script>

<style scoped>

</style>