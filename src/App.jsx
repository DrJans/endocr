import { useState } from 'react'
import styles from './App.module.css'

// ── Data ──────────────────────────────────────────────────────────────────────
const MOTIFS = ['Douleur au froid','Douleur au chaud','Douleur à la mastication','Douleur la nuit','Douleur irradiante','Douleur spontanée','Douleur localisée','Gonflement associé','Fièvre associée','Morceau de dent tombé','Traumatisme dentaire','Couronne tombée','Aucune douleur','Malaises associés']
const EXAM_VISUEL = ['Présence d\'une fêlure','Carie mésiale','Carie distale','Carie buccale','Carie linguale','Carie occlusale','Fracture coronaire','Abrasion','Erosion','Absence de paroi coronaire','Bonne intégrité coronaire']
const TRAITEMENT_ENDO_OPTS = ['Traitement canalaire dense, mené à l\'apex','Traitement canalaire non dense, non mené à l\'apex','Absence de traitement du canal MV2','Présence d\'un instrument fracturé (racine D)','Présence d\'un instrument fracturé (racine M)','Aucun traitement canalaire antérieur visible']
const RESTAURATION_OPTS = ['Composite','Amalgame','Couronne','Inlay/Onlay','Absence d\'étanchéité coronaire','Tenon radiculaire']
const PARTICULARITES_OPTS = ['Calcification canalaire','Dens in dente','Résorption interne','Résorption externe','Dilacération radiculaire','Fêlure radiculaire','Canal en C']
const DIAG_PULP = ['Pulpe saine','Pulpite réversible','Pulpite irréversible','Pulpe nécrosée','Présence d\'un traitement canalaire antérieur']
const DIAG_PARO = ['Parodonte sain','Abcès apical aigu','Abcès apical chronique asymptomatique','Abcès apical chronique symptomatique','Parodontite apicale chronique']
const PRONO = ['Favorable','Réservé','Défavorable']
const OPTIONS_THER = ['Traitement canalaire initial','Retraitement canalaire par voie orthograde','Retraitement sélectif par voie orthograde','Chirurgie endodontique avec obturation rétrograde','Avulsion de la dent','Abstention thérapeutique et surveillance','Apexification','Revitalisation','Pulpotomie totale','Pulpotomie partielle','Coiffage pulpaire direct','Coiffage pulpaire indirect']

const STEPS = [
  { key: 'infos',   title: 'Informations générales' },
  { key: 'motif',   title: 'Motif de consultation' },
  { key: 'clinique',title: 'Examen clinique' },
  { key: 'radio',   title: 'Examen radiographique' },
  { key: 'diag',    title: 'Diagnostics & pronostics' },
  { key: 'plan',    title: 'Plan de traitement' },
]

// ── Sub-components ─────────────────────────────────────────────────────────────
function RadioGroup({ options, value, onChange }) {
  return (
    <div className={styles.radioGroup}>
      {options.map(o => (
        <button
          key={o}
          type="button"
          className={`${styles.radioBtn} ${value === o ? styles.radioBtnActive : ''}`}
          onClick={() => onChange(o)}
        >{o}</button>
      ))}
    </div>
  )
}

function CheckGrid({ options, value = [], onChange }) {
  const toggle = (o) => {
    const next = value.includes(o) ? value.filter(v => v !== o) : [...value, o]
    onChange(next)
  }
  return (
    <div className={styles.checkGrid}>
      {options.map(o => (
        <label key={o} className={`${styles.checkItem} ${value.includes(o) ? styles.checkItemActive : ''}`}>
          <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} />
          <span className={styles.checkDot} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function Divider({ label }) {
  return <div className={styles.divider}>{label}</div>
}

// ── Steps ──────────────────────────────────────────────────────────────────────
function StepInfos({ data, set }) {
  return (
    <>
      <div className={styles.row2}>
        <Field label="Date de consultation">
          <input type="date" value={data.date || ''} onChange={e => set('date', e.target.value)} />
        </Field>
        <Field label="Numéro de dent (FDI)">
          <input type="text" placeholder="ex: 46" value={data.num_dent || ''} onChange={e => set('num_dent', e.target.value)} />
        </Field>
      </div>
      <div className={styles.row2}>
        <Field label="Nom du patient">
          <input type="text" placeholder="Nom Prénom" value={data.nom || ''} onChange={e => set('nom', e.target.value)} />
        </Field>
        <Field label="Sexe">
          <RadioGroup options={['Homme','Femme']} value={data.sexe} onChange={v => set('sexe', v)} />
        </Field>
      </div>
      <Divider label="Correspondant" />
      <div className={styles.row2}>
        <Field label="Civilité">
          <RadioGroup options={['Cher confrère','Chère consœur']} value={data.confrere} onChange={v => set('confrere', v)} />
        </Field>
        <Field label="Nom du correspondant">
          <input type="text" placeholder="Dr Dupont" value={data.nom_confrere || ''} onChange={e => set('nom_confrere', e.target.value)} />
        </Field>
      </div>
    </>
  )
}

function StepMotif({ data, set }) {
  return (
    <Field label="Motif(s) de consultation">
      <CheckGrid options={MOTIFS} value={data.motifs} onChange={v => set('motifs', v)} />
    </Field>
  )
}

function StepClinique({ data, set }) {
  const showPoches = data.parodontal === 'Présence de poche parodontale'
  return (
    <>
      <Divider label="Tests cliniques" />
      <div className={styles.testGrid}>
        <div className={styles.testCard}>
          <div className={styles.testLabel}>Palpation</div>
          <RadioGroup options={['Positif','Négatif']} value={data.palpation} onChange={v => set('palpation', v)} />
        </div>
        <div className={styles.testCard}>
          <div className={styles.testLabel}>Percussion</div>
          <RadioGroup options={['Positif','Négatif']} value={data.percussion} onChange={v => set('percussion', v)} />
        </div>
        <div className={styles.testCard}>
          <div className={styles.testLabel}>Test au froid</div>
          <RadioGroup options={['Positif','Négatif','Non réalisé']} value={data.froid} onChange={v => set('froid', v)} />
        </div>
        <div className={styles.testCard}>
          <div className={styles.testLabel}>Tooth Slooth</div>
          <RadioGroup options={['Négatif','Positif en ouverture','Positif en fermeture','Non réalisé']} value={data.tooth_slooth} onChange={v => set('tooth_slooth', v)} />
        </div>
        <div className={styles.testCard}>
          <div className={styles.testLabel}>Mobilité</div>
          <RadioGroup options={['Type 1 (< 1mm)','Type 2 (< 3mm)','Type 3 (> 3mm)']} value={data.mobilite} onChange={v => set('mobilite', v)} />
        </div>
      </div>
      <Divider label="Examen visuel" />
      <CheckGrid options={EXAM_VISUEL} value={data.exam_visuel} onChange={v => set('exam_visuel', v)} />
      <Divider label="Sondage parodontal" />
      <Field label="Statut parodontal">
        <RadioGroup options={['Normal','Présence de poche parodontale']} value={data.parodontal} onChange={v => set('parodontal', v)} />
      </Field>
      {showPoches && (
        <>
          <div className={styles.row3}>
            <Field label="Poche mésiale (mm)"><input type="number" placeholder="mm" value={data.prof_mesiale || ''} onChange={e => set('prof_mesiale', e.target.value)} /></Field>
            <Field label="Poche distale (mm)"><input type="number" placeholder="mm" value={data.prof_distale || ''} onChange={e => set('prof_distale', e.target.value)} /></Field>
            <Field label="Poche linguale (mm)"><input type="number" placeholder="mm" value={data.prof_linguale || ''} onChange={e => set('prof_linguale', e.target.value)} /></Field>
          </div>
          <div className={styles.row2}>
            <Field label="Poche vestibulaire (mm)"><input type="number" placeholder="mm" value={data.prof_vesti || ''} onChange={e => set('prof_vesti', e.target.value)} /></Field>
            <Field label="Lésion inter-radiculaire">
              <RadioGroup options={['Absente','Classe I','Classe II','Classe III']} value={data.lesionIR} onChange={v => set('lesionIR', v)} />
            </Field>
          </div>
        </>
      )}
    </>
  )
}

function StepRadio({ data, set }) {
  return (
    <>
      <Field label="Type de radiographie">
        <RadioGroup options={['Rétro-alvéolaire','CBCT','CBCT + Rétro-alvéolaire']} value={data.type_radio} onChange={v => set('type_radio', v)} />
      </Field>
      <Divider label="Findings radiographiques" />
      <Field label="Alvéolyse">
        <RadioGroup options={['Absence d\'alvéolyse apicale','Présence d\'une alvéolyse apicale']} value={data.alveo} onChange={v => set('alveo', v)} />
      </Field>
      <Field label="Traitement endodontique antérieur">
        <CheckGrid options={TRAITEMENT_ENDO_OPTS} value={data.traitement_endo} onChange={v => set('traitement_endo', v)} />
      </Field>
      <Field label="Restauration coronaire">
        <CheckGrid options={RESTAURATION_OPTS} value={data.restauration} onChange={v => set('restauration', v)} />
      </Field>
      <Field label="Particularités anatomiques">
        <CheckGrid options={PARTICULARITES_OPTS} value={data.particularites} onChange={v => set('particularites', v)} />
      </Field>
    </>
  )
}

function StepDiag({ data, set }) {
  return (
    <>
      <Field label="Diagnostic pulpaire">
        <RadioGroup options={DIAG_PULP} value={data.diag_pulp} onChange={v => set('diag_pulp', v)} />
      </Field>
      <Field label="Diagnostic parodontal">
        <RadioGroup options={DIAG_PARO} value={data.diag_paro} onChange={v => set('diag_paro', v)} />
      </Field>
      <Divider label="Pronostics" />
      <div className={styles.testGrid}>
        <div className={styles.testCard}>
          <div className={styles.testLabel}>Pronostic endodontique</div>
          <RadioGroup options={PRONO} value={data.prono_endo} onChange={v => set('prono_endo', v)} />
        </div>
        <div className={styles.testCard}>
          <div className={styles.testLabel}>Pronostic parodontal</div>
          <RadioGroup options={PRONO} value={data.prono_paro} onChange={v => set('prono_paro', v)} />
        </div>
        <div className={styles.testCard}>
          <div className={styles.testLabel}>Pronostic structurel</div>
          <RadioGroup options={PRONO} value={data.prono_struct} onChange={v => set('prono_struct', v)} />
        </div>
      </div>
    </>
  )
}

function StepPlan({ data, set }) {
  return (
    <>
      <div className={styles.infoBanner}>
        Sélectionnez jusqu'à 3 options dans l'ordre de préférence. L'option 1 sera la recommandation principale.
      </div>
      <Field label="Option 1 — Recommandée (idéal)">
        <select value={data.option1 || ''} onChange={e => set('option1', e.target.value)}>
          <option value="">— Choisir —</option>
          {OPTIONS_THER.map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Option 2">
        <select value={data.option2 || ''} onChange={e => set('option2', e.target.value)}>
          <option value="">— Aucune —</option>
          {OPTIONS_THER.map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Option 3">
        <select value={data.option3 || ''} onChange={e => set('option3', e.target.value)}>
          <option value="">— Aucune —</option>
          {OPTIONS_THER.map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Choix du patient">
        <RadioGroup options={['Option 1','Option 2','Option 3','Souhaite réfléchir']} value={data.choix_patient} onChange={v => set('choix_patient', v)} />
      </Field>
    </>
  )
}

// ── Results ────────────────────────────────────────────────────────────────────
function Results({ crConfrere, crPatient, onReset }) {
  const [tab, setTab] = useState('confrere')
  const [copied, setCopied] = useState(false)

  const copy = () => {
    const text = tab === 'confrere' ? crConfrere : crPatient
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <div className={styles.tabRow}>
        <button className={`${styles.tab} ${tab === 'confrere' ? styles.tabActive : ''}`} onClick={() => setTab('confrere')}>CR Confrère</button>
        <button className={`${styles.tab} ${tab === 'patient' ? styles.tabActive : ''}`} onClick={() => setTab('patient')}>Résumé Patient</button>
      </div>
      <div className={styles.resultBox}>
        <pre className={styles.resultContent}>{tab === 'confrere' ? crConfrere : crPatient}</pre>
      </div>
      <div className={styles.navRow}>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onReset}>← Nouvelle consultation</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={copy}>
          {copied ? '✓ Copié !' : 'Copier le texte'}
        </button>
      </div>
    </div>
  )
}

// ── Build prompts ──────────────────────────────────────────────────────────────
function buildPrompts(data) {
  const motifs = (data.motifs || []).join(', ') || 'Non précisé'
  const examVisuel = (data.exam_visuel || []).join(', ') || 'Aucune anomalie'
  const traitEndo = (data.traitement_endo || []).join(', ') || 'Aucun traitement canalaire antérieur visible'
  const restauration = (data.restauration || []).join(', ') || 'Aucune restauration notable'
  const particularites = (data.particularites || []).join(', ') || 'Aucune particularité anatomique'

  let blocParo = ''
  if (data.parodontal === 'Normal') {
    blocParo = "Aucune poche parodontale détectée."
  } else {
    const poches = []
    if (data.prof_mesiale) poches.push(`poche mésiale ${data.prof_mesiale}mm`)
    if (data.prof_distale) poches.push(`poche distale ${data.prof_distale}mm`)
    if (data.prof_linguale) poches.push(`poche linguale ${data.prof_linguale}mm`)
    if (data.prof_vesti) poches.push(`poche vestibulaire ${data.prof_vesti}mm`)
    blocParo = poches.length ? `Sondage parodontal: ${poches.join(', ')}.` : 'Sondage parodontal réalisé.'
    if (data.lesionIR && data.lesionIR !== 'Absente') blocParo += ` Lésion inter-radiculaire ${data.lesionIR}.`
  }

  const promptConfrere = `Tu es Dr Axel Jans, chirurgien-dentiste spécialisé en endodontie. Rédige un compte rendu de consultation endodontique professionnel destiné à un confrère dentiste.

Données cliniques :
- Patient : ${data.nom || 'Patient'}, ${data.sexe || ''}
- Date : ${data.date || 'à renseigner'}
- Dent concernée : ${data.num_dent || 'non précisée'}
- Motif de consultation : ${motifs}
- Tests cliniques — Palpation : ${data.palpation || 'nr'}, Percussion : ${data.percussion || 'nr'}, Froid : ${data.froid || 'nr'}, Tooth Slooth : ${data.tooth_slooth || 'nr'}, Mobilité : ${data.mobilite || 'nr'}
- Examen visuel : ${examVisuel}
- Parodontal : ${blocParo}
- Radiographie (${data.type_radio || 'nr'}) : ${data.alveo || ''} — ${traitEndo} — ${restauration} — ${particularites}
- Diagnostic pulpaire : ${data.diag_pulp || 'non renseigné'}
- Diagnostic parodontal : ${data.diag_paro || 'non renseigné'}
- Pronostic endodontique : ${data.prono_endo || 'nr'}, parodontal : ${data.prono_paro || 'nr'}, structurel : ${data.prono_struct || 'nr'}
- Option 1 (recommandée) : ${data.option1 || 'nr'}${data.option2 ? `, Option 2 : ${data.option2}` : ''}${data.option3 ? `, Option 3 : ${data.option3}` : ''}
- Choix du patient : ${data.choix_patient || 'non renseigné'}

Rédige un compte rendu formel en français médical professionnel. Commence par "${data.confrere || 'Cher confrère'}," suivi du nom ${data.nom_confrere || ''}. Structure : Anamnèse, Examen clinique, Examen radiographique, Diagnostics, Pronostics, Plan de traitement, formule confraternelle. Signe "Dr Axel Jans — Chirurgien-dentiste, exercice exclusif en endodontie". Maximum 350 mots.`

  const promptPatient = `Tu es Dr Axel Jans, chirurgien-dentiste spécialisé en endodontie. Rédige un résumé de consultation destiné directement au patient, en langage clair et bienveillant (non médical).

Données :
- Dent concernée : ${data.num_dent || 'la dent concernée'}
- Diagnostic pulpaire : ${data.diag_pulp || 'non précisé'}
- Diagnostic parodontal : ${data.diag_paro || 'non précisé'}
- Traitement recommandé : ${data.option1 || 'non précisé'}
- Pronostic endodontique : ${data.prono_endo || ''}

Rédige 4 paragraphes courts : 1) ce qui a été observé (simple, sans jargon), 2) explication de la situation en termes courants, 3) le traitement recommandé expliqué simplement avec les bénéfices attendus, 4) conclusion rassurante. Vouvoiement obligatoire. Maximum 200 mots. Signe "Dr Axel Jans".`

  return { promptConfrere, promptPatient }
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  const generate = async () => {
    setLoading(true)
    setError('')
    const { promptConfrere, promptPatient } = buildPrompts(data)
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: promptConfrere }) }),
        fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: promptPatient }) }),
      ])
      const d1 = await r1.json()
      const d2 = await r2.json()
      if (d1.error || d2.error) throw new Error(d1.error || d2.error)
      setResults({ crConfrere: d1.text, crPatient: d2.text })
    } catch (e) {
      setError('Erreur lors de la génération : ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setStep(0); setData({}); setResults(null); setError('') }

  const stepComponents = [
    <StepInfos data={data} set={set} />,
    <StepMotif data={data} set={set} />,
    <StepClinique data={data} set={set} />,
    <StepRadio data={data} set={set} />,
    <StepDiag data={data} set={set} />,
    <StepPlan data={data} set={set} />,
  ]

  if (results) {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.container}>
          <div className={styles.stepLabel}>Documents générés</div>
          <div className={styles.stepTitle}>{data.nom || 'Patient'} — Dent {data.num_dent || ''}</div>
          <Results crConfrere={results.crConfrere} crPatient={results.crPatient} onReset={reset} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.container}>
        <ProgressBar current={step} total={STEPS.length} />
        <div className={styles.stepLabel}>Étape {step + 1} / {STEPS.length}</div>
        <div className={styles.stepTitle}>{STEPS[step].title}</div>
        {stepComponents[step]}
        {error && <div className={styles.errorBanner}>{error}</div>}
        <div className={styles.navRow}>
          {step > 0
            ? <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setStep(s => s - 1)}>← Retour</button>
            : <span />
          }
          {step < STEPS.length - 1
            ? <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setStep(s => s + 1)}>Continuer →</button>
            : <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={generate} disabled={loading}>
                {loading ? <><span className={styles.spinner} /> Génération en cours...</> : 'Générer les comptes rendus →'}
              </button>
          }
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logoMark}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.6 2.8 1.5 3.8L6 20h12l-1.5-9.2C17.4 9.8 18 8.5 18 7c0-2.5-2.5-5-6-5z"/>
        </svg>
      </div>
      <div>
        <div className={styles.headerTitle}>EndoCR</div>
        <div className={styles.headerSub}>Compte rendu endodontique assisté par IA</div>
      </div>
    </div>
  )
}

function ProgressBar({ current, total }) {
  return (
    <div className={styles.progressBar}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`${styles.pill} ${i < current ? styles.pillDone : i === current ? styles.pillActive : ''}`} />
      ))}
    </div>
  )
}
