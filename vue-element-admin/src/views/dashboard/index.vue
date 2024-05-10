<template>
  <div class="dashboard-container">
    <div> 
      <el-tag v-permission="['admin']">admin</el-tag>
      <el-tag v-permission="['editor']">admin</el-tag>
    </div>
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import permission from '@/directive/permission/index.js'
export default {
  name: 'Dashboard',
  directives:{permission},
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
