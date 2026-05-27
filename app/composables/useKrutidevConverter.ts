// Krutidev ↔ Unicode converter
//
// K→U mapping source: Language Technology Research Centre, IIIT Hyderabad
//   https://github.com/ltrc/kru2uni
//   Fixes applied to LTRC data:
//     1. `saz` moved before `s`/`a`/`z` to prevent premature decomposition
//     2. \xef and \xd4 corrected from ࠡ (Samaritan Alef) to ड (ड) — LTRC typo
//
// U→K mapping source: TGNYC Node.js port of the LTRC table
//   https://github.com/TGNYC/Kriti-Dev-to-Unicode/blob/master/krutidevtounicode.js
//   Fixes applied to TGNYC data:
//     1. String.search() replaced with indexOf() — search() ignores start position argument
//     2. क्क moved before क् to prevent premature decomposition

// [krutidev, unicode] pairs — order is critical: longer/more specific sequences first.
const K2U: readonly [string, string][] = [
  ['\xf1', '॰'],                         // ñ → ॰
  ['Q+Z', 'QZ+'],
  ['sas', 'sa'],
  ['aa', 'a'],
  [')Z', 'र्द्ध'],   // )Z → र्द्ध
  ['ZZ', 'Z'],
  ['‘', '"'],
  ['’', '"'],
  ['“', "'"],
  ['”', "'"],
  ['\xe5', '०'],                          // å → ०
  ['ƒ', '१'],                        // ƒ → १
  ['„', '२'],                        // „ → २
  ['…', '३'],                        // … → ३
  ['†', '४'],                        // † → ४
  ['‡', '५'],                        // ‡ → ५
  ['ˆ', '६'],                        // ˆ → ६
  ['‰', '७'],                        // ‰ → ७
  ['Š', '८'],                        // Š → ८
  ['‹', '९'],                        // ‹ → ९
  ['\xb6+', 'फ़्'],                   // ¶+ → फ़् (before ¶)
  ['d+', 'क़'],                            // d+ → क़ (before d)
  ['[+k', 'ख़'],                           // [+k → ख़ (before [+, [k)
  ['[+', 'ख़्'],                      // [+ → ख़् (before [k, [)
  ['x+', 'ग़'],                            // x+ → ग़ (before x)
  ['T+', 'ज़्'],                // T+ → ज़् (before T)
  ['t+', 'ज़'],                            // t+ → ज़ (before t)
  ['M+', 'ड़'],                            // M+ → ड़ (before M)
  ['<+', 'ढ़'],                            // <+ → ढ़ (before <)
  ['Q+', 'फ़'],                            // Q+ → फ़ (before Q)
  [';+', 'य़'],                            // ;+ → य़ (before ;)
  ['j+', 'ऱ'],                            // j+ → ऱ (before j)
  ['u+', 'ऩ'],                            // u+ → ऩ (before u)
  ['\xd9k', 'त्त'],             // Ùk → त्त (before Ù)
  ['\xd9', 'त्त्'],        // Ù → त्त्
  ['\xe4', 'क्त'],              // ä → क्त
  ['–', 'दृ'],                  // – → दृ
  ['—', 'कृ'],                  // — → कृ
  ['\xe9', 'न्न'],              // é → न्न
  ['™', 'न्न्'],      // ™ → न्न्
  ['=kk', '=k'],
  ['f=k', 'f='],
  ['\xe0', 'ह्न'],              // à → ह्न
  ['\xe1', 'ह्य'],              // á → ह्य
  ['\xe2', 'हृ'],                    // â → हृ
  ['\xe3', 'ह्म'],              // ã → ह्म
  ['\xbaz', 'ह्र'],             // ºz → ह्र (before º, z)
  ['\xba', 'ह्'],                    // º → ह्
  ['\xed', 'द्द'],              // í → द्द
  ['{k', 'क्ष'],               // {k → क्ष (before {)
  ['{', 'क्ष्'],           // { → क्ष्
  ['=', 'त्र'],                 // = → त्र
  ['\xab', 'त्र्'],        // « → त्र्
  ['N\xee', 'छ्य'],             // Nî → छ्य (before N)
  ['V\xee', 'ट्य'],             // Vî → ट्य (before V)
  ['B\xee', 'ठ्य'],             // Bî → ठ्य (before B)
  ['M\xee', 'ड्य'],             // Mî → ड्य (before M)
  ['<\xee', 'ढ्य'],             // <î → ढ्य (before <)
  ['|', 'द्य'],                 // | → द्य
  ['K', 'ज्ञ'],                 // K → ज्ञ
  ['}', 'द्व'],                 // } → द्व
  ['J', 'श्र'],                 // J → श्र
  ['V\xaa', 'ट्र'],             // Vª → ट्र (before V)
  ['M\xaa', 'ड्र'],             // Mª → ड्र (before M)
  ['<\xaa\xaa', 'ढ्र'],         // <ªª → ढ्र (before <ª, <)
  ['N\xaa', 'छ्र'],             // Nª → छ्र (before N)
  ['\xd8', 'क्र'],              // Ø → क्र
  ['\xdd', 'फ्र'],              // Ý → फ्र
  ['nzZ', 'र्द्र'],   // nzZ → र्द्र (before n, z, Z)
  ['\xe6', 'द्र'],              // æ → द्र
  ['\xe7', 'प्र'],              // ç → प्र
  ['\xc1', 'प्र'],              // Á → प्र
  ['xz', 'ग्र'],                // xz → ग्र (before x, z)
  ['#', 'रु'],                       // # → रु
  [':', 'रू'],                       // : → रू
  ['v‚', 'ऑ'],                       // v‚ → ऑ (before v)
  ['vks', 'ओ'],                           // vks → ओ (before vk, v)
  ['vkS', 'औ'],                           // vkS → औ (before vk, v)
  ['vk', 'आ'],                            // vk → आ (before v)
  ['v', 'अ'],                             // v → अ
  ['b\xb1', 'ईं'],                   // b± → ईं (before b)
  ['\xc3', 'ई'],                          // Ã → ई
  ['bZ', 'ई'],                            // bZ → ई (before b)
  ['b', 'इ'],                             // b → इ
  ['m', 'उ'],                             // m → उ
  ['\xc5', 'ऊ'],                          // Å → ऊ
  [',s', 'ऐ'],                            // ,s → ऐ (before ,)
  [',', 'ए'],                             // , → ए
  ['_', 'ऋ'],                             // _ → ऋ
  ['\xf4', 'क्क'],              // ô → क्क
  ['d', 'क'],                             // d → क
  ['Dk', 'क'],                            // Dk → क (before D)
  ['D', 'क्'],                       // D → क्
  ['[k', 'ख'],                            // [k → ख (before [)
  ['[', 'ख्'],                       // [ → ख्
  ['x', 'ग'],                             // x → ग
  ['Xk', 'ग'],                            // Xk → ग (before X)
  ['X', 'ग्'],                       // X → ग्
  ['\xc4', 'घ'],                          // Ä → घ
  ['?k', 'घ'],                            // ?k → घ (before ?)
  ['?', 'घ्'],                       // ? → घ्
  ['\xb3', 'ङ'],                          // ³ → ङ
  ['pkS', 'चै'],                     // pkS → चै (before p, k, S)
  ['p', 'च'],                             // p → च
  ['Pk', 'च'],                            // Pk → च (before P)
  ['P', 'च्'],                       // P → च्
  ['N', 'छ'],                             // N → छ
  ['t', 'ज'],                             // t → ज
  ['Tk', 'ज'],                            // Tk → ज (before T)
  ['T', 'ज्'],                       // T → ज्
  ['>', 'झ'],                             // > → झ
  ['\xf7', 'झ्'],                    // ÷ → झ्
  ['\xa5', 'ञ'],                          // ¥ → ञ
  ['\xea', 'ट्ट'],              // ê → ट्ट
  ['\xeb', 'ट्ठ'],              // ë → ट्ठ
  ['V', 'ट'],                             // V → ट
  ['B', 'ठ'],                             // B → ठ
  ['\xec', 'ड्ड'],              // ì → ड्ड
  ['\xef', 'ड्ढ'],              // ï → ड्ढ (LTRC had ࠡ — typo fixed)
  ['M', 'ड'],                             // M → ड
  ['<', 'ढ'],                             // < → ढ
  ['.k', 'ण'],                            // .k → ण (before .)
  ['.', 'ण्'],                       // . → ण्
  ['r', 'त'],                             // r → त
  ['Rk', 'त'],                            // Rk → त (before R)
  ['R', 'त्'],                       // R → त्
  ['Fk', 'थ'],                            // Fk → थ (before F)
  ['F', 'थ्'],                       // F → थ्
  [')', 'द्ध'],                 // ) → द्ध
  ['n', 'द'],                             // n → द
  ['/k', 'ध'],                            // /k → ध (before /)
  ['\xcb', 'ध्'],                    // Ë → ध्
  ['\xe8', 'ध'],                          // è → ध
  ['/', 'ध्'],                       // / → ध्
  ['u', 'न'],                             // u → न
  ['Uk', 'न'],                            // Uk → न (before U)
  ['U', 'न्'],                       // U → न्
  ['i', 'प'],                             // i → प
  ['Ik', 'प'],                            // Ik → प (before I)
  ['I', 'प्'],                       // I → प्
  ['Q', 'फ'],                             // Q → फ
  ['\xb6', 'फ्'],                    // ¶ → फ्
  ['c', 'ब'],                             // c → ब
  ['Ck', 'ब'],                            // Ck → ब (before C)
  ['C', 'ब्'],                       // C → ब्
  ['Hk', 'भ'],                            // Hk → भ (before H)
  ['H', 'भ्'],                       // H → भ्
  ['e', 'म'],                             // e → म
  ['Ek', 'म'],                            // Ek → म (before E)
  ['E', 'म्'],                       // E → म्
  [';', 'य'],                             // ; → य
  ['\xb8', 'य्'],                    // ¸ → य्
  ['j', 'र'],                             // j → र
  ['y', 'ल'],                             // y → ल
  ['Yk', 'ल'],                            // Yk → ल (before Y)
  ['Y', 'ल्'],                       // Y → ल्
  ['G', 'ळ'],                             // G → ळ
  ['o', 'व'],                             // o → व
  ['Ok', 'व'],                            // Ok → व (before O)
  ['O', 'व्'],                       // O → व्
  ["'k", 'श'],                            // 'k → श (before ')
  ["'", 'श्'],                       // ' → श्
  ['"k', 'ष'],                            // "k → ष (before ")
  ['"', 'ष्'],                       // " → ष्
  ['l', 'स'],                             // l → स
  ['Lk', 'स'],                            // Lk → स (before L)
  ['L', 'स्'],                       // L → स्
  ['g', 'ह'],                             // g → ह
  ['\xc8', 'ीं'],                    // È → ीं
  ['saz', '्रें'],         // saz → ्रें (before s, a, z)
  ['z', '्र'],                       // z → ्र
  ['\xcc', 'द्द'],              // Ì → द्द
  ['\xcd', 'ट्ट'],              // Í → ट्ट
  ['\xce', 'ट्ठ'],              // Î → ट्ठ
  ['\xcf', 'ड्ड'],              // Ï → ड्ड
  ['\xd1', 'कृ'],                    // Ñ → कृ
  ['\xd2', 'भ'],                          // Ò → भ
  ['\xd3', '्य'],                    // Ó → ्य
  ['\xd4', 'ड्ढ'],              // Ô → ड्ढ (LTRC had ࠡ — typo fixed)
  ['\xd6', 'झ्'],                    // Ö → झ्
  ['\xdck', 'श'],                         // Ük → श (before Ü)
  ['\xdc', 'श्'],                    // Ü → श्
  ['‚', 'ॉ'],                        // ‚ → ॉ
  ['kas', 'ों'],                     // kas → ों (before k, a, s)
  ['ks', 'ो'],                            // ks → ो (before k, s)
  ['kS', 'ौ'],                            // kS → ौ (before k, S)
  ['\xa1k', 'ाँ'],                   // ¡k → ाँ (before ¡, k)
  ['ak', 'kं'],                           // ak → k+ं → cascades to ां
  ['k', 'ा'],                             // k → ा
  ['ah', 'ीं'],                      // ah → ीं (before a, h)
  ['h', 'ी'],                             // h → ी
  ['aq', 'ुं'],                      // aq → ुं (before a, q)
  ['q', 'ु'],                             // q → ु
  ['aw', 'ूं'],                      // aw → ूं (before a, w)
  ['\xa1w', 'ूँ'],                   // ¡w → ूँ (before ¡, w)
  ['w', 'ू'],                             // w → ू
  ['`', 'ृ'],                             // ` → ृ
  ['̀', 'ृ'],                        // grave → ृ
  ['as', 'ें'],                      // as → ें (before a, s)
  ['\xb1s', 's\xb1'],                          // ±s → s± (swap for correct order)
  ['s', 'े'],                             // s → े
  ['aS', 'ैं'],                      // aS → ैं (before a, S)
  ['S', 'ै'],                             // S → ै
  ['a\xaa', '्रं'],             // aª → ्रं (before a, ª)
  ['\xaa', '्र'],                    // ª → ्र
  ['fa', 'ंf'],                           // fa → ंf (intermediate: f still needs repositioning)
  ['a', 'ं'],                             // a → ं
  ['\xa1', 'ँ'],                          // ¡ → ँ
  ['%', ':'],                                  // % → :
  ['W', 'ॅ'],                             // W → ॅ
  ['•', 'ऽ'],                        // • → ऽ
  ['\xb7', 'ऽ'],                          // · → ऽ
  ['∙', 'ऽ'],                        // ∙ → ऽ
  ['~j', '्र'],                      // ~j → ्र (before ~)
  ['~', '्'],                             // ~ → ्
  ['\\', '?'],                                 // \ → ?
  ['+', '़'],                             // + → ़
  ['^', '‘'],                             // ^ → '
  ['*', '’'],                             // * → '
  ['\xde', '“'],                          // Þ → "
  ['\xdf', '”'],                          // ß → "
  ['(', ';'],                                  // ( → ;
  ['\xbc', '('],                               // ¼ → (
  ['\xbd', ')'],                               // ½ → )
  ['\xbf', '{'],                               // ¿ → {
  ['\xc0', '}'],                               // À → }
  ['\xbe', '='],                               // ¾ → =
  ['A', '।'],                             // A → ।
  ['-', '.'],                                  // - → .
  ['&', '-'],                                  // & → -
  ['μ', '-'],                             // μ → -
  ['Œ', '॰'],                        // Œ → ॰
  [']', ','],                                  // ] → ,
  ['~ ', '् '],                           // "~ " → "् "
  ['@', '/'],                                  // @ → /
  ['\xae', 'ैं'],                    // ® → ैं
]

export function krutidevToUnicode(input: string): string {
  if (!input) return ''

  // Pre-process: remove spurious spaces before ्र sequences
  let text = input
  text = text.replaceAll(' \xaa', '\xaa')
  text = text.replaceAll(' ~j', '~j')
  text = text.replaceAll(' z', 'z')

  // Apply all K2U substitutions in order
  for (const [from, to] of K2U) {
    text = text.replaceAll(from, to)
  }

  // Post-process ±  →  Zं  (reph + anusvara)
  text = text.replaceAll('\xb1', 'Zं')

  // Post-process Æ  →  र्f
  text = text.replaceAll('\xc6', 'र्f')

  // Reposition f (ikar ि): f+char → char+ि
  let pos = text.indexOf('f')
  while (pos !== -1) {
    const next = text[pos + 1] ?? ''
    text = text.slice(0, pos) + next + 'ि' + text.slice(pos + 2)
    pos = text.indexOf('f', pos + 1)
  }

  // Post-process Ç / ¯  →  fa  and  É  →  र्fa
  text = text.replaceAll('\xc7', 'fa')
  text = text.replaceAll('\xaf', 'fa')
  text = text.replaceAll('\xc9', 'र्fa')

  // Reposition fa: fa+char → char+िं
  pos = text.indexOf('fa')
  while (pos !== -1) {
    const next = text[pos + 2] ?? ''
    text = text.slice(0, pos) + next + 'िं' + text.slice(pos + 3)
    pos = text.indexOf('fa', pos + 1)
  }

  // Post-process Ê  →  ीZ
  text = text.replaceAll('\xca', 'ीZ')

  // Fix ि् sequences: ि्+char → ्+char+ि
  pos = text.indexOf('ि्')
  while (pos !== -1) {
    const next = text[pos + 2] ?? ''
    text = text.slice(0, pos) + '्' + next + 'ि' + text.slice(pos + 3)
    pos = text.indexOf('ि्', pos + 2)
  }

  // Clean up ्+Z → Z  (halant before reph marker is redundant)
  text = text.replaceAll('्Z', 'Z')

  // Reposition reph Z: move र् to before the syllable
  const vowelSigns = new Set([
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ',
    'ए', 'ऐ', 'ओ', 'औ',
    'ा', 'ि', 'ी', 'ु', 'ू', 'ृ',
    'े', 'ै', 'ो', 'ौ',
    'ं', 'ः', 'ँ', 'ॅ',
  ])

  pos = text.indexOf('Z')
  while (pos > 0) {
    let start = pos - 1
    while (start > 0 && vowelSigns.has(text[start]!)) start--
    const syllable = text.slice(start, pos)
    text = text.slice(0, start) + 'र्' + syllable + text.slice(pos + 1)
    pos = text.indexOf('Z')
  }

  // Clean up: remove matra after space or comma
  const unattachedMatras = [
    'ा', 'ि', 'ी', 'ु', 'ू', 'ृ',
    'े', 'ै', 'ो', 'ौ',
    'ं', 'ः', 'ँ', 'ॅ',
  ]
  for (const m of unattachedMatras) {
    text = text.replaceAll(' ' + m, m)
    text = text.replaceAll(',' + m, m + ',')
    text = text.replaceAll('्' + m, m)
  }

  // Normalize redundant halant sequences
  text = text.replaceAll('््र', '्र') // ् + ् + र → ् + र
  text = text.replaceAll('्र्', 'र्') // ् + र + ् → र + ्
  text = text.replaceAll('््', '्')             // ् + ् → ्

  // Remove trailing halant before space
  text = text.replaceAll('् ', ' ')

  return text
}

// ---------------------------------------------------------------------------
// Unicode → Krutidev
// ---------------------------------------------------------------------------

// Dependent vowel signs used to determine reph (र्) syllable boundary
const MATRA_SET = new Set<string>([
  'ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', 'ँ', 'ॅ',
])

// [unicode, krutidev] pairs — order matters: longer/more specific first
const U2K: readonly [string, string][] = [
  // Punctuation & special symbols
  ['‘', '^'],  ['’', '*'],
  ['“', '\xde'],     ['”', '\xdf'],
  ['(', '\xbc'],          [')', '\xbd'],
  ['{', '\xbf'],          ['}', '\xc0'],
  ['=', '\xbe'],
  ['।', 'A'],
  ['?', '\\'],
  ['-', '&'],             ['µ', '&'],
  ['॰', 'Œ'],
  [',', ']'],
  ['.', '-'],
  ['् ', '~ '],           // halant+space (before halant alone)
  // Numerals
  ['०', '\xe5'],   ['१', 'ƒ'],  ['२', '„'],  ['३', '…'],
  ['४', '†'], ['५', '‡'],  ['६', 'ˆ'],  ['७', '‰'],
  ['८', 'Š'], ['९', '‹'],
  // Nukta consonants (precomposed, before plain counterparts)
  ['फ़्', '\xb6+'], ['क़', 'd+'],  ['ख़', '[+k'], ['ग़', 'x+'],
  ['ज़्', 'T+'],    ['ज़', 't+'],   ['ड़', 'M+'],  ['ढ़', '<+'],
  ['फ़', 'Q+'],     ['य़', ';+'],   ['ऱ', 'j+'],   ['ऩ', 'u+'],
  // Conjuncts with dedicated Krutidev glyphs (longer before shorter)
  ['त्त्', '\xd9'],        ['त्त', '\xd9k'],
  ['क्त', '\xe4'],
  ['दृ', '–'],         ['कृ', '—'],
  ['ह्न', '\xe0'],          ['ह्य', '\xe1'],
  ['हृ', '\xe2'],            ['ह्म', '\xe3'],
  ['ह्र', '\xbaz'],         ['ह्', '\xba'],
  ['द्द', '\xed'],
  ['क्ष्', '{'],            ['क्ष', '{k'],
  ['त्र्', '\xab'],         ['त्र', '='],
  ['ज्ञ', 'K'],
  ['छ्य', 'N\xee'], ['ट्य', 'V\xee'], ['ठ्य', 'B\xee'],
  ['ड्य', 'M\xee'], ['ढ्य', '<\xee'], ['द्य', '|'],
  ['द्व', '}'],
  ['श्र', 'J'],
  ['ट्र', 'V\xaa'],         ['ड्र', 'M\xaa'],
  ['ढ्र', '<\xaa\xaa'],     ['छ्र', 'N\xaa'],
  ['क्र', '\xd8'],           ['फ्र', '\xdd'],
  ['द्र', '\xe6'],           ['प्र', '\xe7'],
  ['ग्र', 'xz'],
  ['रु', '#'],               ['रू', ':'],
  ['्र', 'z'],               // half-r ्र (before ् alone)
  // Independent vowels
  ['ओ', 'vks'],  ['औ', 'vkS'], ['आ', 'vk'],  ['अ', 'v'],
  ['ई', 'bZ'],   ['इ', 'b'],   ['उ', 'm'],   ['ऊ', '\xc5'],
  ['ऐ', ',s'],   ['ए', ','],   ['ऋ', '_'],
  // Consonants — specific conjuncts BEFORE their components
  ['क्क', '\xf4'],          // ô before क्, क
  ['क्', 'D'],              ['क', 'd'],
  ['ख्', '['],              ['ख', '[k'],
  ['ग्', 'X'],              ['ग', 'x'],
  ['घ्', '?'],              ['घ', '?k'],
  ['ङ', '\xb3'],
  ['चै', 'pkS'],
  ['च्', 'P'],              ['च', 'p'],
  ['छ', 'N'],
  ['ज्', 'T'],              ['ज', 't'],
  ['झ्', '\xf7'],           ['झ', '>'],
  ['ञ', '\xa5'],
  ['ट्ट', '\xea'],          ['ट्ठ', '\xeb'],
  ['ट', 'V'],               ['ठ', 'B'],
  ['ड्ड', '\xec'],          ['ड्ढ', '\xef'],
  ['ड', 'M'],               ['ढ', '<'],
  ['ण्', '.'],              ['ण', '.k'],
  ['त्', 'R'],              ['त', 'r'],
  ['थ्', 'F'],              ['थ', 'Fk'],
  ['द्ध', ')'],
  ['द', 'n'],
  ['ध्', '/'],              ['ध', '/k'],
  ['न्', 'U'],              ['न', 'u'],
  ['प्', 'I'],              ['प', 'i'],
  ['फ्', '\xb6'],           ['फ', 'Q'],
  ['ब्', 'C'],              ['ब', 'c'],
  ['भ्', 'H'],              ['भ', 'Hk'],
  ['म्', 'E'],              ['म', 'e'],
  ['य्', '\xb8'],           ['य', ';'],
  ['र', 'j'],
  ['ल्', 'Y'],              ['ल', 'y'],
  ['ळ', 'G'],
  ['व्', 'O'],              ['व', 'o'],
  ['श्', "'"],              ['श', "'k"],
  ['ष्', '"'],              ['ष', '"k'],
  ['स्', 'L'],              ['स', 'l'],
  ['ह', 'g'],
  // Dependent vowel signs (matras)
  ['ऑ', 'v‚'],         // independent ऑ (before अ)
  ['ॉ', '‚'],          // dependent ॉ matra
  ['ो', 'ks'],              ['ौ', 'kS'],
  ['ा', 'k'],               ['ी', 'h'],
  ['ु', 'q'],               ['ू', 'w'],
  ['ृ', '`'],
  ['े', 's'],               ['ै', 'S'],
  // Diacritics
  ['ं', 'a'],   ['ँ', '\xa1'],  ['ः', '%'],  ['ॅ', 'W'],
  ['ऽ', '\xb7'],
  ['्', '~'],               // halant alone (after ् + space and ्र handled)
]

export function unicodeToKrutidev(input: string): string {
  if (!input) return ''

  // NFC normalization resolves decomposed nukta sequences (e.g. क + ़ → क़)
  let text = input.normalize('NFC')

  // Reposition ि (ikar): char+ि → f+char, moving f before the full conjunct
  let pos = text.indexOf('ि')
  while (pos !== -1) {
    if (pos > 0) {
      const charLeft = text[pos - 1]!
      text = text.slice(0, pos - 1) + 'f' + charLeft + text.slice(pos + 1)
      let fPos = pos - 1
      // Walk f leftward past any halant-consonant pairs (conjunct cluster)
      while (fPos >= 2 && text[fPos - 1] === '्') {
        const conjChar = text[fPos - 2]!
        text = text.slice(0, fPos - 2) + 'f' + conjChar + '्' + text.slice(fPos + 1)
        fPos -= 2
      }
      pos = text.indexOf('ि', fPos + 1)
    }
    else {
      pos = text.indexOf('ि', pos + 1)
    }
  }

  // Reposition र् (reph): र्+syllable → syllable+Z
  text += '  '  // sentinel: prevents out-of-bounds on charAt
  pos = text.indexOf('र्')
  while (pos > 0) {
    let end = pos + 2  // index of first char after र्
    // Extend end past any dependent vowel signs
    while (end < text.length - 2 && MATRA_SET.has(text[end + 1]!)) end++
    const syllable = text.slice(pos + 2, end + 1)
    text = text.slice(0, pos) + syllable + 'Z' + text.slice(pos + 2 + syllable.length)
    pos = text.indexOf('र्')
  }
  text = text.slice(0, -2)  // remove sentinel

  // Apply all U2K substitutions in order
  for (const [from, to] of U2K) {
    text = text.replaceAll(from, to)
  }

  return text
}
