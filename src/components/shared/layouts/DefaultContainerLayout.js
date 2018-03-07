/**
 * Default Container Layout:
 * includes top and side nav
 *
 * @example:
 * <DefaultContainerLayout {...this.props}>
 *   <div>
 *     Content of the container
 *   </div>
 * </DefaultContainerLayout>
 *
 * @note:
 * You will need to pass in all props from parent container with "{...this.props}"
 * because we might need to take data from store or call router in the future in this component.
 */
import React, { Component } from 'react';
import SideNav from './SideNav';
import TopNav from './TopNav';

class DefaultContainerLayout extends Component {
  render() {
    const { app, children } = this.props;
    return (
      <div className="DefaultContainerLayout">
        <TopNav />
        <SideNav router={app.router} />
        <div className="static-content-wrapper">
          {children}
        </div>
      </div>
    );
  }
}

export default DefaultContainerLayout;
