<template>
    <section class="app-body container-fluid">
      <div id="results-row" class="row">
        <div id="results">
          <ResultsGrid />
          <ResultsView :displayed="displayed" />
        </div>
      </div>
    </section>
</template>

<script>
import ResultsGrid from "@/components/ResultsGrid";
import ResultsView from "@/components/ResultsView";

export default {
  name: "Results",
  props: ["matches", "displayed"],
  components: {
    ResultsGrid,
    ResultsView
  },
  data() {
    return {
      split: null
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
