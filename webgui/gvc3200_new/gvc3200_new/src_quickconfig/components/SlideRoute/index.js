import React from 'react'
import { Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import './SlideRoute.less'

const SlideRoute = ({ path, component: Component }) => {
  return (
    <Route path={path}>
      {({ match }) => (
        <CSSTransition
          in={match != null}
          timeout={300}
          classNames='slide-page'
          unmountOnExit
        >
          <Component />
        </CSSTransition>
      )}
    </Route>
  )
}

export default SlideRoute
