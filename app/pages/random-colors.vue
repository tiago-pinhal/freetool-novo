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
        nl: '/willekeurige-kleuren'
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
        pageTitle: "Random Color Generator: HEX, RGB, HSL Palette Maker | Free",
        ogTitle: "Random Color Generator: Free Online Color Palette Tool",
        ogLocale: "en_US",
        title: "Random Color Generator",
        intro: "Generate random colors in HEX, RGB, RGBA, HSL, or HSLA. Lock your favorite colors to keep them in new palettes and test different combinations using hue and luminosity filters.",
        bt: "Generate Colors",
        meta: "Generate random colors online in HEX, RGB, or HSL. Lock specific colors and create palettes quickly with hue and luminosity control.",
        about_desc: "Generate random colors in HEX, RGB, RGBA, HSL, and HSLA formats, filter by hue and luminosity, and lock your favorites to create new combinations. Perfect for building palettes, testing styles, and exploring ideas for UI, branding, and creative projects.",
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
        pageTitle: "Gerador de Cores Aleatórias: Paletas HEX, RGB e HSL | Grátis",
        ogTitle: "Gerador de Cores Aleatórias: Ferramenta Online Grátis",
        ogLocale: "pt_BR",
        title: "Gerador de Cores Aleatórias",
        intro: "Gere cores aleatórias em HEX, RGB, RGBA, HSL ou HSLA. Fixe suas cores favoritas para que permaneçam nas próximas combinações geradas. Escolha tons e níveis de luminosidade para testar diferentes combinações.",
        bt: "Gerar Cores",
        meta: "Gere cores aleatórias online em HEX, RGB ou HSL. Fixe cores específicas e crie paletas rapidamente com controle de matiz e luminosidade.",
        about_desc: "Esta ferramenta gera cores aleatórias nos formatos HEX, RGB, RGBA, HSL e HSLA. Escolha tons e níveis de luminosidade, fixe as cores que quiser manter e gere novas combinações instantaneamente. Ideal para criar paletas, testar estilos visuais e encontrar referências para interfaces, branding e projetos criativos.",
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
        pageTitle: "Generador de Colores Aleatorios: Paletas HEX, RGB, HSL | Gratis",
        ogTitle: "Generador de Colores Aleatorios: Herramienta Online Gratis",
        ogLocale: "es_ES",
        title: "Generador de Colores Aleatorios",
        intro: "Genera colores aleatorios en HEX, RGB, RGBA, HSL o HSLA. Fija tus colores favoritos para mantenerlos en nuevas paletas y prueba diferentes combinaciones usando filtros de tono y luminosidad.",
        bt: "Generar Colores",
        meta: "Genera colores aleatorios online en HEX, RGB o HSL. Bloquea colores específicos y crea paletas rápidamente con control de tono y luminosidad.",
        about_desc: "Genera colores aleatorios en formatos HEX, RGB, RGBA, HSL y HSLA, filtra por tono y luminosidad, y fija tus favoritos para crear nuevas combinaciones. Perfecto para crear paletas, probar estilos y explorar ideas para UI, branding y proyectos creativos.",
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
        pageTitle: "Générateur de Couleurs Aléatoires: Palettes HEX, RGB, HSL | Gratuit",
        ogTitle: "Générateur de Couleurs Aléatoires: Outil en Ligne Gratuit",
        ogLocale: "fr_FR",
        title: "Générateur de Couleurs Aléatoires",
        intro: "Générez des couleurs aléatoires en HEX, RGB, RGBA, HSL ou HSLA. Verrouillez vos couleurs préférées pour les conserver dans de nouvelles palettes et testez différentes combinaisons avec les filtres de teinte et de luminosité.",
        bt: "Générer des Couleurs",
        meta: "Générez des couleurs aléatoires en ligne en HEX, RGB ou HSL. Verrouillez des couleurs spécifiques et créez des palettes rapidement avec contrôle de teinte et luminosité.",
        about_desc: "Générez des couleurs aléatoires aux formats HEX, RGB, RGBA, HSL et HSLA, filtrez par teinte et luminosité, puis verrouillez vos favoris pour créer de nouvelles combinaisons. Parfait pour créer des palettes, tester des styles et explorer des idées pour l’UI, le branding et les projets créatifs.",
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
        pageTitle: "Generatore di Colori Casuali: Palette HEX, RGB, HSL | Gratuito",
        ogTitle: "Generatore di Colori Casuali: Strumento Online Gratuito",
        ogLocale: "it_IT",
        title: "Generatore di Colori Casuali",
        intro: "Genera colori casuali in HEX, RGB, RGBA, HSL o HSLA. Blocca i tuoi colori preferiti per mantenerli nelle nuove palette e prova diverse combinazioni usando filtri di tonalità e luminosità.",
        bt: "Genera Colori",
        meta: "Genera colori casuali online in HEX, RGB o HSL. Blocca colori specifici e crea palette rapidamente con controllo di tonalità e luminosità.",
        about_desc: "Genera colori casuali nei formati HEX, RGB, RGBA, HSL e HSLA, filtra per tonalità e luminosità e blocca i tuoi preferiti per creare nuove combinazioni. Perfetto per creare palette, testare stili ed esplorare idee per UI, branding e progetti creativi.",
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
        pageTitle: "Generator Warna Acak: Palet HEX, RGB, HSL | Gratis",
        ogTitle: "Generator Warna Acak: Alat Online Gratis",
        ogLocale: "id_ID",
        title: "Generator Warna Acak",
        intro: "Hasilkan warna acak dalam format HEX, RGB, RGBA, HSL, atau HSLA. Kunci warna favorit Anda agar tetap ada di palet berikutnya dan coba berbagai kombinasi menggunakan filter rona dan kecerahan.",
        bt: "Hasilkan Warna",
        meta: "Hasilkan warna acak online dalam format HEX, RGB, atau HSL. Buat palet warna dengan cepat menggunakan kontrol rona dan kecerahan.",
        about_desc: "Hasilkan warna acak dalam format HEX, RGB, RGBA, HSL, dan HSLA, filter berdasarkan rona dan kecerahan, lalu kunci warna favorit Anda untuk membuat kombinasi baru. Cocok untuk membuat palet, mencoba gaya visual, dan mengeksplorasi ide untuk UI, branding, dan proyek kreatif.",
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
        pageTitle: "Zufallsfarbengenerator: HEX, RGB, HSL Paletten | Kostenlos",
        ogTitle: "Zufallsfarbengenerator: Kostenloses Online-Farbtool",
        ogLocale: "de_DE",
        title: "Zufallsfarbengenerator",
        intro: "Erzeuge Zufallsfarben in HEX, RGB, RGBA, HSL oder HSLA. Speichere deine Lieblingsfarben für neue Paletten und teste verschiedene Kombinationen mit Farbton- und Helligkeitsfiltern.",
        bt: "Farben Generieren",
        meta: "Generiere Zufallsfarben online in HEX, RGB oder HSL. Sperre bestimmte Farben und erstelle Paletten schnell mit Farbton- und Helligkeitskontrolle.",
        about_desc: "Erzeuge Zufallsfarben in den Formaten HEX, RGB, RGBA, HSL und HSLA, filtere nach Farbton und Helligkeit und speichere deine Favoriten für neue Kombinationen. Perfekt zum Erstellen von Paletten, Testen von Designs und Entdecken neuer Ideen für UI, Branding und kreative Projekte.",
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
        pageTitle: "Willekeurige Kleurengenerator: HEX, RGB, HSL Paletten | Gratis",
        ogTitle: "Willekeurige Kleurengenerator: Gratis Online Kleurentool",
        ogLocale: "nl_NL",
        title: "Willekeurige Kleurengenerator",
        intro: "Genereer willekeurige kleuren in HEX, RGB, RGBA, HSL of HSLA. Bewaar je favoriete kleuren voor nieuwe paletten en test verschillende combinaties met filters voor tint en helderheid.",
        bt: "Kleuren Genereren",
        meta: "Genereer willekeurige kleuren online in HEX, RGB of HSL. Vergrendel specifieke kleuren en maak snel paletten met toon- en helderheidscontrole.",
        about_desc: "Genereer willekeurige kleuren in HEX, RGB, RGBA, HSL en HSLA-formaat, filter op tint en helderheid en bewaar je favorieten om nieuwe combinaties te maken. Perfect voor het maken van paletten, het testen van stijlen en het ontdekken van ideeën voor UI, branding en creatieve projecten.",
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
    }
}
</i18n>
