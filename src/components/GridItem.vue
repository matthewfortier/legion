<template>
    <tr @contextmenu.prevent="$refs.menu.open($event, { path: match.path })" v-on:click="loadResults(match.path)" v-on:dblclick="openFile(match.path)">
        <td><img v-bind:src="match.file | icon" alt=""></td>
        <td>{{ match.file }}</td>
        <td>{{ match.path.replace(match.directory, "").replace(/^\//, "").replace(/^\\/, "") }}</td>
        <td>{{ match.file.slice((match.file.lastIndexOf(".") - 1 >>> 0) + 2) | mime }}</td>
        <td>{{ match.stats.size | bytesToSize }}</td>
        <td>{{ match.stats.atimeMs | dateFromTime }}</td>
        <td>{{ match.stats.mtimeMs | dateFromTime }}</td>
        <td>{{ match.stats.birthtimeMs | dateFromTime }}</td>
    </tr>
</template>

<script>
export default {
  name: "GridItem",
  props: ["match"]
};
</script>

<style lang="scss" scoped>
</style>
