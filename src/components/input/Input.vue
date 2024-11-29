<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    alt: {
      type: String,
      default: "icon",
    },
    icon: {
      type: [String, Number],
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
      required: true,
    },
    max: {
      type: [String, Number],
      default: 30,
    },
    placeholder: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text",
    },
    iconPosition: {
      type: String,
      default: "left",
    },
    style: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  data() {
    return {
      value: this.modelValue,
      showPassword: false,
    };
  },

  computed: {
    inputType() {
      return this.type === "password" && this.showPassword ? "text" : this.type;
    },
    inputStyle() {
      return this.icon
          ? { padding: this.iconPosition === "left" ? "12px 12px 12px 34px" : "0" }
          : { padding: "0" };
    }
  },

  watch: {
    value(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },

  methods: {
    handleUpdate(event) {
      this.value = event.target.value;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<template>
  <div class="base-input">
    <label v-if="label.length">{{ label }}</label>

    <div class="base-input__content" :style="style">
      <img
          v-if="icon"
          :class="`base-input__icon ${iconPosition}`"
          width="22"
          height="22"
          :src="icon"
          :alt="alt"
      />

      <input
          :class="{ disabled: disabled }"
          :maxlength="max"
          :type="inputType"
          :value="value"
          :disabled="disabled"
          :required="required"
          :placeholder="placeholder"
          v-bind="$attrs"
          @input="handleUpdate"
          :style="inputStyle"
      />

      <img
          v-if="type === 'password'"
          class="base-input__password"
          width="22"
          height="22"
          :src="showPassword ? require('@/assets/icons/eye-on.svg') : require('@/assets/icons/eye-off.svg')"
          :alt="alt"
          @click="togglePasswordVisibility"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "Input.scss";
</style>
