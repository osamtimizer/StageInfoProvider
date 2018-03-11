//TODO:You have to write your global "node_modules" path as "NODE_PATH" on .bashrc for 'chai'.
//Otherwise, require('chai'); will throw exception.

const chai = require('chai');
const should = chai.should();

const fs = require('fs');

const target = require('../validateItems');


describe('validateItems', ()=> {
  describe('validateItems', () => {
    it('should return when the input argment is invalid', () => {
      //forEach method is only available for Array Object.
      let test_json = JSON.parse(fs.readFileSync("result_unofficial.json", "utf-8"));
      let result = test_json.result;

      let regular = result.regular;
      let gachi = result.gachi;
      let league = result.league;

      target.validateItems(regular).should.equal(null);
      target.validateItems(gachi).should.equal(null);
      target.validateItems(league).should.equal(null);
    });
  });
});
