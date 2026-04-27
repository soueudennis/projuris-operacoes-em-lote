// Modal "Operação em lote" — fluxo wizard com IA

function BulkModal({ open, onClose, processes, initialOp = null }) {
  const [phase, setPhase] = React.useState('config'); // config | review | processing | result
  const [op, setOp] = React.useState(initialOp);
  const [form, setForm] = React.useState({
    // FormAdvogado
    novoAdvogado: 'mc',
    dataEfetiva: new Date().toISOString().slice(0,10),
    notificacao: 'email',
    justificativa: '',
    // FormEncerrar
    motivoEncerramento: '',
    dataEncerramento: new Date().toISOString().slice(0,10),
    observacoes: '',
    // FormStatus
    novoStatus: '',
    justificativaStatus: '',
    // FormTarefas
    tituloTarefa: 'Revisar status processual e atualizar cliente',
    atribuirTarefaA: 'resp',
    prazoTarefa: '',
    aplicarSugestaoIA: true,
    notificarPartes: true,
  });
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      setPhase('config');
      setOp(initialOp);
      setProgress(0);
      setForm({
        novoAdvogado: 'mc',
        dataEfetiva: new Date().toISOString().slice(0,10),
        notificacao: 'email',
        justificativa: '',
        motivoEncerramento: '',
        dataEncerramento: new Date().toISOString().slice(0,10),
        observacoes: '',
        novoStatus: '',
        justificativaStatus: '',
        tituloTarefa: 'Revisar status processual e atualizar cliente',
        atribuirTarefaA: 'resp',
        prazoTarefa: '',
        aplicarSugestaoIA: true,
        notificarPartes: true,
      });
    }
  }, [open, initialOp]);

  React.useEffect(() => {
    if (phase !== 'processing') return;
    let p = 0;
    const id = setInterval(() => {
      p += 8 + Math.random() * 6;
      if (p >= 100) { p = 100; clearInterval(id); setTimeout(() => setPhase('result'), 350); }
      setProgress(p);
    }, 220);
    return () => clearInterval(id);
  }, [phase]);

  if (!open) return null;

  const opData = OPERACOES.find(o => o.key === op);
  const totalValor = processes.reduce((acc, p) => {
    const n = parseFloat(p.valor.replace(/[^\d,]/g,'').replace(',','.'));
    return acc + (isNaN(n) ? 0 : n);
  }, 0);
  const valorFmt = totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const stepStatus = (target) => {
    const order = ['config','review','processing','result'];
    const a = order.indexOf(target), b = order.indexOf(phase);
    if (a < b) return 'done';
    if (a === b) return 'active';
    return '';
  };

  return (
    <div className="modal-mask" onClick={(e) => e.target.classList.contains('modal-mask') && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__head">
          <div className="modal__title-row">
            <span className="ai-badge">{Icon.sparkle(12)}</span>
            <h2 className="modal__title" id="modal-title">Operação em lote</h2>
            <span className="ai-card__label">com IA</span>
          </div>
          <button className="iconbtn iconbtn--ghost" onClick={onClose}>{Icon.close(18)}</button>
        </div>

        <div className="modal__body">
          <aside className="modal__anchor">
            <div className={`modal__anchor-item ${stepStatus('config')}`}>
              <span className="modal__anchor-step">{stepStatus('config') === 'done' ? Icon.check(10) : '1'}</span>
              Configurar
            </div>
            <div className={`modal__anchor-item ${stepStatus('review')}`}>
              <span className="modal__anchor-step">{stepStatus('review') === 'done' ? Icon.check(10) : '2'}</span>
              Revisar
            </div>
            <div className={`modal__anchor-item ${stepStatus('processing')}`}>
              <span className="modal__anchor-step">{stepStatus('processing') === 'done' ? Icon.check(10) : '3'}</span>
              Aplicar
            </div>
            <div className={`modal__anchor-item ${stepStatus('result')}`}>
              <span className="modal__anchor-step">{stepStatus('result') === 'done' ? Icon.check(10) : '4'}</span>
              Concluído
            </div>
          </aside>

          <div className="modal__content">
            <div className="sel-summary">
              <span className="sel-summary__pill">{processes.length}</span>
              <span className="sel-summary__text">
                processos selecionados · valor total <strong>{valorFmt}</strong>
              </span>
            </div>

            {phase === 'config' && (
              <ConfigPhase op={op} setOp={setOp} form={form} setForm={setForm} processes={processes} />
            )}
            {phase === 'review' && (
              <ReviewPhase op={op} opData={opData} form={form} processes={processes} />
            )}
            {phase === 'processing' && (
              <ProcessingPhase progress={progress} processes={processes} opData={opData} />
            )}
            {phase === 'result' && (
              <ResultPhase processes={processes} opData={opData} />
            )}
          </div>
        </div>

        <div className="modal__foot">
          {phase === 'config' && (
            <>
              <span className="muted" style={{fontSize:12}}>Etapa 1 de 4</span>
              <div style={{display:'flex', gap:8}}>
                <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
                <button className="btn btn--primary" disabled={!op} onClick={() => setPhase('review')}>
                  Continuar para revisão
                </button>
              </div>
            </>
          )}
          {phase === 'review' && (
            <>
              <button className="btn btn--tertiary" onClick={() => setPhase('config')}>Voltar</button>
              <div style={{display:'flex', gap:8}}>
                <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
                <button className="btn btn--primary" onClick={() => setPhase('processing')}>
                  Aplicar a {processes.length} processos
                </button>
              </div>
            </>
          )}
          {phase === 'processing' && (
            <>
              <span className="muted" style={{fontSize:12}}>Você pode fechar esta janela; a operação continua em segundo plano.</span>
              <button className="btn btn--tertiary" onClick={onClose}>Executar em segundo plano</button>
            </>
          )}
          {phase === 'result' && (
            <>
              <button className="btn btn--tertiary">Ver na auditoria</button>
              <div style={{display:'flex', gap:8}}>
                <button className="btn btn--secondary">Desfazer (24h)</button>
                <button className="btn btn--primary" onClick={onClose}>Concluir</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Phase 1: Config
function ConfigPhase({ op, setOp, form, setForm, processes }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Escolher operação</h3>
      <div className="op-grid" style={{ marginBottom: 24 }}>
        {OPERACOES.map(o => (
          <button key={o.key} className={`op-card ${op === o.key ? 'selected' : ''}`} onClick={() => setOp(o.key)}>
            <span className="op-card__icon">{Icon[o.icon](20)}</span>
            <div style={{minWidth:0, flex:1}}>
              <p className="op-card__title">{o.titulo}</p>
              <p className="op-card__desc">{o.desc}</p>
              {o.ai && <span className="op-card__ai-tag">{Icon.sparkle(10)} sugestão da IA disponível</span>}
            </div>
          </button>
        ))}
      </div>

      {op === 'advogado' && <FormAdvogado form={form} setForm={setForm} processes={processes} />}
      {op === 'encerrar' && <FormEncerrar form={form} setForm={setForm} processes={processes} />}
      {op === 'status'   && <FormStatus form={form} setForm={setForm} />}
      {op === 'tags'     && <FormTags form={form} setForm={setForm} />}
      {op === 'tarefas'  && <FormTarefas form={form} setForm={setForm} />}
    </div>
  );
}

// ====== Forms ======

function AICard({ children, confidence = 94 }) {
  return (
    <div className="ai-card">
      <div className="ai-card__head">
        <div className="ai-card__brand">
          <span className="ai-badge">{Icon.sparkle(12)}</span>
          <span className="ai-card__label">Projuris IA</span>
        </div>
        <span className="ai-card__confidence">
          <span className="ai-card__confidence-dot" /> {confidence}% de confiança
        </span>
      </div>
      {children}
    </div>
  );
}

function FormAdvogado({ form, setForm, processes }) {
  const sugerido = ADVOGADOS.find(a => a.id === 'rs'); // Rafael Souza tem menor carga
  return (
    <>
      <AICard>
        <p className="ai-card__title">Recomendamos <strong>{sugerido.nome}</strong> ({sugerido.oab})</p>
        <p className="ai-card__body">
          Considerando carga de trabalho atual ({sugerido.carga} processos ativos), área de atuação compatível
          ({sugerido.area}) e taxa de êxito histórica acima da média da equipe nessa natureza.
          Distribuição balanceada entre os {processes.length} processos.
        </p>
      </AICard>

      <div className="formgroup">
        <h4 className="formgroup__title">Configuração da operação</h4>

        <div className="field">
          <label className="field__label">Novo advogado responsável <span className="req">*</span></label>
          <select className="field__select" value={form.novoAdvogado} onChange={e => setForm({...form, novoAdvogado: e.target.value})}>
            {ADVOGADOS.map(a => (
              <option key={a.id} value={a.id}>{a.nome} — {a.area} · {a.carga} processos ativos</option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="field">
            <label className="field__label">Data efetiva</label>
            <input className="field__input" type="date" value={form.dataEfetiva} onChange={e => setForm({...form, dataEfetiva: e.target.value})} />
          </div>
          <div className="field">
            <label className="field__label">Notificar partes envolvidas</label>
            <select className="field__select" value={form.notificacao} onChange={e => setForm({...form, notificacao: e.target.value})}>
              <option value="email">Por e-mail</option>
              <option value="none">Não notificar</option>
              <option value="both">E-mail e push</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field__label">Justificativa (registrada na auditoria)</label>
          <textarea className="field__textarea" placeholder="Descreva o motivo da reatribuição..." rows={2} value={form.justificativa} onChange={e => setForm({...form, justificativa: e.target.value})} />
        </div>
      </div>
    </>
  );
}

function FormEncerrar({ form, setForm, processes }) {
  return (
    <>
      <AICard confidence={87}>
        <p className="ai-card__title">2 dos {processes.length} processos podem ter pendências</p>
        <p className="ai-card__body">
          Identificamos audiências futuras agendadas em <strong>2 processos</strong> e prazos abertos
          em <strong>1 processo</strong>. Recomendamos revisar antes de encerrar para evitar perda de prazo.
        </p>
      </AICard>

      <div className="formgroup">
        <h4 className="formgroup__title">Dados do encerramento</h4>

        <div className="row">
          <div className="field">
            <label className="field__label">Motivo do encerramento <span className="req">*</span></label>
            <select className="field__select" value={form.motivoEncerramento} onChange={e => setForm({...form, motivoEncerramento: e.target.value})}>
              <option value="" disabled>Selecione...</option>
              <option value="acordo">Acordo extrajudicial</option>
              <option value="sentenca">Sentença transitada em julgado</option>
              <option value="desistencia">Desistência da ação</option>
              <option value="arquivamento">Arquivamento</option>
            </select>
          </div>
          <div className="field">
            <label className="field__label">Data do encerramento <span className="req">*</span></label>
            <input className="field__input" type="date" value={form.dataEncerramento} onChange={e => setForm({...form, dataEncerramento: e.target.value})} />
          </div>
        </div>

        <div className="field">
          <label className="field__label">Observações</label>
          <textarea className="field__textarea" rows={2} placeholder="Detalhes que serão registrados em todos os processos..." value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})} />
        </div>
      </div>
    </>
  );
}

function FormStatus({ form, setForm }) {
  return (
    <div className="formgroup">
      <h4 className="formgroup__title">Novo status</h4>
      <div className="field">
        <label className="field__label">Status <span className="req">*</span></label>
        <select className="field__select" value={form.novoStatus} onChange={e => setForm({...form, novoStatus: e.target.value})}>
          <option value="" disabled>Selecione...</option>
          <option value="Suspenso">Suspenso</option>
          <option value="Em revisão">Em revisão</option>
          <option value="Ativo">Ativo</option>
        </select>
      </div>
      <div className="field">
        <label className="field__label">Justificativa</label>
        <textarea className="field__textarea" rows={2} value={form.justificativaStatus} onChange={e => setForm({...form, justificativaStatus: e.target.value})} />
      </div>
    </div>
  );
}

function FormTags({ form, setForm }) {
  return (
    <div className="formgroup">
      <h4 className="formgroup__title">Etiquetas a aplicar</h4>
      <div className="field">
        <label className="field__label">Adicione uma ou mais etiquetas</label>
        <input className="field__input" placeholder="Digite e pressione Enter..." />
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
        <span className="tag tag--purple">Revisão Q4</span>
        <span className="tag tag--green">Prioridade alta</span>
        <span className="tag tag--orange">Aguarda cliente</span>
      </div>
    </div>
  );
}

function FormTarefas({ form, setForm }) {
  return (
    <>
      <AICard confidence={91}>
        <p className="ai-card__title">Sugestão de tarefa baseada no contexto</p>
        <p className="ai-card__body">
          "Revisar status processual e atualizar cliente" — prazo sugerido de 7 dias úteis,
          atribuir ao advogado responsável de cada processo.
        </p>
      </AICard>
      <div className="formgroup">
        <h4 className="formgroup__title">Nova tarefa</h4>
        <div className="field">
          <label className="field__label">Título <span className="req">*</span></label>
          <input className="field__input" value={form.tituloTarefa} onChange={e => setForm({...form, tituloTarefa: e.target.value})} />
        </div>
        <div className="row">
          <div className="field">
            <label className="field__label">Atribuir a</label>
            <select className="field__select" value={form.atribuirTarefaA} onChange={e => setForm({...form, atribuirTarefaA: e.target.value})}>
              <option value="resp">Advogado responsável de cada processo</option>
              <option value="equipe">Equipe inteira</option>
            </select>
          </div>
          <div className="field">
            <label className="field__label">Prazo</label>
            <input className="field__input" type="date" value={form.prazoTarefa} onChange={e => setForm({...form, prazoTarefa: e.target.value})} />
          </div>
        </div>
      </div>
    </>
  );
}

// Phase 2: Review
function ReviewPhase({ op, opData, form, processes }) {
  const novoAdv = ADVOGADOS.find(a => a.id === form.novoAdvogado);
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>Revisar operação</h3>
      <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 13 }}>
        Operação: <strong style={{color:'var(--foreground)'}}>{opData?.titulo}</strong>
      </p>

      <AICard confidence={96}>
        <p className="ai-card__title">Análise final pré-execução</p>
        <p className="ai-card__body">
          Todos os {processes.length} processos passam nas regras de validação. Sem conflito de fuso de prazos.
          Auditoria será registrada com sua identidade. Operação reversível por <strong>24h</strong>.
        </p>
      </AICard>

      <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '20px 0 10px' }}>
        Itens afetados ({processes.length})
      </h4>
      <div className="review-list">
        {processes.slice(0, 6).map(p => (
          <div key={p.id} className="review-item">
            <div className="review-item__avatar">
              {p.cliente.split(' ').map(s => s[0]).slice(0,2).join('')}
            </div>
            <div className="review-item__main">
              <span className="review-item__num">{p.numero}</span>
              <span className="review-item__client">{p.cliente}</span>
              <span className="review-item__meta">{p.natureza} · {p.valor}</span>
            </div>
            {op === 'advogado' && (
              <div className="review-item__diff">
                <span className="review-item__diff-old">{p.advogado}</span>
                <span className="review-item__diff-arrow">→</span>
                <span className="review-item__diff-new">{novoAdv?.nome}</span>
              </div>
            )}
            {op === 'encerrar' && (
              <span className="tag tag--gray">Encerrado</span>
            )}
            <span className="muted" style={{ fontSize: 11 }}>{p.cadastro}</span>
            <button className="iconbtn iconbtn--ghost">{Icon.more(16)}</button>
          </div>
        ))}
        {processes.length > 6 && (
          <div className="review-item" style={{ justifyContent: 'center', color: 'var(--primary)', fontWeight: 600, gridTemplateColumns: '1fr', cursor: 'pointer' }}>
            + {processes.length - 6} processos a serem afetados — ver todos
          </div>
        )}
      </div>

      <div className="alert alert--warning" style={{ marginTop: 20 }}>
        <span className="alert__icon">{Icon.warning(18)}</span>
        <div>
          <p className="alert__title">Esta operação será registrada em auditoria</p>
          <p className="alert__body">
            A ação ficará disponível para reverter por 24h. Após esse período,
            mudanças individuais devem ser feitas processo a processo.
          </p>
        </div>
      </div>
    </div>
  );
}

// Phase 3: Processing
function ProcessingPhase({ progress, processes, opData }) {
  const done = Math.floor((progress / 100) * processes.length);
  return (
    <div className="processing">
      <div className="processing__ring">
        <span className="processing__ring-icon">{Icon.sparkle(28)}</span>
      </div>
      <h3 className="processing__title">Aplicando “{opData?.titulo}”</h3>
      <p className="processing__sub">
        A IA está validando cada processo, registrando histórico e disparando notificações.
        Não feche esta janela ou pode acompanhar em segundo plano.
      </p>

      <div style={{ width: 320 }}>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-meta">
          <span>{done} de {processes.length} processos</span>
          <span>{Math.floor(progress)}%</span>
        </div>
      </div>

      <div className="runlog">
        <div className="runlog__line"><span className="runlog__time">10:42:01</span> Validando regras de negócio…</div>
        <div className="runlog__line runlog__line--ok"><span className="runlog__time">10:42:02</span> ✓ {Math.min(done, 4)} processos validados</div>
        <div className="runlog__line"><span className="runlog__time">10:42:03</span> Atualizando vínculos no banco</div>
        {progress > 60 && <div className="runlog__line runlog__line--ok"><span className="runlog__time">10:42:05</span> ✓ Notificações enviadas</div>}
        {progress > 80 && <div className="runlog__line runlog__line--err"><span className="runlog__time">10:42:06</span> ✗ 2 processos exigem atenção manual</div>}
      </div>
    </div>
  );
}

// Phase 4: Result
function ResultPhase({ processes, opData }) {
  const total = processes.length;
  const errors = 2;
  const ok = total - errors;
  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>Operação concluída com avisos</h3>
      <p className="muted" style={{ marginTop: 0, marginBottom: 20, fontSize: 13 }}>
        “{opData?.titulo}” aplicada a {ok} de {total} processos.
      </p>

      <div className="result-summary">
        <div className="result-stat">
          <div className="result-stat__num result-stat__num--ok">{ok}</div>
          <div className="result-stat__label">Aplicados com sucesso</div>
        </div>
        <div className="result-stat">
          <div className="result-stat__num result-stat__num--err">{errors}</div>
          <div className="result-stat__label">Erros recuperáveis</div>
        </div>
        <div className="result-stat">
          <div className="result-stat__num">24h</div>
          <div className="result-stat__label">Janela de reversão</div>
        </div>
      </div>

      <div className="alert alert--error">
        <span className="alert__icon">{Icon.errorIcon(18)}</span>
        <div style={{ flex: 1 }}>
          <p className="alert__title">2 processos não foram alterados</p>
          <p className="alert__body" style={{ marginBottom: 8 }}>
            <strong>{processes[1]?.cliente}</strong> · prazo aberto até 30/04 · ação manual recomendada<br/>
            <strong>{processes[5]?.cliente}</strong> · audiência agendada para 12/05 · ação manual recomendada
          </p>
          <button className="btn btn--secondary" style={{ marginTop: 4 }}>Resolver pendências</button>
        </div>
      </div>

      <AICard confidence={88}>
        <p className="ai-card__title">Próximas operações que economizariam tempo</p>
        <p className="ai-card__body" style={{ marginBottom: 12 }}>
          Identifiquei <strong>4 processos similares</strong> ainda em sua carteira, da mesma natureza
          e do mesmo cliente, que normalmente passam pelo mesmo fluxo.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--ia btn--sm">{Icon.sparkle(12)} Aplicar nas 4 similares</button>
          <button className="btn btn--tertiary">Ver lista</button>
        </div>
      </AICard>
    </div>
  );
}

window.BulkModal = BulkModal;
