<template>
  <div>
    <b-container>
      <keep-alive>
        <WineTable />
      </keep-alive>
    </b-container>
  </div>
</template>

<script>
import WineTable from "@/components/WineTable.vue"

export default {
  components: {
    WineTable
  },
};
</script>
