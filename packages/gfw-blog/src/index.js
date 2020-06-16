import image from '@frontity/html2react/processors/image';
import iframe from '@frontity/html2react/processors/iframe';
import sortBy from 'lodash/sortBy';
import { Carousel } from 'gfw-components';
import axios from 'axios';

import Blockquote from './components/blockquote';
import Theme from './app';

const MAIN_CATEGORIES = [
  'data-and-research',
  'people',
  'commodities',
  'fires',
  'climate',
  'places-to-watch',
  'uncategorized',
];

const gutenbergGallery = {
  test: ({ component, props }) =>
    component === 'ul' && props.className === 'blocks-gallery-grid',
  processor: () => {
    return {
      component: Carousel,
      props: {
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          lazyLoad: false,
          infinite: true,
          focusOnSelect: true,
        },
      },
    };
  },
};

const blockquote = {
  test: ({ component }) => component === 'blockquote',
  processor: () => {
    return {
      component: Blockquote,
    };
  },
};

const stickyPostsHandler = {
  priority: 10,
  pattern: 'sticky-posts',
  func: async ({ route, state, libraries }) => {
    const { api } = libraries.source;
    // 1. fetch the posts you want
    const response = await api.get({
      endpoint: 'posts',
      params: {
        sticky: true,
        'filter[lang]': 'en',
      },
    });

    // 2. populate response
    const stickyPosts = await response.json();

    // 3. add data to source
    const currentPageData = state.source.data[route];

    Object.assign(currentPageData, {
      stickyPosts: stickyPosts.map((post) => ({
        ...post,
      })),
    });
  },
};

const allCategoriesHandler = {
  name: 'allCategories',
  priority: 10,
  pattern: 'all-categories',
  func: async ({ route, state, libraries }) => {
    const { api } = libraries.source;

    // 1. fetch the data you want from the endpoint page
    const response = await api.get({
      endpoint: 'categories',
      params: {
        per_page: 100, // To make sure you get all of them
      },
    });

    // 2. get an array with each item in json format
    const items = await response.json();
    const categories = items
      .filter((c) => MAIN_CATEGORIES.includes(c.slug))
      .map((c) => ({
        ...c,
        link: `/${c.slug}`,
      }));
    const sortedCategories = sortBy(categories, (cat) =>
      MAIN_CATEGORIES.indexOf(cat.slug)
    );
    // 3. add data to source
    const currentPageData = state.source.data[route];

    Object.assign(currentPageData, {
      categories: sortedCategories,
    });
  },
};

const topTagsHandler = {
  name: 'topTags',
  priority: 1,
  pattern: 'top-tags',
  func: async ({ route, state, libraries }) => {
    const { api } = libraries.source;

    // 1. fetch the data you want from the endpoint page
    const response = await api.get({
      endpoint: 'tags',
      params: {
        per_page: 100, // To make sure you get all of them
        orderby: 'count',
        order: 'desc',
      },
    });

    // 2. get an array with each item in json format
    const items = await response.json();

    const tags = items.map((tag) => ({
      ...tag,
      link: `/tag/${tag.slug}`,
    }));
    // 3. add data to source
    const currentPageData = state.source.data[route];

    Object.assign(currentPageData, {
      tags,
    });
  },
};

const categoryOrPostHandler = {
  name: 'categoryOrPostType',
  priority: 30,
  pattern: '/(.*)?/:slug',
  func: async ({ route, params, state, libraries, link }) => {
    // 1. try with category.
    try {
      const category = libraries.source.handlers.find(
        (handler) => handler.name === 'category'
      );
      await category.func({
        link,
        route,
        params: { ...params, 'filter[lang]': 'en' },
        state,
        libraries,
      });
    } catch (e) {
      // It's not a category
      const postType = libraries.source.handlers.find(
        (handler) => handler.name === 'post type'
      );

      try {
        // 1. fetch the data you want from the endpoint page
        await postType.func({
          link,
          route,
          params,
          state,
          libraries,
          force: true,
        });
      } catch (err) {
        const token = await axios.post(
          `${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`,
          {
            username: process.env.REST_USERNAME,
            password: process.env.REST_PASSWORD,
          }
        );

        const regexLink = link.replace(/.$/, '');

        const checkRedirection = await axios.get(
          `${process.env.WORDPRESS_API_URL}/wp-json/redirection/v1/redirect?filterBy[url]=${regexLink}`,
          {
            headers: {
              Authorization: `Bearer ${token?.data?.token}`,
            },
          }
        );

        const currentPageData = state.source.data[route];

        // eslint-disable-next-line camelcase
        const { action_data: actionData } =
          checkRedirection?.data?.items?.[0] || {};
        const redirection = actionData?.url;

        Object.assign(currentPageData, {
          redirection,
          is404: !redirection,
        });
      }
    }
  },
};

const postsHandler = {
  name: 'postsHandler',
  priority: 19,
  pattern: '/',
  func: async ({ route, params, state, libraries, link }) => {
    const stateWithParams = !link.includes('?s=')
      ? {
          ...state,
          source: {
            ...state.source,
            params: {
              ...state.source.params,
              'filter[lang]': 'en',
            },
          },
        }
      : state;

    try {
      const posts = libraries.source.handlers.find(
        (handler) => handler.name === 'post archive'
      );
      await posts.func({
        link,
        route,
        params,
        state: stateWithParams,
        libraries,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

const marsTheme = {
  name: '@gfw/blog-theme',
  roots: {
    /**
     *  In Frontity, any package can add React components to the site.
     *  We use roots for that, scoped to the `theme` namespace.
     */
    theme: Theme,
  },
  state: {
    /**
     * State is where the packages store their default settings and other
     * relevant state. It is scoped to the `theme` namespace.
     */
    theme: {
      isContactUsOpen: false,
      featured: {
        showOnList: false,
        showOnPost: true,
      },
      searchIsActive: false,
      searchQuery: '',
      tags: [],
      categories: [],
      lang: 'en_US',
    },
    googleAnalytics: {
      trackingId: 'UA-48182293-1',
    },
  },
  /**
   * Actions are functions that modify the state or deal with other parts of
   * Frontity like libraries.
   */
  actions: {
    theme: {
      toggleContactUsModal: ({ state }) => {
        state.theme.isContactUsOpen = !state.theme.isContactUsOpen;
      },
      setSearchOpen: ({ state }) => (open) => {
        state.theme.searchIsActive = open;
      },
      setSearchQuery: ({ state }) => (value) => {
        state.theme.searchQuery = value;
      },
      changeLanguage: ({ state }) => (value) => {
        state.theme.lang = value;
      },
      beforeSSR: ({ actions }) => async () => {
        await actions.source.fetch('all-categories');
        await actions.source.fetch('top-tags');
        await actions.source.fetch('sticky-posts');
      },
    },
  },
  libraries: {
    html2react: {
      /**
       * Add a processor to `html2react` so it processes the `<img>` tags
       * inside the content HTML. You can add your own processors too
       */
      processors: [image, iframe, gutenbergGallery, blockquote],
    },
    source: {
      handlers: [
        allCategoriesHandler,
        topTagsHandler,
        categoryOrPostHandler,
        stickyPostsHandler,
        postsHandler,
      ],
    },
  },
};

export default marsTheme;
