export const checkForMobNum = async (inputTerm) => {
  // console.log('::: Running checkForMobNum :::', inputTerm);

  function validMobNum(inputTerm) {
    let regexp = /^\+?01[0-9]{9}$/;
    return regexp.test(inputTerm);
  }

  if (!inputTerm) {
    return 'Please enter mobile number';
  }

  if (validMobNum(inputTerm)) {
    return '';
  }

  return 'Enter valid mobile number';
};

export const checkForEmail = async (inputTerm) => {
  // console.log('::: Running checkForEmail :::', inputTerm);

  function validEmail(inputTerm) {
    let regexp =
      /^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/g;
    return regexp.test(inputTerm);
  }

  if (!inputTerm) {
    return 'Please enter e-mail';
  }

  if (validEmail(inputTerm)) {
    return '';
  }

  return 'Please enter valid e-mail';
};

export const checkForUserName = async (inputTerm) => {
  // console.log('::: Running checkForUserName :::', inputTerm);

  function validUserName(inputTerm) {
    let regexp =
      /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z\s]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_\s]*$/;
    return regexp.test(inputTerm);
  }

  if (!inputTerm) {
    return 'Please enter user name';
  }

  if (validUserName(inputTerm)) {
    return '';
  }

  return 'Please enter valid user name';
};

export const checkForMembership = async (inputTerm) => {
  // console.log('::: Running checkForMembership :::', inputTerm);

  function validMembership(inputTerm) {
    let regexp = /\w{1,}/;
    return regexp.test(inputTerm);
  }

  if (inputTerm === undefined) {
    return 'Please select membership';
  }

  if (validMembership(inputTerm)) {
    return '';
  }

  return 'Please select membership';
};
