import {
  html,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'https://unpkg.com/htm/preact/standalone.module.js'

const DEFAULT_PROMPT = [
  {text: '~/ $'}
]

const DEFAULT_MOTD = [
  [{text: 'Welcome to the terminal!'}],
  [{text: 'Use the command '}, {text: 'help ', styles: {fontWeight: 'bold'}}, {text: 'for a list of commands.'}]
]

export default function Terminal({motd=DEFAULT_MOTD, prompt=DEFAULT_PROMPT, commands={}}) {
  const inputRef = useRef(null)
  const [history, setHistory] = useState(motd)
  const [input, setInput] = useState([])
  const [lastCommand, setLastCommand] = useState('')
  const [counter, setCounter] = useState(0)

  const helpResponse = useMemo(() => {
    return Object.keys(commands).map((commandName) => [{text: `${commandName}`, styles: {fontWeight: 'bold'}}])
  }, [commands])

  const onEnter = useCallback((commandName) => {
    setHistory([
      ...history,
      [...prompt, {text: commandName, styles: {marginLeft: '0.25rem'}}]
    ])
    setInput('')
    setLastCommand(commandName)
    setCounter(counter + 1)
  })

  const onBodyClick = useCallback((event) => {
    if (inputRef.current && event.target === document.body) {
      inputRef.current.focus()
    }
  }, [])

  // Effect to focus the input immediately on page load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef.current])

  // Effect to focus the input when the body is clicked
  useEffect(() => {
    document.body.addEventListener('click', onBodyClick)

    return function cleanup() {
      document.removeEventListener('click', onBodyClick)
    }
  }, [])

  //Effect to scroll to bottom automatically
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [history])

  // Effect to execute commands
  useEffect(() => {
    if (lastCommand.trim() === '') return

    const command = commands[lastCommand]
    if (command) {
      setHistory(command(history))
    } else if (lastCommand === 'clear') {
      setHistory([])
    } else if (lastCommand === 'help') {
      setHistory([...history, ...helpResponse, [{text: 'clear', styles: {fontWeight: 'bold'}}], [{text: 'help', styles: {fontWeight: 'bold'}}]])
    } else {
      setHistory([...history, [{text: `Unknown command: ${lastCommand}`, styles: {color: '#e16868'}}]])
    }
  }, [lastCommand, counter])

  return html`
    <div class="history">
      ${history.map((item, idx) => 
        html`<div class="line">${item.map((part, idx2) =>
          html`<span key=${`${idx}-${idx2}`} style=${part.styles}>${part.text}</span>`
        )}</div>`
      )}
    </div>
    <div class="prompt line">
      <span class="prompt-prefix">
        ${prompt.map((part, idx) => html`<span key=${idx} style=${part.styles}>${part.text}</span>`)}
      </span>
      <input
        type="text"
        ref=${inputRef}
        value=${input}
        onKeyUp=${({target}) => setInput(target.value)}
        onKeyDown=${(event) => {
          if (event.key === 'Enter') onEnter(input)
        }}
      />
    </div>
  `
}
