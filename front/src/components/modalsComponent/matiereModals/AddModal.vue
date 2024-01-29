<template>
    <div class="modal fade" ref="addModal" id="addModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="addMatiere()">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajout - Matière</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="errMsg!==''">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        {{ errMsg }}
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div class="mb-3">
                            <label for="nom" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Nom</label>
                            <input type="text" class="form-control" id="nom" name="nom" v-model="matiereInfo['nom_matiere']" required>
                        </div>
                        <div class="mb-3">
                            <label for="enseignant" class="form-label">Enseignant</label>
                            <select id="enseignant" class="form-select" name="enseignant" v-model="matiereInfo['enseignant_id']">
                                <option v-for="e in enseignants" v-bind:key="e.id" v-bind:value="e.id">{{ e.nom_enseignant }}</option>
                            </select>
                        </div>
                        <!-- <div class="mb-3">
                            <label for="semestre" class="form-label">Semestre</label>
                            <select id="semestre" class="form-select" name="semestre" v-model="matiereInfo['semestre_id']">
                                <option v-for="s in semestres" v-bind:key="s.id" v-bind:value="s.id">{{ s.nom_semestre }}</option>
                            </select>
                        </div> -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="parcours" class="form-label">Parcours</label>
                                <select id="parcours" class="form-select" name="parcours" v-model="matiereInfo['parcours_id']" multiple>
                                    <option v-for="p in parcours" v-bind:key="p.id" v-bind:value="p.id">{{ p.nom_parcours }}</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="niveau" class="form-label">Niveau</label>
                                <select id="niveau" class="form-select" name="niveau" v-model="matiereInfo['niveau_id']">
                                    <option v-for="n in niveaux" v-bind:key="n.id" v-bind:value="n.id">{{ n.nom_niveau }}</option>
                                </select>
                            </div>
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
    props : ['parcours', 'niveaux', 'enseignants', 'semestres', 'errMsg'],
    data() {
        return {
            matiereInfo : {
                nom_matiere : "",
                parcours_id : [],
                niveau_id : "",
                enseignant_id : "",
                semestre_id : "",
                total_heure : ""
            }
        }
    },
    validations() {
        return {
            matiereInfo : {
               nom_matiere : { required },
               parcours_id : { minValue(val) {
                    return val.length != 0;
                    }
                },
                niveau_id : { required },
                enseignant_id : { required },
            }
        }
    },
    watch: {
        niveaux : {
            handler(newVal) {
                if (newVal.length !== 0) this.matiereInfo['niveau_id'] = newVal[0].id;
            },
            deep : true
        },
        enseignants : {
            handler(newVal) {
                if (newVal.length !== 0) this.matiereInfo['enseignant_id'] = newVal[0].id;
            },
            deep : true
        },
        semestres : {
            handler(newVal) {
                if (newVal.length !== 0) this.matiereInfo['semestre_id'] = newVal[0].id;
            },
            deep : true
        },
    },
    mounted() {
    (this.$refs.addModal).addEventListener("hidden.bs.modal", () => {
        this.matiereInfo = {};
        this.matiereInfo.parcours_id = [];
        if (this.errMsg !== '') this.resetErrMsg()
        })
    },
    methods: {
        async addMatiere() {
            createEntity('matiere', this.matiereInfo)
            .then(res => { 
                console.log(res.successResponse);
                this.launchLoader();
                })
            .catch(err => console.log(err.errorResponse))
        },
        launchLoader() {
            this.$emit('launchLoader', true);
        },
        resetErrMsg() {
            this.$emit('resetErrMsg', "")
        }
    },
}
</script>

<style scoped>

</style>