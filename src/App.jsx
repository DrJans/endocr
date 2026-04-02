import { useState } from 'react'
import styles from './App.module.css'

const MOTIFS = ['Douleur au froid','Douleur au chaud','Douleur à la mastication','Douleur la nuit','Douleur irradiante','Douleur spontanée','Douleur localisée','Gonflement associé','Fièvre associée','Morceau de dent tombé','Traumatisme dentaire','Couronne tombée','Aucune douleur','Malaises associés']
const EXAM_VISUEL = ["Présence d'une fêlure",'Carie mésiale','Carie distale','Carie buccale','Carie linguale','Carie occlusale','Fracture coronaire','Abrasion','Erosion','Absence de paroi coronaire','Bonne intégrité coronaire']
const TRAITEMENT_ENDO_OPTS = ["Traitement canalaire dense, mené à l'apex","Traitement canalaire non dense, non mené à l'apex",'Absence de traitement du canal MV2','Présence d\'un instrument fracturé (racine D)','Présence d\'un instrument fracturé (racine M)','Aucun traitement canalaire antérieur visible']
const RESTAURATION_OPTS = ['Composite','Amalgame','Couronne','Inlay/Onlay',"Absence d'étanchéité coronaire",'Tenon radiculaire']
const PARTICULARITES_OPTS = ['Calcification canalaire','Dens in dente','Résorption interne','Résorption externe','Dilacération radiculaire','Fêlure radiculaire','Canal en C']
const DIAG_PULP = ['Pulpe saine','Pulpite réversible','Pulpite irréversible','Pulpe nécrosée',"Présence d'un traitement canalaire antérieur"]
const DIAG_PARO = ['Parodonte sain','Abcès apical aigu','Abcès apical chronique asymptomatique','Abcès apical chronique symptomatique','Parodontite apicale chronique']
const PRONO = ['Favorable','Réservé','Défavorable']
const OPTIONS_THER = ['Traitement canalaire initial','Retraitement canalaire par voie orthograde','Retraitement sélectif par voie orthograde','Chirurgie endodontique avec obturation rétrograde','Avulsion de la dent','Abstention thérapeutique et surveillance','Apexification','Revitalisation','Pulpotomie totale','Pulpotomie partielle','Coiffage pulpaire direct','Coiffage pulpaire indirect']
const STEPS = [
  { key: 'infos', title: 'Informations générales' },
  { key: 'motif', title: 'Motif de consultation' },
  { key: 'clinique', title: 'Examen clinique' },
  { key: 'radio', title: 'Examen radiographique' },
  { key: 'diag', title: 'Diagnostics et pronostics' },
  { key: 'plan', title: 'Plan de traitement' },
]

function buildDocuments(data) {
  const genre = data.sexe === 'Femme' ? 'la patiente' : 'le patient'
  const pronom = data.sexe === 'Femme' ? 'elle' : 'il'
  const motifs = (data.motifs || []).join(', ') || 'Non précisé'
  let blocParo = ''
  if (!data.parodontal || data.parodontal === 'Normal') {
    blocParo = "Aucune poche parodontale n'a été détectée."
  } else {
    const poches = []
    if (data.prof_mesiale) poches.push(`une poche mésiale de ${data.prof_mesiale}mm`)
    if (data.prof_distale) poches.push(`une poche distale de ${data.prof_distale}mm`)
    if (data.prof_linguale) poches.push(`une poche linguale de ${data.prof_linguale}mm`)
    if (data.prof_vesti) poches.push(`une poche vestibulaire/buccale de ${data.prof_vesti}mm`)
    blocParo = poches.length ? `Le sondage parodontal révèle : ${poches.join(', ')}.` : 'Sondage parodontal réalisé.'
    if (data.lesionIR && data.lesionIR !== 'Absente') blocParo += ` Une lésion inter-radiculaire de ${data.lesionIR} est observée.`
  }
  const traitEndo = data.traitement_endo && data.traitement_endo.length > 0
    ? `La présence de : ${data.traitement_endo.join(', ')} est à noter.`
    : "Aucun traitement canalaire antérieur n'est visible."
  const blocResto = data.restauration && data.restauration.length > 0
    ? `On notera la présence des éléments suivants : ${data.restauration.join(', ')}.`
    : "Aucune restauration n'est visible radiographiquement."
  const blocParticularite = data.particularites && data.particularites.length > 0
    ? `Nous avons mis en évidence la présence de : ${data.particularites.join(', ')}.` : ''
  const examVisuel = data.exam_visuel && data.exam_visuel.length > 0
    ? data.exam_visuel.join(', ') : 'Aucune anomalie visuelle notable.'
  let blocChoix = ''
  if (!data.choix_patient || data.choix_patient === 'Souhaite réfléchir') {
    blocChoix = 'souhaite réfléchir et nous contactera ultérieurement.'
  } else {
    blocChoix = `choisit : ${data.choix_patient}.`
  }
  let blocExplication = ''
  if (data.diag_pulp === 'Pulpe nécrosée') blocExplication = "La pulpe de votre dent est nécrosée. Des bactéries sont présentes dans le canal et causent une inflammation des tissus de soutien de la dent."
  else if (data.diag_pulp === "Présence d'un traitement canalaire antérieur") blocExplication = "Malgré le traitement canalaire présent dans votre dent, des bactéries persistent à l'intérieur des canaux et causent une inflammation des tissus de soutien de la dent."
  else if (data.diag_pulp === 'Pulpite irréversible' || data.diag_pulp === 'Pulpite réversible') blocExplication = "La pulpe de votre dent est inflammée."
  else if (data.diag_pulp === 'Pulpe saine') blocExplication = "La pulpe de votre dent est saine."
  function getExp(opt) {
    if (!opt) return ''
    if (opt === 'Traitement canalaire initial') return "Nettoyage, désinfection et obturation des canaux radiculaires sous contrôle optique, afin d'éliminer et/ou de prévenir une infection et de conserver la dent."
    if (opt === 'Retraitement canalaire par voie orthograde' || opt === 'Retraitement sélectif par voie orthograde') return "Reprise partielle ou totale d'un traitement canalaire existant en cas d'échec ou de persistance infectieuse."
    if (opt === 'Chirurgie endodontique avec obturation rétrograde') return "Intervention chirurgicale ciblée visant à traiter l'extrémité de la ou des racines lorsque le traitement ou le retraitement canalaire seul n'est pas suffisant."
    if (opt === 'Avulsion de la dent') return "Solution envisagée lorsque le maintien de la dent n'est pas raisonnablement possible. Elle entraîne la perte définitive de la dent et nécessite un remplacement (implant, pont, prothèse amovible, etc.)."
    if (opt === 'Abstention thérapeutique et surveillance') return "Absence de traitement avec mise en place d'une surveillance clinique et radiographique à intervalles réguliers."
    if (opt === 'Apexification') return "Nettoyage, désinfection et obturation des canaux radiculaires afin de conserver une dent présentant des racines immatures."
    if (opt === 'Revitalisation') return "Procédure visant à favoriser la poursuite de la croissance radiculaire grâce aux cellules souches des tissus péri-dentaires. La réponse au traitement est incertaine et un traitement canalaire ultérieur peut être nécessaire."
    if (['Pulpotomie totale','Pulpotomie partielle','Coiffage pulpaire direct','Coiffage pulpaire indirect'].includes(opt)) return "Tentative de conservation de la vitalité pulpaire à l'aide d'un matériau biocompatible et bioactif."
    return ''
  }
  const crConfrere = `COMPTE RENDU DE CONSULTATION ENDODONTIQUE
Date de consultation : ${data.date || ''}
${data.confrere || 'Cher confrère'}${data.nom_confrere ? ' ' + data.nom_confrere : ''},

Je vous adresse le compte rendu de la consultation endodontique concernant ${genre} ${data.nom || ''}, adressé(e) pour l'évaluation de la dent ${data.num_dent || ''}.

ANAMNÈSE
${genre.charAt(0).toUpperCase() + genre.slice(1)} vient nous consulter pour : ${motifs}

EXAMEN CLINIQUE
Le test à la palpation est ${data.palpation || 'non renseigné'}.
Le test de percussion est ${data.percussion || 'non renseigné'}.
Le test au froid est ${data.froid || 'non renseigné'}.
Le test au Tooth Slooth est ${data.tooth_slooth || 'non renseigné'}.
La mobilité dentaire est ${data.mobilite || 'non renseignée'}.
Examen visuel : ${examVisuel}

EXAMEN PARODONTAL
${blocParo}

EXAMEN RADIOGRAPHIQUE
Une radiographie de type ${data.type_radio || 'non précisé'} a été réalisée.
${data.alveo || ''}
${traitEndo}
${blocResto}
${blocParticularite}

DIAGNOSTICS
Le diagnostic pulpaire retenu est : ${data.diag_pulp || 'non renseigné'}.
Le diagnostic parodontal est : ${data.diag_paro || 'non renseigné'}.

PRONOSTICS
Le pronostic endodontique est ${data.prono_endo || 'non renseigné'}.
Le pronostic parodontal est ${data.prono_paro || 'non renseigné'}.
Le pronostic structurel est ${data.prono_struct || 'non renseigné'}.

OPTIONS THÉRAPEUTIQUES
Option 1 (idéal) : ${data.option1 || 'non précisé'}${data.option2 ? '\nOption 2 : ' + data.option2 : ''}${data.option3 ? '\nOption 3 : ' + data.option3 : ''}

Après discussion avec ${genre} des risques et bénéfices de chaque option, ${pronom} ${blocChoix}
Un consentement éclairé a été établi dans ce sens.

Je reste bien entendu à votre disposition pour toute information complémentaire.
Bien confraternellement,

Dr Axel Jans
Chirurgien-dentiste
Exercice exclusif en endodontie`

  const crPatient = `RÉSUMÉ DE CONSULTATION ENDODONTIQUE
Patient : ${data.nom || ''}
Date : ${data.date || ''}
Dent concernée : ${data.num_dent || ''}

MOTIF DE LA CONSULTATION
Vous avez été adressé(e) pour l'évaluation et la prise en charge endodontique de la dent ${data.num_dent || ''}.

DIAGNOSTIC ENDODONTIQUE
À l'issue de l'examen clinique et radiographique (${data.type_radio || ''}), les diagnostics suivants ont été retenus :
- ${data.diag_pulp || ''}
- ${data.diag_paro || ''}

EXPLICATION DE LA SITUATION
${blocExplication}

Cette atteinte peut être à l'origine :
- De fortes douleurs spontanées et/ou provoquées
- D'une infection locale ou diffuse autour de votre dent
- D'une fragilisation de la dent pouvant aboutir à l'extraction
${blocParticularite ? '\n' + blocParticularite : ''}
OPTIONS THÉRAPEUTIQUES
${data.option1 ? 'Option 1 – ' + data.option1 + ' (IDÉAL)\nPrincipe : ' + getExp(data.option1) + '\n' : ''}${data.option2 ? '\nOption 2 – ' + data.option2 + '\nPrincipe : ' + getExp(data.option2) + '\n' : ''}${data.option3 ? '\nOption 3 – ' + data.option3 + '\nPrincipe : ' + getExp(data.option3) + '\n' : ''}
PRONOSTIC
Pronostic endodontique : ${data.prono_endo || ''}
Pronostic parodontal : ${data.prono_paro || ''}
Pronostic structurel : ${data.prono_struct || ''}

RECOMMANDATION
La prise en charge recommandée est : ${data.option1 || ''}

Si vous avez des questions, n'hésitez pas à nous en faire part.

Dr Axel Jans
Chirurgien-dentiste – Exercice exclusif en endodontie`

  return { crConfrere, crPatient }
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className={styles.radioGroup}>
      {options.map(o => (
        <button key={o} type="button"
          className={`${styles.radioBtn} ${value === o ? styles.radioBtnActive : ''}`}
          onClick={() => onChange(o)}>{o}</button>
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

function StepInfos({ data, set }) {
  return (
    <>
      <div className={styles.row2}>
        <Field label="Date de consultation"><input type="date" value={data.date || ''} onChange={e => set('date', e.target.value)} /></Field>
        <Field label="Numéro de dent (FDI)"><input type="text" placeholder="ex: 46" value={data.num_dent || ''} onChange={e => set('num_dent', e.target.value)} /></Field>
      </div>
      <div className={styles.row2}>
        <Field label="Nom du patient"><input type="text" placeholder="Nom Prénom" value={data.nom || ''} onChange={e => set('nom', e.target.value)} /></Field>
        <Field label="Sexe"><RadioGroup options={['Homme','Femme']} value={data.sexe} onChange={v => set('sexe', v)} /></Field>
      </div>
      <Divider label="Correspondant" />
      <div className={styles.row2}>
        <Field label="Civilité"><RadioGroup options={['Cher confrère','Chère consœur']} value={data.confrere} onChange={v => set('confrere', v)} /></Field>
        <Field label="Nom du correspondant"><input type="text" placeholder="Dr Dupont" value={data.nom_confrere || ''} onChange={e => set('nom_confrere', e.target.value)} /></Field>
      </div>
    </>
  )
}

function StepMotif({ data, set }) {
  return <Field label="Motif(s) de consultation"><CheckGrid options={MOTIFS} value={data.motifs} onChange={v => set('motifs', v)} /></Field>
}

function StepClinique({ data, set }) {
  const showPoches = data.parodontal === 'Présence de poche parodontale'
  return (
    <>
      <Divider label="Tests cliniques" />
      <div className={styles.testGrid}>
        <div className={styles.testCard}><div className={styles.testLabel}>Palpation</div><RadioGroup options={['Positif','Négatif']} value={data.palpation} onChange={v => set('palpation', v)} /></div>
        <div className={styles.testCard}><div className={styles.testLabel}>Percussion</div><RadioGroup options={['Positif','Négatif']} value={data.percussion} onChange={v => set('percussion', v)} /></div>
        <div className={styles.testCard}><div className={styles.testLabel}>Test au froid</div><RadioGroup options={['Positif','Négatif','Non réalisé']} value={data.froid} onChange={v => set('froid', v)} /></div>
        <div className={styles.testCard}><div className={styles.testLabel}>Tooth Slooth</div><RadioGroup options={['Négatif','Positif en ouverture','Positif en fermeture','Non réalisé']} value={data.tooth_slooth} onChange={v => set('tooth_slooth', v)} /></div>
        <div className={styles.testCard}><div className={styles.testLabel}>Mobilité</div><RadioGroup options={['Type 1 (< 1mm)','Type 2 (< 3mm)','Type 3 (> 3mm)']} value={data.mobilite} onChange={v => set('mobilite', v)} /></div>
      </div>
      <Divider label="Examen visuel" />
      <CheckGrid options={EXAM_VISUEL} value={data.exam_visuel} onChange={v => set('exam_visuel', v)} />
      <Divider label="Sondage parodontal" />
      <Field label="Statut parodontal"><RadioGroup options={['Normal','Présence de poche parodontale']} value={data.parodontal} onChange={v => set('parodontal', v)} /></Field>
      {showPoches && (
        <>
          <div className={styles.row3}>
            <Field label="Poche mésiale (mm)"><input type="number" placeholder="mm" value={data.prof_mesiale || ''} onChange={e => set('prof_mesiale', e.target.value)} /></Field>
            <Field label="Poche distale (mm)"><input type="number" placeholder="mm" value={data.prof_distale || ''} onChange={e => set('prof_distale', e.target.value)} /></Field>
            <Field label="Poche linguale (mm)"><input type="number" placeholder="mm" value={data.prof_linguale || ''} onChange={e => set('prof_linguale', e.target.value)} /></Field>
          </div>
          <div className={styles.row2}>
            <Field label="Poche vestibulaire (mm)"><input type="number" placeholder="mm" value={data.prof_vesti || ''} onChange={e => set('prof_vesti', e.target.value)} /></Field>
            <Field label="Lésion inter-radiculaire"><RadioGroup options={['Absente','Classe I','Classe II','Classe III']} value={data.lesionIR} onChange={v => set('lesionIR', v)} /></Field>
          </div>
        </>
      )}
    </>
  )
}

function StepRadio({ data, set }) {
  return (
    <>
      <Field label="Type de radiographie"><RadioGroup options={['Rétro-alvéolaire','CBCT','CBCT + Rétro-alvéolaire']} value={data.type_radio} onChange={v => set('type_radio', v)} /></Field>
      <Divider label="Findings radiographiques" />
      <Field label="Alvéolyse"><RadioGroup options={["Absence d'alvéolyse apicale","Présence d'une alvéolyse apicale"]} value={data.alveo} onChange={v => set('alveo', v)} /></Field>
      <Field label="Traitement endodontique antérieur"><CheckGrid options={TRAITEMENT_ENDO_OPTS} value={data.traitement_endo} onChange={v => set('traitement_endo', v)} /></Field>
      <Field label="Restauration coronaire"><CheckGrid options={RESTAURATION_OPTS} value={data.restauration} onChange={v => set('restauration', v)} /></Field>
      <Field label="Particularités anatomiques"><CheckGrid options={PARTICULARITES_OPTS} value={data.particularites} onChange={v => set('particularites', v)} /></Field>
    </>
  )
}

function StepDiag({ data, set }) {
  return (
    <>
      <Field label="Diagnostic pulpaire"><RadioGroup options={DIAG_PULP} value={data.diag_pulp} onChange={v => set('diag_pulp', v)} /></Field>
      <Field label="Diagnostic parodontal"><RadioGroup options={DIAG_PARO} value={data.diag_paro} onChange={v => set('diag_paro', v)} /></Field>
      <Divider label="Pronostics" />
      <div className={styles.testGrid}>
        <div className={styles.testCard}><div className={styles.testLabel}>Pronostic endodontique</div><RadioGroup options={PRONO} value={data.prono_endo} onChange={v => set('prono_endo', v)} /></div>
        <div className={styles.testCard}><div className={styles.testLabel}>Pronostic parodontal</div><RadioGroup options={PRONO} value={data.prono_paro} onChange={v => set('prono_paro', v)} /></div>
        <div className={styles.testCard}><div className={styles.testLabel}>Pronostic structurel</div><RadioGroup options={PRONO} value={data.prono_struct} onChange={v => set('prono_struct', v)} /></div>
      </div>
    </>
  )
}

function StepPlan({ data, set }) {
  return (
    <>
      <div className={styles.infoBanner}>Sélectionnez jusqu'à 3 options dans l'ordre de préférence. L'option 1 sera la recommandation principale.</div>
      <div className={styles.field} style={{marginBottom:'1rem'}}>
        <label className={styles.fieldLabel}>Option 1 — Recommandée (idéal)</label>
        <div className={styles.radioGroup}>{OPTIONS_THER.map(o => <button key={o} type="button" className={`${styles.radioBtn} ${data.option1 === o ? styles.radioBtnActive : ''}`} onClick={() => set('option1', o)}>{o}</button>)}</div>
      </div>
      <div className={styles.field} style={{marginBottom:'1rem'}}>
        <label className={styles.fieldLabel}>Option 2</label>
        <div className={styles.radioGroup}>
          <button type="button" className={`${styles.radioBtn} ${!data.option2 ? styles.radioBtnActive : ''}`} onClick={() => set('option2', '')}>Aucune</button>
          {OPTIONS_THER.map(o => <button key={o} type="button" className={`${styles.radioBtn} ${data.option2 === o ? styles.radioBtnActive : ''}`} onClick={() => set('option2', o)}>{o}</button>)}
        </div>
      </div>
      <div className={styles.field} style={{marginBottom:'1rem'}}>
        <label className={styles.fieldLabel}>Option 3</label>
        <div className={styles.radioGroup}>
          <button type="button" className={`${styles.radioBtn} ${!data.option3 ? styles.radioBtnActive : ''}`} onClick={() => set('option3', '')}>Aucune</button>
          {OPTIONS_THER.map(o => <button key={o} type="button" className={`${styles.radioBtn} ${data.option3 === o ? styles.radioBtnActive : ''}`} onClick={() => set('option3', o)}>{o}</button>)}
        </div>
      </div>
      <Field label="Choix du patient"><RadioGroup options={['Option 1','Option 2','Option 3','Souhaite réfléchir']} value={data.choix_patient} onChange={v => set('choix_patient', v)} /></Field>
    </>
  )
}

function Results({ crConfrere, crPatient, onReset }) {
  const [tab, setTab] = useState('confrere')
  const [copied, setCopied] = useState(false)
  const copy = () => {
    const text = tab === 'confrere' ? crConfrere : crPatient
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  const downloadPDF = () => {
    const text = tab === 'confrere' ? crConfrere : crPatient
    const filename = tab === 'confrere' ? 'CR_Confrere.txt' : 'Resume_Patient.txt'
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
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
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={copy}>{copied ? '✓ Copié !' : 'Copier le texte'}</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={downloadPDF}>⬇ Télécharger</button>
      </div>
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({})
  const [results, setResults] = useState(null)
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const generate = () => setResults(buildDocuments(data))
  const reset = () => { setStep(0); setData({}); setResults(null) }
  const stepComponents = [
    <StepInfos data={data} set={set} />,
    <StepMotif data={data} set={set} />,
    <StepClinique data={data} set={set} />,
    <StepRadio data={data} set={set} />,
    <StepDiag data={data} set={set} />,
    <StepPlan data={data} set={set} />,
  ]
  if (results) return (
    <div className={styles.app}>
      <Header />
      <div className={styles.container}>
        <div className={styles.stepLabel}>Documents générés</div>
        <div className={styles.stepTitle}>{data.nom || 'Patient'} — Dent {data.num_dent || ''}</div>
        <Results crConfrere={results.crConfrere} crPatient={results.crPatient} onReset={reset} />
      </div>
    </div>
  )
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.container}>
        <ProgressBar current={step} total={STEPS.length} />
        <div className={styles.stepLabel}>Étape {step + 1} / {STEPS.length}</div>
        <div className={styles.stepTitle}>{STEPS[step].title}</div>
        {stepComponents[step]}
        <div className={styles.navRow}>
          {step > 0 ? <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setStep(s => s - 1)}>← Retour</button> : <span />}
          {step < STEPS.length - 1
            ? <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setStep(s => s + 1)}>Continuer →</button>
            : <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={generate}>Générer les documents →</button>}
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logoMark}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.6 2.8 1.5 3.8L6 20h12l-1.5-9.2C17.4 9.8 18 8.5 18 7c0-2.5-2.5-5-6-5z"/></svg>
      </div>
      <div>
        <div className={styles.headerTitle}>EndoCR</div>
        <div className={styles.headerSub}>Compte rendu endodontique</div>
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
