//TODO:You have to write your global "node_modules" path as "NODE_PATH" on .bashrc for 'chai'.
//Otherwise, require('chai'); will throw exception.

const chai = require('chai');
const assert = chai.assert;

const fs = require('fs');
const target = require('../validateItems');


describe('validateItems', ()=> {
  describe('validateItems', () => {
    it('should return false when the input argment is invalid', () => {
      //forEach method is only available for Array Object.
      let test_json = JSON.parse(fs.readFileSync("result_unofficial.json", "utf-8"));
      let result = test_json.result;

      let regular = result.regular;
      let gachi = result.gachi;
      let league = result.league;

      let actual = target.validateItems(regular);
      assert.isNotTrue(actual);

    });
  });
});
