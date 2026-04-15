type AuroraProps = {
  ambienceActive: boolean
}

const Aurora = ({ ambienceActive }: AuroraProps) => {
  return <div className={`aurora ${ambienceActive ? 'ambience-on' : ''}`} aria-hidden="true" />
}

export default Aurora
