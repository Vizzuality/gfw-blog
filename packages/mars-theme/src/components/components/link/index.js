import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'frontity';

const Link = ({
  state,
  actions,
  link,
  className,
  children,
  ariaCurrent
}) => {
  const onClick = event => {
    // Do nothing if it's an external link
    if (link.startsWith('http')) return;

    event.preventDefault();
    // Set the router to the new url.
    actions.router.set(link);

    // Scroll the page to the top
    window.scrollTo(0, 0);

    // if the menu modal is open, close it so it doesn't block rendering
    if (state.theme.isMobileMenuOpen) {
      actions.theme.closeMobileMenu();
    }
  };

  return (
    <a
      href={link}
      onClick={onClick}
      className={className}
      aria-current={ariaCurrent}
    >
      {children}
    </a>
  );
};

Link.propTypes = {
  state: PropTypes.object,
  actions: PropTypes.object,
  link: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  ariaCurrent: PropTypes.string,
}

export default connect(Link);