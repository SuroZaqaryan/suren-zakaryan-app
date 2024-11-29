<script>
import Dropdown from '@/components/dropdown/Dropdown.vue';

export default {
  components: {
    Dropdown,
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    pageSizeOptions: {
      type: Array,
      default: () => [5, 10, 15, 20],
    },
  },
  computed: {
    totalPageItems() {
      return Math.ceil(this.totalPages / this.pageSize);
    },
    pageRange() {
      const range = [];
      const pageRangeStart = Math.max(this.currentPage - 2, 1);
      const pageRangeEnd = Math.min(this.currentPage + 2, this.totalPageItems);

      for (let i = pageRangeStart; i <= pageRangeEnd; i++) {
        range.push(i);
      }

      return range;
    },
  },
  methods: {
    goToFirstPage() {
      if (this.currentPage > 1) {
        this.$emit('update:currentPage', 1);
      }
    },
    goToLastPage() {
      if (this.currentPage < this.totalPageItems) {
        this.$emit('update:currentPage', this.totalPageItems);
      }
    },
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.$emit('update:currentPage', this.currentPage - 1);
      }
    },
    goToNextPage() {
      if (this.currentPage < this.totalPageItems) {
        this.$emit('update:currentPage', this.currentPage + 1);
      }
    },
    goToPage(page) {
      this.$emit('update:currentPage', page);
    },
    changePageSize(newPageSize) {
      this.$emit('update:pageSize', newPageSize.value);
    },
  },
};
</script>

<template>
  <div class="pagination">
    <div class="pagination__records">
      <label for="page-size">
        <span>1–{{ pageSize }}</span> из <span>{{ totalCount }}</span> записей
      </label>

      <Dropdown
          id="page-size"
          :default="pageSize"
          :options="pageSizeOptions"
          @change="changePageSize"
          :style="{ maxWidth: '80px'}"
      />
    </div>

    <div class="pagination__pages">
      <button @click="goToFirstPage" :disabled="currentPage <= 1" class="navigate">
        <img src="@/assets/icons/arrow-double-left.svg" alt="prev"/>
      </button>

      <button @click="goToPreviousPage" :disabled="currentPage <= 1" class="navigate">
        <img src="@/assets/icons/arrow-left.svg" alt="prev"/>
      </button>

      <span v-if="currentPage > 3">...</span>

      <button
          v-for="page in pageRange"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
          class="page"
      >
        {{ page }}
      </button>

      <span v-if="currentPage < totalPageItems - 2">...</span>

      <button v-if="currentPage < totalPageItems - 1" @click="goToPage(totalPageItems)" class="page">
        {{ totalPageItems }}
      </button>

      <button @click="goToNextPage" :disabled="currentPage >= totalPageItems" class="navigate">
        <img src="@/assets/icons/arrow-right.svg" alt="next"/>
      </button>

      <button @click="goToLastPage" :disabled="currentPage >= totalPageItems" class="navigate">
        <img src="@/assets/icons/arrow-double-right.svg" alt="next"/>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "Pagination.scss";
</style>
