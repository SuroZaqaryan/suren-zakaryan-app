<script>
import Modal from "@/components/modal/Modal.vue";
import Input from "@/components/input/Input.vue";
import Dropdown from '@/components/dropdown/Dropdown.vue';
import { parseDateTime} from "@/utils/dateFormat";

export default {
  data() {
    return {
      formData: {
        apartment: {
          apartment_id: null,
          label: null,
        },
        premise: {
          premise_id: null,
          address: null,
        },
        applicant: {
          first_name: '',
          last_name: '',
          patronymic_name: '',
          username: '',
        },
        description: '',
        due_date: '',
      },
    };
  },

  props: {
    appealInfo: {
      type: Object,
      required: false,
      default: null,
    },
  },

  components: {
    Input,
    Modal,
    Dropdown,
  },

  mounted() {
    const { appealInfo, formData } = this;

    if(appealInfo) {
      formData.premise.address = appealInfo.premise?.address;
      formData.apartment.label = appealInfo.apartment?.label;
      formData.due_date = parseDateTime(appealInfo?.due_date);
      formData.applicant = appealInfo?.applicant;
      formData.description = appealInfo?.description;
    }

    this.$refs.modal.openModal();
  },

  computed: {
    appeals() {
      return this.$store.state.appeals;
    },
    premises() {
      const premisesArray = Array.from(this.appeals.results.map(appeal => {
        return {
          value: appeal.premise?.id,
          label: appeal.premise?.address,
        };
      }));

      return premisesArray.filter((value, index, self) =>
          index === self.findIndex((t) => t.label === value.label)
      );
    },
    apartments() {
      const apartmentsArray = Array.from(this.appeals.results.map(appeal => appeal.apartment?.label));

      return apartmentsArray.filter((value, index, self) =>
          index === self.findIndex((t) => t === value)
      );
    },
  },

  methods: {
    async submitForm() {
      const dataToSubmit = {
        premise_id: this.formData.premise_id,
        apartment_id: this.formData.apartment_id,
        applicant: {
          first_name: this.formData.applicant.first_name,
          last_name: this.formData.applicant.last_name,
          patronymic_name: this.formData.applicant.patronymic_name,
          username: this.formData.applicant.username,
        },
        description: this.formData.description,
        due_date: parseDateTime(this.formData.due_date),
      };

      if(!this.appealInfo) {
        await this.$store.dispatch('sendAppeals', dataToSubmit); // Создание
      } else {
        await this.$store.dispatch('editAppeals', { data: dataToSubmit, appeal_id: this.appealInfo.id }); // Редактирование
      }

      this.$emit('close');
    }
  }
};
</script>

<template>
  <Modal ref="modal" @close="$emit('close')" title="Создание заявки">
    <div class="dashboard__container">
      <div class="dashboard__content">
        <div class="dashboard__col">
          <Dropdown
              :options="premises"
              :default="formData.premise.address"
              @change="(e) => formData.premise.premise_id = e.value"
              placeholder="Дом"
          />

          <Dropdown
              :options="apartments"
              :default="formData.apartment.label"
              @change="(e) => formData.apartment.apartment_id = e.value"
              placeholder="Квартира"
          />

          <Input v-model="formData.due_date" type="datetime-local"/>
        </div>

        <div class="dashboard__col">
          <Input v-model="formData.applicant.last_name" placeholder="Фамилия"/>
          <Input v-model="formData.applicant.first_name" placeholder="Имя"/>
          <Input v-model="formData.applicant.patronymic_name" placeholder="Отчество"/>
          <Input v-model="formData.applicant.username" placeholder="Телефон"/>
        </div>

        <div class="dashboard__col dashboard__area">
          <textarea v-model="formData.description" placeholder="Описание заявки" rows="7"/>
        </div>
      </div>

      <div class="dashboard__header">
        <button @click="submitForm">{{ !appealInfo ? 'создать' : 'сохранить' }}</button>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
@import "DashboardCreate.scss";
</style>
