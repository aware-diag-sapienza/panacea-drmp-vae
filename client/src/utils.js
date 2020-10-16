import { useEffect } from 'react'

export const useMountEffect = f => useEffect(f, [])

export const pairs = (arr) => arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat()

export const groupBy = (arr, key) => {
  return arr.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push()
    return rv
  }, {})
}

export const groupByObjects = (arr, key) => {
  return arr.reduce((rv, x) => {
    rv[x[key]] = rv[x[key]] || []
    rv[x[key]].push(x)
    return rv
  }, Object.create(null))
}

export const concatUnique = (a, b) => a.concat(b.filter((item) => a.indexOf(item) < 0))

export const arraysEqual = (a, b) => {
  if (a === b) return true
  if (a === null || b === null) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export const onlyUnique = (value, index, self) => self.indexOf(value) === index
