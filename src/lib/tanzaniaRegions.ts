/**
 * Comprehensive list of all 31 administrative regions of Tanzania
 * (26 Mainland regions + 5 Zanzibar archipelago regions)
 */
export const TANZANIA_REGIONS = [
  'Arusha',
  'Dar es Salaam',
  'Dodoma',
  'Geita',
  'Iringa',
  'Kagera',
  'Katavi',
  'Kigoma',
  'Kilimanjaro',
  'Lindi',
  'Manyara',
  'Mara',
  'Mbeya',
  'Morogoro',
  'Mtwara',
  'Mwanza',
  'Njombe',
  'Pemba Kaskazini',
  'Pemba Kusini',
  'Pwani',
  'Rukwa',
  'Ruvuma',
  'Shinyanga',
  'Simiyu',
  'Singida',
  'Songwe',
  'Tabora',
  'Tanga',
  'Zanzibar Kaskazini (Unguja)',
  'Zanzibar Kusini (Unguja)',
  'Zanzibar Mjini Magharibi'
] as const;

export type TanzaniaRegion = typeof TANZANIA_REGIONS[number];
