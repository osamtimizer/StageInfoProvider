const valid = new (require('jsonschema').Validator);
let validateItems = (stages_json) => {

  if (typeof(stage_json) !== "undefined") {
    console.log("input is undefined");
    return false;
  }

  const schema = {
    "description": "validation for input item",
    "type": "object",
    "required": ["rule", "rule_ex", "maps", "maps_ex", "start", "start_utc", "start_t", "end", "end_utc", "end_t"]
  };

  let isValid = true;
  stages_json.some((item) => {
    Object.keys(item).some((key) => {
      if( valid.validate(item, schema).errors.length !== 0) {
        console.log("Input is invalid");
        isValid = false;
        return !isValid;
      }
    });
    return !isValid;
  });

  return isValid;
}

exports.validateItems = validateItems;
