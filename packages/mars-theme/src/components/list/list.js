/* eslint-disable no-plusplus */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, styled, decode } from 'frontity';
import Item from './list-item';
import SubPost from './sub-post';
import MainPost from './main-post';
import LoadMore from './load-more';
import BlogHeader from '../blog-header';
import CategoryNameList from '../category/list-name';
import Breadcrumbs from '../breadcrumbs';
import {
  LARGE_ENDPOINT,
  SMALL_ENDPOINT,
  MEDIUM_ENDPOINT,
} from '../heplers/css-endpoints';

const POSTS_PER_PAGE = 9;
const topSectionNumber = 3;

const List = ({ state }) => {
  const isBlogHomePage = () => {
    return state.router.link === '/';
  };

  const data = state.source.get(state.router.link);
  const categories = Object.values(
    state.source.category
  ).map(({ name, link }) => ({ name, link }));
  const initialPosts = [...data.items];
  const mainPost = isBlogHomePage() ? initialPosts.shift() : null;
  const subPosts = isBlogHomePage() ? initialPosts.splice(0, 2) : [];
  const [posts, setPosts] = useState(
    initialPosts.map(({ id, type }) => ({ id, type }))
  );
  const { length } = Object.keys(state.source.post);
  const pageNumber = Math.round(length / POSTS_PER_PAGE);
  const [page, setPage] = useState(pageNumber);

  const getLength = useCallback(() => {
    if (isBlogHomePage()) {
      return Number(posts.length) + topSectionNumber;
    }
    return posts.length;
  }, [posts]);

  useEffect(() => {
    if (page && page > 1) {
      const diff = length - getLength();
      if (diff > 0) {
        const pagesLoaded = Math.round(getLength() / POSTS_PER_PAGE);
        const pagesToLoad = Math.round(diff / POSTS_PER_PAGE);
        const accPosts = posts.concat([]);
        for (let i = pagesLoaded; i < pagesToLoad + pagesLoaded; i++) {
          const nextPage = i + 1;
          const nextData = state.source.get(
            `${state.router.link}page/${nextPage}`
          );
          if (nextData && nextData.items) {
            accPosts.push(
              ...nextData.items.map(({ id, type }) => ({ id, type }))
            );
          }
        }
        setPosts(accPosts);
      }
    }
  }, [page, state, length, posts]);

  const categoriesStyles = `@media screen and (max-width: ${MEDIUM_ENDPOINT}) {
    padding: 0 1rem;
  }`;
  return (
    <Wrapper>
      <Container>
        <Breadcrumbs />
        {isBlogHomePage() && <BlogHeader />}
        {/* If the list is a taxonomy, we render a title. */}
        {data.isTaxonomy && (
          <Header>
            {data.taxonomy}
            :
            {' '}
            <b>{decode(state.source[data.taxonomy][data.id].name)}</b>
          </Header>
        )}
        {isBlogHomePage() && (
          <CategoryNameList
            categories={categories}
            title="Categories"
            styles={categoriesStyles}
          />
        )}
        {mainPost && <MainPost post={mainPost} />}
        {subPosts &&
          subPosts.map(({ type, id }) => {
            const item = state.source[type][id];
            return <SubPost key={item.id} item={item} />;
          })}
      </Container>
      {isBlogHomePage() && <Divider />}
      <Container>
        {isBlogHomePage() && <Title>latest articles</Title>}
        {/* Iterate over the items of the list. */}
        {posts.map((el) => {
          if (!el) return null;
          const { type, id } = el;
          const item = state.source[type][id];
          // Render one Item component for each one.
          return <Item key={item.id + item.date} item={item} />;
        })}
        <LoadMore
          isFetching={data.isFetching}
          setPage={setPage}
          page={page}
          length={length}
        />
      </Container>
    </Wrapper>
  );
};

export default connect(List);

const Wrapper = styled.div`
  width: 100%;
`;

const Divider = styled.div`
  border-top: 1px solid #e5e5df;
  margin-top: 2rem;
  @media screen and (max-width: ${SMALL_ENDPOINT}) {
    display: none;
  }
`;

const Container = styled.section`
  max-width: 1110px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  @media screen and (min-width: ${SMALL_ENDPOINT}) and (max-width: ${MEDIUM_ENDPOINT}) {
    padding: 1.5rem;
  }
`;

const Header = styled.h3`
  font-weight: 300;
  text-transform: capitalize;
  color: rgba(12, 17, 43, 0.9);
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  margin: 2rem 0;
  text-transform: uppercase;
  width: 100%;
  @media screen and (max-width: ${SMALL_ENDPOINT}) {
    display: none;
  }
`;

List.propTypes = {
  state: PropTypes.object,
};
