<script>
import { formatDate, formatDateTime } from "@/utils/dateFormat";
import Input from "@/components/input/Input.vue";
import Dropdown from '@/components/dropdown/Dropdown.vue';
import Pagination from "@/components/pagination/Pagination.vue";
import DashboardCreate from "./sections/DashboardCreate.vue";

export default {
  components: {
    Input,
    Dropdown,
    Pagination,
    DashboardCreate,
  },
  data() {
    return {
      isLoading: true,
      search: '',
      timeout: null,
      appealInfo: null,
      showDashboardCreateModal: false,
      sortDirection: {
        created_at: 'asc',
        status: 'asc',
      },
    };
  },
  computed: {
    appeals() {
      return this.$store.state.appeals;
    },

    sortedAppeals() {
      let sorted = [...this.appeals.results];

      // Сортировка по дате
      if (this.sortDirection.created_at === 'asc') {
        sorted = sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } else {
        sorted = sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      // Сортировка по статусу
      if (this.sortDirection.status === 'asc') {
        sorted = sorted.sort((a, b) => a.status.name.localeCompare(b.status.name));
      } else {
        sorted = sorted.sort((a, b) => b.status.name.localeCompare(a.status.name));
      }

      return sorted;
    },
  },
  async created() {
    if (this.$store.state.token) {
      await this.fetchPageData();
    } else {
      this.$router.push('/login');
    }
  },
  watch: {
    async search(value) {
      if (!value.length) {
        this.$store.state.appeals = [];
        await this.fetchPageData();
      } else {
        this.appeals.page = 1;
        this.debouncedFetchSearchData();
      }
    },
  },
  methods: {
    debouncedFetchSearchData() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.fetchSearchData(), 1500);
    },

    async fetchSearchData() {
      this.isLoading = true;
      await this.$store.dispatch('searchAppeals', { search: this.search }).finally(() => {
        this.isLoading = false;
      });
    },

    editAppeal(appeal) {
      this.appealInfo = appeal;
      this.showDashboardCreateModal = true;
    },

    async fetchPageData({ page = this.appeals.page, page_size = this.appeals.page_size } = {}) {
      try {
        this.isLoading = true;
        await this.$store.dispatch('fetchAppeals', { page, page_size });
      } finally {
        this.isLoading = false;
      }
    },

    updateCurrentPage(newPage) {
      this.fetchPageData({ page: newPage });
    },

    updatePageSize(newPageSize) {
      this.fetchPageData({ page_size: newPageSize });
    },

    toggleSortCreatedAt() {
      this.sortDirection.created_at = this.sortDirection.created_at === 'asc' ? 'desc' : 'asc';
    },
    toggleSortStatus() {
      this.sortDirection.status = this.sortDirection.status === 'asc' ? 'desc' : 'asc';
    },

    showMessage() {
      alert('Из-за некорректной работы API пропустил фильтрацию по дому, а поиск работает только частично.');
    },

    formatDate,
    formatDateTime,
  },
};
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard__title">Список заявок</h1>

    <div v-if="!$store.state.token">
      <p>Вы не авторизованы. Пожалуйста, войдите.</p>
    </div>

    <div v-else class="dashboard__container">
      <div class="dashboard__header">
        <button @click="showDashboardCreateModal = true">Создать</button>
      </div>

      <div class="dashboard__filters">
        <Input
            v-model="search"
            :icon="require('@/assets/icons/search.svg')"
            iconPosition="right"
            placeholder="Поиск (№ заявки, название)"
        />

        <Dropdown :value="null" :options="[]" @click="showMessage" placeholder="Дом" />
      </div>

      <img v-if="isLoading" class="loader" src="https://media.tenor.com/joLYNfFQGDgAAAAj/loading.gif" width="38" height="38" alt="loading..." />

      <template v-else>
        <div class="dashboard__content">
          <table>
            <thead>
            <tr>
              <th>№</th>
              <th class="dashboard__sort" @click="toggleSortCreatedAt">
                Создана
                <img
                    src='@/assets/icons/arrow-up.svg'
                    :style="{ transform: sortDirection.created_at === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)' }"
                    alt="sort"
                />
              </th>
              <th>Адрес</th>
              <th>Заявитель</th>
              <th>Описание</th>
              <th>Срок</th>
              <th class="dashboard__sort" @click="toggleSortStatus">
                Статус
                <img
                    src='@/assets/icons/arrow-up.svg'
                    alt="sort"
                    :style="{ transform: sortDirection.status === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)' }"
                />
              </th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(appeal, index) in sortedAppeals" :key="index">
              <td @click.stop="editAppeal(appeal)" class="appeal__number"><span>{{ appeal?.number }}</span></td>
              <td>{{ formatDate(appeal?.created_at) }}</td>
              <td>{{ appeal.premise?.address || appeal.apartment?.label || appeal.address }}</td>
              <td>{{ appeal.applicant?.first_name }} {{ appeal.applicant?.last_name }}</td>
              <td style="max-width: 200px">{{ appeal?.description }}</td>
              <td>{{ formatDateTime(appeal?.due_date) }}</td>
              <td>{{ appeal.status?.name }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <Pagination
            :currentPage="appeals.page"
            :totalPages="appeals.pages"
            :totalCount="appeals.count"
            :pageSize="appeals.page_size"
            @update:pageSize="updatePageSize($event)"
            @update:currentPage="updateCurrentPage($event)"
        />
      </template>
    </div>

    <DashboardCreate
        v-if="showDashboardCreateModal"
        :appealInfo="appealInfo"
        @close="showDashboardCreateModal = false, appealInfo = null"
    />
  </div>
</template>

<style scoped lang="scss">
@import "Dashboard.scss";
</style>
