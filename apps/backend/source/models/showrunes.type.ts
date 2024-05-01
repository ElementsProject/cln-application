export type ShowRunes = {
  runes: Rune[],
  isLoading: boolean,
  error?: any
}

export type Rune = {
  rune: string;
  unique_id: string;
  restrictions: Restriction[];
  restrictions_as_english: string;
  stored?: boolean;
  blacklisted?: boolean; 
  last_used?: number;
  our_rune?: boolean;
}

export type Restriction = {
  alternatives: Alternative[];
  english: string;
}

export type Alternative = {
  fieldname: string;
  value: string;
  condition: string;
  english: string;
}
