<script setup lang="ts">
import { watch, computed, ref, reactive } from 'vue'
import Color from '~/components/Color.vue'

interface ColorState { value: string, locked: boolean }
interface State { hue: number, format: number, luminosity: number}
const state = reactive<State>({ hue: 0, format: 0, luminosity: 0 })

const { t, locale } = useI18n({ useScope: 'local' })

const colors = ref<ColorState[]>(Array(9).fill(null).map(() => ({ value: '', locked: false })));
const ads = ref(false);
const t_hues = computed(() => t('hues').split(','));
const hues = 'random,blue,red,orange,yellow,green,purple,pink,monochrome'.split(',');
const formats = 'HEX,RGB,RGBA,HSL,HSLA'.split(',');
const t_luminosities = computed(() => ['...', ...t('luminosities').split(',')]);
const luminosities = ['light','dark'];

const { status: rcStatus } = useScript('https://cdnjs.cloudflare.com/ajax/libs/randomcolor/0.6.1/randomColor.js', { trigger: 'client' })
const rcLoaded = computed(() => rcStatus.value === 'loaded')

watch(() => [state.hue, state.format, state.luminosity], () => {
    colors.value = colors.value.map(c => c.locked ? c : { value: '', locked: false });
});

function toggleLock(index: number) {
    colors.value[index].locked = !colors.value[index].locked;
}

const MAX_RETRY_ATTEMPTS = 20;

function generateUniqueColor(rc: Function, existingColors: Set<string>): string {
    const opts = {
        hue: hues[state.hue],
        format: formats[state.format].toLowerCase(),
        luminosity: state.luminosity === 0 ? null : luminosities[state.luminosity - 1]
    };

    for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
        const candidate: string = rc(opts);
        const normalized = candidate.toLowerCase().replace(/\s/g, '');
        if (!existingColors.has(normalized)) {
            existingColors.add(normalized);
            return candidate;
        }
    }

    return '';
}

function generate(){
    if (!rcLoaded.value) return;
    const rc = (window as any).randomColor;

    const usedColors = new Set<string>(
        colors.value
            .filter(c => c.locked && c.value)
            .map(c => c.value.toLowerCase().replace(/\s/g, ''))
    );

    const toGenerate = 9 - usedColors.size;

    if (toGenerate > 0) {
        try {
            colors.value = colors.value.map(c => {
                if (c.locked && c.value) return c;
                const unique = generateUniqueColor(rc, usedColors);
                return { value: unique, locked: false };
            });
        } catch (e) {
            console.error('Error generating colors:', e);
        }
    }

    ads.value = true;
}

// --- SEO ---
usePageJsonLd({
  name: t('title'),
  description: t('meta'),
  features: [t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')],
  faq: [
    { question: t('faq1q'), answer: t('faq1a') },
    { question: t('faq2q'), answer: t('faq2a') },
    { question: t('faq3q'), answer: t('faq3a') }
  ],
})

useHead({
    htmlAttrs: {
        lang: locale.value
    },
    title: t('pageTitle'),
    meta: [
        { name: "description", content: t('meta') },
        { property: 'og:title', content: t('ogTitle') },
        { property: 'og:description', content: t('meta') },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: t('ogLocale') },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: t('ogTitle') },
        { name: 'twitter:description', content: t('meta') }
    ]
})

defineI18nRoute({
    paths: {
        en: '/random-colors',
        pt: '/cores-aleatorias',
        es: '/colores-aleatorios',
        fr: '/couleurs-aleatoires',
        it: '/colori-casuali',
        id: '/warna-acak',
        de: '/zufallsfarben',
        nl: '/willekeurige-kleuren',
        ru: '/sluchajnye-cveta'
    }
})
</script>

<template>
  <ToolPage
    :title="t('title')"
    :description="t('intro')"
    :info-description="t('about_desc')"
    :see-also-links="[
      { label: t('see1'), to: 'dominant-colors-of-the-image' },
      { label: t('see2'), to: 'color-converter' },
      { label: t('see3'), to: 'color-combination' },
      { label: t('see4'), to: 'qrcode-generator' }
    ]"
  >
    <div class="flex flex-col py-8 w-full max-w-2xl mx-auto">
        <div class="flex flex-wrap items-end gap-3 mb-6">
            <div class="grid min-w-[120px] flex-1">
                <label for="hue" class="text-xs text-base-content/60 mb-1 font-medium">{{ t('hue') }}:</label>
                <select id="hue" v-model="state.hue" class="select select-bordered select-sm w-full">
                    <option v-for="(h, i) in t_hues" :key="i" :value="i">{{ h }}</option>
                </select>
            </div>
            <div class="grid min-w-[100px] flex-1">
                <label for="lum" class="text-xs text-base-content/60 mb-1 font-medium">{{ t('luminosity') }}:</label>
                <select id="lum" v-model="state.luminosity" class="select select-bordered select-sm w-full">
                    <option v-for="(l, i) in t_luminosities" :key="i" :value="i">{{ l }}</option>
                </select>
            </div>
            <div class="grid min-w-[100px] flex-1">
                <label for="format" class="text-xs text-base-content/60 mb-1 font-medium">{{ t('fmt') }}:</label>
                <select id="format" v-model="state.format" class="select select-bordered select-sm w-full">
                    <option v-for="(f, i) in formats" :key="i" :value="i">{{ f }}</option>
                </select>
            </div>
            <button type="button" @click="generate" :disabled="!rcLoaded" class="btn btn-primary btn-sm h-[32px] px-6">
                <Icon name="dice.svg?width=18&height=18&color=currentColor" lib="mdi"/> {{ t('bt') }}
            </button>
        </div>
        
        <div class="grid grid-cols-3 gap-2 mt-4">
            <div v-for="(item, i) in colors" :key="'clr'+i" class="relative group h-24 w-full rounded overflow-hidden">
                <Color :color="item.value" v-if="item.value" class="w-full h-full" />
                <div v-else class="rounded border border-base-content/20 bg-base-200/50 h-full w-full animate-pulse flex items-center justify-center text-base-content/40 italic text-[10px] text-center px-1">
                    {{ t('empty') }}
                </div>
                
                <button 
                    v-if="item.value"
                    @click="toggleLock(i)" 
                    type="button"
                    class="absolute top-1 right-1 p-1.5 rounded-md bg-black/60 hover:bg-black/80 transition-all z-10 flex items-center justify-center cursor-pointer"
                    :class="item.locked ? 'opacity-100 scale-110 shadow-lg text-yellow-400' : 'opacity-60 hover:opacity-100 scale-100 text-white'"
                    :title="item.locked ? t('unlock') : t('lock')"
                >
                    <Icon 
                        :name="item.locked ? 'lock' : 'lock-open-outline'" 
                        lib="mdi" 
                    />
                </button>
            </div>
        </div>

        <Ads adslot="5577057946" format="auto" v-if="ads" class="mt-8" />
    </div>

    <template #info>
      <div class="space-y-8">
        

        <FeatureSection
          :title="t('features_title')"
          :items="[t('feature_1'), t('feature_2'), t('feature_3'), t('feature_4')]"
        />

        <UseCaseSection
          :title="t('apps_title')"
          :items="[t('app1'), t('app2'), t('app3'), t('app4'), t('app5')]"
        />

        <HowToSection
          :title="t('how_title')"
          :items="[
            { title: t('step_1_t'), description: t('step_1_d') },
            { title: t('step_2_t'), description: t('step_2_d') },
            { title: t('step_3_t'), description: t('step_3_d') },
            { title: t('step_4_t'), description: t('step_4_d') },
            { title: t('step_5_t'), description: t('step_5_d') }
          ]"
        />

        <div>
          <FeatureSection
            :title="t('tech_title')"
            :items="[t('tech1'), t('tech2'), t('tech3'), t('tech4')]"
          />
        </div>

        <FaqSection
          :title="t('faq_title')"
          :items="[
            { question: t('faq1q'), answer: t('faq1a') },
            { question: t('faq2q'), answer: t('faq2a') },
            { question: t('faq3q'), answer: t('faq3a') }
          ]"
        />
      </div>
    </template>
  </ToolPage>
</template>

<i18n lang="yaml">
{
    en: {
        pageTitle: "Random Color Palette Generator – HEX, RGB, HSL | Free",
        ogTitle: "Random Color Palette Generator: Free Online Color Picker Tool",
        ogLocale: "en_US",
        title: "Random Color Generator",
        intro: "Generate random colors and build professional color palettes in different formats. Lock your favorite colors, filter by hue and luminosity, and explore different color sets instantly.",
        bt: "Generate Colors",
        meta: "Generate random colors and colour palettes online in HEX, RGB, or HSL. Use as a random color picker — lock specific colours and create palettes quickly with hue and luminosity control.",
        about_desc: "This random color picker (palette generator) allows you to create color combinations in HEX, RGB, RGBA, HSL, and HSLA formats. Use the hue and luminosity controls to refine the result, lock the colors you want to preserve, and generate new variations until you find the ideal combination.",
        feature_1: "Generate random colors in HEX, RGB, RGBA, HSL, and HSLA",
        feature_2: "Filter by shades like blue, red, green, orange, pink, purple, or monochrome",
        feature_3: "Choose between light, dark, or fully random tones",
        feature_4: "Lock your favorite colors to reuse them in future palettes",
        how_title: "How to Use the Random Color Generator",
        features_title: "Key Features",
        step_1_t: "Choose a base color",
        step_1_d: "Select shades like Blue, Red, or Green to narrow the results, or leave it on Random to generate more varied combinations",
        step_2_t: "Set the luminosity",
        step_2_d: "Choose between light, dark, or no filter to generate colors with different brightness levels",
        step_3_t: "Choose the format",
        step_3_d: "Select the output format for the generated colors: HEX, RGB, RGBA, HSL, or HSLA",
        step_4_t: "Click Generate Colors",
        step_4_d: "Nine colors appear instantly. Hover over any color to preview its value and click to copy",
        step_5_t: "Lock and refine",
        step_5_d: "Click the padlock icon on any color to lock it. When generating again, only unlocked colors will change",
        apps_title: "What You Can Use Random Colors For",
        app1: "Create palettes for interfaces, brands, and visual projects by combining primary colors and complementary shades",
        app2: "Generate combinations for CSS variables, themes, buttons, hover states, and interface prototypes",
        app3: "Explore monochrome, light, or dark palettes for dashboards, landing pages, and modern interfaces",
        app4: "Find inspiration for posters, illustrations, moodboards, and visual identities using different color styles",
        app5: "Compare warm, cool, soft, or saturated tones to test different visual directions for a project",
        tech_title: "Technical Notes and Edge Cases",
        tech1: "HEX is one of the most common formats for CSS, Tailwind, and interfaces because it is simple, compact, and easy to recognize",
        tech2: "RGB and RGBA are ideal for transparency, gradients, overlays, and visual effects",
        tech3: "HSL and HSLA make it easier to adjust brightness and saturation without changing the main color tone",
        tech4: "Locked colors remain saved only during the current session. Refreshing the page or changing filters may reset the palette",
        faq_title: "Frequently Asked Questions",
        faq1q: "Are the generated colors really random?",
        faq1a: "Yes, but the results follow the selected filters. Choosing a color group or setting light or dark tones keeps the generated combinations within those preferences.",
        faq2q: "How can I keep a color while generating new combinations?",
        faq2a: "Click the padlock icon on the desired color. It will remain fixed in future palettes while the other colors continue changing.",
        faq3q: "Which format should I use: HEX, RGB, or HSL?",
        faq3a: "HEX is one of the most common formats for CSS and interfaces. RGB and RGBA are ideal for transparency and visual effects, while HSL and HSLA make brightness and saturation adjustments easier.",
        hue: "Hue",
        luminosities: "Light,Dark",
        hues: "Random,Blue,Red,Orange,Yellow,Green,Purple,Pink,Monochrome",
        fmt: "Format",
        luminosity: "Luminosity",
        see1: "Image Colors",
        see2: "Color Converter",
        see3: "Color Combination",
        see4: "QR Code Generator",
        lock: "Lock color",
        unlock: "Unlock color",
        empty: "Empty"
    },
    pt: {
        pageTitle: "Gerador de Paleta de Cores Aleatórias – HEX, RGB, HSL | Grátis",
        ogTitle: "Gerador de Paleta de Cores Aleatórias: Ferramenta Online Grátis",
        ogLocale: "pt_BR",
        title: "Gerador de Cores Aleatórias",
        intro: "Gere cores aleatórias e monte paletas de cores profissionais em diferentes formatos. Fixe suas cores favoritas, filtre por matiz e luminosidade e explore diferentes conjunto de cores instantaneamente.",
        bt: "Gerar Cores",
        meta: "Gere cores aleatórias e paletas de cores online em HEX, RGB ou HSL. Use como seletor de cores aleatório — fixe cores específicas e crie paletas rapidamente com controle de matiz e luminosidade.",
        about_desc: "Este seletor de cores aleatório (gerador de paletas) permite criar combinações de cores nos formatos HEX, RGB, RGBA, HSL e HSLA. Use os controles de matiz e luminosidade para refinar o resultado, fixe as cores que quiser preservar e gere novas variações até encontrar a combinação ideal.",
        feature_1: "Gere cores aleatórias em HEX, RGB, RGBA, HSL e HSLA",
        feature_2: "Filtre por tons como azul, vermelho, verde, laranja, rosa, roxo ou monocromático",
        feature_3: "Escolha entre tons claros, escuros ou totalmente aleatórios",
        feature_4: "Fixe suas cores favoritas para reutilizá-las nas próximas paletas",
        how_title: "Como Usar o Gerador de Cores Aleatórias",
        features_title: "Funcionalidades",
        step_1_t: "Escolha a cor base",
        step_1_d: "Selecione tons como Azul, Vermelho ou Verde para limitar os resultados, ou deixe em Aleatório para gerar combinações mais variadas",
        step_2_t: "Defina a luminosidade",
        step_2_d: "Escolha entre tons claros, escuros ou sem filtro para gerar cores com diferentes níveis de brilho",
        step_3_t: "Escolha o formato",
        step_3_d: "Selecione o formato de saída das cores: HEX, RGB, RGBA, HSL ou HSLA",
        step_4_t: "Clique em Gerar Cores",
        step_4_d: "Nove cores são exibidas instantaneamente. Passe o mouse sobre qualquer uma para visualizar o código da cor e clique para copiar",
        step_5_t: "Fixe e refine",
        step_5_d: "Clique no cadeado em qualquer cor para fixá-la. Ao gerar novamente, apenas as cores não fixadas serão alteradas",
        apps_title: "Casos de Uso",
        app1: "Crie paletas para interfaces, marcas e projetos visuais combinando cores principais e tons complementares.",
        app2: "Gere combinações para variáveis CSS, temas, botões, estados hover e protótipos de interface.",
        app3: "Explore paletas monocromáticas, claras ou escuras para dashboards, landing pages e interfaces modernas.",
        app4: "Encontre inspirações para pôsteres, ilustrações, moodboards e identidades visuais com diferentes estilos de cor.",
        app5: "Compare tons quentes, frios, suaves ou saturados para testar diferentes direções visuais em um projeto.",
        tech_title: "Notas Técnicas",
        tech1: "HEX é um dos formatos mais usados para CSS, Tailwind e interfaces por ser simples, compacto e fácil de identificar",
        tech2: "RGB e RGBA são ideais para transparência, gradientes, sobreposições e efeitos visuais",
        tech3: "HSL e HSLA facilitam ajustes de brilho e saturação sem alterar o tom principal da cor",
        tech4: "As cores fixadas permanecem salvas apenas durante a sessão atual. Atualizar a página ou alterar os filtros pode redefinir a paleta",
        faq_title: "Perguntas e Respostas",
        faq1q: "As cores geradas são realmente aleatórias?",
        faq1a: "Sim, mas os resultados seguem os filtros selecionados. Ao escolher um grupo de cores ou definir tons claros ou escuros, as combinações geradas permanecem dentro dessas preferências.",
        faq2q: "Como manter uma cor enquanto gero novas combinações?",
        faq2a: "Clique no ícone de cadeado da cor desejada. Ela permanecerá fixa nas próximas paletas geradas enquanto as outras cores mudam.",
        faq3q: "Qual formato devo usar: HEX, RGB ou HSL?",
        faq3a: "HEX é um dos formatos mais usados em CSS e interfaces. RGB e RGBA são ideais para transparência e efeitos visuais, enquanto HSL e HSLA facilitam ajustes de brilho e saturação.",
        hue: "Cor Base",
        luminosities: "Claro,Escuro",
        hues: "Aleatório,Azul,Vermelho,Laranja,Amarelo,Verde,Roxo,Rosa,Monocromático",
        fmt: "Formato",
        luminosity: "Luminosidade",
        see1: "Cores da Imagem",
        see2: "Conversor de Cores",
        see3: "Combinação de Cores",
        see4: "Gerador de QR Code",
        lock: "Fixar cor",
        unlock: "Desbloquear cor",
        empty: "Vazio"
    },
    es: {
        pageTitle: "Generador de Paletas de Colores Aleatorios – HEX, RGB, HSL | Gratis",
        ogTitle: "Generador de Paletas de Colores Aleatorios: Herramienta Online Gratis",
        ogLocale: "es_ES",
        title: "Generador de Colores Aleatorios",
        intro: "Genera colores aleatorios y crea paletas de colores profesionales en diferentes formatos. Fija tus colores favoritos, filtra por tono y luminosidad y explora diferentes conjuntos de colores al instante.",
        bt: "Generar Colores",
        meta: "Genera colores aleatorios y paletas de colores online en HEX, RGB o HSL. Úsalo como selector de colores aleatorio — bloquea colores específicos y crea paletas rápidamente con control de tono y luminosidad.",
        about_desc: "Este selector de colores aleatorios (generador de paletas) te permite crear combinaciones de colores en los formatos HEX, RGB, RGBA, HSL y HSLA. Usa los controles de tono y luminosidad para refinar el resultado, fija los colores que quieras conservar y genera nuevas variaciones hasta encontrar la combinación ideal.",
        feature_1: "Genera colores aleatorios en HEX, RGB, RGBA, HSL y HSLA",
        feature_2: "Filtra por tonos como azul, rojo, verde, naranja, rosa, púrpura o monocromático",
        feature_3: "Elige entre tonos claros, oscuros o completamente aleatorios",
        feature_4: "Fija tus colores favoritos para reutilizarlos en futuras paletas",
        how_title: "Cómo Usar el Generador de Colores Aleatorios",
        features_title: "Funcionalidades",
        step_1_t: "Elige un color base",
        step_1_d: "Selecciona tonos como Azul, Rojo o Verde para limitar los resultados, o déjalo en Aleatorio para generar combinaciones más variadas",
        step_2_t: "Define la luminosidad",
        step_2_d: "Elige entre tonos claros, oscuros o sin filtro para generar colores con diferentes niveles de brillo",
        step_3_t: "Elige el formato",
        step_3_d: "Selecciona el formato de salida de los colores generados: HEX, RGB, RGBA, HSL o HSLA",
        step_4_t: "Haz clic en Generar Colores",
        step_4_d: "Nueve colores aparecen al instante. Pasa el cursor sobre cualquiera para ver el valor y haz clic para copiarlo",
        step_5_t: "Fija y ajusta",
        step_5_d: "Haz clic en el candado de cualquier color para fijarlo. Al generar nuevamente, solo cambiarán los colores no fijados",
        apps_title: "Para Qué Puedes Usar los Colores Aleatorios",
        app1: "Crea paletas para interfaces, marcas y proyectos visuales combinando colores principales y tonos complementarios",
        app2: "Genera combinaciones para variables CSS, temas, botones, estados hover y prototipos de interfaz",
        app3: "Explora paletas monocromáticas, claras u oscuras para dashboards, landing pages e interfaces modernas",
        app4: "Encuentra inspiración para pósters, ilustraciones, moodboards e identidades visuales usando diferentes estilos de color",
        app5: "Compara tonos cálidos, fríos, suaves o saturados para probar diferentes direcciones visuales en un proyecto",
        tech_title: "Notas Técnicas y Casos Especiales",
        tech1: "HEX es uno de los formatos más usados para CSS, Tailwind e interfaces por ser simple, compacto y fácil de reconocer",
        tech2: "RGB y RGBA son ideales para transparencias, gradientes, superposiciones y efectos visuales",
        tech3: "HSL y HSLA facilitan ajustes de brillo y saturación sin cambiar el tono principal del color",
        tech4: "Los colores fijados solo se mantienen durante la sesión actual. Actualizar la página o cambiar los filtros puede reiniciar la paleta",
        faq_title: "Preguntas Frecuentes",
        faq1q: "¿Los colores generados son realmente aleatorios?",
        faq1a: "Sí, pero los resultados siguen los filtros seleccionados. Elegir un grupo de colores o definir tonos claros u oscuros mantiene las combinaciones dentro de esas preferencias.",
        faq2q: "¿Cómo puedo mantener un color mientras genero nuevas combinaciones?",
        faq2a: "Haz clic en el icono de candado del color deseado. Permanecerá fijo en las próximas paletas mientras los demás colores siguen cambiando.",
        faq3q: "¿Qué formato debería usar: HEX, RGB o HSL?",
        faq3a: "HEX es uno de los formatos más usados en CSS e interfaces. RGB y RGBA son ideales para transparencias y efectos visuales, mientras que HSL y HSLA facilitan los ajustes de brillo y saturación.",
        hue: "Tono",
        luminosities: "Claro,Oscuro",
        hues: "Aleatorio,Azul,Rojo,Naranja,Amarillo,Verde,Púrpura,Rosa,Monocromo",
        fmt: "Formato",
        luminosity: "Luminosidad",
        see1: "Colores de la Imagen",
        see2: "Convertidor de Colores",
        see3: "Combinación de Colores",
        see4: "Generador de QR Code",
        lock: "Bloquear color",
        unlock: "Desbloquear color",
        empty: "Vacío"
    },
    fr: {
        pageTitle: "Générateur de Palettes de Couleurs Aléatoires – HEX, RGB, HSL | Gratuit",
        ogTitle: "Générateur de Palettes de Couleurs Aléatoires: Outil en Ligne Gratuit",
        ogLocale: "fr_FR",
        title: "Générateur de Couleurs Aléatoires",
        intro: "Générez des couleurs aléatoires et créez des palettes de couleurs professionnelles dans différents formats. Verrouillez vos couleurs préférées, filtrez par teinte et luminosité et explorez différents ensembles de couleurs instantanément.",
        bt: "Générer des Couleurs",
        meta: "Générez des couleurs aléatoires et des palettes de couleurs en ligne en HEX, RGB ou HSL. Utilisez comme sélecteur de couleurs aléatoire — verrouillez des couleurs spécifiques et créez des palettes rapidement avec contrôle de teinte et luminosité.",
        about_desc: "Ce sélecteur de couleurs aléatoires (générateur de palettes) vous permet de créer des combinaisons de couleurs aux formats HEX, RGB, RGBA, HSL et HSLA. Utilisez les contrôles de teinte et de luminosité pour affiner le résultat, verrouillez les couleurs que vous souhaitez conserver et générez de nouvelles variations jusqu'à trouver la combinaison idéale.",
        feature_1: "Générez des couleurs aléatoires en HEX, RGB, RGBA, HSL et HSLA",
        feature_2: "Filtrez par tons comme bleu, rouge, vert, orange, rose, violet ou monochrome",
        feature_3: "Choisissez entre des tons clairs, sombres ou totalement aléatoires",
        feature_4: "Verrouillez vos couleurs préférées pour les réutiliser dans de futures palettes",
        how_title: "Comment Utiliser le Générateur de Couleurs Aléatoires",
        features_title: "Fonctionnalités",
        step_1_t: "Choisissez une couleur de base",
        step_1_d: "Sélectionnez des tons comme Bleu, Rouge ou Vert pour limiter les résultats, ou laissez sur Aléatoire pour obtenir des combinaisons plus variées",
        step_2_t: "Définissez la luminosité",
        step_2_d: "Choisissez entre des tons clairs, sombres ou sans filtre pour générer des couleurs avec différents niveaux de luminosité",
        step_3_t: "Choisissez le format",
        step_3_d: "Sélectionnez le format de sortie des couleurs générées : HEX, RGB, RGBA, HSL ou HSLA",
        step_4_t: "Cliquez sur Générer des Couleurs",
        step_4_d: "Neuf couleurs apparaissent instantanément. Survolez-en une pour voir sa valeur et cliquez pour la copier",
        step_5_t: "Verrouillez et ajustez",
        step_5_d: "Cliquez sur le cadenas d’une couleur pour la verrouiller. Lors de la prochaine génération, seules les couleurs non verrouillées changeront",
        apps_title: "À quoi Servent les Couleurs Aléatoires",
        app1: "Créez des palettes pour interfaces, marques et projets visuels en combinant couleurs principales et tons complémentaires",
        app2: "Générez des combinaisons pour variables CSS, thèmes, boutons, états hover et prototypes d’interface",
        app3: "Explorez des palettes monochromes, claires ou sombres pour dashboards, landing pages et interfaces modernes",
        app4: "Trouvez de l’inspiration pour affiches, illustrations, moodboards et identités visuelles avec différents styles de couleur",
        app5: "Comparez des tons chauds, froids, doux ou saturés pour tester différentes directions visuelles dans un projet",
        tech_title: "Notes Techniques et Cas Particuliers",
        tech1: "HEX est l’un des formats les plus utilisés pour CSS, Tailwind et les interfaces grâce à sa simplicité et son format compact",
        tech2: "RGB et RGBA sont idéaux pour la transparence, les dégradés, les superpositions et les effets visuels",
        tech3: "HSL et HSLA facilitent les ajustements de luminosité et de saturation sans modifier la teinte principale",
        tech4: "Les couleurs verrouillées restent enregistrées uniquement pendant la session actuelle. Actualiser la page ou modifier les filtres peut réinitialiser la palette",
        faq_title: "Foire Aux Questions",
        faq1q: "Les couleurs générées sont-elles vraiment aléatoires ?",
        faq1a: "Oui, mais les résultats suivent les filtres sélectionnés. Choisir un groupe de couleurs ou définir des tons clairs ou sombres garde les combinaisons dans ces préférences.",
        faq2q: "Comment conserver une couleur pendant que je génère de nouvelles combinaisons ?",
        faq2a: "Cliquez sur l’icône de cadenas de la couleur souhaitée. Elle restera fixe dans les prochaines palettes pendant que les autres couleurs changent.",
        faq3q: "Quel format utiliser : HEX, RGB ou HSL ?",
        faq3a: "HEX est l’un des formats les plus utilisés pour CSS et les interfaces. RGB et RGBA sont idéaux pour la transparence et les effets visuels, tandis que HSL et HSLA facilitent les ajustements de luminosité et de saturation.",
        hue: "Teinte",
        luminosities: "Clair,Sombre",
        hues: "Aléatoire,Bleu,Rouge,Orange,Jaune,Vert,Violet,Rose,Monochrome",
        fmt: "Format",
        luminosity: "Luminosité",
        see1: "Couleurs de l'Image",
        see2: "Convertisseur de Couleurs",
        see3: "Combinaison de Couleurs",
        see4: "Générateur de QR Code",
        lock: "Verrouiller la couleur",
        unlock: "Déverrouiller la couleur",
        empty: "Vide"
    },
    it: {
        pageTitle: "Generatore di Palette di Colori Casuali – HEX, RGB, HSL | Gratuito",
        ogTitle: "Generatore di Palette di Colori Casuali: Strumento Online Gratuito",
        ogLocale: "it_IT",
        title: "Generatore di Colori Casuali",
        intro: "Genera colori casuali e crea palette di colori professionali in differenti formati. Blocca i tuoi colori preferiti, filtra per tonalità e luminosità ed esplora differenti set di colori all'istante.",
        bt: "Genera Colori",
        meta: "Genera colori casuali e palette di colori online in HEX, RGB o HSL. Usa come selettore di colori casuale — blocca colori specifici e crea palette rapidamente con controllo di tonalità e luminosità.",
        about_desc: "Questo selettore di colori casuali (generatore di palette) ti consente di creare combinazioni di colori nei formati HEX, RGB, RGBA, HSL e HSLA. Usa i controlli di tonalità e luminosità per affinare il risultato, blocca i colori che desideri conservare e genera nuove variazioni fino a trovare la combinazione ideale.",
        feature_1: "Genera colori casuali in HEX, RGB, RGBA, HSL e HSLA",
        feature_2: "Filtra per tonalità come blu, rosso, verde, arancione, rosa, viola o monocromatico",
        feature_3: "Scegli tra tonalità chiare, scure o completamente casuali",
        feature_4: "Blocca i tuoi colori preferiti per riutilizzarli nelle prossime palette",
        how_title: "Come Usare il Generatore di Colori Casuali",
        features_title: "Funzionalità",
        step_1_t: "Scegli un colore base",
        step_1_d: "Seleziona tonalità come Blu, Rosso o Verde per limitare i risultati, oppure lascia su Casuale per ottenere combinazioni più varie",
        step_2_t: "Imposta la luminosità",
        step_2_d: "Scegli tra tonalità chiare, scure o senza filtro per generare colori con diversi livelli di luminosità",
        step_3_t: "Scegli il formato",
        step_3_d: "Seleziona il formato di output dei colori generati: HEX, RGB, RGBA, HSL o HSLA",
        step_4_t: "Clicca su Genera Colori",
        step_4_d: "Nove colori appaiono immediatamente. Passa il mouse su un colore per vedere il valore e clicca per copiarlo",
        step_5_t: "Blocca e perfeziona",
        step_5_d: "Clicca sul lucchetto di un colore per bloccarlo. Alla generazione successiva cambieranno solo i colori non bloccati",
        apps_title: "A Cosa Servono i Colori Casuali",
        app1: "Crea palette per interfacce, brand e progetti visivi combinando colori principali e tonalità complementari",
        app2: "Genera combinazioni per variabili CSS, temi, pulsanti, stati hover e prototipi di interfaccia",
        app3: "Esplora palette monocromatiche, chiare o scure per dashboard, landing page e interfacce moderne",
        app4: "Trova ispirazione per poster, illustrazioni, moodboard e identità visive usando diversi stili di colore",
        app5: "Confronta tonalità calde, fredde, morbide o sature per testare diverse direzioni visive in un progetto",
        tech_title: "Note Tecniche e Casi Particolari",
        tech1: "HEX è uno dei formati più usati per CSS, Tailwind e interfacce grazie alla sua semplicità e compattezza",
        tech2: "RGB e RGBA sono ideali per trasparenze, gradienti, sovrapposizioni ed effetti visivi",
        tech3: "HSL e HSLA facilitano le regolazioni di luminosità e saturazione senza modificare la tonalità principale",
        tech4: "I colori bloccati rimangono salvati solo durante la sessione corrente. Aggiornare la pagina o modificare i filtri può reimpostare la palette",
        faq_title: "Domande Frequenti",
        faq1q: "I colori generati sono davvero casuali?",
        faq1a: "Sì, ma i risultati seguono i filtri selezionati. Scegliere un gruppo di colori o impostare tonalità chiare o scure mantiene le combinazioni all’interno di quelle preferenze.",
        faq2q: "Come posso mantenere un colore mentre genero nuove combinazioni?",
        faq2a: "Clicca sull’icona del lucchetto del colore desiderato. Rimarrà fisso nelle prossime palette mentre gli altri colori continueranno a cambiare.",
        faq3q: "Quale formato dovrei usare: HEX, RGB o HSL?",
        faq3a: "HEX è uno dei formati più usati per CSS e interfacce. RGB e RGBA sono ideali per trasparenze ed effetti visivi, mentre HSL e HSLA facilitano le regolazioni di luminosità e saturazione.",
        hue: "Tonalità",
        luminosities: "Chiaro,Scuro",
        hues: "Casuale,Blu,Rosso,Arancione,Giallo,Verde,Viola,Rosa,Monocromatico",
        fmt: "Formato",
        luminosity: "Luminosità",
        see1: "Colori dell'Immagine",
        see2: "Convertitore di Colori",
        see3: "Combinazione di Colori",
        see4: "Generatore di QR Code",
        lock: "Blocca colore",
        unlock: "Sblocca colore",
        empty: "Vuoto"
    },
    id: {
        pageTitle: "Generator Palet Warna Acak – HEX, RGB, HSL | Gratis",
        ogTitle: "Generator Palet Warna Acak: Alat Online Gratis",
        ogLocale: "id_ID",
        title: "Generator Warna Acak",
        intro: "Hasilkan warna acak dan buat palet warna profesional dalam berbagai format. Kunci warna favorit Anda, filter berdasarkan rona dan kecerahan, dan jelajahi berbagai rangkaian warna secara instan.",
        bt: "Hasilkan Warna",
        meta: "Hasilkan warna acak dan palet warna online dalam format HEX, RGB, atau HSL. Gunakan sebagai pemilih warna acak — kunci warna tertentu dan buat palet dengan cepat menggunakan kontrol rona dan kecerahan.",
        about_desc: "Pemilih warna acak (generator palet) ini memungkinkan Anda membuat kombinasi warna dalam format HEX, RGB, RGBA, HSL, dan HSLA. Gunakan kontrol rona dan kecerahan untuk menyempurnakan hasil, kunci warna yang ingin Anda pertahankan, dan hasilkan variasi baru hingga Anda menemukan kombinasi ideal.",
        feature_1: "Hasilkan warna acak dalam format HEX, RGB, RGBA, HSL, dan HSLA",
        feature_2: "Filter berdasarkan warna seperti biru, merah, hijau, oranye, merah muda, ungu, atau monokrom",
        feature_3: "Pilih antara warna terang, gelap, atau sepenuhnya acak",
        feature_4: "Kunci warna favorit Anda untuk digunakan kembali di palet berikutnya",
        how_title: "Cara Menggunakan Generator Warna Acak",
        features_title: "Fitur Utama",
        step_1_t: "Pilih warna dasar",
        step_1_d: "Pilih warna seperti Biru, Merah, atau Hijau untuk membatasi hasil, atau biarkan di Acak untuk mendapatkan kombinasi yang lebih beragam",
        step_2_t: "Atur kecerahan",
        step_2_d: "Pilih antara warna terang, gelap, atau tanpa filter untuk menghasilkan warna dengan tingkat kecerahan berbeda",
        step_3_t: "Pilih format",
        step_3_d: "Pilih format output warna yang dihasilkan: HEX, RGB, RGBA, HSL, atau HSLA",
        step_4_t: "Klik Hasilkan Warna",
        step_4_d: "Sembilan warna akan muncul secara instan. Arahkan kursor ke warna untuk melihat nilainya dan klik untuk menyalinnya",
        step_5_t: "Kunci dan sesuaikan",
        step_5_d: "Klik ikon gembok pada warna untuk menguncinya. Saat menghasilkan ulang, hanya warna yang tidak dikunci yang akan berubah",
        apps_title: "Kegunaan Warna Acak",
        app1: "Buat palet untuk antarmuka, brand, dan proyek visual dengan menggabungkan warna utama dan warna pelengkap",
        app2: "Hasilkan kombinasi untuk variabel CSS, tema, tombol, status hover, dan prototipe antarmuka",
        app3: "Jelajahi palet monokrom, terang, atau gelap untuk dashboard, landing page, dan antarmuka modern",
        app4: "Temukan inspirasi untuk poster, ilustrasi, moodboard, dan identitas visual dengan berbagai gaya warna",
        app5: "Bandingkan warna hangat, dingin, lembut, atau jenuh untuk mencoba berbagai arah visual dalam proyek",
        tech_title: "Catatan Teknis dan Kasus Khusus",
        tech1: "HEX adalah salah satu format paling umum untuk CSS, Tailwind, dan antarmuka karena sederhana, ringkas, dan mudah dikenali",
        tech2: "RGB dan RGBA ideal untuk transparansi, gradien, overlay, dan efek visual",
        tech3: "HSL dan HSLA memudahkan penyesuaian kecerahan dan saturasi tanpa mengubah rona utama warna",
        tech4: "Warna yang dikunci hanya tersimpan selama sesi aktif. Memuat ulang halaman atau mengubah filter dapat mengatur ulang palet",
        faq_title: "Pertanyaan yang Sering Diajukan",
        faq1q: "Apakah warna yang dihasilkan benar-benar acak?",
        faq1a: "Ya, tetapi hasil tetap mengikuti filter yang dipilih. Memilih kelompok warna atau menentukan warna terang atau gelap akan menjaga kombinasi tetap dalam preferensi tersebut.",
        faq2q: "Bagaimana cara mempertahankan warna saat menghasilkan kombinasi baru?",
        faq2a: "Klik ikon gembok pada warna yang diinginkan. Warna tersebut akan tetap terkunci di palet berikutnya sementara warna lainnya terus berubah.",
        faq3q: "Format mana yang sebaiknya saya gunakan: HEX, RGB, atau HSL?",
        faq3a: "HEX adalah salah satu format paling umum untuk CSS dan antarmuka. RGB dan RGBA ideal untuk transparansi dan efek visual, sedangkan HSL dan HSLA memudahkan penyesuaian kecerahan dan saturasi.",
        hue: "Rona",
        luminosities: "Terang,Gelap",
        hues: "Acak,Biru,Merah,Oranye,Kuning,Hijau,Ungu,Merah Muda,Monokrom",
        fmt: "Format",
        luminosity: "Kecerahan",
        see1: "Warna Gambar",
        see2: "Konverter Warna",
        see3: "Kombinasi Warna",
        see4: "Generator Kode QR",
        lock: "Kunci warna",
        unlock: "Buka kunci warna",
        empty: "Kosong"
    },
    de: {
        pageTitle: "Zufällige Farbpaletten-Generator – HEX, RGB, HSL | Kostenlos",
        ogTitle: "Zufällige Farbpaletten-Generator: Kostenloses Online-Farbtool",
        ogLocale: "de_DE",
        title: "Zufallsfarbengenerator",
        intro: "Erzeugen Sie Zufallsfarben und erstellen Sie professionelle Farbpaletten in verschiedenen Formaten. Speichern Sie Ihre Lieblingsfarben, filtern Sie nach Farbton und Helligkeit und entdecken Sie sofort verschiedene Farbsets.",
        bt: "Farben Generieren",
        meta: "Generiere Zufallsfarben und Farbpaletten online in HEX, RGB oder HSL. Als zufälliger Farbwähler nutzbar — sperre bestimmte Farben und erstelle Paletten schnell mit Farbton- und Helligkeitskontrolle.",
        about_desc: "Mit diesem zufälligen Farbwähler (Paletten-Generator) können Sie Farbkombinationen in den Formaten HEX, RGB, RGBA, HSL und HSLA erstellen. Nutzen Sie die Farbton- und Helligkeitsregler, um das Ergebnis zu verfeinern, sperren Sie die Farben, die Sie behalten möchten, und generieren Sie neue Variationen, bis Sie die ideale Kombination gefunden haben.",
        feature_1: "Erzeuge Zufallsfarben in HEX, RGB, RGBA, HSL und HSLA",
        feature_2: "Filtere nach Farben wie Blau, Rot, Grün, Orange, Pink, Lila oder Monochrom",
        feature_3: "Wähle zwischen hellen, dunklen oder vollständig zufälligen Farbtönen",
        feature_4: "Speichere deine Lieblingsfarben für zukünftige Paletten",
        how_title: "So Verwendest Du den Zufallsfarbengenerator",
        features_title: "Funktionen",
        step_1_t: “Wähle eine Grundfarbe”,
        step_1_d: "Wähle Farbtöne wie Blau, Rot oder Grün, um die Ergebnisse einzugrenzen, oder lasse Zufällig aktiviert für vielfältigere Kombinationen",
        step_2_t: "Lege die Helligkeit fest",
        step_2_d: "Wähle zwischen hellen, dunklen oder ungefilterten Farben für unterschiedliche Helligkeitsstufen",
        step_3_t: "Wähle das Format",
        step_3_d: "Wähle das Ausgabeformat der generierten Farben: HEX, RGB, RGBA, HSL oder HSLA",
        step_4_t: "Klicke auf Farben Generieren",
        step_4_d: "Neun Farben erscheinen sofort. Fahre mit der Maus darüber, um den Wert anzuzeigen, und klicke zum Kopieren",
        step_5_t: "Speichern und Verfeinern",
        step_5_d: "Klicke auf das Schloss-Symbol einer Farbe, um sie zu speichern. Beim nächsten Generieren ändern sich nur die nicht gespeicherten Farben",
        apps_title: "Wofür Du Zufallsfarben Verwenden Kannst",
        app1: "Erstelle Farbpaletten für Interfaces, Marken und visuelle Projekte mit Haupt- und Komplementärfarben",
        app2: "Generiere Kombinationen für CSS-Variablen, Themes, Buttons, Hover-Zustände und Interface-Prototypen",
        app3: "Entdecke monochrome, helle oder dunkle Paletten für Dashboards, Landingpages und moderne Interfaces",
        app4: "Finde Inspiration für Poster, Illustrationen, Moodboards und visuelle Identitäten mit verschiedenen Farbstilen",
        app5: "Vergleiche warme, kalte, sanfte oder kräftige Farbtöne für unterschiedliche visuelle Richtungen eines Projekts",
        tech_title: "Technische Hinweise und Besonderheiten",
        tech1: "HEX ist eines der beliebtesten Formate für CSS, Tailwind und Interfaces, da es einfach, kompakt und leicht erkennbar ist",
        tech2: "RGB und RGBA eignen sich ideal für Transparenz, Verläufe, Overlays und visuelle Effekte",
        tech3: "HSL und HSLA erleichtern Anpassungen von Helligkeit und Sättigung, ohne den Hauptfarbton zu verändern",
        tech4: "Gespeicherte Farben bleiben nur während der aktuellen Sitzung erhalten. Das Neuladen der Seite oder Ändern der Filter kann die Palette zurücksetzen",
        faq_title: "Häufig Gestellte Fragen",
        faq1q: "Sind die generierten Farben wirklich zufällig?",
        faq1a: "Ja, aber die Ergebnisse folgen den ausgewählten Filtern. Wenn du eine Farbgruppe oder helle bzw. dunkle Farbtöne auswählst, bleiben die Kombinationen innerhalb dieser Einstellungen.",
        faq2q: "Wie kann ich eine Farbe behalten, während ich neue Kombinationen generiere?",
        faq2a: "Klicke auf das Schloss-Symbol der gewünschten Farbe. Sie bleibt in zukünftigen Paletten erhalten, während sich die anderen Farben weiter ändern.",
        faq3q: "Welches Format sollte ich verwenden: HEX, RGB oder HSL?",
        faq3a: "HEX gehört zu den beliebtesten Formaten für CSS und Interfaces. RGB und RGBA eignen sich ideal für Transparenz und visuelle Effekte, während HSL und HSLA Anpassungen von Helligkeit und Sättigung vereinfachen.",
        hue: "Farbton",
        luminosities: "Hell,Dunkel",
        hues: "Zufällig,Blau,Rot,Orange,Gelb,Grün,Lila,Pink,Monochrom",
        fmt: "Format",
        luminosity: "Helligkeit",
        see1: "Bildfarben",
        see2: "Farbkonverter",
        see3: "Farbkombination",
        see4: "QR-Code-Generator",
        lock: "Farbe sperren",
        unlock: "Farbe entsperren",
        empty: "Leer"
    },
    nl: {
        pageTitle: "Willekeurige Kleurenpalet Generator – HEX, RGB, HSL | Gratis",
        ogTitle: "Willekeurige Kleurenpalet Generator: Gratis Online Kleurentool",
        ogLocale: "nl_NL",
        title: "Willekeurige Kleurengenerator",
        intro: "Genereer willekeurige kleuren en maak professionele kleurenpaletten in verschillende formaten. Bewaar je favoriete kleuren, filter op tint en helderheid, en ontdek direct verschillende kleurensets.",
        bt: "Kleuren Genereren",
        meta: "Genereer willekeurige kleuren en kleurenpaletten online in HEX, RGB of HSL. Gebruik als willekeurige kleurenkiezer — vergrendel specifieke kleuren en maak snel paletten met toon- en helderheidscontrole.",
        about_desc: "Deze willekeurige kleurenkiezer (paletgenerator) stelt je in staat om kleurcombinaties te maken in de formaten HEX, RGB, RGBA, HSL en HSLA. Gebruik de regelaars voor tint en helderheid om het resultaat te verfijnen, vergrendel de kleuren die je wilt behouden en genereer nieuwe variaties totdat je de ideale combinatie vindt.",
        feature_1: "Genereer willekeurige kleuren in HEX, RGB, RGBA, HSL en HSLA",
        feature_2: "Filter op kleuren zoals blauw, rood, groen, oranje, roze, paars of monochroom",
        feature_3: "Kies tussen lichte, donkere of volledig willekeurige tinten",
        feature_4: "Bewaar je favoriete kleuren voor toekomstige paletten",
        how_title: "Hoe Je de Willekeurige Kleurengenerator Gebruikt",
        features_title: "Functies",
        step_1_t: "Kies een basiskleur",
        step_1_d: "Kies tinten zoals Blauw, Rood of Groen om de resultaten te beperken, of laat Willekeurig geselecteerd voor meer gevarieerde combinaties",
        step_2_t: "Stel de helderheid in",
        step_2_d: "Kies tussen lichte, donkere of ongefilterde kleuren voor verschillende helderheidsniveaus",
        step_3_t: "Kies het formaat",
        step_3_d: "Selecteer het uitvoerformaat van de gegenereerde kleuren: HEX, RGB, RGBA, HSL of HSLA",
        step_4_t: "Klik op Kleuren Genereren",
        step_4_d: "Negen kleuren verschijnen direct. Beweeg met de muis over een kleur om de waarde te bekijken en klik om te kopiëren",
        step_5_t: "Opslaan en Verfijnen",
        step_5_d: "Klik op het slot-icoon van een kleur om deze vast te zetten. Bij de volgende generatie veranderen alleen de niet-opgeslagen kleuren",
        apps_title: "Waarvoor Je Willekeurige Kleuren Kunt Gebruiken",
        app1: "Maak kleurpaletten voor interfaces, merken en visuele projecten met hoofd- en complementaire kleuren",
        app2: "Genereer combinaties voor CSS-variabelen, thema’s, knoppen, hover-statussen en interfaceprototypes",
        app3: "Ontdek monochrome, lichte of donkere paletten voor dashboards, landingspagina’s en moderne interfaces",
        app4: "Vind inspiratie voor posters, illustraties, moodboards en visuele identiteiten met verschillende kleurstijlen",
        app5: "Vergelijk warme, koele, zachte of verzadigde tinten om verschillende visuele richtingen voor een project te testen",
        tech_title: "Technische Opmerkingen en Bijzondere Gevallen",
        tech1: "HEX is een van de populairste formaten voor CSS, Tailwind en interfaces omdat het eenvoudig, compact en makkelijk herkenbaar is",
        tech2: "RGB en RGBA zijn ideaal voor transparantie, verlopen, overlays en visuele effecten",
        tech3: "HSL en HSLA maken het eenvoudiger om helderheid en verzadiging aan te passen zonder de hoofdtint te veranderen",
        tech4: "Opgeslagen kleuren blijven alleen beschikbaar tijdens de huidige sessie. Het vernieuwen van de pagina of wijzigen van filters kan het palet resetten",
        faq_title: "Veelgestelde Vragen",
        faq1q: "Zijn de gegenereerde kleuren echt willekeurig?",
        faq1a: "Ja, maar de resultaten volgen de geselecteerde filters. Wanneer je een kleurgroep of lichte of donkere tinten kiest, blijven de combinaties binnen die instellingen.",
        faq2q: "Hoe kan ik een kleur behouden terwijl ik nieuwe combinaties genereer?",
        faq2a: "Klik op het slot-icoon van de gewenste kleur. Deze blijft behouden in toekomstige paletten terwijl de andere kleuren blijven veranderen.",
        faq3q: "Welk formaat moet ik gebruiken: HEX, RGB of HSL?",
        faq3a: "HEX is een van de populairste formaten voor CSS en interfaces. RGB en RGBA zijn ideaal voor transparantie en visuele effecten, terwijl HSL en HSLA het aanpassen van helderheid en verzadiging eenvoudiger maken.",
        hue: "Toon",
        luminosities: "Licht,Donker",
        hues: "Willekeurig,Blauw,Rood,Oranje,Geel,Groen,Paars,Roze,Monochroom",
        fmt: "Formaat",
        luminosity: "Helderheid",
        see1: "Afbeeldingskleuren",
        see2: "Kleurenconverter",
        see3: "Kleurencombinatie",
        see4: "QR-codegenerator",
        lock: "Kleur vergrendelen",
        unlock: "Kleur ontgrendelen",
        empty: "Leeg"
    },
    ru: {
        pageTitle: "Генератор случайных цветов и цветовых палитр — HEX, RGB, HSL | Бесплатно",
        ogTitle: "Генератор случайных цветов: бесплатный онлайн-инструмент подбора цветов",
        ogLocale: "ru_RU",
        title: "Случайные цвета",
        intro: "Генерируйте случайные цвета и создавайте профессиональные цветовые палитры в различных форматах. Закрепляйте понравившиеся цвета, фильтруйте по оттенку и яркости, исследуйте сочетания мгновенно.",
        bt: "Сгенерировать цвета",
        meta: "Генерируйте случайные цвета и цветовые палитры онлайн в форматах HEX, RGB или HSL. Используйте как генератор случайных цветов — закрепляйте нужные цвета и быстро создавайте палитры с контролем оттенка и яркости.",
        about_desc: "Этот инструмент подбора случайных цветов (генератор палитр) позволяет создавать цветовые комбинации в форматах HEX, RGB, RGBA, HSL и HSLA. Используйте настройки оттенка и яркости для точной настройки, закрепляйте цвета, которые хотите сохранить, и генерируйте новые варианты, пока не найдете идеальное сочетание.",
        feature_1: "Генерация случайных цветов в форматах HEX, RGB, RGBA, HSL и HSLA",
        feature_2: "Фильтрация по основным оттенкам: синий, красный, зеленый, оранжевый, розовый, фиолетовый или монохромный",
        feature_3: "Выбор между светлыми, темными или полностью случайными тонами",
        feature_4: "Закрепление любимых цветов для использования в последующих палитрах",
        how_title: "Как использовать генератор случайных цветов",
        features_title: "Основные возможности",
        step_1_t: "Выберите базовый оттенок",
        step_1_d: "Выберите такие оттенки, как Синий, Красный или Зеленый, чтобы сузить результаты, или оставьте Случайный для получения максимально разнообразных сочетаний",
        step_2_t: "Настройте яркость",
        step_2_d: "Выберите светлый, темный или снимите фильтр для генерации цветов с разным уровнем яркости",
        step_3_t: "Выберите формат",
        step_3_d: "Выберите формат отображения сгенерированных цветов: HEX, RGB, RGBA, HSL или HSLA",
        step_4_t: "Нажмите Сгенерировать цвета",
        step_4_d: "Мгновенно появятся девять цветов. Наведите на любой цвет, чтобы увидеть его значение, и кликните для копирования",
        step_5_t: "Закрепляйте и улучшайте",
        step_5_d: "Нажмите на иконку замочка на любом цвете, чтобы закрепить его. При следующей генерации изменятся только незакрепленные цвета",
        apps_title: "Где можно применить случайные цвета",
        app1: "Создавайте палитры для интерфейсов, брендов и графических проектов, сочетая основные цвета и дополнительные оттенки",
        app2: "Генерируйте сочетания для CSS-переменных, тем оформления, кнопок, состояний наведения (hover) и дизайн-макетов",
        app3: "Исследуйте монохромные, светлые или темные палитры для дашбордов, лендингов и современных интерфейсов",
        app4: "Находите вдохновение для постеров, иллюстраций, мудбордов и фирменных стилей с помощью различных цветовых решений",
        app5: "Сравнивайте теплые, холодные, мягкие или насыщенные тона, чтобы протестировать разные визуальные направления проекта",
        tech_title: "Технические примечания",
        tech1: "HEX — один из самых популярных форматов для CSS, Tailwind и веб-интерфейсов благодаря простоте, компактности и узнаваемости",
        tech2: "RGB и RGBA идеально подходят для работы с прозрачностью, градиентами, наложениями и визуальными эффектами",
        tech3: "HSL и HSLA облегчают регулировку яркости и насыщенности без изменения основного тона цвета",
        tech4: "Закрепленные цвета сохраняются только в рамках текущей сессии. Обновление страницы или смена фильтров может сбросить палитру",
        faq_title: "Часто задаваемые вопросы",
        faq1q: "Действительно ли генерируемые цвета случайны?",
        faq1a: "Да, но результаты учитывают выбранные фильтры. Выбор цветовой группы или настройка яркости (светлый/темный) удерживает сочетания в рамках этих предпочтений.",
        faq2q: "Как сохранить цвет при генерации новых сочетаний?",
        faq2a: "Нажмите на иконку замочка на нужном цвете. Он останется зафиксированным в последующих палитрах, пока остальные цвета будут меняться.",
        faq3q: "Какой формат использовать: HEX, RGB или HSL?",
        faq3a: "HEX — наиболее распространенный и удобный формат для CSS и веб-разработки. RGB и RGBA незаменим для прозрачности и эффектов, а HSL и HSLA упрощают ручную настройку яркости и насыщенности.",
        hue: "Оттенок",
        luminosities: "Светлый,Темный",
        hues: "Случайный,Синий,Красный,Оранжевый,Желтый,Зеленый,Фиолетовый,Розовый,Монохромный",
        fmt: "Формат",
        luminosity: "Яркость",
        see1: "Цвета из изображения",
        see2: "Конвертер цветов",
        see3: "Цветовые комбинации",
        see4: "Генератор QR-кодов",
        lock: "Заблокировать цвет",
        unlock: "Разблокировать цвет",
        empty: "Пусто"
    }
}
</i18n>
