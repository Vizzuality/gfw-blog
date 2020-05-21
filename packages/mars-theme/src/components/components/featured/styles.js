import { styled } from 'frontity';
import theme from '../../theme';

export const Wrapper = styled.article`
  height: 400px;
  position: relative;
  overflow: hidden;

  ${theme.mediaQueries.small} {
    height: 440px;
  }

  ${theme.mediaQueries.medium} {
    height: 440px;
  }

  img {
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    img {
      transition: all 0.2s ease-in-out;
      transform: scale(1.05);
    }

    h3 {
      text-decoration: underline;
    }
  }
`;

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
`;

export const ContentWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  top: 0;
  padding: 30px 16px;
  width: 100%;
  height: 100%;

  ${theme.mediaQueries.small} {
    padding: 40px 50px;
  }

  ${theme.mediaQueries.medium} {
    padding: 50px 70px;
  }
`;

export const PostTitle = styled.h3`
  font-size: 36px;
  line-height: 45px;
  font-weight: 400;
  color: ${theme.colors.white};
  width: 100%;
  margin-bottom: 20px;
`;

export const PostExcerpt = styled.p`
  font-size: 16px;
  line-height: 28px;
  color: ${theme.colors.white};
  width: 100%;
`;
