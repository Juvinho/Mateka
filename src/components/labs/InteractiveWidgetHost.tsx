import type { InteractiveWidget } from '../../data/matrizes/units'
import CayleyHamiltonVerifier from './CayleyHamiltonVerifier'
import DeterminantLab from './DeterminantLab'
import InverseLab from './InverseLab'
import MatrixExplorerLab from './MatrixExplorerLab'
import MultiplicationLab from './MultiplicationLab'
import OperationsLab from './OperationsLab'
import TransformLab from './TransformLab'

const InteractiveWidgetHost = ({ widget }: { widget: InteractiveWidget }) => {
  switch (widget) {
    case 'matrix-explorer':
      return <MatrixExplorerLab />
    case 'operations-lab':
      return <OperationsLab />
    case 'multiplication-lab':
      return <MultiplicationLab />
    case 'determinant-lab':
      return <DeterminantLab />
    case 'inverse-lab':
      return <InverseLab />
    case 'transform-lab':
      return <TransformLab />
    case 'cayley-hamilton-verifier':
      return <CayleyHamiltonVerifier />
  }
}

export default InteractiveWidgetHost
