<script setup lang="ts">
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const currentLocale = computed(() => {
  return locales.value.find((l: any) => l.code === locale.value)
})

const currentLocaleName = computed(() => {
  const current = currentLocale.value
  return typeof current === 'object' ? (current as any).name : current
})

const otherLocales = computed(() => {
  return locales.value.filter((l: any) => l.code !== locale.value)
})

const toggleMenu = () => {
  const checkbox = document.getElementById('main-drawer') as HTMLInputElement | null
  if (checkbox) checkbox.checked = !checkbox.checked
}

const route = useRoute()
const isHomePage = computed(() => route.path === localePath('/'))
</script>

<template>
  <header class="navbar bg-base-200 shadow-sm w-full rounded-md px-4">
    <div class="navbar-start">
      <button v-if="!isHomePage" @click="toggleMenu" class="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </button>
      <NuxtLink :to="localePath('/')" class="flex items-center text-2xl font-bold text-base-content transition-transform active:scale-95 whitespace-nowrap">
        𝗙𝗿𝗲𝗲𝗧𝗼𝗼𝗹
        <span class="ml-2 text-sm font-medium px-2 py-0.5 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white uppercase tracking-wider">
          DEV
        </span>
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <div class="flex items-center">
        <div class="dropdown dropdown-end group">
          <div
            tabindex="0"
            role="button"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Select language"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-base-content hover:bg-base-200 transition-colors duration-200 cursor-pointer"
          >
            <Icon name="language.svg?width=18&height=18" aria-hidden="true" />
            <span class="hidden sm:inline font-medium">{{ currentLocaleName }}</span>
            <Icon name="chevron-down.svg?width=18&height=18" class="opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </div>

          <ul
            tabindex="0"
            role="menu"
            class="dropdown-content z-[100] menu p-2 shadow-xl bg-base-200 rounded-lg w-44 mt-2 border border-base-content/10"
          >
            <li v-for="loc in otherLocales" :key="loc.code">
              <NuxtLink
                :to="switchLocalePath(loc.code)"
                class="text-base-content hover:bg-base-300 transition-colors rounded-md"
              >
                {{ loc.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
