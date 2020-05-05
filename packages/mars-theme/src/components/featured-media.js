import React from 'react';
import PropTypes from 'prop-types';
import { connect, styled } from 'frontity';
import Image from '@frontity/components/image';

const FeaturedMedia = ({ state, id, styles = '' }) => {
  const Container = styled.div`
    margin-top: 1rem;
    height: 200px;
    width: 100%;
    ${styles}
  `;
  const media = state.source.attachment[id];

  if (!media) return null;

  const srcset =
    Object.values(media.media_details.sizes)
      // Get the url and width of each size.
      .map((item) => [item.source_url, item.width])
      // Recude them to a string with the format required by `srcset`.
      .reduce(
        (final, current, index, array) =>
          final.concat(
            `${current.join(' ')}w${index !== array.length - 1 ? ', ' : ''}`
          ),
        ''
      ) || null;

  return (
    <Container>
      <StyledImage
        alt={media.title.rendered}
        src={media.source_url}
        srcSet={srcset}
      />
    </Container>
  );
};

export default connect(FeaturedMedia);

const StyledImage = styled(Image)`
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

FeaturedMedia.propTypes = {
  id: PropTypes.number,
  styles: PropTypes.string,
  state: PropTypes.object,
};
