import React, { useEffect } from 'react';
import { connect, styled } from 'frontity';
import PropTypes from 'prop-types';
import { rgba } from 'emotion-rgba';
import TwitterConvTrkr from 'react-twitter-conversion-tracker';

import Switch from '@frontity/components/switch';

import {
  Header,
  Footer,
  ContactUsModal,
  GlobalStyles,
  theme,
  CookiesBanner,
} from 'gfw-components';

import ReactPixel from '../helpers/facebook-pixel';
import Head from './head';

import { getAPILangCode } from '../helpers/lang';

import Loading from '../pages/loading';
import Home from '../pages/home';
import Archive from '../pages/archive';
import Post from '../pages/post';
import Error from '../pages/error';

const IS_BROWSER = typeof window !== 'undefined';

export const initAnalytics = () => {
  if (IS_BROWSER) {
    ReactPixel.init('895929814105571');
    TwitterConvTrkr.init('o4166');
  }
};

export const handlePageTrack = () => {
  ReactPixel.pageView();
  TwitterConvTrkr.pageView();
};

const Theme = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const searchOpen = state.theme.searchIsActive;
  const redirectionPost =
    !data.redirection &&
    data.is404 &&
    state.source.post &&
    Object.values(state.source.post)?.[0];

  if (data.isAuthor) {
    data.is404 = true;
  }

  useEffect(() => {
    if (data.redirection) {
      actions.router.set(data.redirection);
    }

    if (redirectionPost) {
      actions.router.set(redirectionPost.link);
    }
  }, []);

  useEffect(() => {
    const lang = JSON.parse(localStorage.getItem('txlive:selectedlang'));
    actions.theme.changeLanguage(getAPILangCode(lang));
  }, []);

  useEffect(() => {
    if (!window.ANALYTICS_INITIALIZED) {
      initAnalytics();
      window.ANALYTICS_INITIALIZED = true;
    }
    handlePageTrack();
  }, [data.link]);

  const handleLangSelect = (lang) => {
    actions.theme.changeLanguage(getAPILangCode(lang));
    if (data.isPostType && data.isPost) {
      const post = state.source[data.type][data.id];
      const translation = post?.translations_posts?.find((p) =>
        p?.locale?.includes(lang)
      );
      if (translation) {
        actions.router.set(translation.link);
      }
    }
  };

  return (
    <>
      <Head redirecting={!!data.redirection || !!redirectionPost} />
      <GlobalStyles />
      <HeaderWrapper>
        <Header
          relative
          pathname="https://blog.globalforestwatch.org"
          openContactUsModal={actions.theme.toggleContactUsModal}
          afterLangSelect={handleLangSelect}
        />
      </HeaderWrapper>
      <Main>
        {searchOpen && (
          <Overlay
            role="button"
            aria-label="close search"
            tabIndex={0}
            onClick={() => actions.theme.setSearchOpen(false)}
          />
        )}
        <Switch>
          <Loading
            when={data.isFetching || data.redirection || !!redirectionPost}
          />
          <Home
            when={!data.isPreview && data.isHome && !data.link.includes('/?s=')}
          />
          <Archive when={data.isArchive && !data.isAuthor} />
          <Post when={data.isPostType || data.isPreview} />
          <Error when={data.is404 || data.isError} />
        </Switch>
      </Main>
      <FooterWrapper>
        <Footer openContactUsModal={actions.theme.toggleContactUsModal} />
      </FooterWrapper>
      <CookiesBannerWrapper>
        <CookiesBanner />
      </CookiesBannerWrapper>
      <ContactUsModal
        open={state.theme.isContactUsOpen}
        onRequestClose={actions.theme.toggleContactUsModal}
      />
    </>
  );
};

Theme.propTypes = {
  state: PropTypes.object,
  actions: PropTypes.object,
};

export default connect(Theme);

const HeaderWrapper = styled.div`
  position: fixed;
  z-index: 100;
  width: 100%;
  margin-bottom: 20px;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 76px;
  z-index: 50;
  position: relative;
`;

const FooterWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const CookiesBannerWrapper = styled.div`
  position: fixed;
  z-index: 999999;
  bottom: 0;
  width: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: ${rgba(theme.colors.white, 0.8)};
  cursor: pointer;
  z-index: 10;
`;
