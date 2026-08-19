import { useState } from 'react'

const ScratchPad = () => {
  const [visible, setVisible] = useState(true)
  const [text, setText] = useState('')

  return (
    <div className="scratchpad">
      <button type="button" className="scratchpad-toggle" onClick={() => setVisible((v) => !v)}>
        {visible ? '✎ Ocultar rascunho' : '✎ Mostrar rascunho'}
      </button>
      {visible && (
        <textarea
          className="scratchpad-area"
          placeholder="Use este espaço para fazer as contas antes de preencher a resposta..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
      )}
    </div>
  )
}

export default ScratchPad
