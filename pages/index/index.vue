<template>
	<Appointment />
</template>

<script setup>
import { utils } from '@/static/js/utils.js';
import Appointment from "/pages/component/makeMeet/Appointment.vue";
utils.timerLoginStatus();
</script>