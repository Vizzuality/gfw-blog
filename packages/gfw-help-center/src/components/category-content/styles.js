import { styled } from 'frontity';

import { H3 as h3, H4 as h4, H5 as h5, P as p } from 'gfw-components';

export const H3 = styled(h3)`
  margin-botton: 24px;
  color: #333333;
  font-size: 30px;
  font-weight: 300;
`;

export const H4 = styled(h4)`
  color: #333333;
  font-weight: 500;
  line-height: 24px;
  margin: 15px 0;
`;

export const H5 = styled(h5)`
  color: #777777;
  line-height: 24px;
  margin-top: 25px;
`;

export const P = styled(p)`
  color: #333333;
  line-height: 36px;
  margin-bottom: 24px;
`;

// Cards

export const CardWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 30px;
  border: 1px solid #e5e5df;
  margin: 15px 0;
`;

export const CardImage = styled.img`
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #313c3c;
  margin-right: 30px;
`;

export const CardTitle = styled.h5`
  color: #333333;
  font-size: 20px;
  line-height: 36px;
`;

export const CardText = styled.p`
  color: #777777;
  font-size: 14px;
  line-height: 21px;
  margin: 10px 0;
`;
