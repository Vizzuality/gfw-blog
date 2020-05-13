import image from '@frontity/html2react/processors/image';
import iframe from '@frontity/html2react/processors/iframe';
import { Carousel } from 'gfw-components';
import Blockquote from './components/blockqoute';
import Theme from './components';

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

const marsTheme = {
  name: '@frontity/mars-theme',
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
    },
    googleAnalytics: {
      trackingId: process.env.GOOGLE_ANALYTICS,
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
  },
};

export default marsTheme;
