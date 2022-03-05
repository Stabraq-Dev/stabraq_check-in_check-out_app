export const checkForMobNum = async (inputTerm) => {
  // console.log('::: Running checkForMobNum :::', inputTerm);
  const regexpForMobile = /^\+?01[0-9]{9}$/;

  if (!inputTerm) {
    return 'Please enter mobile number';
  }

  if (!regexpForMobile.test(inputTerm)) {
    return 'Enter valid mobile number';
  }

  return '';
};

export const checkForEmail = async (inputTerm) => {
  // console.log('::: Running checkForEmail :::', inputTerm);
  const regexpForNoSpaces = /^\S*$/;
  const regexpForEmail =
    /^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/g;

  // if (!inputTerm) {
  //   return 'Please enter e-mail';
  // }

  if (inputTerm && !regexpForNoSpaces.test(inputTerm)) {
    return 'Please delete spaces, Email cannot contain spaces';
  }

  if (inputTerm && !regexpForEmail.test(inputTerm)) {
    return 'Please enter valid e-mail';
  }

  return '';
};

export const checkForUserName = async (inputTerm) => {
  // console.log('::: Running checkForUserName :::', inputTerm);
  const regexpForSpaceAtBeginning = /^[^-\s]/;
  const regexpForEngOrAraName =
    /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z\s]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_\s]*$/;

  if (!inputTerm) {
    return 'Please enter user name';
  }

  if (!regexpForSpaceAtBeginning.test(inputTerm)) {
    return 'Please delete space at the beginning';
  }

  if (!regexpForEngOrAraName.test(inputTerm)) {
    return 'Please enter valid user name';
  }

  return '';
};

export const checkForMembership = async (inputTerm) => {
  // console.log('::: Running checkForMembership :::', inputTerm);
  const regexp = /\w{1,}/;

  if (inputTerm === undefined) {
    return 'Please select membership';
  }

  if (!regexp.test(inputTerm)) {
    return 'Please select membership';
  }

  return '';
};
