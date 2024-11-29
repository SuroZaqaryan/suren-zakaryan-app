<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: [Object, String, Number],
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
    placeholder: {
      type: [String, Number],
      required: false,
      default: null,
    },
    style: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      selected: this.default || null,
      open: false,
      openUp: false,
      searchQuery: "",
    };
  },
  computed: {
    normalizedOptions() {
      return this.options
          .map(option => {
            if (typeof option === "string" || typeof option === "number") {
              return { label: String(option), value: option };
            }
            return option;
          })
          .filter(option => option?.label);
    },
    filteredOptions() {
      if (!this.searchQuery) return this.normalizedOptions;
      return this.normalizedOptions.filter(option => {
        return option.label
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
      });
    },
  },
  mounted() {
    this.$emit("input", this.selected);
  },
  methods: {
    toggleDropdown() {
      this.open = !this.open;
      if (!this.open) {
        this.searchQuery = "";
      } else {
        this.checkSpaceForDropdown();
      }
    },
    checkSpaceForDropdown() {
      const rect = this.$el.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      this.openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    },
    handleKeyDown(event) {
      if (this.open) {
        if (event.key === "Escape") {
          this.open = false;
          this.searchQuery = "";
        } else if (event.key.length === 1) {
          this.searchQuery += event.key;
        }
      }
    },
    selectOption(option) {
      this.selected = option;
      this.open = false;
      this.searchQuery = "";
      this.$emit("change", option);
    },
  },
};
</script>

<template>
  <div
      class="custom-select"
      :tabindex="tabindex"
      :style="style"
      @click="toggleDropdown"
      @keydown="handleKeyDown"
      @blur="() => { open = false; searchQuery = ''; }"
  >
    <span
        v-if="placeholder"
        :class="{
        placeholder,
        'placeholder-active': selected !== null,
      }"
    >
      {{ placeholder }}
    </span>

    <div class="selected" :class="{ open: open }">
      <span :title="selected?.label || selected">
        {{ selected?.label || selected }}
      </span>
      <img src="@/assets/icons/arrow-down.svg" class="arrow" alt="arrow" />
    </div>

    <div
        class="items scrollable"
        :class="{ selectHide: !open }"
        :style="{ bottom: openUp ? '100%' : 'auto', top: openUp ? 'auto' : '100%' }"
    >
      <template v-for="(option, i) in filteredOptions" :key="i">
        <div
            v-if="option?.label"
            @click.stop="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "Dropdown.scss";

.scrollable {
  max-height: 200px;
  overflow-y: auto;
}
</style>