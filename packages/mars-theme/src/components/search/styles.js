import { styled } from 'frontity';
import theme from '../../app/theme';

export const Wrapper = styled.div`
  height: 60px;
  width: 100%;
  cursor: pointer;
  z-index: 20;
  position: relative;

  ${theme.mediaQueries.small} {
    height: 80px;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 60px;
  border-bottom: solid 1px transparent;

  ${theme.mediaQueries.small} {
    height: 80px;
  }

  ${({ open, expanded }) =>
    (open || expanded) &&
    `
    border-bottom-color: ${theme.colors.grey};
  `}
`;

export const SearchClosed = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchOpen = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const OpenMessage = styled.span`
  color: ${theme.colors.mediumGrey};
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 400;
  margin-right: 10px;
`;

export const Input = styled.input`
  appearance: none;
  width: 100%;
  height: 100%;
  background: ${theme.colors.white};
  border: none;
  border-radius: 0;
  font-size: 22px;
  color: ${theme.colors.darkestGrey};
  padding: 0 10px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${theme.mediaQueries.small} {
    padding: 0 20px;
  }

  ${({ value }) =>
    value &&
    `
    padding: 0 !important;
  `}

  ${({ expanded }) =>
    expanded &&
    `
    padding-left: 0 !important;
  `}
`;