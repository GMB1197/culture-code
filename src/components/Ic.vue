<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { I } from '../lib/icons'
defineProps({ n: { type: String, required: true } })
</script>

<template><FontAwesomeIcon :icon="I[n]" fixed-width /></template>
