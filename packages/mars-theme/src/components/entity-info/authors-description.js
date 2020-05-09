import React, { useState, useEffect }from 'react';
import PropTypes from 'prop-types';
import {connect, decode, styled, css, fetch} from 'frontity';
import { NumberInfo, Title } from './components';
import { getLessContent } from '../heplers/content';
import ExpandedDescription from './expanded-description';

const WORDPRESS_GFW_API = 'https://dev-global-forest-watch-blog.pantheonsite.io/wp-json';

function useAsyncHook(url, defaultPic) {
  const [jobTitle, setJobTitle] = useState('Author');
  const [profilePicture, setProfilePicture] = useState(defaultPic);

  useEffect(() => {
    async function retrieveAcfData() {
      try {
        const response = await fetch(url);
        const json = await response.json();

        setJobTitle(json.acf.job_title);
        setProfilePicture(json.acf.profile_picture);
      } catch (error) {
        return null;
      }
    }

    if (url.length !== 0) {
      retrieveAcfData();
    }
  }, []);

  return [jobTitle, profilePicture];
}

const AuthorDescription = ({ state }) => {
  const data = state.source.get(state.router.link);

  const url = `${WORDPRESS_GFW_API}/wp/v2/users/${data.id}`;

  const [jobTitle, profilePicture] = useAsyncHook(url, state.source.author[data.id].avatar_urls[96]);

  const description = decode(state.source.author[data.id].description);

  const lessDescription = getLessContent(description);

  return (
    <>
      <div>
        <Avatar>
          <img
            css={css`
              border-radius: 90px;
              width: 100px;
              height: 100px;
            `}
            alt={state.source.author[data.id].name}
            src={profilePicture}
          />
        </Avatar>
        <Title>
          <Head>{jobTitle}</Head>
          <ExpandedDescription less={lessDescription} full={description} />
        </Title>
      </div>
      <NumberInfo styles="margin-top:2.1875rem;">
        {`${data.total}
        article${data.total > 1 ? `s` : ''} written by
        ${decode(state.source.author[data.id].name)}
        `}
      </NumberInfo>
    </>
  );
};

export default connect(AuthorDescription);

AuthorDescription.propTypes = {
  state: PropTypes.object,
};

const Avatar = styled.div`
  float: left;
  border-radius: 96px;
  padding-top: 2.5rem;
  padding-right: 2rem;
  padding-bottom: 0rem;
`;

const Head = styled.div`
  font-size: 1.125rem;
  line-height: 1.875;
  font-weight: 600;
  color: var(--color-dark-grey);
  padding-top: 0.5rem;
`;
