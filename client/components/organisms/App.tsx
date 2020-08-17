import React, { useEffect } from 'react'
import { AppAction, AppState } from '../../redux/reducers/app'

type Props = {
  app: AppState
  setTitle: (v: string) => AppAction
}

export const App: React.FC<Props> = ({ setTitle, app }) => {
  useEffect(() => {
    setTitle('Client Side Rendering')
  }, [setTitle])

  return (
    <>
    </>
  )
}
