<template>
  <div>
    <div class="pagetitle">
      <h1>Emplois du temps</h1>
    </div>
    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="intervalleExists">
        <i class="bi bi-exclamation-triangle me-1"></i>
        Désolé, le/les dates que vous voulez insérer sont déjà incluses dans une autre intervalle existante.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="intervalleExists=false"></button>
    </div>
    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="planErrMsg !== ''">
        <i class="bi bi-exclamation-triangle me-1"></i>
        {{ planErrMsg }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="planErrMsg=''"></button>
    </div>
    <div class="card">
          <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="niveau" class="form-label">Niveau</label>
                    <select id="niveau" class="form-select" name="niveau" v-model="selectedPlanification['niveau_id']" :onchange="changeFilename">
                        <option id="test" v-for="n in niveaux" v-bind:key="n.id" v-bind:value="n.id">{{ n.nom_niveau }}</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="parcours" class="form-label">Parcours</label>
                    <select id="parcours" class="form-select" name="parcours" v-model="selectedPlanification['parcours_id']" :onchange="changeFilename">
                        <option v-for="p in parcours" v-bind:key="p.id" v-bind:value="p.id">{{ p.nom_parcours }}</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-5 row mb-3">
                    <div class="col-md-9">
                        <label for="intervalle" class="form-label">Intervalles</label>
                        <select id="intervalle" class="form-select" name="intervalle" v-model="selectedPlanification['intervalle_id']">
                            <option v-for="i in intervalles" v-bind:key="i.id" v-bind:value="i.id">
                              {{ formatDate(i.date_debut) }} - {{ formatDate(i.date_fin) }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-1">
                      <button type="button" class="btn btn-primary btn-sm" style="margin-top: 37px" @click="actionOnIntervalle=true"><i class="bi bi-plus-lg"></i></button>
                    </div>
                    <div class="col-md-1" v-if="allowAction">
                      <button type="button" class="btn btn-warning btn-sm" style="margin-top: 37px; margin-left: 10px;" @click="setInterPlanToSelectedInter(selectedPlanification['intervalle_id'])"><i class="bi bi-pencil-square"></i></button>
                    </div>
                    <div class="col-md-1" v-if="allowAction">
                      <button type="button" class="btn btn-danger btn-sm" style="margin-top: 37px; margin-left: 20px;" data-bs-toggle="modal" data-bs-target="#deleteIntervalleModal" @click="triggerDeleteIntervalleRequest(selectedPlanification['intervalle_id'])"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
                <div class="col-md-7 row mb-3" style="padding-left: 50px" v-if="actionOnIntervalle">
                  <div class="col-md-5">
                    <label for="date-debut" class="form-label">De</label>
                    <input type="date" class="form-control" id="date-debut" name="date-debut" v-model="selectedIntervalle['date_debut']" required>
                  </div>
                  <div class="col-md-5">
                    <label for="date-fin" class="form-label">à</label>
                    <input type="date" class="form-control" id="date-debut" name="date-debut" v-model="selectedIntervalle['date_fin']" required>
                  </div>
                  <div class="col-md-1">
                    <button type="button" class="btn btn-success btn-sm" style="margin-top: 37px" @click="requestOnIntervalle(selectedIntervalle)" :disabled="v$.$invalid"><i class="bi bi-check2-circle"></i></button>
                  </div>
                  <div class="col-md-1">
                    <button type="button" class="btn btn-danger btn-sm" style="margin-top: 37px" @click="actionOnIntervalle=false;selectedIntervalle={}"><i class="bi bi-x"></i></button>
                  </div>
                </div>
            </div>
            <vue3-simple-html2pdf ref="vue3SimpleHtml2pdf" :options="pdfOptions" :filename="exportFilename">
              <div>
                <h4 style="font-size:24px;font-weight:600;text-align:center;margin-bottom:0;">{{ titleTable }}</h4>
                <h5 style="text-align:center;margin-bottom:15px;">Emplois du temps du <strong>{{ debut_inter }}</strong> au <strong>{{fin_inter}}</strong></h5>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>
                          #
                      </th>
                      <th v-for="j in jours" v-bind:key="j.id">
                        {{ j.nom_jour }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="h in heures" v-bind:key="h.id">
                      <th scope="row">
                        {{ formatTime(h.debut) }} - {{ formatTime(h.fin) }}
                      </th>
                      <td v-for="j in jours" v-bind:key="j.id" class="time-table-instance" @click="triggerAddOrUpdateRequest(j.id, h.id)" data-bs-toggle="modal" data-bs-target="#addOrUpdateModal">
                        <template v-for="p in planifications">
                          <div v-bind:key="p.id" v-if="isPlanificationInstance(p.plan, j.id, h.id)">
                            <div v-if="p.plan.groupe_id">
                                <strong>* {{ p.plan.nom_groupe }}</strong><br>
                                {{ p.plan.nom_matiere }} <template v-if="p.plan.nom_enseignant"> - {{ p.plan.nom_enseignant }} </template><br>
                                <span v-for="salle in p.salle" v-bind:key="salle.id" class="badge bg-secondary">{{ salle.nom_salle }}</span>
                            </div>
                            <div v-else>
                                {{ p.plan.nom_matiere }} <template v-if="p.plan.nom_enseignant"> - {{ p.plan.nom_enseignant }} </template><br>
                                <span v-for="salle in p.salle" v-bind:key="salle.id" class="badge bg-secondary">{{ salle.nom_salle }}</span>
                            </div>
                          </div>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="html2pdf__page-break"></div>
            </vue3-simple-html2pdf>
            <button style="text-align:center" class="btn btn-primary offset-5" :onclick="downloadPdf">Exporter en PDF</button>
          </div>
      </div>
      <DeleteIntervalleModal :intervalleInfoToDelete = 'requestedDeleteIntervalle' @launchLoader = "loadingI = $event; loadingP = $event"/>
      <AddOrUpdateModal ref="addOrUpdateModal" :errMsg= "onRequestErrMsg" :matieres = "matieres" :groupes= "groupes" :salles = "salles" :selectedPlanification = "planificationToRequest" :requestType="requestType" @launchLoader = "loadingP = $event" @resetModalData= "modalDataReady = $event" @regetSalles= "askForSalles = $event" @errorMessage= "planErrMsg = $event"/>
      <DeleteModal :planIdToDelete = "planIdToDelete" @launchLoader = "loadingP = $event"/>
  </div>
</template>

<script>
import moment from 'moment'
import { createEntity, readEntity, updateEntity } from '../services/crudService.js'
import { readGroupe, readMatiere, readPlanification, readSalleLibre } from '../services/planificationService.js'
import DeleteIntervalleModal from '@/components/modalsComponent/intervalleModals/DeleteIntervalleModal.vue'
import AddOrUpdateModal from '@/components/modalsComponent/timeTableModals/AddOrUpdateModal.vue'
import DeleteModal from '@/components/modalsComponent/timeTableModals/DeleteModal.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  setup () {
        return { v$: useVuelidate({$scope : false}) }
    },
  components: {
    DeleteIntervalleModal,
    AddOrUpdateModal,
    DeleteModal
    },
  data() {
    return {
      jours : [],
      heures : [],
      loadingH : false,
      niveaux : [],
      parcours : [],
      groupes : [],
      intervalles : [],
      selectedIntervalle : {
        id : "",
        date_debut : "",
        date_fin : ""
      },
      requestedDeleteIntervalle : "",
      actionOnIntervalle : false,
      intervalleExists: false,
      allowAction: false,
      loadingI : false,
      salles : [],
      askForSalles : {},
      matieres : [],
      planifications : [],
      selectedPlanification : {},
      planificationToRequest : {},
      planIdToDelete : 0,
      loadingP : false,
      planErrMsg : "",
      onRequestErrMsg : "",
      modalDataReady : false,
      requestType : "",
      pdfOptions : {
        margin: 15,
        image: {
          type: 'jpeg',
          quality: 1,
        },
        html2canvas: { scale: 3 },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'l',
        },
      },
      exportFilename: '',
      titleTable: '',
      debut_inter: '',
      fin_inter: ''
    }
  },
  validations() {
        return {
            selectedIntervalle : {
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
    loadingH(newVal) {
      if (newVal) this.getHeures();
    },
    loadingI(newVal) {
      if (newVal) this.getIntervalles();
    },
    loadingP(newVal) {
      if (newVal) this.getPlanifications();
    },
    modalDataReady(newVal) {
      if (newVal === false) {
        this.requestType = "";
        this.onRequestErrMsg = "";
        this.askForSalles = {};
        if (this.selectedPlanification.groupes) delete this.selectedPlanification.groupes;
      } 
    },
    async askForSalles(newVal) {
      if (JSON.stringify(newVal) !== '{}') {
        if (this.requestType === 'create') {
          await this.getSalles({
            niveau_id : this.selectedPlanification['niveau_id'], 
            intervalle_id : this.selectedPlanification["intervalle_id"], 
            jour_id : this.selectedPlanification['jour_id'], 
            heure_id : this.selectedPlanification['heure_id'],
            matiere_id : newVal.matiere_id,
            bool : newVal.bool
            })
        } else if (this.requestType === 'update') {
          await this.getSalles({
            id : newVal.id,
            groupe_id : newVal.groupe_id,
            niveau_id : this.selectedPlanification['niveau_id'], 
            intervalle_id : this.selectedPlanification["intervalle_id"], 
            jour_id : this.selectedPlanification['jour_id'], 
            heure_id : this.selectedPlanification['heure_id'],
            matiere_id : newVal.matiere_id,
            bool : newVal.bool
            })
        }
      }
    },
    parcours : {
        handler(newVal) {
            if (newVal.length !== 0) this.selectedPlanification['parcours_id'] = newVal[0].id;
        },
        deep : true
    },
    niveaux : {
        handler(newVal) {
            if (newVal.length !== 0) this.selectedPlanification['niveau_id'] = newVal[0].id;
        },
        deep : true
    },
    intervalles : {
        handler(newVal) {
            if (newVal.length !== 0) {
              this.selectedPlanification['intervalle_id'] = newVal[0].id;
              this.allowAction = true;
            } else {
              this.allowAction = false;
            }
        },
        deep : true
    },
    intervalleExists(newVal) {
      if (newVal) {
        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          this.intervalleExists = false;
        }, 5000)
      }
    },
    planErrMsg(newVal) {
      if (newVal !== "") {
        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          this.planErrMsg = "";
        }, 5000)
      }
    },
    selectedPlanification :{
      handler() {
          this.getPlanifications();
          this.getGroupes()
        },
        deep : true
    },
  },
  created() {
    this.getNiveaux()
    this.getParcours()
    this.getGroupes()
    this.getIntervalles()
    this.getJours()
    this.getHeures()
    this.getPlanifications()
  },
  mounted() {
    if (this.intervalles.length != 0) this.allowAction = true;
  },
  methods: {
    async getPlanifications() {
      readPlanification(this.selectedPlanification).then(res => {
        this.planifications = [...res.data];
        this.loadingP = false;
      }).catch(err => { 
          console.log(err.errorResponse);
        })
    },
    isPlanificationInstance(planification, jour_id, heure_id) {
      return planification["jour_id"] == jour_id && planification["heure_id"] == heure_id;
    },
    async triggerAddOrUpdateRequest(jour_id, heure_id) {
      if (this.niveaux.length == 0 || this.parcours.length == 0 || this.intervalles.length ==0) {
        if (this.niveaux.length == 0 && this.parcours.length == 0 && this.intervalles.length ==0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours, niveau et intervalle de dates";
        } else if (this.niveaux.length == 0 && this.parcours.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours et un niveau";
        } else if (this.parcours.length == 0 && this.intervalles.length ==0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours et une intervalle de dates";
        } else if (this.niveaux.length == 0 && this.intervalles.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un niveau et une intervalle de dates";
        } else if (this.parcours.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un parcours";
        } else if (this.niveaux.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins un niveau";
        } else if (this.intervalles.length == 0) {
          this.onRequestErrMsg = "Veuillez d'abord ajouter au moins une intervalle de dates";
        }
      }
      else {
        this.selectedPlanification['jour_id'] = jour_id;
        this.selectedPlanification['heure_id'] = heure_id;
        await this.getMatieres(this.selectedPlanification['niveau_id'], this.selectedPlanification['parcours_id']);
        if (this.matieres.length == 0) {
              this.onRequestErrMsg = "Veuillez d'abord ajouter au moins une matière pour le niveau et parcours correspondants"
        } 
        else {
          let currentPlan = this.planifications.filter(x => x.plan.inter_id == this.selectedPlanification['intervalle_id'] && x.plan.jour_id == jour_id && x.plan.heure_id == heure_id);
          if (currentPlan.length != 0) {
            if (currentPlan.some(el => el.plan.groupe_id != null) || currentPlan.length > 1) {
              this.selectedPlanification['groupes'] = [];
              for (const p of currentPlan) {
                this.selectedPlanification['groupes'].push({
                    plan_id : p.plan.id,
                    groupe_id : p.plan.groupe_id,
                    matiere_id : p.plan.matiere_id,
                    salle_id : (p.salle).map(el => (el.id)),
                    bool : p.plan.bool === 1 ? true : false
                })
              }
              this.planificationToRequest = {...this.selectedPlanification};
              this.planIdToDelete = this.planificationToRequest.groupes.map(el => el.plan_id).toString();
              console.log('Raoplanina x1', this.planificationToRequest.parcours_id, this.groupes);
            } else {
                this.planificationToRequest = {...currentPlan[0]};
                this.planIdToDelete = this.planificationToRequest.plan.id.toString();
                console.log('Raoplanina x2', this.planificationToRequest.parcours_id, this.groupes);
            }
            this.requestType = "update";
          } else {
            this.planificationToRequest = {...this.selectedPlanification};
            console.log('Raoplanina x3', this.planificationToRequest.parcours_id, this.groupes);
            this.requestType = "create";
          }
          }
      }
      this.modalDataReady = true;
    },

    async getJours() {
      readEntity('jours').then(res => {
          this.jours = [...res.data];
        }).catch(err => { 
          console.log(err.errorResponse);
        })
    },

    async getHeures() {
      this.loadingH = true;
      readEntity('heures').then(res => {
          this.heures = [...res.data];
          this.loadingH = false;
        }).catch(err => { 
          console.log(err.errorResponse);
          this.loadingH = false;
        })
    },

    async getNiveaux() {
      readEntity('niveaux').then(res => {
          this.niveaux = [...res.data];
          if (this.titleTable === ''){
            this.titleTable = '' + this.niveaux[0].nom_niveau
            this.exportFilename = '' + this.niveaux[0].nom_niveau
          }
        }).catch(err => { 
          console.log(err.errorResponse);
        })
    },

    async getParcours() {
      readEntity('parcours').then(res => {
          this.parcours = [...res.data];
          if (this.titleTable == this.niveaux[0].nom_niveau){
            this.titleTable += ' ' + this.parcours[0].nom_parcours
            this.exportFilename += '_' + this.parcours[0].nom_parcours + '_EDT.pdf'
          }
        }).catch(err => { 
          console.log(err.errorResponse);
        })
    },

    async getGroupes() {
      readGroupe(this.selectedPlanification['niveau_id'], this.selectedPlanification['parcours_id']).then(res => {
          this.groupes = [...res.data];
        }).catch(err => { 
          console.log(err.errorResponse);
        })
    },

    requestOnIntervalle() {
      this.selectedIntervalle.id ? this.updateIntervalle() : this.addIntervalle();
    },
    async addIntervalle() {
      createEntity('intervalle', this.selectedIntervalle)
      .then(res => {
          if (res.successResponse.status == 400 && res.successResponse.error) {
            this.intervalleExists = true;
          } else {
          this.actionOnIntervalle = false;
          this.selectedIntervalle = {};
          this.getIntervalles()
          }
          })
      .catch(err => {
        console.log('hey', err.errorResponse)
        })
    },
    async updateIntervalle() {
        updateEntity('intervalle', this.selectedIntervalle.id, this.selectedIntervalle)
        .then(res => {
            if (res.successResponse.status == 400 && res.successResponse.error) {
            this.intervalleExists = true;
          } else {
            this.actionOnIntervalle = false;
            this.selectedIntervalle = {};
            this.getIntervalles()
          }
            })
        .catch(err => console.log(err.errorResponse))
    },
    async triggerDeleteIntervalleRequest(id) {
      this.requestedDeleteIntervalle = id;
    },
    async setInterPlanToSelectedInter(id) {
      let currentIntervalle = this.intervalles.filter(x => x.id == id)[0];
      this.selectedIntervalle.id =  currentIntervalle.id;
      this.selectedIntervalle.date_debut = moment(currentIntervalle.date_debut).format('YYYY-MM-DD');
      this.selectedIntervalle.date_fin = moment(currentIntervalle.date_fin).format('YYYY-MM-DD');
      this.actionOnIntervalle = true;
    },
    async getIntervalles() {
      readEntity('intervalles').then(res => {
          this.intervalles = [...res.data];
          this.debut_inter = this.formatDate(this.intervalles[0].date_debut)
          this.fin_inter = this.formatDate(this.intervalles[0].date_fin)
        }).catch(err => { 
          console.log(err.errorResponse);
        })
    },

    async getSalles(data) {
      return new Promise((resolve, reject) => {
        try {
            readSalleLibre(data).then(res => {
            this.salles = [...res.data];
            console.log('Sallem', this.salles);
            resolve(res.successResponse);
          }).catch(err => { 
            reject(err.errorResponse);
          })
        }
        catch(e) {
          reject(e);
        }
      })
    },

    async getMatieres(niveau_id, parcours_id) {
      return new Promise((resolve, reject) => {
        try {
            readMatiere(niveau_id, parcours_id).then(res => {
            this.matieres = (res.data).map(el => el.matiere);
            resolve(res.successResponse);
          }).catch(err => { 
            reject(err.errorResponse);
          })
        }
        catch(e) {
          reject(e);
        }
      })
    },

    changeFilename(){
      for(let i = 0; i < this.niveaux.length; i++){
        if(this.niveaux[i].id === this.selectedPlanification.niveau_id){
          this.exportFilename = '' + this.niveaux[i].nom_niveau
          this.titleTable = '' + this.niveaux[i].nom_niveau
          break;
        }
      }
      for(let i = 0; i < this.parcours.length; i++){
        if(this.parcours[i].id === this.selectedPlanification.parcours_id){
          this.exportFilename += '_' + this.parcours[i].nom_parcours
          this.titleTable += ' ' + this.parcours[i].nom_parcours
          break
        }
      }
      for(let i = 0; i < this.intervalles.length; i++){
        if(this.intervalles[i].id === this.selectedPlanification.intervalle_id){
          this.debut_inter = this.formatDate(this.intervalles[i].date_debut)
          this.fin_inter = this.formatDate(this.intervalles[i].date_fin)
          break;
        }
      }
      this.exportFilename += '_EDT.pdf'
      console.log(this.debut_inter)
    },

    downloadPdf(){
      this.$refs.vue3SimpleHtml2pdf.download()
    },

    formatTime(time) {
      return moment(time, 'HH:mm:ss').format('HH:mm')
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    }
  },
}
</script>

<style scoped>
  .pagetitle {
    display: flex;
    justify-content: space-between;
  }
  .card {
    margin-top: 30px;
  }
  .card-body {
    padding-top: 20px;
  }
  .time-table-instance {
    cursor: pointer;
  }
  .time-table-instance:hover {
    background: aliceblue;
  }
</style>
