import {
  checkForUserName,
  checkForMobNum,
  checkForEmail,
  checkForMembership,
} from '../../functions/validation';

export const validate = async (formValues) => {
  const errors = {};
  const { username, mobile, email, membership, hoursPackages, gender } =
    formValues;

  const validUserName = await checkForUserName(username);
  const validMobile = await checkForMobNum(mobile);
  const validEmail = await checkForEmail(email);
  const validMembership = await checkForMembership(membership);
  const validHoursPackages = await checkForMembership(hoursPackages);
  const validGender = await checkForMembership(gender);

  if (validUserName) {
    errors.username = validUserName;
  }

  if (validMobile) {
    errors.mobile = validMobile;
  }

  if (validEmail) {
    errors.email = validEmail;
  }

  if (validMembership) {
    errors.membership = validMembership;
  }

  if (validHoursPackages && membership === 'HOURS_MEMBERSHIP') {
    errors.hoursPackages = 'Please select a package';
  }

  if (validGender) {
    errors.gender = 'Please select a gender';
  }

  return errors;
};
