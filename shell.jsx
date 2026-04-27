// Sidebar + topbar shell — Projuris Empresas DS

function Sidebar() {
  const groups = [
    {
      label: 'Trabalho',
      items: [
        { key: 'doc', icon: 'doc', label: 'Processos', count: 1247, active: true },
        { key: 'gavel', icon: 'gavel', label: 'Audiências', count: 12 },
        { key: 'task', icon: 'task', label: 'Tarefas', count: 38 },
        { key: 'flow', icon: 'flow', label: 'Fluxos' },
      ],
    },
    {
      label: 'Cadastros',
      items: [
        { key: 'building', icon: 'building', label: 'Clientes' },
        { key: 'users', icon: 'users', label: 'Equipe' },
      ],
    },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="white">
            <path d="M8 6h10a8 8 0 010 16h-6v6H8V6zm4 4v8h6a4 4 0 000-8h-6z" />
          </svg>
        </div>
        <div>
          <div className="sidebar__brand-text">Projuris</div>
          <div className="sidebar__brand-sub">Empresas</div>
        </div>
      </div>
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          <div className="sidebar__group">{g.label}</div>
          {g.items.map(it => (
            <a key={it.key} className={`sidebar__item ${it.active ? 'active' : ''}`} href="#">
              <span className="sidebar__item-icon">{Icon[it.icon](16)}</span>
              <span>{it.label}</span>
              {it.count != null && <span className="sidebar__item-count">{it.count}</span>}
            </a>
          ))}
        </React.Fragment>
      ))}
      <div className="sidebar__user">
        <div className="sidebar__user-av">JK</div>
        <div className="sidebar__user-meta">
          <b>Júlia Kessler</b>
          <span>Coord. Cível</span>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ crumbs = [] }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <span className="crumbs__sep">›</span>}
              <span className={last ? 'crumbs__current' : 'crumbs__link'}>{c}</span>
            </React.Fragment>
          );
        })}
      </div>
      <div className="topbar__search">
        <span className="topbar__search-icon">{Icon.search(16)}</span>
        <input placeholder="Buscar processos, clientes, tarefas..." />
      </div>
      <button className="topbar__icon" title="Calendário">{Icon.calendar(18)}</button>
      <button className="topbar__icon" title="Notificações">
        {Icon.bell(18)}
        <span className="topbar__icon-dot" />
      </button>
      <div className="topbar__avatar">JK</div>
    </header>
  );
}

window.Sidebar = Sidebar;
window.TopBar = TopBar;
