import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, css } from 'frontity';
import theme from '../../theme';

import Card from '../../components/card';
import LoadMore from '../../components/load-more';
import Breadcrumbs from '../../components/breadcrumbs';

import {
  Wrapper,
  SearchMobile,
  SearchDesktop,
  LoadMoreWrapper,
} from './styles';

const POSTS_PER_PAGE = 9;

const ArchivePage = ({ state }) => {
  const [isFetching, setIsFetching] = useState(false);
  const { link } = state.router;

  const data = state.source.get(state.router.link);
  const initialPosts = data.items;

  const [posts, setPosts] = useState({
    [state.router.link]: initialPosts.map(({ id, type }) => ({ id, type })),
  });

  const { totalPages } = data;
  const [page, setPage] = useState(1);

  useEffect(() => {
    let fetchingAllData = true;
    let lastLoadedPage = 1;
    const loadedPosts = [];
    while (fetchingAllData) {
      const getLink =
        link[1] === '?'
          ? `page/${lastLoadedPage + 1}${link}`
          : `${link}page/${lastLoadedPage + 1}`;
      const pageData = state.source.get(getLink);
      if (pageData && pageData.items) {
        lastLoadedPage++;
        loadedPosts.push(...pageData.items);
      } else {
        fetchingAllData = false;
      }
    }
    const finalPosts = [...initialPosts, ...loadedPosts];
    setPosts({ [link]: finalPosts });
    setPage(lastLoadedPage);
  }, [link, setIsFetching, setPosts, setPage]);

  useEffect(() => {
    if (page && page > 1 && page <= totalPages && isFetching) {
      const pagesNumber = Math.round(
        posts[state.router.link].length / POSTS_PER_PAGE
      );
      if (pagesNumber < page) {
        for (let i = page - 1; i < page; i++) {
          const nextPage = i + 1;
          const getLink =
            link[1] === '?'
              ? `page/${nextPage}${link}`
              : `${link}page/${nextPage}`;
          const nextData = state.source.get(getLink);
          const accPosts = posts[state.router.link].concat([]);
          if (nextData && nextData.items) {
            accPosts.push(
              ...nextData.items.map(({ id, type }) => ({ id, type }))
            );
            const newPosts = { ...posts };
            newPosts[link] = accPosts;
            setPosts(newPosts);
            setIsFetching(false);
          }
        }
      } else {
        setIsFetching(false);
      }
    }
  }, [page, state, totalPages, posts, setIsFetching, isFetching]);

  return (
    <Wrapper>
      <div
        className="row"
        css={css`
          position: relative;
          z-index: 10;
        `}
      >
        <div className="column small-9">
          <Breadcrumbs
            css={css`
              margin-bottom: 25px;

              ${theme.mediaQueries.small} {
                margin-bottom: 40px;
              }
            `}
          />
        </div>
        <div className="column small-3">
          <SearchMobile />
        </div>
        <div className="column small-12 medium-9">Dropdown</div>
        <div className="column small-12 medium-3">
          <SearchDesktop showTitle />
        </div>
      </div>
      <div
        className="row"
        css={css`
          margin-bottom: 60px;
        `}
      >
        {posts[state.router.link].map((post) => (
          <div
            className="column small-12 medium-6 large-4"
            css={css`
              margin-bottom: 40px;
            `}
            key={post.id}
          >
            <Card {...post} />
          </div>
        ))}
        <LoadMoreWrapper className="column small-10 small-offset-1 medium-4 medium-offset-4">
          <LoadMore
            isFetching={isFetching}
            setIsFetching={setIsFetching}
            setPage={setPage}
            page={page}
            limit={totalPages}
          />
        </LoadMoreWrapper>
      </div>
    </Wrapper>
  );
};

ArchivePage.propTypes = {
  state: PropTypes.object,
};

export default connect(ArchivePage);