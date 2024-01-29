<template>
    <aside id="sidebar" class="sidebar">

    <ul class="sidebar-nav" id="sidebar-nav">
      <li class="nav-item">
          <router-link class="nav-link collapsed" to="/">
          <i class="bi bi-journal"></i>
          <span>Emplois du temps</span>
        </router-link>
      </li>
      <!-- <li class="nav-item">
          <router-link class="nav-link collapsed" to="/semestre">
          <i class="bi bi-calendar"></i>
          <span>Semestre</span>
        </router-link>
      </li> -->
      <li class="nav-item">
          <router-link class="nav-link collapsed" to="/enseignant">
          <i class="bi bi-person"></i>
          <span>Enseignants</span>
        </router-link>
      </li>
    <li class="nav-item">
          <router-link class="nav-link collapsed" to="/parcours">
          <i class="ri-arrow-right-circle-line"></i>
          <span>Parcours</span>
        </router-link>
    </li>
    <li class="nav-item">
          <router-link class="nav-link collapsed" to="/niveau">
          <i class="bi bi-bar-chart-steps"></i>
          <span>Niveaux</span>
        </router-link>
    </li>
    <li class="nav-item">
          <router-link class="nav-link collapsed" to="/groupe">
          <i class="bi bi-diagram-3"></i>
          <span>Groupes d'étudiants</span>
        </router-link>
    </li>
    <li class="nav-item">
        <router-link class="nav-link collapsed" to="/matiere">
            <i class="bi bi-book"></i>
            <span>Matières</span>
        </router-link>
        </li>

    <li class="nav-item">
    <router-link class="nav-link collapsed" to="/salle">
        <i class="ri-home-gear-line"></i>
        <span>Salles</span>
    </router-link>
    </li>

    <li class="nav-item">
        <router-link class="nav-link collapsed" to="/horaire">
        <i class="bi bi-alarm"></i>
        <span>Horaires</span>
    </router-link>
    </li>
    </ul>

  </aside>
</template>

<script>
export default {
    
}
</script>

<style scoped>
  .router-link-exact-active {
    color: #4154f1 !important;
    background: #f6f9ff !important;
  }
</style>