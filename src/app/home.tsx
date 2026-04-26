import { useState } from 'react';
import HomeScreenContent from '../components/home/HomeScreenContent';
import { Cidade, cidadesRecomendadas, ultimasVisualizadas } from '../data/mockCidades';

type NavKey = 'explorar' | 'roteiro' | 'mapa' | 'perfil';

export default function HomeScreen() {
  const [busca, setBusca] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState<Cidade[] | null>(null);
  const [navAtivo, setNavAtivo] = useState<NavKey>('explorar');

  function handleBusca() {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      setResultadoBusca(null);
      return;
    }

    const todas = [...cidadesRecomendadas, ...ultimasVisualizadas];
    setResultadoBusca(todas.filter((cidade) => cidade.nome.toLowerCase().includes(termo)));
  }

  function handleBuscaChange(value: string) {
    setBusca(value);
    if (!value.trim()) {
      setResultadoBusca(null);
    }
  }

  return (
    <HomeScreenContent
      busca={busca}
      resultadoBusca={resultadoBusca}
      recomendadas={cidadesRecomendadas}
      ultimas={ultimasVisualizadas}
      navAtivo={navAtivo}
      onChangeBusca={handleBuscaChange}
      onSubmitBusca={handleBusca}
      onChangeNav={setNavAtivo}
    />
  );
}
