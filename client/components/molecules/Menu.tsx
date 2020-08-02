import React from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { Layout } from '../utils/Layout'
// import { Button } from '../atoms/Button'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
)

export function Menu() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Link href="/">
            <Typography variant="h6" className={classes.title}>
              Bamboo Shop
            </Typography>
          </Link>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

// export const Menu = () => (
//   <Layout>
//     <ButtonLayout>
//       <Button type="button" buttonText="index" href="/" />
//     </ButtonLayout>
//     <ButtonLayout>
//       <Button type="button" buttonText="about" href="about" />
//     </ButtonLayout>
//     <ButtonLayout>
//       <Button type="button" buttonText="dynamicImport" href="dynamicImport" />
//     </ButtonLayout>
//     <ButtonLayout>
//       <Button type="button" buttonText="lazyLoad" href="lazyLoad" />
//     </ButtonLayout>
//   </Layout>
// )

const ButtonLayout = styled.div`
  margin: 5px;
`
