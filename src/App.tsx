import { useActionState, useState } from 'react'
import './App.css'

type PatternInfo = {
  patternName: string,
  garmentSection: string,
  description: string,
  repeats: string
}
const savedPatternInfo: PatternInfo | null = JSON.parse(localStorage.getItem('patternInfo') ?? 'null')

function App() {

  // Initialize count from localStorage or default to 0
  const [count, setCount] = useState(() => Number(localStorage.getItem('repeatCount')) || 0)

  // add _ to prevState so TS understands it's an unused var, but it's necessary for holding position
  function addPatternInfo(_prevState: PatternInfo | null, formData: FormData): PatternInfo | null {
    if (formData.get('intent') === 'clear') {
      localStorage.removeItem('patternInfo')
      localStorage.removeItem('repeatCount')
      setCount(0)
      return null
    }
    const newPatternInfo = Object.fromEntries(formData) as PatternInfo
    localStorage.setItem('patternInfo', JSON.stringify(newPatternInfo))
    setCount(0) // Reset count when a new pattern is submitted
    localStorage.removeItem('repeatCount') // Reset repeat count in localStorage
    
    return newPatternInfo
  }

  const [patternInfo, formAction] = useActionState(addPatternInfo, savedPatternInfo)

  const isComplete = patternInfo !== null && count >= Number(patternInfo.repeats)

  return (
    <main className="app">
    <header className="app-header">
      <h1>My Pattern Repeats Tracker</h1>
    </header>

    <div className="layout">
    <form action={formAction} className="pattern-form card">
        <div className="field">
          <label htmlFor="pattern">Pattern name</label>
          <input type="text" id="pattern" name="patternName" />
        </div>

        <div className="field">
          <label htmlFor="garmentSection">Garment section</label>
          <input type="text" id="garmentSection" name="garmentSection" />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description"></textarea>
        </div>

        <div className="field">
          <label htmlFor="repeats">Number of repeats</label>
          <input type="number" id="repeats" required name="repeats" min="1" />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary">Submit</button>
          <button name="intent" value="clear" formNoValidate className="btn btn-quiet">Clear</button>
        </div>
    </form>

    {patternInfo &&  (
      <section className={`tracker card ${isComplete ? 'is-complete' : ''}`}>
        <h2>{patternInfo.patternName}</h2>
        <h3>{patternInfo.garmentSection}</h3>
        <p className="description">{patternInfo.description}</p>

        <div className="progress-row">
          <p className="count">
            <span className="count-current">{count}</span> / {patternInfo.repeats}
          </p>
          <progress className="progress" value={count} max={patternInfo.repeats} aria-label="Repeats completed" />
          <button className="btn btn-add" aria-label="Add repeat" onClick={() => {
            const newCount: number = count + 1
            setCount(newCount)
            localStorage.setItem('repeatCount', String(newCount))
          }} disabled={isComplete}>
            +
          </button>
        </div>

        {isComplete && <p className="complete" role="status">Pattern completed! What's next?</p>}
      </section>
    )}
    </div>
    </main>
  )
}

export default App
