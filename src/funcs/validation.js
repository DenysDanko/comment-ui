export const validateCommentForm = (formData) => {
  const errors = {};

  if (!formData.userName.trim()) {
    errors.userName = 'User Name is required.';
  } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.userName)) {
    errors.userName = 'Only Latin letters, numbers and spaces are allowed.';
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format.";
  }

  if (formData.homePage && 
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.homePage)) {
    errors.homePage = "Invalid URL format.";
  }

  if (!formData.captchaAnswer.trim()) {
    errors.captchaAnswer = "Captcha code is required.";
  }

  if (!formData.content.trim()) {
    errors.content = "Message content is required.";
  } else {
    const tagRegex = /<(?!\/?(a|code|i|strong)(?=>|\s.*>))\/?.*?>/g;
    if (tagRegex.test(formData.content)) {
      errors.content = "Only <a>, <code>, <i>, and <strong> tags are allowed.";
    }
  }

  return errors;
};
