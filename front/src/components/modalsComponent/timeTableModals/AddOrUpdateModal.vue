<template>
    <div class="modal fade" ref="addOrUpdateModal" id="addOrUpdateModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="requestOnPlanification()">
                    <div class="modal-header">
                        <h5 class="modal-title">Plannification</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="noSalles()">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        Veuillez d'abord ajouter au moins libérer une salle ou en ajouter d'autres
                    </div>
                    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="sameProfDiffMat">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        Veuillez bien vérifier car il y a des matières différentes ayant le même enseignant
                    </div>
                    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="errMsg!==''">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        {{ errMsg }}
                    </div>
                    <div v-else class="modal-body">
                        <div v-if="showMultiForm" class="mb-3">
                            <div class="d-flex align-items-start">
                                <div class="nav flex-column nav-pills me-3" style="width:25%" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    <button v-for="g in groupes" v-bind:key="g.id" :disabled="isActiveGroupe(g)" @click="setActiveGroupe(g)" class="nav-link" :class="{active:isActiveGroupe(g)}" data-bs-toggle="pill" :data-bs-target="'#G-'+g.id" type="button" role="tab" :aria-selected="isActiveGroupe(g)">{{g.nom_groupe}}</button>
                                </div>
                                <div class="tab-content" style="width:75%;" id="v-pills-tabContent">
                                    <div v-for="g in groupes" v-bind:key="g.id" :id="'G-'+g.id" class="tab-pane fade" :class="{show:isActiveGroupe(g), active:isActiveGroupe(g)}" role="tabpanel">
                                        <label class="form-label">Matière</label>
                                        <select class="form-select" v-model="currentGroupe(g.id)['matiere_id']">
                                            <option v-for="m in matieres" v-bind:key="m.id" v-bind:value="m.id">{{ m.nom_matiere }}</option>
                                        </select><br>
                                        <label class="form-label">Salles</label>
                                        <select class="form-select" v-model="currentGroupe(g.id)['salle_id']" @change="checkMatProf(currentGroupe(g.id))" multiple>
                                            <template v-for="s in salles">
                                                <option v-if="notInOtherGroup(g.id, s.id)" v-bind:key="s.id" v-bind:value="s.id">{{ s.nom_salle }}</option>
                                            </template>
                                        </select><br>
                                        <input class="form-check-input" type="checkbox" id="bool" v-model="currentGroupe(g.id)['bool']">
                                        <label class="form-check-label captivated-text" for="bool">
                                            Inclus d'autres parcours du même niveau et même enseignant
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="mb-3">
                                <label for="matiere" class="form-label">Matière</label>
                                <select id="matiere" class="form-select" name="matiere" v-model="planification['matiere_id']">
                                    <option v-for="m in matieres" v-bind:key="m.id" v-bind:value="m.id">{{ m.nom_matiere }}</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Salles</label>
                                <select class="form-select" v-model="planification['salle_id']" multiple>
                                    <option v-for="s in salles" v-bind:key="s.id" v-bind:value="s.id">{{ s.nom_salle }}</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="bool" v-model="planification['bool']">
                                    <label class="form-check-label captivated-text" for="bool">
                                        Inclus d'autres parcours du même niveau et même enseignant
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="errMsg==''" class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" v-if="requestType==='update'">Supprimer</button>
                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" :disabled="canSubmit()">Enregistrer</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { createPlanification, updatePlanification } from '../../../services/planificationService';
export default {
    props : ['matieres', 'salles', 'groupes', 'selectedPlanification', 'requestType', 'errMsg'],
    data() {
        return {
            planification : {
                id : "",
                matiere_id : "",
                niveau_id : "",
                parcours_id : "",
                intervalle_id : "",
                jour_id : "",
                heure_id : "",
                groupes : [{
                    plan_id : "",
                    groupe_id : "",
                    matiere_id : "",
                    salle_id : []
                }],
                salle_id : [],
                bool : false,
                showMultiForm : null,
                activeIdGroupe : '',
                sameProfDiffMat : false
            },
        }
    },
    watch: {
        requestType(newVal)  {
            if (newVal === 'create') {
                if (this.groupes.length > 0) {
                    ({
                        intervalle_id : this.planification['intervalle_id'],
                        niveau_id : this.planification['niveau_id'],
                        parcours_id : this.planification['parcours_id'],
                        jour_id : this.planification['jour_id'],
                        heure_id : this.planification['heure_id']
                    } = this.selectedPlanification);
                    this.planification['groupes'] = [];
                    for(const g of this.groupes) {
                        this.planification['groupes'].push({
                            groupe_id : g.id,
                            matiere_id : this.matieres[0].id,
                            salle_id : [], 
                            bool : false
                        })
                    }
                    this.showMultiForm = true;
                } else {
                    this.planification = {...this.selectedPlanification};
                    this.planification['salle_id'] = [];
                    this.planification['bool'] = false;
                    if (this.matieres.length != 0) this.planification["matiere_id"] = this.matieres[0].id;
                    this.showMultiForm = false;
                }
            } else if (newVal === 'update') {
                if (this.selectedPlanification.groupes && this.groupes.length > 0) {
                    ({
                        intervalle_id : this.planification['intervalle_id'],
                        niveau_id : this.planification['niveau_id'],
                        parcours_id : this.planification['parcours_id'],
                        jour_id : this.planification['jour_id'],
                        heure_id : this.planification['heure_id']
                    } = this.selectedPlanification);
                    this.planification['groupes'] = [];
                    for (const g of this.groupes) {
                        let groupe = this.selectedPlanification.groupes.find(el => el.groupe_id == g.id);
                        if (groupe) {
                            this.planification['groupes'].push({
                                plan_id : groupe.plan_id,
                                groupe_id : groupe.groupe_id,
                                matiere_id : groupe.matiere_id,
                                salle_id : groupe.salle_id,
                                bool : groupe.bool
                            })
                        } else {
                            this.planification['groupes'].push({
                            groupe_id : g.id,
                            matiere_id : this.matieres[0].id,
                            salle_id : [], 
                            bool : this.selectedPlanification.groupes.some(el => el.matiere_id == this.matieres[0].id && el.bool == true) ? true : false
                        })
                        }
                    }
                    this.showMultiForm = true;
                } else {
                    this.planification = {...this.selectedPlanification.plan};
                    this.planification['bool'] = this.selectedPlanification.plan.bool === 1 ? true : false;
                    this.planification["salle_id"] = (this.selectedPlanification.salle).map(el => (el.id));
                    this.showMultiForm = false;
                }
            }
        },
        planificationStringClone : {
            deep : true,
            handler(newValStrObj, preValStrObj) {
                let newVal = JSON.parse(newValStrObj);
                let preVal = JSON.parse(preValStrObj);

                if (newVal.groupes 
                && preVal.groupes 
                && newVal.groupes.some(el1 => preVal.groupes.some(el2 => el2.groupe_id == el1.groupe_id && el2.bool != el1.bool))) {
                    let groupInstance = newVal.groupes.find(el1 => preVal.groupes.some(el2 => el2.groupe_id == el1.groupe_id && el2.bool != el1.bool));
                    if (this.planification.groupes.some(el => el.groupe_id != groupInstance.groupe_id && el.matiere_id == groupInstance.matiere_id && el.bool != groupInstance.bool)) {
                        while (this.planification.groupes.some(el => el.groupe_id != groupInstance.groupe_id && el.matiere_id == groupInstance.matiere_id && el.bool != groupInstance.bool)) {
                            this.planification.groupes.forEach(el => {
                                if (el.groupe_id != groupInstance.groupe_id 
                                && el.matiere_id == groupInstance.matiere_id 
                                && el.bool != groupInstance.bool) {
                                    el.bool = groupInstance.bool;
                                }
                            });
                        }
                        this.reGetSalles();
                    }
                } else if (newVal.groupes 
                && preVal.groupes 
                && newVal.groupes.find(el1 => preVal.groupes.some(el2 => el2.groupe_id == el1.groupe_id && el2.matiere_id != el1.matiere_id))) {
                    let groupInstance = newVal.groupes.find(el1 => preVal.groupes.some(el2 => el2.groupe_id == el1.groupe_id && el2.matiere_id != el1.matiere_id));
                    this.checkMatProf(groupInstance);
                    if (this.planification.groupes.some(el => el.groupe_id != groupInstance.groupe_id && el.matiere_id == groupInstance.matiere_id && el.bool != groupInstance.bool && el.bool == true)) {
                        this.planification.groupes.find(el => el.groupe_id == groupInstance.groupe_id).bool = true;
                        this.reGetSalles(true);
                    } else {
                        this.planification.groupes.find(el => el.groupe_id == groupInstance.groupe_id).bool = false;
                        this.reGetSalles(false);
                    }
                }
                else if (newValStrObj !== '{}') {
                    this.reGetSalles();
                }
            },
        },
        salles : {
            handler(newVal) {
                if (this.planification.salle_id && this.planification.salle_id.length > 0) {
                    for (const salle of this.planification['salle_id']) {
                        if (newVal.every(el => el.id !== salle)) {
                            this.planification['salle_id'].splice(this.planification['salle_id'].indexOf(salle), 1)
                        }
                    }
                } else if (this.planification.groupes && this.planification.groupes.some(el => el['salle_id'].length > 0)) {
                    for (const g of this.planification['groupes']) {
                        if (g['salle_id'].length > 0) {
                            for (const salle of g.salle_id) {
                                if (newVal.every(el => el.id !== salle)) {
                                    g.salle_id.splice(g.salle_id.indexOf(salle), 1)
                                }
                            }
                        }
                    }
                }
            },
            deep : true
        }
    },
    mounted() {
    (this.$refs.addOrUpdateModal).addEventListener("hidden.bs.modal", () => {
        this.resetModalData();
        })
    },
    methods: {
        async requestOnPlanification() {
            if (this.requestType === "create") {
                this.addPlanification();
            } else if (this.requestType === "update") {
                this.updatePlanification();
            }
        },
        async addPlanification() {
            createPlanification(this.planification)
            .then(res => {
                if (res.successResponse.status == 400 && res.successResponse.error) {
                    this.sendErrorMessage(res.successResponse.error);
                }
                this.launchLoader()
                this.resetModalData()
            })
            .catch(err => console.log(err.errResponse))
        },
        async updatePlanification() {
            updatePlanification(this.planification)
            .then(res => {
                console.log('Raisponsy', res);
                if (res.successResponse.status == 400 && res.successResponse.error) {
                    this.sendErrorMessage(res.successResponse.error);
                }
                this.launchLoader()
                this.resetModalData()
            })
            .catch(err => console.log(err.errResponse))
        },
        sendErrorMessage(msg) {
            this.$emit('errorMessage', msg);
        },
        launchLoader() {
            this.$emit('launchLoader', true);
        },
        resetModalData() {
            this.activeIdGroupe = '';
            this.showMultiForm = null;
            this.sameProfDiffMat = false;
            this.planification = {};
            this.$emit('resetModalData', false);
        },
        reGetSalles(boolParam) {
            if (this.showMultiForm) {
                (boolParam !== true && boolParam !== false) ? (boolParam = this.planification.groupes.some(el => el.bool === true) ? true : false) : ''
                this.$emit('regetSalles', {
                    groupe_id : (this.planification.groupes.map(el => el.groupe_id)).toString(), 
                    matiere_id : (this.planification.groupes.map(el => el.matiere_id)).toString(), 
                    bool : boolParam
                });
            } else {
                this.$emit('regetSalles', {id : this.planification.id, matiere_id : this.planification.matiere_id, bool : this.planification.bool});
            }
        },
        isActiveGroupe(groupe) {
            if (this.activeIdGroupe && this.activeIdGroupe !== '') {
                return this.activeIdGroupe === groupe.id;
            } else {
                this.activeIdGroupe = this.groupes.indexOf(groupe) === 0 ? groupe.id : '';
                return true;
            }
        },
        setActiveGroupe(groupe) {
            this.activeIdGroupe = groupe.id;
            this.reGetSalles(this.planification.groupes.find(el => el.groupe_id == groupe.id).bool);
        },
        currentGroupe(groupe_id) {
            if (this.showMultiForm) {
                return this.planification['groupes'].find(el => el.groupe_id === groupe_id);
            }
        },
        canSubmit() {
            if (JSON.stringify(this.planification) !== '{}') {
                if (this.showMultiForm) {
                    return (this.matieres.length == 0  || this.sameProfDiffMat || this.planification.groupes.every(el =>  el.salle_id.length == 0));
                } else {
                    return (this.matieres.length == 0 || this.planification.salle_id.length == 0);
                }
            }
        },
        notInOtherGroup(groupe_id, salle_id) {
            if (this.showMultiForm) {
                let status = true;
                let currGroup = this.planification.groupes.find(el => el.groupe_id === groupe_id);
                for (const g of this.planification.groupes) {
                    if (g.salle_id.some(el => el == salle_id) && currGroup.groupe_id !== g.groupe_id && currGroup.matiere_id !== g.matiere_id) {
                        status = false;
                    }
                }
                return status;
            }
        },
        noSalles() {
            return (this.salles.length == 0 && this.errMsg == '');
        },
        checkMatProf(groupe) {
            if (groupe.salle_id.length > 0) {
                if (this.planification.groupes.some(el1 => {
                    return (el1.groupe_id !== groupe.groupe_id 
                    && el1.matiere_id !== groupe.matiere_id 
                    && this.matieres.find(el2 => el2.id == el1.matiere_id).enseignant_id == this.matieres.find(el2 => el2.id == groupe.matiere_id).enseignant_id
                    && el1.salle_id.length > 0)
                })) this.sameProfDiffMat = true;
                else this.sameProfDiffMat = false;
            }
        },
    },
    computed : {
        planificationStringClone() {
            return JSON.stringify(this.planification);
        }
    }
}
</script>

<style scoped>
    .captivated-text {
        color: #51678f;
        font-weight: 600;
    }
</style>