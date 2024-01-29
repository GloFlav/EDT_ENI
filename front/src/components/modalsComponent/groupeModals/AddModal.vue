<template>
    <div class="modal fade" ref="addModal" id="addModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="addGroupe()">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajout - Groupe</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="errMsg!==''">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        {{ errMsg }}
                    </div>
                    <div class="modal-body">
                        <p style="font-weight: bold;color: red;font-style: italic;">* Champs obligatoires</p>
                        <div class="mb-3">
                            <label for="lib" class="form-label"><span style="font-weight: bold;color: red;font-style: italic;">*</span> Nom</label>
                            <input type="text" class="form-control" id="lib" name="lib" v-model="groupeInfo['nom_groupe']" required>
                        </div>
                        <div class="mb-3">
                            <label for="parcours" class="form-label">Parcours</label>
                            <select id="parcours" class="form-select" name="parcours" v-model="groupeInfo['parcours_id']">
                                <option v-for="p in parcours" v-bind:key="p.id" v-bind:value="p.id">{{ p.nom_parcours }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="niveau" class="form-label">Niveau</label>
                            <select id="niveau" class="form-select" name="niveau" v-model="groupeInfo['niveau_id']">
                                <option v-for="n in niveaux" v-bind:key="n.id" v-bind:value="n.id">{{ n.nom_niveau }}</option>
                            </select>
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
    props : ['parcours', 'niveaux', 'errMsg'],
    data() {
        return {
            groupeInfo : {
                nom_groupe : "",
                parcours_id : "",
                niveau_id : ""
            }
        }
    },
    validations() {
        return {
            groupeInfo : {
               nom_groupe : { required },
               parcours_id : { required },
               niveau_id : { required }
            }
        }
    },
    watch: {
        parcours : {
            handler(newVal) {
                if (newVal.length !== 0) this.groupeInfo['parcours_id'] = newVal[0].id;
            },
            deep : true
        },
        niveaux : {
            handler(newVal) {
                if (newVal.length !== 0) this.groupeInfo['niveau_id'] = newVal[0].id;
            },
            deep : true
        },
    },
    mounted() {
    (this.$refs.addModal).addEventListener("hidden.bs.modal", () => {
        this.groupeInfo = {};
        if (this.errMsg !== '') this.resetErrMsg()
        })
    },
    methods: {
        async addGroupe() {
            createEntity('groupe', this.groupeInfo)
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