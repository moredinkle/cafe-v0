<template>
  <v-card rounded>
    <v-card-title>
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-form ref="form" v-model="valid" lazy-validation>
              <div v-for="(item, index) in formElements" :key="item.ref">
                <v-text-field
                  v-model="form.parent_id[index]"
                  :label="item.label"
                  :counter="item.count"
                  :rules="item.rules"
                  :type="item.type"
                  required
                  outlined
                  auto-grow
                  clearable
                  filled
                  clear-icon="mdi-close-circle"
                ></v-text-field>
              </div>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="warning" text @click="reset"> Vaciar </v-btn>
      <v-btn color="success" text @click="save" :disabled="!valid"> Guardar </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "FormComponent",

  props: {
    formElements: Array,
    formTitle: String,
  },

  data() {
    return {
      valid: true,
      formData: [],
      form: {
        parent_id: [],
      },
    };
  },

  methods: {
    save(){
      this.$emit('saveForm',this.form.parent_id);
      this.reset();
    },

    reset() {
        this.$refs.form.reset();
    }
  },
};
</script>
