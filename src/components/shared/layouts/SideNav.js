/**
 * SidebarNav
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SideNav extends Component {
  render() {
    const { navItems } = this.props;

    return (
      <div className="SideNav static-sidebar-wrapper sidebar-default">
        <div className="static-sidebar" style={{ marginTop: 56, minHeight: 800 }}>
          <div className="sidebar">
            <div className="widget stay-on-collapse" id="widget-sidebar">
              <nav role="navigation" className="widget-body">
                <ul className="acc-menu">
                  <li className="nav-separator"><span>Main</span></li>
                  {
                    navItems.map(navItem => (
                      <li key={navItem.name}>
                        <a href={navItem.href}>
                          <i className={navItem.iconClassName} /><span>{navItem.name}</span>
                        </a>
                      </li>
                    ))
                  }
                  <li className="nav-separator"><span>Extras</span></li>
                  <li>
                    <a href="/#logout">
                      <i className="fa fa-sign-out" /><span>Logout</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
SideNav.PropTypes = {
  navItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    iconClassName: PropTypes.string.isRequired,
  })),
};

SideNav.defaultProps = {
  navItems: [
    { name: 'Restaurants', href: '/#restaurants', iconClassName: 'fa fa-cutlery' },
    { name: 'Cards', href: '/#cards', iconClassName: 'fa fa-picture-o' },
    { name: 'Cuisine Types', href: '/#cuisine-types', iconClassName: 'fa fa-file-code-o' },
    { name: 'Reports', href: '/#reports', iconClassName: 'fa fa-flag' },
  ],
};

export default SideNav;
