const basePalette = {
  background: '248 249 250',
  surface: '255 255 255',
  surface2: '243 244 245',
  surface3: '231 232 233',
  border: '236 239 241',
  text: '25 28 29',
  muted: '90 102 109',
  primary: '175 16 26',
  primarySoft: '211 47 47',
  onPrimary: '255 255 255',
  secondary: '84 96 103',
  tertiary: '139 68 0',
  danger: '186 26 26',
  warning: '180 83 9',
  success: '22 163 74',
  navy: '0 26 67',
  glass: '255 255 255',
}

export const themeTokens = {
  atelier: basePalette,
  sandstone: {
    ...basePalette,
    background: '251 248 244',
    surface: '255 253 250',
    surface2: '247 241 236',
    surface3: '234 227 221',
    border: '229 221 214',
    primary: '153 76 30',
    primarySoft: '193 111 61',
    tertiary: '120 82 49',
    navy: '42 37 30',
  },
  noir: {
    ...basePalette,
    background: '17 20 24',
    surface: '24 29 34',
    surface2: '32 37 44',
    surface3: '40 46 54',
    border: '58 66 78',
    text: '235 238 241',
    muted: '151 163 178',
    primary: '240 101 117',
    primarySoft: '248 144 157',
    onPrimary: '17 20 24',
    secondary: '188 195 204',
    tertiary: '246 171 92',
    navy: '8 11 15',
    glass: '24 29 34',
  },
}

export const themeOptions = [
  {
    id: 'atelier',
    label: 'Atelier Red',
    description: 'Default brand palette from the reference screens.',
  },
  {
    id: 'sandstone',
    label: 'Sandstone',
    description: 'Warm neutral variant with softer accents.',
  },
  {
    id: 'noir',
    label: 'Noir',
    description: 'Dark workspace mode for low-light editing.',
  },
]

export const defaultThemeId = 'atelier'

export function applyTheme(themeId = defaultThemeId) {
  const theme = themeTokens[themeId] ?? themeTokens.atelier
  const root = document.documentElement
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  root.dataset.theme = themeId
}
