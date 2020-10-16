import { blueGrey } from '@material-ui/core/colors'

export default props => {
  const paletteType = props.theme.palette.type
  return {
    dependencyGraph: {
      nodeStyle: {
        'border-width': 1,
        'border-color': paletteType === 'light'
          ? blueGrey[200]
          : blueGrey[50]
      },
      edgeStyle: {
        'line-color': paletteType === 'light'
          ? blueGrey[200]
          : blueGrey[50]
      },
      iconsStyle: {
        fill: paletteType === 'light'
          ? 'white'
          : 'red'
      }
    }
  }
}
