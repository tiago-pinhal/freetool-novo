<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer footer-center p-10 bg-base-200 text-base-content border-t border-base-content/5 mt-auto">
    <aside>
      <p class="text-sm opacity-60">
        &copy; {{ currentYear }} <span class="font-bold">FreeTool.Dev</span> — {{ t('r') }}
      </p>
    </aside>
    <nav class="grid grid-flow-col gap-4">
      <NuxtLink :to="localePath('about')" class="link link-hover font-medium underline-offset-4">{{ t('a') }}</NuxtLink>
      <NuxtLink :to="localePath('privacy')" class="link link-hover font-medium underline-offset-4">{{ t('p') }}</NuxtLink>
      <NuxtLink :to="localePath('terms-of-use')" class="link link-hover font-medium underline-offset-4">{{ t('t') }}</NuxtLink>
    </nav>
  </footer>
</template>

<i18n lang="yaml">
en:
    r: "All Rights Reserved"
    a: "About"
    p: "Privacy Policy"
    t: "Terms"
pt:
    r: "Todos os Direitos Reservados"
    a: "Sobre"
    p: "Política de Privacidade"
    t: "Termos"
es:
    r: "Todos los Derechos Reservados"
    a: "Sobre"
    p: "Política de Privacidad"
    t: "Términos"
fr:
    r: "Tous droits réservés"
    a: "Propos"
    p: "Politique de Confidentialité"
    t: "Conditions"
it:
    r: "Tutti i diritti riservati"
    a: "Su di noi"
    p: "Politica Sulla Privacy"
    t: "Termini"
id:
    r: "Semua Hak Dilindungi"
    a: "Tentang Kami"
    p: "Kebijakan Privasi"
    t: "Syarat dan Ketentuan"
</i18n>
