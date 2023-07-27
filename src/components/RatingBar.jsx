import { Rating } from 'react-simple-star-rating';
import {
  MdSentimentVeryDissatisfied,
  MdSentimentDissatisfied,
  MdSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVerySatisfied,
} from 'react-icons/md';

const customIcons = [
  { icon: <MdSentimentVeryDissatisfied size={50} /> },
  { icon: <MdSentimentDissatisfied size={50} /> },
  { icon: <MdSentimentNeutral size={50} /> },
  { icon: <MdSentimentSatisfiedAlt size={50} /> },
  { icon: <MdSentimentVerySatisfied size={50} /> },
];

const RatingBar = (props) => {
  const { onClick, ratingValue, initialValue } = props;
  return (
    <Rating
      customIcons={customIcons}
      onClick={onClick}
      showTooltip
      // fillColor='#ff5500'
      fillColorArray={['#e12025', '#f47950', '#fcb040', '#91ca61', '#3ab54a']}
      ratingValue={ratingValue}
      initialValue={initialValue}
    />
  );
};

export default RatingBar;
