import { Cidade } from '../data/mockCidades';
import { Roteiro } from '../data/mockRoteiros';

export type UserPreferences = {
  clima?: string[];
  duracao?: string[];
  estilo?: string[];
};

const estiloCategoryMap: Record<string, string[]> = {
  Aventura: ['Praia', 'Natureza', 'Histórico'],
  Cultural: ['Cultura', 'Histórico'],
  Gastronomia: ['Gastronomia'],
  Relaxamento: ['Praia', 'Natureza'],
  Ecoturismo: ['Natureza', 'Histórico'],
};

const climaCategoryMap: Record<string, string[]> = {
  Quente: ['Praia'],
  Temperado: ['Natureza', 'Cultura', 'Histórico'],
  Frio: ['Natureza'],
  Qualquer: ['Praia', 'Natureza', 'Cultura', 'Histórico', 'Gastronomia'],
};

const climaRegionMap: Record<string, string[]> = {
  Quente: ['Nordeste', 'Norte'],
  Temperado: ['Sudeste', 'Centro-Oeste', 'Sul'],
  Frio: ['Sul'],
  Qualquer: ['Nordeste', 'Norte', 'Sudeste', 'Centro-Oeste', 'Sul'],
};

const estiloRoteiroMap: Record<string, string[]> = {
  Aventura: ['Aventura', 'Natureza'],
  Cultural: ['Cultura', 'Passeios'],
  Gastronomia: ['Gastronomia'],
  Relaxamento: ['Verão', 'Cultura', 'Passeios'],
  Ecoturismo: ['Aventura', 'Natureza'],
};

const climaRoteiroMap: Record<string, string[]> = {
  Quente: ['Verão', 'Praia'],
  Temperado: ['Passeios', 'Cultura', 'Aventura'],
  Frio: ['Inverno'],
  Qualquer: ['Verão', 'Inverno', 'Aventura', 'Passeios', 'Cultura'],
};

const durationBucketMap: Record<string, string[]> = {
  '1 dia': ['1 dia'],
  '2-3 dias': ['2-3 dias', '2-4 dias'],
  '4-7 dias': ['4-7 dias', '5-10 dias', '7-12 dias', '7-14 dias'],
  '7+ dias': ['7+ dias', '20 dias'],
};

function normalizeRoteiroDuration(duration: string): string | undefined {
  const lower = duration.toLowerCase();
  if (lower.includes('1 dia')) return '1 dia';
  if (lower.includes('2-3') || lower.includes('2-4')) return '2-3 dias';
  if (lower.includes('4-7')) return '4-7 dias';
  if (lower.includes('7+') || lower.includes('20 dias') || lower.includes('7-12') || lower.includes('7-14')) return '7+ dias';
  return undefined;
}

function matchesEstiloCategory(city: Cidade, preferencias?: UserPreferences) {
  return preferencias?.estilo?.some((estilo) => estiloCategoryMap[estilo]?.includes(city.categoria));
}

function matchesClimaPreferences(city: Cidade, preferencias?: UserPreferences) {
  if (!preferencias?.clima?.length) return false;
  return preferencias.clima.some((clima) =>
    climaCategoryMap[clima]?.includes(city.categoria) || climaRegionMap[clima]?.includes(city.regiao),
  );
}

export function rankCitiesByPreferences(cities: Cidade[], preferencias?: UserPreferences) {
  if (!preferencias || (!preferencias.clima?.length && !preferencias.estilo?.length)) {
    return cities;
  }

  return [...cities]
    .map((city, index) => {
      const score =
        (matchesEstiloCategory(city, preferencias) ? 3 : 0) +
        (matchesClimaPreferences(city, preferencias) ? 1 : 0);
      return { city, score, index };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    })
    .map(({ city }) => city);
}

function matchesRoteiroEstilo(roteiro: Roteiro, preferencias?: UserPreferences) {
  return preferencias?.estilo?.some((estilo) =>
    estiloRoteiroMap[estilo]?.some((tag) => roteiro.tipo.toLowerCase().includes(tag.toLowerCase())),
  );
}

function matchesRoteiroClima(roteiro: Roteiro, preferencias?: UserPreferences) {
  return preferencias?.clima?.some((clima) =>
    climaRoteiroMap[clima]?.some((tag) => roteiro.tipo.toLowerCase().includes(tag.toLowerCase())),
  );
}

function matchesRoteiroDuracao(roteiro: Roteiro, preferencias?: UserPreferences) {
  if (!preferencias?.duracao?.length) return false;
  const normalized = normalizeRoteiroDuration(roteiro.duracao);
  if (!normalized) return false;
  return preferencias.duracao.some((duracao) => durationBucketMap[duracao]?.includes(normalized));
}

export function rankRoteirosByPreferences(roteiros: Roteiro[], preferencias?: UserPreferences) {
  if (!preferencias || (!preferencias.clima?.length && !preferencias.duracao?.length && !preferencias.estilo?.length)) {
    return roteiros;
  }

  return [...roteiros]
    .map((roteiro, index) => {
      const score =
        (matchesRoteiroEstilo(roteiro, preferencias) ? 3 : 0) +
        (matchesRoteiroClima(roteiro, preferencias) ? 2 : 0) +
        (matchesRoteiroDuracao(roteiro, preferencias) ? 1 : 0);
      return { roteiro, score, index };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    })
    .map(({ roteiro }) => roteiro);
}
