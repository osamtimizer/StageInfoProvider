let validateItems = (stages_json) => {
  let isValid = true;
  stages_json.forEach((item) => {
    if(!item.rule && !item.rule_type && !item.rule_ex && !item.maps && !item.start_t && !item.start) {
      console.log("Input is invalid");
      isValid = false;
    }
  });
  if (!isValid) {
    throw new ArgumentException();
  }
}

exports.validateItems = validateItems;
