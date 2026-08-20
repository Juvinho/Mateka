import mascotEntusiasmo from '../assets/mascot/feliz-cumprimentando.webp'
import mascotNormal from '../assets/mascot/sorridente.webp'
import mascotTimida from '../assets/mascot/timida.webp'
import mascotFelicidade from '../assets/mascot/radiante.webp'
import mascotAtencao from '../assets/mascot/atencao.webp'
import mascotSuspiro from '../assets/mascot/bracos-cruzados.webp'
import mascotPensando from '../assets/mascot/pensativa.webp'
import mascotSurpresa from '../assets/mascot/radiante-demais.webp'
import mascotPalmas from '../assets/mascot/muito-contente.webp'

import audioPrimeiroAcerto from '../assets/voice/primeiro  acerto.mp3'
import audioTentarNovamente from '../assets/voice/tentarnovamente.mp3'
import audioRecaptular from '../assets/voice/recaptular.mp3'
import audioEndless from '../assets/voice/endless.mp3'
import audioPromessa from '../assets/voice/promessa.mp3'
import audioPromessaFalhou from '../assets/voice/promessa falhou.mp3'
import audioAlegriaModulo2 from '../assets/voice/alegria modulo 2.mp3'
import audioAlegriaModulo from '../assets/voice/alegria modulo.mp3'

export type Mood =
  | 'entusiasmo'
  | 'normal'
  | 'timida'
  | 'felicidade'
  | 'chamando-atencao'
  | 'suspiro'
  | 'pensando'
  | 'surpresa'
  | 'batendo-palmas'
  | 'alegria'
  | 'suspense'

export const MOOD_IMAGE: Record<Mood, string> = {
  entusiasmo: mascotEntusiasmo,
  normal: mascotNormal,
  timida: mascotTimida,
  felicidade: mascotFelicidade,
  'chamando-atencao': mascotAtencao,
  suspiro: mascotSuspiro,
  pensando: mascotPensando,
  surpresa: mascotSurpresa,
  'batendo-palmas': mascotPalmas,
  alegria: mascotFelicidade,
  suspense: mascotPensando,
}

export const MOOD_ALT: Record<Mood, string> = {
  entusiasmo: 'Emy-chan, a mascote do Mateka, animada e acenando',
  normal: 'Emy-chan, a mascote do Mateka, sorrindo calmamente',
  timida: 'Emy-chan, a mascote do Mateka, um pouco tímida',
  felicidade: 'Emy-chan, a mascote do Mateka, muito feliz e radiante',
  'chamando-atencao': 'Emy-chan, a mascote do Mateka, de óculos, chamando atenção',
  suspiro: 'Emy-chan, a mascote do Mateka, de braços cruzados, suspirando',
  pensando: 'Emy-chan, a mascote do Mateka, pensativa',
  surpresa: 'Emy-chan, a mascote do Mateka, surpresa e animada',
  'batendo-palmas': 'Emy-chan, a mascote do Mateka, batendo palmas, super animada',
  alegria: 'Emy-chan, a mascote do Mateka, radiante de alegria',
  suspense: 'Emy-chan, a mascote do Mateka, curiosa e pensativa',
}

export type ReactionKey =
  | 'primeiro-acerto'
  | 'tentar-novamente'
  | 'promessa'
  | 'promessa-falhou'
  | 'recaptular'
  | 'endless'
  | 'alegria-modulo'
  | 'alegria-modulo-2'

export type ReactionSegment = { mood: Mood; start: number; text: string }

export type Reaction = {
  audio: string
  segments: ReactionSegment[]
}

// `start` times (seconds) are proportioned from each clip's real duration by
// character weight per segment — there's no forced-alignment transcript, so
// this is an approximation, not exact word-level sync.
export const REACTIONS: Record<ReactionKey, Reaction> = {
  'primeiro-acerto': {
    audio: audioPrimeiroAcerto,
    segments: [
      { mood: 'felicidade', start: 0, text: 'Muito bom, seu primeiro acerto, primeiro de muitos é claro,' },
      { mood: 'entusiasmo', start: 3.41, text: 'vamos continuar pra ver o que você é capaz.' },
    ],
  },
  'tentar-novamente': {
    audio: audioTentarNovamente,
    segments: [
      { mood: 'chamando-atencao', start: 0, text: 'Ei! Acabamos de ver isso, você não pode fazer assim,' },
      { mood: 'suspiro', start: 4.75, text: 'vamos tentar de novo.' },
    ],
  },
  promessa: {
    audio: audioPromessa,
    segments: [
      {
        mood: 'pensando',
        start: 0,
        text: 'Hummm... Tem um erro ali, vamos fazer assim: você finge que não aconteceu, mas promete que não vai errar na próxima?',
      },
    ],
  },
  'promessa-falhou': {
    audio: audioPromessaFalhou,
    segments: [
      { mood: 'pensando', start: 0, text: 'Eu falei pra você não errar... Ai você me quebra desse jeito.' },
    ],
  },
  recaptular: {
    audio: audioRecaptular,
    segments: [
      { mood: 'pensando', start: 0, text: 'Calma... Vamos recaptular para não perder por aqui.' },
    ],
  },
  endless: {
    audio: audioEndless,
    segments: [
      {
        mood: 'felicidade',
        start: 0,
        text: 'Esse endless seu está insano! 50 questões respondidas e poucos erros, esse vai de recordação da próxima!',
      },
    ],
  },
  'alegria-modulo': {
    audio: audioAlegriaModulo,
    segments: [
      { mood: 'alegria', start: 0, text: 'Muito bom! Você acertou o módulo inteiro! Parabéns!' },
      { mood: 'entusiasmo', start: 3.8, text: 'Vamos continuar fazendo bonito?' },
    ],
  },
  'alegria-modulo-2': {
    audio: audioAlegriaModulo2,
    segments: [
      { mood: 'surpresa', start: 0, text: 'Nossa! Por essa eu não esperava! 2 módulos seguidos sem errar?' },
      { mood: 'batendo-palmas', start: 4.69, text: 'quero mais! quero mais!' },
    ],
  },
}
