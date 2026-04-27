// List screen — Processos com seleção em lote
function ListScreen({ selectedIds, setSelectedIds, onOpenBulk }) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [exact, setExact] = React.useState(false);

  const rows = React.useMemo(() => {
    const term = search.trim();
    if (!term) return PROCESSES;
    const needle = exact ? term : term.toLowerCase();
    return PROCESSES.filter(r => {
      const hay = `${r.cliente} ${r.numero} ${r.natureza} ${r.advogado} ${r.pasta}`;
      return (exact ? hay : hay.toLowerCase()).includes(needle);
    });
  }, [search, exact]);

  const allChecked = rows.length > 0 && rows.every(r => selectedIds.includes(r.id));
  const someChecked = rows.some(r => selectedIds.includes(r.id)) && !allChecked;

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds(prev => prev.filter(id => !rows.some(r => r.id === id)));
    } else {
      const newIds = rows.map(r => r.id);
      setSelectedIds(prev => [...new Set([...prev, ...newIds])]);
    }
  };
  const toggleOne = (id) => setSelectedIds(
    selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]
  );

  return (
    <div className="page" data-screen-label="01 Processos">
      <div className="page__head">
        <div className="page__title-block">
          <h1 className="page__title">Processos</h1>
          <p>{rows.length} processos · 9 selecionados</p>
        </div>
        <div className="page__actions">
          <button className="iconbtn" title="Filtros" onClick={() => setFilterOpen(v => !v)}>{Icon.filter(16)}</button>
          <button className="iconbtn" title="Relatórios">{Icon.chart(16)}</button>
          <button className="iconbtn" title="Exportar">{Icon.upload(16)}</button>
          <button className="iconbtn" title="Mais">{Icon.more(16)}</button>
          <button className="btn btn--outline">{Icon.pencil(14)} Editar</button>
          <button className="btn btn--primary">{Icon.plus(14)} Novo processo</button>
        </div>
      </div>

      {filterOpen && (
        <div className="filterbar">
          <div className="filterbar__head">
            <span>Filtros aplicados</span>
            <span className="spacer" />
            <button className="btn btn--tertiary btn--sm">Salvar filtro</button>
          </div>
          <div className="filterbar__chips">
            <div className="filterchip">
              <span className="filterchip__label">Natureza:</span>
              <span className="filterchip__value">Trabalhista</span>
              <span className="filterchip__remove">{Icon.close(12)}</span>
            </div>
            <div className="filterchip">
              <span className="filterchip__label">Data de início:</span>
              <span className="filterchip__value">{'< Mês anterior'}</span>
              <span className="filterchip__remove">{Icon.close(12)}</span>
            </div>
            <button className="filterchip filterchip--add">{Icon.plus(12)}</button>
          </div>
        </div>
      )}

      <div className="searchbar">
        <span className="searchbar__icon">{Icon.search(18)}</span>
        <input
          placeholder="Busca rápida"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label className="searchbar__exact" onClick={() => setExact(v => !v)}>
          <span className={`checkbox ${exact ? 'checked' : ''}`}>{exact && Icon.check(10)}</span>
          Termo exato
        </label>
      </div>

      <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>
              <span
                className={`checkbox ${allChecked ? 'checked' : someChecked ? 'indeterminate' : ''}`}
                onClick={toggleAll}
              >
                {allChecked && Icon.check(10)}
                {someChecked && Icon.dash(10)}
              </span>
            </th>
            <th>Pasta</th>
            <th>Status</th>
            <th>Cliente principal</th>
            <th>Número atual</th>
            <th>Natureza</th>
            <th>Advogado responsável</th>
            <th style={{ textAlign: 'right' }}>Valor da causa</th>
            <th>Data de cadastro</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const checked = selectedIds.includes(r.id);
            const t = STATUS_TAG[r.status];
            return (
              <tr key={r.id} className={checked ? 'selected' : ''}>
                <td>
                  <span className={`checkbox ${checked ? 'checked' : ''}`} onClick={() => toggleOne(r.id)}>
                    {checked && Icon.check(10)}
                  </span>
                </td>
                <td className="tbl__pasta">{r.pasta}</td>
                <td><span className={t.cls}><span className="dot" />{t.label}</span></td>
                <td><a className="tbl__link" href="#">{r.cliente}</a></td>
                <td><a className="tbl__link tbl__num" href="#">{r.numero}</a></td>
                <td>{r.natureza}</td>
                <td>{r.advogado}</td>
                <td className="tbl__amount" style={{ textAlign: 'right' }}>{r.valor}</td>
                <td>{r.cadastro}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      <div className="tbl-foot">
        <span>Exibindo <span className="tbl-foot__strong">{rows.length}</span> de <span className="tbl-foot__strong">{PROCESSES.length}</span> registros</span>
        <button className="btn btn--outline btn--sm">Exibir mais</button>
      </div>

      {selectedIds.length > 0 && (
        <BulkBar
          count={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onOpenBulk={onOpenBulk}
        />
      )}
    </div>
  );
}

function BulkBar({ count, onClear, onOpenBulk }) {
  return (
    <div className="bulkbar">
      <div className="bulkbar__count">
        <span className="bulkbar__count-pill">{count}</span>
        {count === 1 ? 'selecionado' : 'selecionados'}
      </div>
      <div className="bulkbar__divider" />
      <div className="bulkbar__actions">
        <button className="bulkbar__action" onClick={() => onOpenBulk('advogado')}>
          {Icon.swap(14)} Trocar advogado
        </button>
        <button className="bulkbar__action" onClick={() => onOpenBulk('tags')}>
          {Icon.tag(14)} Etiquetar
        </button>
        <button className="bulkbar__action" onClick={() => onOpenBulk('encerrar')}>
          {Icon.archive(14)} Encerrar
        </button>
      </div>
      <div className="bulkbar__divider" />
      <button className="btn--ia-bulk" onClick={() => onOpenBulk(null)}>
        {Icon.sparkle(14)} Operação em lote com IA
      </button>
      <button className="bulkbar__close" onClick={onClear} title="Limpar seleção">{Icon.close(16)}</button>
    </div>
  );
}

window.ListScreen = ListScreen;
