<template>
  <div>
    <h1 class="ma-3">Menú</h1>
    <sales-menu @itemAddedToOrder="addToOrder"/>
    <h1 class="ma-3">Pedido</h1>
  </div>
</template>

<script>
// import HelloWorld from "../components/HelloWorld";
// import CardComponent from "../components/UI/CardComponent";
import SalesMenu from "../components/sales/SalesMenu";

export default {
  name: "SalesView",
  components: {
    SalesMenu
  },
  data(){
    return{
      order: [],
    }
  },
  methods: {
    addToOrder(item){
      console.log(`${item.nombre}   ${item.cantidad}   ${item.precio}`)
      this.order.push(item);
    }

  },
  created() {

  }
};
</script>
