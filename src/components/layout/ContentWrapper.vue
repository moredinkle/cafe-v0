<template>
  <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <slot></slot>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'ContentWrapper'
}
</script>
