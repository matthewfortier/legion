<template>
    <div class="results-grid">
        <table id="results-table">
            <thead>
                <tr><th>Filename</th></tr>
            </thead>
            <tbody>
                <tr v-for="file in files" :key="file.filename" v-on:click="loadResults(file)">
                    <td>{{ file.filename }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "ResultsGrid",
  data() {
    return {
      files: []
    };
  },
  methods: {
    loadResults: function(file) {
      ipcRenderer.send("cross-component", {
        message: "loadResults",
        data: file
      });
    }
  },
  mounted() {
    var that = this;

    ipcRenderer.on("clear", function() {
      that.files = [];
    });

    ipcRenderer.on("fileResponse", function(event, args) {
      // eslint-disable-next-line
      console.log(args);
      that.files.push(args);
    });
  }
};
</script>

<style lang="scss" scoped>
.results-grid {
  overflow-x: scroll;
}

th {
  background-color: #2c333d;
}

td {
  white-space: nowrap;
  border-top: 1px solid #2f374a;
}

tbody tr:hover {
  background-color: lighten(#1b77d2, 10);
  cursor: pointer;
}
</style>
